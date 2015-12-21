var socket = require('socket.io-client')('http://localhost:8080');

var emitter = {
  newArticle: function(articleData){
    socket.emit('new-article', articleData);
  }
}

var responder = {
  onUpdatePaper: function(cb){
    socket.on('update-paper', function(data){
      cb(data)
    });
  }
}

module.exports = {
  emitter: emitter,
  responder: responder
}
