var marked  = require('marked');
var marked_options = {
  gfm: false,
  sanitize: true
}
marked.setOptions(marked_options);

var socket = require('socket.io-client')('http://localhost:8080');

var client = new WebTorrent();
var uploadElem = document.getElementById('upload');
var downloadElem = document.getElementById("torrent-id-submit");
var mdTrans = document.getElementById('md-transform');
var fetchLastArticleBtn = document.getElementById('fetch-last-article');
downloadElem.addEventListener('click', addFile, false);
uploadElem.addEventListener('change', seedFile, false);
fetchLastArticleBtn.addEventListener('click', fetchLastArticle);

function seedFile(){
  var upld = this.files[0];
  if(isMarkdown(upld.name)){
    console.log("yeppers");
    client.seed(upld, onSeed);
  } else {
    console.log("naw son");
  }
}

// could be more than one file in the future
function addFile(){
  var torrentId = document.getElementById('torrent-id').value.trim();
  if(torrentId != ''){
    client.add(torrentId, onTorrent);
  }
}

function fetchLastArticle(){
  seedFile();
}

function onTorrent(torrent){
  console.log(torrent.infoHash);
  var infoObj = {
    hash: torrent.infoHash,
    title: document.getElementById('article-title').value()
  };
  newArticle(infoObj);
  torrent.files.forEach(function(file){
    var stream = file.createReadStream();
    stream.setEncoding('utf-8');
    var final = "";
    stream.on('data', function(chunk){
      final += chunk;
    });
    stream.on('end', function(){
      mdTrans.innerHTML = marked(final);
    });
  });
}

function onSeed(torrent){
  // persistArticle(torrent.files[0]);
  // console.log(torrent.files[0].name);
  onTorrent(torrent);
}

// should check if localStorage is available
// maybe display an error if not
// could just save it to my backblaze account
// or sync with dropbox, idk
function persistArticle(article){
  var ls  = localStorage;
  article.getBuffer(function(err, buffer){
    if(err) throw err;
    var blob = new Blob(buffer, {type: "text/markdown"});
    var fr = new FileReader();
    fr.onload = function(e){
      var result = e.target.result;
      console.log(result);
      try {
        ls['latest-article'] = result;
      }
      catch(e){
        console.log("couldn't store markdown: " + e);
      }
    };
    fr.readAsDataURL(blob);
  });
}

function mdTransform(){}

// check if markdown
function isMarkdown(filename){
  var rg = /\.md$/g
  var fileStr = filename.toLowerCase();
  return rg.exec(fileStr);
}

// SOCKET STUFF
function newArticle(info){
  socket.emit('new-article', info);
}

socket.on('add-article', function(info){

});
