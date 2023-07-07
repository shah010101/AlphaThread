const socketIO = require('socket.io');
const http = require('http');
const server = http.createServer();
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
});

server.listen(8000, () => {
    console.log('Socket.IO server is running on port 8000');
  });
  
// Node Server which handle socket io connection
const users={};
// console.log("aur yaha bhi");
// socket is particular connection
// io.on socket.io instance listen all the sockets
io.on('connection', socket=>{
    // if new user joined then socket will be callback and store the name of user and  broadcast other sockets by emit name of user 
    socket.on('new user',name=>{
        console.log("new user");
        users[socket.id]=name;
        socket.broadcast.emit('user joined',name);
    })
    // if message send by any user then it will be nodbroadcast to all other users 
    socket.on('send',message=>{
        socket.broadcast.emit('receive',{
            message:message,
            name:users[socket.id]
        })
    });
   // if user disconnected 
    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });
});
