<h1 align="center">Progressive ChatGPT Bot</h1>

<p align="center">
    An progressive ChatGPT Feishu bot, made to assist my girlfriend's work.
</p>

## Motivation

### For My Girlfriend

In the work involving a lot of copywriting, [ChatGPT](https://openai.com/blog/chatgpt/) may improve our work efficiency, but my girlfriend does not have a very stable way to use it, especially the use of WeChat may lead to account bans, so I created this project for her.

### Progressive

Many ChatGPT bots reply all messages at one time, which may take a long time, but the goal of this bot will be the same as ChatGPT's official website, you will be able to receive messages as quickly as possible, typing in real time to reply you.


## Quick Start

### 1. Lark Robot Setup

### 2. Aircode Setup

Install following packages:

- `progressive-chatgpt-bot`
- `@larksuiteoapi/node-sdk`
- `axios`
- `chatgpt`

Create a function:

```ts
const { getAircodeFunction } = require('progressive-chatgpt-bot');
module.exports = getAircodeFunction();
```

## Credits

- [chatgpt-api](https://github.com/bestony/chatgpt-api)
- [ChatGPT-Feishu](https://github.com/bestony/ChatGPT-Feishu)

## License

MIT &copy; [ULIVZ](https://github.com/ulivz)
