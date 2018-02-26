
const moment = require('moment'); 
const generateMessage = (from ,text) =>{
    return {
        from,
        text,
        createdAt: moment().valueOf()
    }
}

const generateLocationMessage = (from ,lang,long) =>{
    return {
        from,
        url:`https://www.google.com/maps?q=${lang},${long}`,
        createdAt: moment.valueOf()
    }
}

module.exports = {generateMessage,generateLocationMessage}