// line.js
import { Client } from "@line/bot-sdk";

export const lineConfig = {
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};

export const client = new Client(lineConfig);
