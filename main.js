import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

console.log("起動");

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("新しいクライアントが接続しました");

  ws.on("message", (message) => {
    console.log(`サーバー: クライアントから受信したメッセージ: ${message}`);
    
    // ここでメッセージをブロードキャストする処理を追加
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("クライアントが切断されました");
  });
});

app.use(express.static("public"));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`サーバーがポート ${port} で起動しました`);
});
