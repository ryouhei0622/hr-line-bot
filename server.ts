'use strict';

import express, { Request, Response } from 'express';
import {
    Client,
    middleware,
    MiddlewareConfig,
    WebhookRequestBody,
    WebhookEvent,
    MessageAPIResponseBase,
    TextMessage,
} from '@line/bot-sdk';

const PORT = process.env.PORT || 3000;

const config: MiddlewareConfig & {
    channelAccessToken: string;
} = {
    channelSecret: '作成したBOTのチャンネルシークレット',
    channelAccessToken: '作成したBOTのチャンネルアクセストークン',
};

const app = express();

// ブラウザ確認用 (任意)
app.get('/', (_req: Request, res: Response) => res.send('Hello LINE BOT!(GET)'));

// Webhook エンドポイント
app.post(
    '/webhook',
    middleware(config),
    async (req: Request<{}, {}, WebhookRequestBody>, res: Response) => {
        try {
            const results = await Promise.all(req.body.events.map(handleEvent));
            res.json(results);
        } catch (err) {
            console.error(err);
            res.status(500).end();
        }
    }
);

const client = new Client(config);

async function handleEvent(event: WebhookEvent): Promise<MessageAPIResponseBase | null> {
    // event の中身をログ出力
    console.log(event);

    if (event.type !== 'message' || event.message.type !== 'text') {
        return null;
    }

    const echo: TextMessage = {
        type: 'text',
        text: event.message.text,
    };

    return client.replyMessage(event.replyToken, echo);
}

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});
