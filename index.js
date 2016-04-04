var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.get('/',function(req,res){
	var express = require('express');
	app.use(express.static(path.join(__dirname)));
	res.sendFile(path.join(__dirname,'../chatapp','index.html'));
});

io.on('connection',function(socket){
	
	socket.on('chatMessage',function(from,msg){
		io.emit('chatMessage',from,msg);		
	});
	socket.on('notifyUser',function(user){
		io.emit('notifyUser',user);
	});	
});

http.listen(1223,function(){
	console.log('listening on ' + 1223);	
});