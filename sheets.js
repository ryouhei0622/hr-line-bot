import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const spreadsheetId = process.env.SPREAD_SHEET_ID;
const sheetName = process.env.SHEET_NAME || "シート1";

// Google 認証
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth });

export async function appendRow(values) {
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:B`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

export async function findUserRow(userId) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:B`,
  });
  const rows = res.data.values || [];
  const idx = rows.findIndex(r => r[0] === userId);
  return { rows, idx };
}

export async function updateRegion(userId, region) {
  const { rows, idx } = await findUserRow(userId);
  if (idx === -1) {
    await appendRow([userId, region]);
  } else {
    const rowNumber = idx + 1;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!B${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[region]] },
    });
  }
}

export async function getUserIdsByRegion(region) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:B`,
  });
  const rows = res.data.values || [];
  return rows.filter(r => r[1] === region).map(r => r[0]);
}
