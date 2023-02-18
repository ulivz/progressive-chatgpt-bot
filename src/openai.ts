import type { ChatMessage } from 'chatgpt';
import throttle from 'lodash.throttle';
import { lark, replyCard, editCard, reply, buildProgressiveCard } from './lark';
import { Setting } from './types';

export async function handleByOpenAI(
  larkClient: lark.Client,
  setting: Setting,
  messageId: string,
  content: string,
) {
  console.log(`content:${content}`);
  console.log(`messageId:${messageId}`);
  console.log(`apiKey:${setting.openaiApiKey}`);

  const { ChatGPTAPI } = await import('chatgpt');
  console.log('ChatGPTAPI', ChatGPTAPI);

  const api = new ChatGPTAPI({
    apiKey: setting.openaiApiKey,
  });

  let progressMessageId: string | undefined;

  const onProgress = throttle(async (partialResponse: ChatMessage) => {
    console.log('partialResponse', partialResponse);
    if (!progressMessageId) {
      const replyResponse = await replyCard(
        larkClient,
        messageId,
        buildProgressiveCard(partialResponse.text),
      );
      progressMessageId = replyResponse?.data?.message_id;
    } else {
      await editCard(
        larkClient,
        progressMessageId,
        buildProgressiveCard(partialResponse.text),
      );
    }
  }, 1000, {
    leading: true,
    trailing: true,
  });

  try {
    console.log('sendMessage start');
    const res = await api.sendMessage(content, {
      onProgress,
    });
    console.log('sendMessage end');

    await reply(larkClient, messageId, res.text);
  } catch (e) {
    await reply(larkClient, messageId, `failed: ${e}`);
  }
}
