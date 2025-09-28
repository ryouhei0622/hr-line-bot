import { MessagingApiClient } from "@line/bot-sdk";

const client = new MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.LINE_CHANNEL_SECRET,
});

// メッセージ送信
await client.replyMessage({
  replyToken: event.replyToken,
  messages: [{ type: "text", text: "Hello from MessagingApiClient" }]
});
