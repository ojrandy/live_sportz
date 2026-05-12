import { WebSocket, WebSocketServer } from "ws";

// Creating a guard function to handle the socket connection and ensure that the client is authenticated before allowing them to interact with the WebSocket server, enhancing security by preventing unauthorized access to the WebSocket endpoints
function sendJson(socket, payload) {
      if (socket.readyState !== WebSocket.OPEN) return;

      socket.send(JSON.stringify(payload));
}

// sending broadcast to every connected user
 function broadcast(wss, payload) {
      for (const client of wss.clients) {
      if (client.readyState !== WebSocket.OPEN) continue;

      client.send(JSON.stringify(payload));
      }
}

// Attaching the WebSocket server to the existing HTTP server, allowing it to handle WebSocket connections alongside regular HTTP requests, enabling real-time communication capabilities for the application
export function attachWebSocketServer(server) {
      const wss = new WebSocketServer({ server, path: "/ws", maxPayload: 1024 * 1024 }); // 1MB max payload

      wss.on("connection", (socket) => {
            socket.isAlive = true;
            // The ping-pong mechanism is implemented to detect and close dead connections, ensuring that the WebSocket server maintains only active connections and improves resource management by periodically checking the health of each connection
            socket.on("pong", () => {
                  socket.isAlive = true;
            });

            sendJson(socket, { type: "welcome" });

            socket.on('error', console.error);
      });

      // the ping
      const interval = setInterval(() => {
            wss.clients.forEach((ws) => {
                  if (ws.isAlive === false) return ws.terminate();

                  ws.isAlive = false;
                  ws.ping();
            });
      }, 30000); // Ping every 30 seconds

      wss.on('close', () => clearInterval(interval));

      function broadcastMatchCreated(match) {
            broadcast(wss, { type: "matchCreated", data: match });
      }

      return { broadcastMatchCreated };
}