
var http = require('http');
var fs = require('fs');
var uuid = require('node-uuid');
var path = require('path');
var async = require('async');
var _ = require('lodash');
var urlString = fs.readFileSync('76-100.txt','utf8')
var urlList = _.compact(urlString.split("\n"));
console.log(urlList.length);

function download(url,done){
  var file = fs.createWriteStream("images/"+uuid.v4() + path.extname(url));
  http.get(url, function(response) {
    response.pipe(file);
    if(done){
      done();
    }
  });
}

var q = async.queue(function (url, callback) {
    download(url,callback);
}, 5);

// assign a callback
q.drain = function() {
    console.log('all items have been processed');
}

urlList.map(function(url){
    q.push(url);
});
//download();
//q.push();
