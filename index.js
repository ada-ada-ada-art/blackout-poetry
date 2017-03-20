var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
var ngrok = require('ngrok');

app.set('port', (process.env.PORT || 5000));

ngrok.connect(5000, function(err, url) {
  if(err){
    console.log(err);
  }
  console.log('Ngrok opened at: ' + url);
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/', express.static(__dirname + '/'));

app.get('/lyric', function(req, res, next) {

    fs.readFile('./src/lyrics/lazer-eyes.txt', 'utf8', (err, data) => {
        if(err) throw err;
        res.send(data);
    });
});

app.listen(app.get('port'), function () {
  console.log('Server started listening on this port: ' + app.get('port'));
});