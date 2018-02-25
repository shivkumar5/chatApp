const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');
const app = express();
const port = process.env.PORT || 3000 ;
const publicPath = path.join(__dirname,'../public');

var server  = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New User Connected');

    socket.on('createMessage',(msg)=>{
        console.log(msg);
        io.emit('newMessage',{
            'from':msg.from,
            'text':msg.text,
            'createdAt':new Date().getTime()

        })
    })
    socket.on('disconnect',(socket)=>{
        console.log('User DisConnected');
    });
});

server.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
});
