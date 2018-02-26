var socket = io();
socket.on('connect',function(){
    console.log('Connected to server');
});


socket.on('newMessage',function(newMsg){
    //console.log('new messages',newMsg)
    var formattedTime = moment(newMsg.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    li.text(`${newMsg.from}: ${formattedTime}: ${newMsg.text}`);

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
var msgTextBox = jQuery('[name=message]')

jQuery('#message-form').on('submit',function(e){
    e.preventDefault();
    socket.emit('createMessage',{
        from:'User',
        text:msgTextBox.val()
    },function(){
        msgTextBox  .val('')
    })
});


var locationButton = jQuery('#sendLocation');
locationButton.on('click',function(){
    if(!navigator.geolocation){
        alert('Geolocation is not supported by your browser');
    }

    locationButton.attr('disabled','disabled').text('Sending location ...');
    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('send location');
        socket.emit('createLocationMessage',{
            lang:position.coords.latitude,
            long:position.coords.longitude
        });

    },function(){
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location')
    })
})

socket.on('newLocationMessage',function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Location</a>');
    li.text(`${message.from}: ${formattedTime}:  `);
    a.attr('href',message.url);
    li.append(a);
    jQuery('#messages').append(li);
})