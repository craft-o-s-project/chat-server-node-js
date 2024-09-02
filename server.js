const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Serve static files (e.g., index.html) from the root directory
app.use(express.static(path.join(__dirname, '/')));

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Create a WebSocket server and bind it to the same HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('A new client connected.');

    ws.on('message', (message) => {
        console.log('Received:', message);

        // Broadcast the received message to all connected clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('A client disconnected.');
    });
});

console.log('WebSocket server is running.');
