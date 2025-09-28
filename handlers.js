export async function callback(event, client) {
  if (event.type === "follow") {
    return sendQuestion(event.replyToken, client);
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
                url: "https://raw.githubusercontent.com/ryouhei0622/houhan-kun/main/assets/images/tokyo.png",
                size: "full",
                aspectMode: "cover",
                aspectRatio: "2:3",
                gravity: "top"
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
                          { type: "text", text: "選択する", color: "#000000", flex: 0, offsetTop: "-2px" },
                          { type: "filler" }
                        ],
                        spacing: "sm"
                      },
                      { type: "filler" }
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
                      data: "tokyo"
                    }
                  }
                ],
                position: "absolute",
                offsetBottom: "0px",
                offsetStart: "0px",
                offsetEnd: "0px",
                paddingAll: "12px",
                paddingTop: "14px"
              }
            ],
            paddingAll: "0px"
          }
        },
        {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "image",
                url: "https://raw.githubusercontent.com/ryouhei0622/houhan-kun/main/assets/images/kanagawa.png",
                size: "full",
                aspectMode: "cover",
                aspectRatio: "2:3",
                gravity: "top"
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
                          { type: "text", text: "選択する", color: "#000000", flex: 0, offsetTop: "-2px" },
                          { type: "filler" }
                        ],
                        spacing: "sm"
                      },
                      { type: "filler" }
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
                      data: "kanagawa"
                    }
                  }
                ],
                position: "absolute",
                offsetBottom: "0px",
                offsetStart: "0px",
                offsetEnd: "0px",
                paddingAll: "12px",
                paddingTop: "18px"
              }
            ],
            paddingAll: "0px"
          }
        }
      ]
    }
  };

  return client.replyMessage(replyToken, flexMessage);
}
