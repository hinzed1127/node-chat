var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var socket = require('socket.io');
var io = socket.listen(server);

var messages = [];

var storeMessage = function(name, data){
	messages.push({name: name, data: data});
	if (messages.length > 10) {
		messages.shift();
	}
}

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/'));

io.on('connection', function(client){
	client.on('join', function(username){
		client.username = username;
		io.emit('message', client.username + ' has joined');
	})

	client.on('message', function(msg){
		client.broadcast.emit('message', client.username + ':' + msg);
		client.emit('message', client.username + ':' + msg);
		console.log(client.username + ':' + msg);
	});

});

server.listen(8080);