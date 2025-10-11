import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const spreadsheetId = process.env.SPREAD_SHEET_ID;
const sheetName = process.env.SHEET_NAME || "シート1";

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth });

/**
 * 指定した値を行末または既存行の右隣に追加
 * userId が存在しない → 新規行
 * userId が存在する → 指定列に書き込み
 */
export async function updateAnswer(userId, questionNumber, answerValue) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:Z`, // 最大26列まで対応
  });

  const rows = res.data.values || [];
  let rowIndex = rows.findIndex(r => r[0] === userId);

  // 行が存在しない → 新規追加
  if (rowIndex === -1) {
    const newRow = [userId];
    // questionNumberに応じて列位置をずらす
    for (let i = 1; i < questionNumber; i++) newRow.push("");
    newRow.push(answerValue);
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [newRow] },
    });
    return;
  }

  // 行が存在する場合 → 列を指定して上書き
  const rowNumber = rowIndex + 1;
  const columnLetter = getColumnLetter(questionNumber + 1); // A=1, B=2…
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!${columnLetter}${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[answerValue]] },
  });
}

/**
 * 列番号をアルファベットに変換
 * 例: 1→A, 2→B, 3→C
 */
function getColumnLetter(num) {
  let s = "";
  while (num > 0) {
    const mod = (num - 1) % 26;
    s = String.fromCharCode(65 + mod) + s;
    num = Math.floor((num - mod) / 26);
  }
  return s;
}
