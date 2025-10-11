import { updateAnswer } from "./sheets.js";

// 質問リストを定義（順番に送る）
const QUESTIONS = [
  "Q1．まずは、現在のお仕事のご状況を以下よりお選びください！（残り4問）",
  "Q2．これまでのご経験で、一番近い職種を以下よりお選びください！（残り3問）",
  "Q3．ご希望の勤務地は、どのあたりをお考えですか？（残り2問）",
  "Q4．現在の年収に近いものを以下よりお選びください！（残り1問）",
  "Q5．最後に、転職にあたり希望するスタンスをお選びください！",
];


export async function callback(event, client) {
  if (event.type === "follow") {
    // ✅ 初回フォロー時 → Q1送信
    await sendQuestion(event.replyToken, client, 1);
    return;
  }

  if (event.type === "postback") {
    const postbackData = event.postback.data;
    const userId = event.source.userId;
    const [answer, questionNumberStr] = postbackData.split(":");
    const questionNumber = parseInt(questionNumberStr, 10);

    // ✅ スプレッドシートに横展開で記録
    await updateAnswer(userId, questionNumber, answer);

    // ✅ 選択結果を返信
    await client.pushMessage(userId, [
      { type: "text", text: `> あなたの選択: ${answer}` },
    ]);

    // ✅ 次の質問があれば送信、それ以降は終了メッセージ
    if (questionNumber < QUESTIONS.length) {
      await sendQuestion(null, client, questionNumber + 1, userId);
    } else {
      await client.pushMessage(userId, [
        {
          type: "text",
          text: "✅ すべてのアンケートが完了しました。ご協力ありがとうございました！",
        },
      ]);
    }
  }

  return null;
}

/**
 * 質問文＋Flex送信（replyTokenがある場合はreply、ない場合はpush）
 */
async function sendQuestion(replyToken, client, number = 1, userId = null) {
  const questionText = QUESTIONS[number - 1];

  // ① 質問文メッセージ
  const questionMessage = { type: "text", text: questionText };

  // ② Flexメッセージ（画像付き）
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

  // ✅ 最初の1問目は replyMessage、それ以降は pushMessage
  if (replyToken) {
    return client.replyMessage(replyToken, [questionMessage, flexMessage]);
  } else if (userId) {
    return client.pushMessage(userId, [questionMessage, flexMessage]);
  }
}

/**
 * 画像付きバブル生成
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
