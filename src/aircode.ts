import aircode from 'aircode';
import { getLarkClient, LarkEncryptedMessage, LarkReceivedMessage, reply } from './lark';
import { getSettingFromNodeEnv, checkSetting } from './env';
import { handleByOpenAI } from './openai';
import { Logger } from './logger';

const MessageDB = aircode.db.table('lark_message');
export const OpenAIMessageDB = aircode.db.table('openai_message');

export interface FunctionContext {
  log(...args: any[]): void;
  status(code: number): void;
  set(key: string, value: string): void;
  readonly method: string;
}

export type FunctionParams<T extends object = object> = T;

export interface TimerEvent {
  eventType: string;
  name: string;
}

export function defineFunction<
  T extends object = object,
  U = unknown,
>(fn: (params: FunctionParams<T>, context: FunctionContext) => Promise<U>) {
  return fn;
}

export interface AircodeOptions {
  debug: boolean;
}

export function getAircodeHandler(options: AircodeOptions) {
  const logger = new Logger(options.debug);

  return defineFunction<LarkEncryptedMessage & LarkReceivedMessage>(async (params, context) => {
    logger.debug('params', params);

    // Pass Lark's challenge check
    if (params.type === 'url_verification') {
      logger.debug('deal feishu url_verification');
      return {
        challenge: params.challenge,
      };
    }

    // Encrypt should be disabled.
    if (params.encrypt) {
      return {
        code: 1,
        message: 'please disable lark encrypt',
      };
    }

    const setting = getSettingFromNodeEnv();
    const larkClient = getLarkClient(setting);
    logger.debug('setting', setting);

    // Check env
    if (!params.hasOwnProperty('header')) {
      return checkSetting(setting);
    }

    // Handle message
    if (params.header.event_type === 'im.message.receive_v1') {
      const eventId = params.header.event_id;
      logger.debug(`eventId:${eventId}`);
      const messageId = params.event.message.message_id;
      const count = await MessageDB.where({ message_id: messageId }).count();
      if (count !== 0) {
        return {
          code: 2,
          message: 'skip redundant message',
        };
      }
      await MessageDB.save({ message_id: messageId });

      if (params.event.message.chat_type === 'p2p') {
        if (params.event.message.message_type !== 'text') {
          await reply(larkClient, messageId, 'Currently only plain text questions are supported');
          return { code: 0 };
        }
        const userInput = JSON.parse(params.event.message.content);
        const question = userInput.text.replace('@_user_1', '');
        await handleByOpenAI(logger, larkClient, setting, messageId, question);
        return { code: 0 };
      }

      if (params.event.message.chat_type === 'group') {
        if (
          !params.event.message.mentions
          || params.event.message.mentions.length === 0
        ) {
          return { code: 0, message: 'do not process message without mention' };
        }
        if (params.event.message?.mentions[0]?.name !== setting.feishuBotName) {
          return { code: 0, message: 'bot name does not equal to first mention name' };
        }
        const userInput = JSON.parse(params.event.message.content);
        const question = userInput.text.replace('@_user_1', '');
        await handleByOpenAI(logger, larkClient, setting, messageId, question);
        return { code: 0 };
      }
    }

    return {
      code: 2,
      message: `unknown params:${JSON.stringify(params)}`,
    };
  });
}
