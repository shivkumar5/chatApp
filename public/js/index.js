var socket = io();
socket.on('connect',function(){
    console.log('Connected to server');
});

function scrollBottom(){
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight(); 

    if(clientHeight+scrollTop + newMessageHeight + lastMessageHeight >=scrollHeight){
        messages.scrollTop(scrollHeight);

    }
}


socket.on('newMessage',function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
        text:message.text,
        from:message.from,
        createdAt:formattedTime
    });
    jQuery('#messages').append(html);
    scrollBottom();
})
socket.on('disconnect',function(){
    console.log('Disconnected to server');
})

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
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,{
        url:message.url,
        from:message.from,
        createdAt:formattedTime
    });
    jQuery('#messages').append(html);
    scrollBottom();
})