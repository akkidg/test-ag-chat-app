var socket = io();

function submitfunction(){
	var user = $('#user').val();
	var msg = $('#m').val();
	
	if(msg != ''){
		socket.emit('chatMessage',user,msg);
	}
	$('#m').val('').focus();
	return false;
}

function notifyTyping(){
	var user = $('#user').val();
	//alert('typing user'+user);
	socket.emit('notifyUser',user);
}

socket.on('notifyUser',function(user){
	var me = $('#user').val();
	if(user != me){
		$('#notifyUser').text(user + ' is typing...');
	}
	setTimeout(function(){$('#notifyUser').text('');},10000);
});

socket.on('chatMessage',function(from,msg){
	var me = $('#user').val();
	var color = (from == me) ? 'green' : '#009afd';
	var from = (from == me)	? 'Me' : from;
	$('#messages').append('<li><b style="color:' + color + '">' + from + '</b>:' + msg + '</li>');	
});

$(document).ready(function(){
	var name = makeid();		
	alert(name);	
	$('#user').val(name);
	socket.emit('chatMessage','System','<b>' + name + '</b> has joined discussion.');
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
