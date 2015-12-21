var WebTorrent = require('webtorrent');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var React = require('react');
var ReactDom = require('react-dom/server');
var io = require('socket.io')(http);

// TODO
/*
* [x] read markdown
* [x] read torrent
* [] persist torrent -> didn't like localStorage solution
* [] discovery for articles -> when a client seeds a torrent they emit a message to the Server
* -> this message is in turn broadcasted by the servr
*/

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/components'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  // ReactDom.render()
});

// io stuff
io.on('connection', function(socket){
  socket.broadcast.emit('new-member'); //<-- catch up
  // should send an initial update to newcomers
  socket.on('new-article', function(articleData){
    // socket sends the new article to other sockets
    socket.broadcast.emit('update-paper', articleData);
    // cb();
  });
});

http.listen('8080', function(){
  console.log("we listenin'")
});
