var socket = io();
socket.on('connect',function(){
    console.log('Connected to server');
});

socket.on('newUser',function(newMsg){
    console.log(newMsg)
    var li = jQuery('<li></li>');
    li.text(`${newMsg.from}:${newMsg.text}`);

    jQuery('#messages').append(li);
})

socket.on('newMessage',function(newMsg){
    //console.log('new messages',newMsg)
    var li = jQuery('<li></li>');
    li.text(`${newMsg.from}:${newMsg.text}`);

    jQuery('#messages').append(li);
})
socket.on('disconnect',function(){
    console.log('Disconnected to server');
})

// socket.emit('createMessage',{
//     'From':'Shiva',
//     'Text':'Hello babua'
// },function(){
//     console.log('Got it')
// })

jQuery('#message-form').on('submit',function(e){
    e.preventDefault();
    socket.emit('createMessage',{
        from:'User',
        text:jQuery('[name=message]').val()
    },function(){
        console.log('Hoo')
    })
});