const WebSocket = require('ws');

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
    console.log('New client connected');

    // Listening for messages from the client
    ws.on('message', message => {
        console.log(`Received: ${message}`);
        // Echo the message back to the client
        ws.send(`Server: ${message}`);
    });

    // Handling client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // Sending a message to the client on connection
    ws.send('Welcome to the WebSocket server!');
});
