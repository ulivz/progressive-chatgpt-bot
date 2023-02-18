<h1 align="center">Progressive ChatGPT Bot</h1>

<p align="center">
    An progressive ChatGPT Feishu bot, made to assist my girlfriend's work.
</p>

<p align="center">
    <a href="https://npmjs.com/package/progressive-chatgpt-bot"><img src="https://img.shields.io/npm/v/progressive-chatgpt-bot.svg?style=flat" alt="NPM version"></a> 
    <a href="https://npmjs.com/package/progressive-chatgpt-bot"><img src="https://img.shields.io/npm/dm/progressive-chatgpt-bot.svg?style=flat" alt="NPM downloads"></a> 
    <a href="https://circleci.com/gh/saojs/progressive-chatgpt-bot"><img src="https://img.shields.io/circleci/project/saojs/progressive-chatgpt-bot/master.svg?style=flat" alt="Build Status"></a> 
</p>

## Motivation

### For My Girlfriend

In the work involving a lot of copywriting, [ChatGPT](https://openai.com/blog/chatgpt/) may improve our work efficiency, but my girlfriend does not have a very stable way to use it, especially the use of WeChat may lead to account bans, so I created this project for her.

### Progressive

Many ChatGPT bots reply all messages at one time, which may take a long time, but the goal of this bot will be the same as ChatGPT's official website, you will be able to receive messages as quickly as possible, typing in real time to reply you.


## Quick Start

### 1. Lark Robot Setup

See [ChatGPT-Feishu](https://github.com/bestony/ChatGPT-Feishu).

### 2. Aircode Setup

Install `progressive-chatgpt-bot` and create a function:

```ts
module.exports = async function(params, context) {
  const { handle } = await import('progressive-chatgpt-bot');
  return handle(params, context);
}
```

## Credits

- [chatgpt-api](https://github.com/bestony/chatgpt-api)
- [ChatGPT-Feishu](https://github.com/bestony/ChatGPT-Feishu)

## License

MIT &copy; [ULIVZ](https://github.com/ulivz)
