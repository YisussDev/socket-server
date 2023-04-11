const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
require('dotenv').config()

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*'
  }
});

// Habilitar CORS para todas las solicitudes
app.use(cors());

// Configurar rutas de tu aplicación

// Configurar eventos de sockets
io.listen(process.env.SOCKET_PORT || 3000);

io.on('connection', (client) => {
  const { nameRoom } = client.handshake.query || 'global';
  client.join(nameRoom);
  client.emit('connectClient', client.id)
  client.on('message', (message)=>{
    client.broadcast.emit('message', message)
  })
});




app.get('/', (req, res)=>{
    res.end();
})

// Iniciar servidor HTTP
const PORT = process.env.PORT || 4000; // Puerto en el que se ejecutará el servidor
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});