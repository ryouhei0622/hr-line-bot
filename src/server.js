import express from "express";
import { middleware } from "@line/bot-sdk";
import { lineConfig, client } from "./line.js";
import { callback } from "./handlers.js";

const PORT = process.env.PORT || 3000;
const app = express();

// webhook endpoint
app.post("/webhook", middleware(lineConfig), async (req, res) => {
  try {
    await Promise.all(req.body.events.map(event => callback(event, client)));
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
