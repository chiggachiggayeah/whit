var WebTorrent = require('webtorrent');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// TODO
/*
* [x] read markdown
* [x] read torrent
* [] persist torrent -> didn't like localStorage solution
* [] discovery for articles -> when a client seeds a torrent they emit a message from the Server
* -> this message is in turn broadcasted by the servr
*/

app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// io stuff
io.on('connection', function(socket){
  // should send an initial update to newcomers
  socket.on('new-article', function(hash){
    io.broadcast('add-article', hash);
  });
});

http.listen('8080', function(){
  console.log("we listenin'")
});
