import { updateAnswer} from "./sheets.js";

export async function callback(event, client) {
  if (event.type === "follow") {
    return sendQuestion(event.replyToken, client, 1);
  }

  if (event.type === "postback") {
    const postbackData = event.postback.data;
    const userId = event.source.userId;
    const [answer, questionNumberStr] = postbackData.split(":");
    const questionNumber = parseInt(questionNumberStr, 10);

    // ✅ 回答をスプレッドシートに横展開で記録
    await updateAnswer(userId, questionNumber, answer);

    // ✅ 次の質問があれば送信、それ以降は終了メッセージ
    if (questionNumber < 5) {
      await sendQuestion(null, client, questionNumber + 1, userId);
    } else {
      await client.pushMessage(userId, [
        { type: "text", text: "✅ すべてのアンケートが完了しました。ご協力ありがとうございました！" },
      ]);
    }
  }
  return null;
}

/**
 * 既存の質問送信ロジック
 */
function sendQuestion(replyToken, client, number = 1, userId = null) {
  const flexMessage = {
    type: "flex",
    altText: `アンケート${number}`,
    contents: {
      type: "carousel",
      contents: [
        createRegionBubble(
          `https://raw.githubusercontent.com/ryouhei0622/hr-line-bot/main/assets/images/tokyo.png`,
          `tokyo:${number}`,
          `東京エリア ${number}`
        ),
        createRegionBubble(
          `https://raw.githubusercontent.com/ryouhei0622/hr-line-bot/main/assets/images/kanagawa.png`,
          `kanagawa:${number}`,
          `神奈川エリア ${number}`
        ),
      ],
    },
  };

  if (replyToken) {
    return client.replyMessage(replyToken, [flexMessage]);
  } else if (userId) {
    return client.pushMessage(userId, [flexMessage]);
  }
}

function createRegionBubble(imageUrl, postbackData, titleText) {
  return {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "image",
          url: imageUrl,
          size: "full",
          aspectMode: "cover",
          aspectRatio: "2:3",
          gravity: "top",
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "vertical",
              contents: [
                { type: "filler" },
                {
                  type: "box",
                  layout: "baseline",
                  contents: [
                    { type: "filler" },
                    {
                      type: "text",
                      text: "選択する",
                      color: "#000000",
                      flex: 0,
                      offsetTop: "-2px",
                    },
                    { type: "filler" },
                  ],
                  spacing: "sm",
                },
                { type: "filler" },
              ],
              borderWidth: "1px",
              cornerRadius: "4px",
              spacing: "sm",
              borderColor: "#000000",
              margin: "xxl",
              height: "32px",
              action: {
                type: "postback",
                label: "action",
                data: postbackData, // "tokyo:1"
              },
            },
          ],
          position: "absolute",
          offsetBottom: "0px",
          offsetStart: "0px",
          offsetEnd: "0px",
          paddingAll: "12px",
          paddingTop: "14px",
        },
      ],
      paddingAll: "0px",
    },
  };
}
