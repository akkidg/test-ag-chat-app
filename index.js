
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var port = process.env.PORT || 5000

var numUsers = 0;

app.get('/',function(req,res){
	var express = require('express');
	app.use(express.static(path.join(__dirname)));	
	res.sendFile(path.join(__dirname,'index.html'));
});
	
io.on('connection',function(socket){

	var addedUser = false;	
	
	socket.on('addUser',function(userName,id){
		if(addedUser) return;

		socket.username = userName;
		++numUsers;		
		addedUser = true;
		socket.emit('login',{
			numUsers:numUsers
		});
		socket.broadcast.emit('addUser',{username:socket.username,numUsers:numUsers});	
	});
	
	socket.on('chatMessage',function(msg){		
		socket.broadcast.emit('chatMessage',{userName: socket.username,messge: msg});			
	});
	
	socket.on('typing',function(){			
		socket.broadcast.emit('typing',{userName:socket.username});
	});	

	socket.on('stopTyping',function(){			
		socket.broadcast.emit('stopTyping',{userName:socket.username});
	});	
	
	socket.on('directMessage'function(from,to,msg){
		
	});
	
	socket.on('disconnect',function(){
		if(addedUser)
			--numUsers;	
		socket.broadcast.emit('userLeft',{username:socket.username,numUsers: numUsers});
	});
	
});

server.listen(port,function(){
	console.log('listening on ' + port);	
});