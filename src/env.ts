import { Setting } from './types';

export function getSettingFromNodeEnv(): Setting {
  return {
    feishuAppId: process.env.FEISHU_APPID || '',
    feishuAppSecret: process.env.FEISHU_APP_SECRET || '',
    feishuBotName: process.env.FEISHU_BOT_NAME || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    openaiModel: process.env.OPENAI_MODEL || 'text-davinci-003',
    openaiMaxToken: Number(process.env.OPENAI_MAX_TOKEN) || 1024,
  };
}

/**
 * Modified from https://github.com/bestony/ChatGPT-Feishu/blob/master/event.js
 *
 * @param setting
 * @returns
 */
export function checkSetting(setting: Setting) {
  if (setting.feishuAppId === '') {
    return {
      code: 1,
      message: {
        zh_CN: '你没有配置飞书应用的 AppID，请检查 & 部署后重试',
        en_US:
                'Here is no FeiSHu APP id, please check & re-Deploy & call again',
      },
    };
  }
  if (!setting.feishuAppId.startsWith('cli_')) {
    return {
      code: 1,
      message: {
        zh_CN:
                '你配置的飞书应用的 AppID 是错误的，请检查后重试。飞书应用的 APPID 以 cli_ 开头。',
        en_US:
                'Your FeiShu App ID is Wrong, Please Check and call again. FeiShu APPID must Start with cli',
      },
    };
  }
  if (setting.feishuAppSecret === '') {
    return {
      code: 1,
      message: {
        zh_CN: '你没有配置飞书应用的 Secret，请检查 & 部署后重试',
        en_US:
                'Here is no FeiSHu APP Secret, please check & re-Deploy & call again',
      },
    };
  }

  if (setting.feishuBotName === '') {
    return {
      code: 1,
      message: {
        zh_CN: '你没有配置飞书应用的名称，请检查 & 部署后重试',
        en_US:
                'Here is no FeiSHu APP Name, please check & re-Deploy & call again',
      },
    };
  }

  if (setting.openaiApiKey === '') {
    return {
      code: 1,
      message: {
        zh_CN: '你没有配置 OpenAI 的 Key，请检查 & 部署后重试',
        en_US: 'Here is no OpenAI Key, please check & re-Deploy & call again',
      },
    };
  }

  if (!setting.openaiApiKey.startsWith('sk-')) {
    return {
      code: 1,
      message: {
        zh_CN:
                '你配置的 OpenAI Key 是错误的，请检查后重试。飞书应用的 APPID 以 cli_ 开头。',
        en_US:
                'Your OpenAI Key is Wrong, Please Check and call again. FeiShu APPID must Start with cli',
      },
    };
  }
  return {
    code: 0,
    message: {
      zh_CN:
              '✅ 配置成功，接下来你可以在飞书应用当中使用机器人来完成你的工作。',
      en_US:
              '✅ Configuration is correct, you can use this bot in your FeiShu App',
    },
  };
}
