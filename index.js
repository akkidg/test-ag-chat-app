var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var port = process.env.PORT || 5000	
	
var numUsers = 0;
var dataJson, title, alert;

// storing UserSocket Id's globally
var userSocketIds = {};

// Storing Rooms in Global Array
var rooms = {};

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

		if(userSocketIds[id] == null){
			userSocketIds[id] = socket.id;			
			++numUsers;				
			addedUser = true;			
			socket.broadcast.emit('addUser',{username:socket.username,numUsers:numUsers});
		}else{
			userSocketIds[id] = socket.id;	
		}
			
		socket.emit('login',{
			numUsers:numUsers
		});
		//io.emit('systemMessage',"akash");	
	});

	// Event For User status updating (online,typing)

	socket.on('userStatus',function(sender,receiver){
		//var socketId = ;
		//var index = userSocketIds.indexOf(.toString());

		if(userSocketIds[receiver] != null){
			title = 'status online';
			alert = {'status':9,'userStatus':1,'sender':sender};
			dataJson = {'title':title,'alert':alert};
			io.to(userSocketIds[receiver]).emit('userStatus',dataJson);
		}			
	});

	socket.on('typing',function(sender,receiver){
		//var index = userSocketIds.indexOf(userSocketIds[receiver]);

		if(userSocketIds[receiver] != null){
		title = 'user typing';
		alert = {'status':10,'sender':sender};
		dataJson = {'title':title,'alert':alert};			
		io.to(userSocketIds[receiver]).emit('typing',dataJson);
		}
	});	

	socket.on('stopTyping',function(sender,receiver){			
		//var index = userSocketIds.indexOf(userSocketIds[receiver]);

		if(userSocketIds[receiver] != null){	
		title = 'user stop typing';
		alert = {'status':11,'sender':sender};
		dataJson = {'title':title,'alert':alert};			
		io.to(userSocketIds[receiver]).emit('typing',dataJson);
		}
	}); 

	// Event For Direct Messaging
		
	socket.on('directMessage',function(msg,userId){
		var msgObj = JSON.parse(msg);		
		io.to(userSocketIds[userId]).emit('directMessage',msgObj);			
	});
				
	// Events For Group Subscription

	socket.on('subscribe',function(groupName,totParticipant){
		if(rooms[groupName] == null){
			var room = new Room(groupName,totParticipant);
			Player player = new Player(socket.id,socket.username,false);
			room.addPlayer(player);
		}else{
			Room room = rooms[groupName];
			var isPlayerPresent = false;
			for(Player player in room.players){
				if(player.id == socket.id){
					isPlayerPresent = true;
				}
			}
			if(!isPlayerPresent){
				Player player = new Player(socket.id,socket.username,true);
				room.addPlayer(player);			
			}

			if(room.players.length == room.maxPlayer){
				room.startGame();		
			}		
		}
	});

	socket.on('turnComplete',function(groupName){
		Player player;
		if(rooms[groupName] != null){
			var room = rooms[groupName];
			for(var i=0;i<room.players.length;i++){
				player = room.players[i];
				if(player.isTurn){
					player.isTurn = false;
				} 

				if(i == room.players.length - 1){
					player = room.players[0];	
					player.isTurn = true;
				}else{
					player = room.players[i++];	
					player.isTurn = true;
				}
			}
			room.progressRound(player);	
		}
	});

	/*// Event For Start Conversation 
	socket.on('startGame',function(groupName){
		Room room = rooms[groupName];
		if(room != null){
			room.playStart = true;
			room.progressRound();			
		}			
	});*/
	
	// Event on Socket Disonnection
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

// Javascript Prototyping Objects For Room, Players

function Room(room_name,maxPlayer){
	this.players = [];
	this.room_name = room_name;
	this.maxPlayer = maxPlayer;
	this.playStart = false;
};

function Player(player_id,name,isTurn){
	this.id = player_id;
	this.name = name;
	this.isTurn = isTurn;
};

Room.prototype.addPlayer = function(player){
	this.players.push(player);
};

Room.prototype.startGame = function(){
	title = 'Turn System';
	alert = {'status':13,'myTurn':true};
	dataJson = {'title':title,'alert':alert};

	for(var i=0;i<this.players.length;i++){
		if(this.players[i].isTurn){
			io.to(this.players[i].id).emit('turn',dataJson);	
		}		
	}
};

Room.prototype.progressRound = function(player){
	title = 'Turn System';
	alert = {'status':13,'myTurn':true};
	dataJson = {'title':title,'alert':alert};

	for(var i=0;i<this.players.length;i++){
		if(this.players[i].isTurn){
			io.to(this.players[i].id).emit('turn',dataJson);		
		}else{			
			this.players[i].isTurn = false;
		}		
	}
};













