import throttle from 'lodash.throttle';
import { lark, replyCard, editCard, reply } from './lark';
import { Setting } from './types';

export async function handleByOpenAI(
  larkClient: lark.Client,
  setting: Setting,
  messageId: string,
  content: string,
) {
  console.log(`content:${content}`);
  console.log(`messageId:${messageId}`);

  const { ChatGPTAPI } = await import('chatgpt');
  const api = new ChatGPTAPI({
    apiKey: setting.openaiApiKey,
  });

  let progressMessageId: string | undefined;

  const onProgress = throttle(async partialResponse => {
    if (!progressMessageId) {
      const replyResponse = await replyCard(larkClient, messageId, partialResponse.text);
      progressMessageId = replyResponse?.data?.message_id;
    } else {
      await editCard(larkClient, progressMessageId, partialResponse.text);
    }
  }, 1000);

  const res = await api.sendMessage(content, {
    onProgress,
  });

  await reply(larkClient, messageId, res.text);
  return res.text;
}
