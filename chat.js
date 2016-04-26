var socket = io('http://test-ag-chat-app.herokuapp.com/');

function submitfunction(){
	var user = $('#userId').val();
	var msg = $('#m').val();
	//alert("I am an alert box!");
	if(msg != ''){
		socket.emit('chatMessage',user,msg);
	}
	$('#m').val('').focus();
	return false;
}

function notifyTyping(){
	var user = $('#userId').val();
	//alert('typing user'+user);
	socket.emit('notifyUser',user);
}

socket.on('notifyUser',function(user){
	var me = $('#userName').val();
	if(user != me){
		$('#notifyUser').text(user + ' is typing...');
	}
	setTimeout(function(){$('#notifyUser').text('');},10000);
});

socket.on('chatMessage',function(from,msg){
	var me = $('#userName').val();
	var color = (from == me) ? 'green' : '#009afd';
	var from = (from == me)	? 'Me' : from;
	$('#messages').append('<li><b style="color:' + color + '">' + from + '</b>:' + msg + '</li>');	
});

socket.on('systemMessage',function(from,msg){
	$('#messages').append('<li><b style="color:#009afd">' + from + '</b>' + msg + '</li>');	
});

$(document).ready(function(){
	var id = makeid();		
	//alert(name);
	var name = prompt("What's Your Name?");
	$('#userId').val(id);
	$('#userName').val(name);	
	socket.emit('addUser',id,name);	
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
