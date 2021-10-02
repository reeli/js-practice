import WebSocket,{WebSocketServer} from 'ws';

const wss = new WebSocketServer({port: 8080});
const wsMap = new Map();

// 1. 服务器需要管理一个连接池，每个客户端过来都需要添加到这个连接池里面，这样才能保证服务器的消息能通知给每一个客户端。
// 2. 在给客户端发送消息之前，需要先验证客户端是否还处于正常连接状态，如果不是就不给该客户端推送消息

wss.on('connection', function connection(ws) {

  // 监听从客户端发送过来的消息，每个客户端发过来的消息，都需要推送给连接池里面的所有客户端
  ws.on('message', function incoming(message, isBinary) {
    wss.clients.forEach(client=>{
      if (client.readyState === WebSocket.OPEN) {
        client.send(message,  { binary: isBinary })
      }
    })
    console.log('received: %s', message);
  });
});
