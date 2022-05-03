import express from "express";
import { WebSocketServer } from "ws";

const app = express();

const wss = new WebSocketServer({ port: 8080, clientTracking: true });

wss.on("connection", (ws) => {
  ws.on("message", (e) => {
    try {
      const rawMessage: { sender: string; message: string } = JSON.parse(
        e.toString(),
      );
      const { sender, message } = rawMessage;

      for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ sender, message }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  });

  ws.send(
    JSON.stringify({
      sender: "Server",
      message: "Connected to the websocket server",
    }),
  );
});

app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
