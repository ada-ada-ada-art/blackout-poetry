var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
var ngrok = require('ngrok');
var uuid = require('node-uuid');

app.set('port', (process.env.PORT || 5000));

ngrok.connect(5000, function(err, url) {
    if(err){
        console.log(err);
    }
    console.log('Ngrok opened at: ' + url);
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false, limit: '5mb'}));

// parse application/json
app.use(bodyParser.json({limit: '5mb'}));

app.listen(app.get('port'), function () {
  console.log('Server started listening on this port: ' + app.get('port'));
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/generated-poetry', express.static(__dirname + '/generated-poetry'));
app.use('/', express.static(__dirname + '/'));

app.get('/lyric', function(req, res, next) {
    fs.readFile('./src/lyrics/lazer-eyes.txt', 'utf8', (err, data) => {
        if(err) throw err;
        res.send(data);
    });
});

app.post('/save-lyric', function(req, res, next) {
    var string = req.body.data;

    var regex = /^data:.+\/(.+);base64,(.*)$/;
    var matches = string.match(regex);
    var ext = matches[1];
    var data = matches[2];
    var buffer = new Buffer(data, 'base64');

    var fileName = 'poem_' + Date.now() + '.png';
    fs.writeFile('./generated-poetry/' + fileName, buffer, (err) => {
        if(err) throw err;
        console.log('Saved file');
    });
    res.send('Ok good.');
});