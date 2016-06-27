var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
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
	
	socket.on('addUser',function(username,id){
		if(addedUser) return;

		socket.username = username;
		socket.id = id;
		++numUsers;		
		addedUser = true;
		socket.emit('login',{
			numUsers:numUsers
		});
		socket.broadcast.emit('addUser',{username:socket.username,numUsers:numUsers});
		//io.emit('systemMessage',"akash");	
	});
		
	socket.on('chatMessage',function(msg,id){		
		socket.broadcast.to(id).emit('chatMessage',{username: socket.username,message: msg});			
	});
	
	socket.on('typing',function(){			
		socket.broadcast.emit('typing',{username:socket.username});
	});	

	socket.on('stopTyping',function(){			
		socket.broadcast.emit('stopTyping',{username:socket.username});
	});	
	
	socket.on('directMessage',function(){
		
	});
	
	socket.on('disconnect',function(){
		if(addedUser){
			--numUsers;	
			socket.broadcast.emit('userLeft',{username:socket.username,numUsers: numUsers});
		}
	});
	
});

http.listen(port,function(){
	console.log('listening on ' + port);	
});