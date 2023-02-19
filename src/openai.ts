import type { ChatMessage } from 'chatgpt';
import throttle from 'lodash.throttle';
import { lark, replyCard, editCard, reply, buildProgressiveCard } from './lark';
import { Setting } from './types';
import { OpenAIMessageDB } from './aircode';

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
    debug: true,
  });

  let progressMessageId: string | undefined;

  // const onProgress = throttle(async (partialResponse: ChatMessage) => {
  //   console.log('partialResponse', partialResponse);
  //   if (!progressMessageId) {
  //     const replyResponse = await replyCard(
  //       larkClient,
  //       messageId,
  //       buildProgressiveCard(partialResponse.text),
  //     );
  //     progressMessageId = replyResponse?.data?.message_id;
  //   } else {
  //     await editCard(
  //       larkClient,
  //       progressMessageId,
  //       buildProgressiveCard(partialResponse.text),
  //     );
  //   }
  // }, 1000, {
  //   leading: true,
  //   trailing: true,
  // });

  try {
    console.log('sendMessage start');
    const lastMessage = await OpenAIMessageDB.where().findOne();
    console.log('lastMessage', lastMessage);
    const res = await api.sendMessage(content, {
      // onProgress,
      promptPrefix: '',
      promptSuffix: '',
      parentMessageId: lastMessage?.pid,
      conversationId: lastMessage?.cid,
    });
    if (lastMessage) {
      await OpenAIMessageDB.delete([lastMessage]);
    }
    await OpenAIMessageDB.save({ pid: res.id, cid: res.conversationId });

    console.log('res.text', res.text);

    // do not send message when it has been processed under `onProgress` callback
    if (!progressMessageId) {
      await reply(larkClient, messageId, res.text);
    }
  } catch (e) {
    await reply(larkClient, messageId, `failed: ${e}`);
  }
}
