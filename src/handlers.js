import { updateRegion, getUserIdsByRegion } from "./sheets.js";

export async function callback(event, client) {
  if (event.type === "follow") {
    // フォロー時に質問を送信
    return sendQuestion(event.replyToken, client);
  } else if (event.type === "postback") {
    const postbackData = event.postback.data;

    if (["tokyo", "kanagawa"].includes(postbackData)) {
      // ユーザーの選択をシートに記録
      await updateRegion(event.source.userId, postbackData);

      if (postbackData === "tokyo") {
        return targetingRegionMessage(client);
      } else {
        return client.replyMessage(event.replyToken, [
          { type: "text", text: "ファイル分けたよ" },
        ]);
      }
    }
  }
  return null;
}

function sendQuestion(replyToken, client) {
  const flexMessage = {
    type: "flex",
    altText: "アンケート",
    contents: {
      type: "carousel",
      contents: [
        {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "image",
                url: "https://raw.githubusercontent.com/ryouhei0622/hr-line-bot/main/assets/images/tokyo.png",
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
                      data: "tokyo",
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
        },
        {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "image",
                url: "https://raw.githubusercontent.com/ryouhei0622/hr-line-bot/main/assets/images/kanagawa.png",
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
                      data: "kanagawa",
                    },
                  },
                ],
                position: "absolute",
                offsetBottom: "0px",
                offsetStart: "0px",
                offsetEnd: "0px",
                paddingAll: "12px",
                paddingTop: "18px",
              },
            ],
            paddingAll: "0px",
          },
        },
      ],
    },
  };

  // ✅ replyMessage は (replyToken, messages[]) 形式
  return client.replyMessage(replyToken, [flexMessage]);
}

async function targetingRegionMessage(client) {
  const userIds = await getUserIdsByRegion("tokyo");

  const flexMessage = {
    type: "flex",
    altText: "tokyoの方限定！",
    contents: {
      type: "carousel",
      contents: [
        // targetingRegionMessage 用の bubble をここに追加
      ],
    },
  };

  if (userIds.length > 0) {
    // ✅ multicast も (to, messages[]) 形式
    return client.multicast(userIds, [flexMessage]);
  }
}
