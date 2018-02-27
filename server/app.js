const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');

const {isRealString} = require('./utils/validation');
const {generateMessage,generateLocationMessage} = require('./utils/mesaage');
const {Users} = require('./utils/users');
const app = express();
const port = process.env.PORT || 3000 ;
const publicPath = path.join(__dirname,'../public');

var server  = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New User Connected');

    socket.on('join',(params,callback)=>{
        if(!isRealString(params.name) || ! isRealString(params.room)){
            return  callback('Name and Room are required')
        }

        socket.join(params.room);
        users.removeUser(socket.id)
        users.addUser(socket.id,params.name,params.room );
        
        io.to(params.room).emit('updateUserList',users.getUserList(params.room))

        socket.emit('newMessage',generateMessage('Admin','Welcome to chat'));
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} joined the chat`));
        // socket.leave(params.room)
        callback();

    })

    socket.on('createMessage',(msg,callback)=>{
        var user = users.getUser(socket.id);

        if(user && isRealString(msg.text)){
            io.to(user.room).emit('newMessage',{
                'from':user.name,
                'text':msg.text,
                'createdAt':new Date().getTime()
    
            })
        }
        
        callback();
    })
              
    socket.on('createLocationMessage',(coords)=>{
        var user = users.getUser(socket.id);

        if(user){
            io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name ,coords.lang,coords.long))
        }
        
    })

  
    socket.on('disconnect',()=>{
       var user = users.removeUser(socket.id);


       if(user){
           io.to(user.room).emit('updateUserList',users.getUserList(user.room));
           io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left .`))
       }
    });
});

server.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
});
