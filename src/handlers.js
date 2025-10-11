import { updateRegion, getUserIdsByRegion } from "./sheets.js";

export async function callback(event, client) {
  if (event.type === "follow") {
    // 初回フォロー時 → Q1送信
    return sendQuestion(event.replyToken, client, 1);
  }

  if (event.type === "postback") {
    const postbackData = event.postback.data;
    const userId = event.source.userId;

    // postbackDataの例: "tokyo:1" → (回答:tokyo, 質問番号:1)
    const [region, questionNumberStr] = postbackData.split(":");
    const questionNumber = parseInt(questionNumberStr, 10);

    // 回答をスプレッドシートに記録
    if (["tokyo", "kanagawa"].includes(region)) {
      await updateRegion(userId, region);
    }

    // 次の質問があれば送信、それ以降は終了メッセージ
    if (questionNumber < 5) {
      await sendQuestion(null, client, questionNumber + 1, userId);
    } else {
      await client.pushMessage(userId, [
        { type: "text", text: "✅ すべてのアンケートが完了しました。ご協力ありがとうございました！" },
      ]);
    }

    return;
  }

  return null;
}

/**
 * 画像付きFlex送信（replyTokenがある場合はreply、ない場合はpush）
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
    // 初回フォロー時
    return client.replyMessage(replyToken, [flexMessage]);
  } else if (userId) {
    // 回答後の次の質問
    return client.pushMessage(userId, [flexMessage]);
  }
}

/**
 * 画像付きバブル生成関数
 */
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
                data: postbackData, // ✅ "tokyo:1" のように質問番号付き
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

/**
 * 地域別ターゲティング（任意）
 */
async function targetingRegionMessage(client) {
  const userIds = await getUserIdsByRegion("tokyo");

  const flexMessage = {
    type: "flex",
    altText: "tokyoの方限定！",
    contents: {
      type: "carousel",
      contents: [],
    },
  };

  if (userIds.length > 0) {
    return client.multicast(userIds, [flexMessage]);
  }
}
