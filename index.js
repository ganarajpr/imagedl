var rp = require('request-promise');
var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('lodash');
var startPage = 76;
var maxPage = 100;
var wstream = fs.createWriteStream(startPage+'-'+maxPage+'.txt');
//260 pages.
function writeToFile(fileName,content){
  fs.writeFile(fileName, content, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  });
}


function startCapture(index){
  return getListOfImage('http://inspired-ui.com/page/'+index,'.post img')
    .then(function(list){
      var string = _.reduce(list,function(combined,n){
        return combined +"\n"+ n;
      });
      wstream.write(string+"\n");
      if(index < maxPage){
        //do something
        startCapture(index+1);
      }
      else{
        wstream.end();
      }
    })
}


startCapture(startPage);




function getListOfImage(url,selector){
  function process(html){
    //console.log(data);
    var $ = cheerio.load(html);
    return $(selector).map(function(){
      return $(this).attr('src');
    }).get();

  }
  return rp(url)
      .then(process);
}
