const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');

const {generateMessage,generateLocationMessage} = require('./utils/mesaage')
const app = express();
const port = process.env.PORT || 3000 ;
const publicPath = path.join(__dirname,'../public');

var server  = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New User Connected');

    socket.on('createMessage',(msg,callback)=>{
        io.emit('newMessage',{
            'from':msg.from,
            'text':msg.text,
            'createdAt':new Date().getTime()

        })
        callback();
    })
              
    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.lang,coords.long))
        
    })

    socket.emit('newMessage',generateMessage('Admin','Welcome to chat'));
    socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined the chat'));
    socket.on('disconnect',(socket)=>{
        console.log('User DisConnected');
    });
});

server.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
});
