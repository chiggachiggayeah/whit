var marked  = require('marked');
var marked_options = {
  gfm: false,
  sanitize: true
}
marked.setOptions(marked_options);

var sockHndler = require('./socketHandler');

var client = new WebTorrent();


// check if markdown
function isMarkdown(filename){
  var rg = /\.md$/g
  var fileStr = filename.toLowerCase();
  return rg.exec(fileStr);
}

// will use this to process the torrents
// should give data back to the client
function readTorrentFile(torrent, previewFlag){
  return new Promise(function(resolve, reject){
    var file = torrent.files[0];
    var stream = file.createReadStream();
    stream.setEncoding('utf-8');
    var final = "";
    stream.on('data', function(chunk){
      final += chunk;
    });
    stream.on('end', function(){
      // might want to wrap and elminate all
      // html tags
      var prev = final.length > 30 ? final.slice(0, 20) : final;
      prev += '...';
      var ad = {
        hash: torrent.infoHash,
        title: "A Case",
        author: "Jim Sales",
        content: previewFlag ? prev : final,
      };
      console.log(ad.hash);
      resolve(ad);
    });
  });
}

function digestTorrentFull(torrent){
  readTorrentFile(torrent, false);
}

function digestTorrentPartial(torrent){
  var promise = readTorrentFile(torrent, true);
  return promise;
}

var utils = {
  seedFile: function(file){
    function onSeed(torrent){
      // I think you're going to want to construct
      // the preview before emit the new Article
      // actually maybe not
      var digest = digestTorrentPartial(torrent);
      digest.then(function(articleData){
        console.log(articleData);
        sockHndler.emitter.newArticle(articleData);
      });
    };
    var upld = file;
    if(isMarkdown(upld.name)){
      console.log("yeppers");
      client.seed(upld, onSeed);
    } else {
      console.log("naw son");
    }
  },
  addFile: function(hash){
    client.add(hash, digestTorrentPartial);
  },
  toMarkdown: function(text){
    return marked(text);
  }
}

// could be more than one file in the future
function addFile(){
  var torrentId = document.getElementById('torrent-id').value.trim();
  if(torrentId != ''){
    client.add(torrentId, onTorrent);
  }
}

// should check if localStorage is available
// maybe display an error if not
// could just save it to my backblaze account
// or sync with dropbox, idk
// function persistArticle(article){
//   var ls  = localStorage;
//   article.getBuffer(function(err, buffer){
//     if(err) throw err;
//     var blob = new Blob(buffer, {type: "text/markdown"});
//     var fr = new FileReader();
//     fr.onload = function(e){
//       var result = e.target.result;
//       console.log(result);
//       try {
//         ls['latest-article'] = result;
//       }
//       catch(e){
//         console.log("couldn't store markdown: " + e);
//       }
//     };
//     fr.readAsDataURL(blob);
//   });
// }

module.exports = utils;
