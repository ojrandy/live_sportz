import { WebSocket, WebSocketServer } from "ws";

// Creating a guard function to handle the socket connection and ensure that the client is authenticated before allowing them to interact with the WebSocket server, enhancing security by preventing unauthorized access to the WebSocket endpoints
function sendJson(socket, payload) {
      if (socket.readyState !== WebSocket.OPEN) return;

      socket.send(JSON.stringify(payload));
}

// sending broadcast to every connected user
 function broadcast(wss, payload) {
      for (const client of wss.clients) {
      if (client.readyState !== WebSocket.OPEN) return;

      client.send(JSON.stringify(payload));
      }
}

// Attaching the WebSocket server to the existing HTTP server, allowing it to handle WebSocket connections alongside regular HTTP requests, enabling real-time communication capabilities for the application
export function attachWebSocketServer(server) {
      const wss = new WebSocketServer({ 
            server,
            path: "/ws", // This specifies the path on which the WebSocket server will listen for incoming connections
            maxPayload: 1024 * 1024, // This is very important against flooding attacks and memory leaks. as it sets max of 1MB for imcoming messages. 
      }); 

      wss.on("connection", (socket) => { 
            sendJson(socket, { type: "welcome", message: "Welcome to the WebSocket server!" });

            socket.on('error', console.error);
      });

      function broadcastMatchCreated(match) {
            broadcast(wss, { type: "match_created", data: match });
      }

      return { broadcastMatchCreated };
}