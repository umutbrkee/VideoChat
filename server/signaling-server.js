const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    try {
      const parsedMessage = JSON.parse(message);
      const { type, data } = parsedMessage;

      switch (type) {
        case 'call':
        case 'offer':
        case 'answer':
        case 'candidate':
        case 'reject':
          wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(parsedMessage));
            }
          });
          break;
        default:
          console.warn('Unhandled message type:', type);
      }
    } catch (error) {
      console.error('JSON parse error on server:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.send(JSON.stringify({ type: 'hello', data: 'world' }));
});

console.log('WebSocket signaling server is running on ws://localhost:8080');
