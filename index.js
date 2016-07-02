var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var port = process.env.PORT || 5000	

var numUsers = 0;
var userSocketIds = {};

var dataKey = 'com.chatapp.data';

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
		userSocketIds[id] = socket.id;

		++numUsers;		
		addedUser = true;
		socket.emit('login',{
			numUsers:numUsers
		});
		socket.broadcast.emit('addUser',{username:socket.username,numUsers:numUsers});
		//io.emit('systemMessage',"akash");	
	});

	// Events For Direct Messaging
		
	socket.on('directMessage',function(msg,userId){		
		io.to(userSocketIds[userId]).emit('directMessage',{'com.chatapp.data': msg});			
	});
	
	socket.on('typing',function(userId){			
		io.to(userSocketIds[userId]).emit('typing',{username:socket.username});
	});	

	socket.on('stopTyping',function(userId){			
		io.to(userSocketIds[userId]).('stopTyping',{username:socket.username});
	});		

	// Events For Group Messaging

	socket.on('groupJoin',function(groupName){
		socket.join(groupName);
	});

	socket.on('groupMessage',function(groupName,message){
		io.to(groupName).emit('groupMessage',{'com.chatapp.data':message});
	});

	socket.on('groupLeave',function(groupName){
		socket.leave(groupName);
	});
	
	socket.on('disconnect',function(){
		if(addedUser){
			--numUsers;	
			//delete userSocketIds[socket.id];
			socket.broadcast.emit('userLeft',{username:socket.username,numUsers: numUsers});
		}
	});
	
});

http.listen(port,function(){
	console.log('listening on ' + port);	
});