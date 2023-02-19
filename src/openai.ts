import type { ChatMessage } from 'chatgpt';
import { lark, replyCard, editCard, reply, buildProgressiveCard } from './lark';
import { Setting } from './types';
import { OpenAIMessageDB } from './aircode';
import { throttle } from './utils';
import { Logger } from './logger';

export async function handleByOpenAI(
  logger: Logger,
  larkClient: lark.Client,
  setting: Setting,
  messageId: string,
  content: string,
) {
  logger.debug(`content:${content}`);
  logger.debug(`messageId:${messageId}`);
  logger.debug(`apiKey:${setting.openaiApiKey}`);

  const { ChatGPTAPI } = await import('chatgpt');
  logger.debug('ChatGPTAPI', ChatGPTAPI);

  const api = new ChatGPTAPI({
    apiKey: setting.openaiApiKey,
    debug: true,
  });

  let pendingRequest: ReturnType<typeof replyCard>;
  let progressMessageId: string | undefined;

  const onProgress = throttle(async (partialResponse: ChatMessage) => {
    logger.debug('partialResponse', partialResponse);
    if (pendingRequest) {
      const replyResponse = await pendingRequest;
      if (!progressMessageId) {
        progressMessageId = replyResponse?.data?.message_id;
      }
    }
    if (!progressMessageId) {
      pendingRequest = replyCard(
        larkClient,
        messageId,
        buildProgressiveCard(partialResponse.text),
      );
    } else {
      pendingRequest = editCard(
        larkClient,
        progressMessageId,
        buildProgressiveCard(partialResponse.text),
      );
    }
    await pendingRequest;
  }, 2000);

  try {
    logger.debug('sendMessage start');
    const lastMessage = await OpenAIMessageDB.where().findOne();
    logger.debug('lastMessage', lastMessage);
    const res = await api.sendMessage(content, {
      onProgress,
      parentMessageId: lastMessage?.pid,
      conversationId: lastMessage?.cid,
    });
    if (lastMessage) {
      await OpenAIMessageDB.delete([lastMessage]);
    }
    await OpenAIMessageDB.save({ pid: res.id, cid: res.conversationId });
    logger.debug('res.text', res.text);

    // do not send message when it has been processed under `onProgress` callback
    if (!progressMessageId) {
      await reply(larkClient, messageId, res.text);
    }
  } catch (e) {
    await reply(larkClient, messageId, `failed: ${e}`);
  }
}
