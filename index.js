var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var port = process.env.PORT || 5000

var numUsers = 0;
var userUniqueIds = {};

app.get('/',function(req,res){
	var express = require('express');
	app.use(express.static(path.join(__dirname)));	
	res.sendFile(path.join(__dirname,'index.html'));
});
	
io.on('connection',function(socket){

	var addedUser = false;	
	
	socket.on('addUser',function(username,userId){
		if(addedUser) return;

		socket.username = username;
		socket.userId = userId;
		++numUsers;		
		addedUser = true;

		// Add userId into globl user array
		userUniqueIds[socket.userId] = socket; 

		socket.emit('login',{
			numUsers:numUsers
		});
		socket.broadcast.emit('addUser',{username:socket.username,numUsers:numUsers});
		//io.emit('systemMessage',"akash");	
	});
		
	// One to One Messaging		

	socket.on('chatMessage',function(msg,userId){		
		userUniqueIds[userId].emit('chatMessage',{username: socket.username,message: msg});			
	});
	
	socket.on('typing',function(userId){			
		userUniqueIds[userId].emit('typing',{username:socket.username});
	});	

	socket.on('stopTyping',function(userId){			
		userUniqueIds[userId].emit('stopTyping',{username:socket.username});
	});	

	// Group Messaging
	
	socket.on('chatGroupMessage',function(msg,userId){		
		userUniqueIds[userId].emit('chatMessage',{username: socket.username,message: msg});			
	});

	socket.on('groupTyping',function(){			
		socket.broadcast.emit('typing',{username:socket.username});
	});	

	socket.on('groupStopTyping',function(){			
		socket.broadcast.emit('stopTyping',{username:socket.username});
	});
	
	socket.on('disconnect',function(){
		if(addedUser){
			--numUsers;	
			delete userUniqueIds[socket.userId];
			socket.broadcast.emit('userLeft',{username:socket.username,numUsers: numUsers});
		}
	});
	
});

http.listen(port,function(){
	console.log('listening on ' + port);	
});