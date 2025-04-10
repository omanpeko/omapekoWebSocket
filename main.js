import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// WebSocketサーバー
const wss = new WebSocketServer({ server });

let sockets = [];

wss.on('connection', (ws) => {
  console.log('WebSocket接続');
  sockets.push(ws);

  ws.on('close', () => {
    sockets = sockets.filter(s => s !== ws);
  });
});

// fetch受信 → WebSocket中継
app.post('/send', (req, res) => {
  const { text } = req.body;
  console.log(`受信テキスト: ${text}`);

  sockets.forEach(ws => {
    if (ws.readyState === 1) ws.send(text);
  });

  res.json({ status: 'OK' });
});
