import { Request, Response, Application } from 'express';
import * as WebSocket from 'ws';

const express = require('express');
const app = express() as Application & { ws: any };

const expressWs = require('express-ws')(app);

const port = process.env.PORT || 3000;

app.get('/:path', (req: Request, res: Response) => {
  res.json({ message: `hello ${req.params.path}` });
});

type OrderedMessage = {
  id: Number;
  message: String;
};


let messages: { [key: string]: [OrderedMessage] } = {};
let sockets: { [key: string]: Set<WebSocket> } = {};

function handleTopic(topic: string, ws: WebSocket, skip = 0) {
  messages[topic] = (messages[topic] as [OrderedMessage]) || [] as [OrderedMessage];
  ws.on('message', (msg) => {
    const msgToPush = { id: messages[topic].length, message: msg.toString() };
    messages[topic].push(msgToPush);
    const jsonMsgToPush = JSON.stringify(msgToPush);
    sockets[topic].forEach((ws) => {
      ws.send(jsonMsgToPush);
    });
  });
  ws.on('close', () => {
    sockets[topic].delete(ws);
  });
  messages[topic].forEach((msg) => {
    ws.send(JSON.stringify(msg));
  });
  if (!sockets[topic]) {
    sockets[topic] = new Set();
  }
  sockets[topic].add(ws);
}

app.ws('/:topic', (ws: WebSocket, req: Request) => {
  const topic = req.params.topic;
  handleTopic(topic, ws);
});

app.ws('/:topic/:skip', (ws: WebSocket, req: Request) => {
  const topic = req.params.topic;
  handleTopic(topic, ws, req.params.skip);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});

export default app;
