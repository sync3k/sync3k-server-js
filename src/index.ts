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
  msg: String;
};

let messages: { [key: string]: [OrderedMessage] } = {};

function handleTopic(topic: string, ws: WebSocket, skip = 0) {
  messages[topic] = (messages[topic] as [OrderedMessage]) || [] as [OrderedMessage];
  ws.on('message', (msg) => {
    messages[topic].push({ id: messages[topic].length, msg: msg.toString() });
  });
  messages[topic].forEach((msg) => {
    ws.send(JSON.stringify(msg));
  });
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
