import * as lark from '@larksuiteoapi/node-sdk';
import { Setting } from './types';

export { lark };
/**
 * Get lark client
 *
 * @param setting
 * @returns
 */
export function getLarkClient(setting: Setting): lark.Client {
  return new lark.Client({
    appId: setting.feishuAppId,
    appSecret: setting.feishuAppSecret,
    appType: lark.AppType.SelfBuild,
    domain: 'https://fsopen.bytedance.net',
  });
}

/**
 * Reply message
 *
 * @param client
 * @param messageId
 * @param content
 * @returns
 */
export async function reply(client: lark.Client, messageId: string, content: string) {
  try {
    return await client.im.message.reply({
      path: {
        message_id: messageId,
      },
      data: {
        content: JSON.stringify({
          text: content,
        }),
        msg_type: 'text',
      },
    });
  } catch (e) {
    console.log('failed to reply message', e, messageId, content);
  }
}

/**
 * Build progressive message card
 *
 * @param content
 * @returns
 */
export function buildProgressiveCard(content: string): lark.InteractiveCard {
  return {
    config: {
      wide_screen_mode: true,
    },
    header: {
      template: 'orange',
      title: {
        content: ' 📜 Please wait, I\'m typing ...',
        tag: 'plain_text',
      },
    },
    i18n_elements: {
      zh_cn: [
        {
          tag: 'div',
          text: {
            content,
            tag: 'lark_md',
          },
        },
      ],
    },
  };
}

/**
 * Replay an interactive card
 *
 * @param messageId
 * @param card
 * @returns
 */
export async function replyCard(client: lark.Client, messageId: string, card: lark.InteractiveCard) {
  try {
    return await client.im.message.reply({
      data: {
        content: JSON.stringify(card),
        msg_type: 'interactive',
      },
      path: {
        message_id: messageId,
      },
    });
  } catch (e) {
    console.log('reply card error', e, messageId, card);
  }
}

/**
 * Replay an interactive card
 *
 * @param messageId
 * @param card
 * @returns
 */
export async function editCard(client: lark.Client, messageId: string, card: lark.InteractiveCard) {
  try {
    return await client.im.message.patch({
      path: {
        message_id: messageId,
      },
      data: {
        content: JSON.stringify(card),
      },
    });
  } catch (e) {
    console.log('edit message error', e, messageId, card);
  }
}

export interface LarkEncryptedMessage {
  encrypt: boolean;
  [key: string]: any;
}

export interface LarkReceivedMessage {
  schema: string;
  header: {
    app_id: string;
    create_time: string;
    event_id: string;
    event_type: 'im.message.receive_v1';
    tenant_key: string;
    token: string;
  };
  event: {
    sender: {
      sender_id: {
        open_id: string;
        union_id: string;
        user_id: string;
      };
      sender_type: unknown;
    };
    message: {
      chat_id: string;
      chat_type: 'group' | 'p2p';
      content: string;
      create_time: string;
      mentions: {
        id: {
          open_id: string;
          union_id: string;
          user_id: string;
        };
        key: string;
        name: string;
        tenant_key: string;
      }[];
      message_id: string;
      message_type: 'post' | 'text';
      root_id?: string;
      parent_id?: string;
    };
  };
}
