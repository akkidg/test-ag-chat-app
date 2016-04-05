var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var port = process.env.PORT || 5000

	var express = require('express');
	app.use(express.static(__dirname + "/public"));

app.get('/',function(req,res)	
	res.render('index.html');
});
	
io.on('connection',function(socket){
	
	socket.on('chatMessage',function(from,msg){
		io.emit('chatMessage',from,msg);		
	});
	socket.on('notifyUser',function(user){
		io.emit('notifyUser',user);
	});	
});

http.listen(port,function(){
	console.log('listening on ' + port);	
});