var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var port = process.env.PORT || 5000

var Users = [];

app.get('/',function(req,res){
	var express = require('express');
	app.use(express.static(path.join(__dirname)));	
	res.sendFile(path.join(__dirname,'index.html'));
});
	
io.on('connection',function(socket){
	
	socket.on('addUser',function(id,userName){
	var user = {
		"id":id,
		"name":userName
	};	
	Users.push(user);
	socket.username = userName;		
	io.emit('systemMessage','<b>' + userName + '</b>',' has joined discussion.');	
	});
	
	socket.on('chatMessage',function(from,msg){
		var name;
		for(var i=0;i<Users.length;i++){
			var user = Users[i];
			if(user['id']==from){
				name = user['name'];
			}else{
				name = from;
			}
		}
		io.emit('chatMessage',name,msg);		
	});
	
	socket.on('notifyUser',function(user){	
		var name;
		for(var i=0;i<Users.length;i++){
			var user = Users[i];
			if(user['id']==user){
				name = user['name'];
			}else{
				name = user;
			}
		}	
		io.emit('notifyUser',name);
	});	
	
});

http.listen(port,function(){
	console.log('listening on ' + port);	
});