import  express  from 'express';
import http from 'http';

import { matchesRouter } from './routes/matches.js';
import { attachWebSocketServer } from './ws/server.js';

const app = express();
const server = http.createServer(app);

const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json()); // this is the line that enables middleware to parse JSON bodies in requests

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/matches', matchesRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated; // this line allows us to access the broadcastMatchCreated function from the app.locals object, making it available throughout the application, including in our route handlers where we can call it to broadcast new match creations to all connected WebSocket clients.

server.listen(PORT, HOST, () => {
    const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
    console.log(`Sportz is running at ${baseUrl}`);
    console.log(`WebSocket server is running at ${baseUrl.replace('http', 'ws')}/ws`); //the `/ws` is tp tell our app to treat it via the websocket server
    
});