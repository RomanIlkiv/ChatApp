var socket = io();

socket.on('connect', function() {
	console.log('Connected to server');

	/*socket.emit('createMessage', {
		from: 'Roman',
		text: 'Yup, It is me'
	});*/
});

socket.on('disconnect', function() {
	console.log('Disconnected to server');
});

socket.on('newMessage', function(message) {
	console.log('newMessage', message);
	var li = $('<li></li>');
	li.text(message.from + ": " + message.text);

	$('#messages').append(li);
});

/*socket.emit('createMessage', {
	from: 'Roman',
	text: 'Yup, It is me'
}, function(data) {
	console.log('Got it!', data);
});*/

$('#message-form').on('submit', function(event) {
	event.preventDefault();

	socket.emit('createMessage', {
		from: 'User',
		text: $('[name=message]').val()
	}, function() {

	});
});