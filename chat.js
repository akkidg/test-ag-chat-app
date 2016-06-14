var socket = io('http://test-ag-chat-app.herokuapp.com/');

function submitfunction(){
	var user = $('#userName').val();
	var msg = $('#m').val();
	//alert("I am an alert box!");
	if(msg != ''){
		socket.emit('chatMessage',user,msg);
	}
	$('#m').val('').focus();
	return false;
}

function notifyTyping(){
	var user = $('#userName').val();
	//alert('typing user'+user);
	socket.emit('typing',userName);
}

socket.on('systemMessage',function(jsonText){	
	var obj = JSON.parse(jsonText);	
	$('#messages').append('<li>' + obj.message + ' </li>');
});

socket.on('login',function(numUsers){
	var obj = JSON.parse(numUsers);
	$('#messages').append('<li>' + obj.numUsers + ' participants.</li>');
});

socket.on('addUser',function(jsonText){
	var obj = JSON.parse(JSON.stringify(jsonText));
	var user = obj.username;
	var numUsers  = obj.numUsers;
	$('#messages').append('<li><b style="color:#009afd">' + user + '</b> joined room.</li>');	
	$('#messages').append('<li>' + numUsers + '</b> participants.</li>');
});

socket.on('typing',function(jsonText){
	var me = $('#userName').val();
	var obj = JSON.parse(jsonText);
	var user = obj.userName
	//alert('me'+ me);
	if(user != me){
		$('#notifyUser').text(user + ' is typing...');
	}
	setTimeout(function(){$('#notifyUser').text('');},10000);
});

socket.on('chatMessage',function(jsonText){
	var me = $('#userName').val();
	var obj = JSON.parse(jsonText);
	var from = obj.userName;
	var msg = obj.message;

	//alert('me'+me);
	var color = (from == me) ? 'green' : '#009afd';
	var from = (from == me)	? 'Me' : from;
	$('#messages').append('<li><b style="color:' + color + '">' + from + '</b>:' + msg + '</li>');	
});

socket.on('userLeft',function(jsonText){
	var obj = JSON.parse(jsonText);
	var user = obj.userName;
	var numUsers  = obj.numUsers;
	$('#messages').append('<li><b style="color:#009afd">' + user + '</b> left room.</li>');	
	$('#messages').append('<li>' + numUsers + '</b> participants.</li>');	
});

$(document).ready(function(){
	var id = makeid();		
	//alert(name);
	var name = prompt("What's Your Name?");
	$('#userId').val(id);
	$('#userName').val(name);	
	socket.emit('addUser',name,id);	
	$('#messages').append('<li> Welcome ' + name + ' </li>');
	//socket.emit('chatMessage','System','<b>' + name + '</b> has joined discussion.');
});

// create new User Id
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
  for( var i=0; i < 5; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
