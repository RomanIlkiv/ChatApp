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

socket.on('newLocationMessage', function(message) {
	var li = $('<li></li>');
	var a = $('<a target="_blank">My current location</a>');
	li.text(`${message.from}: `);
	a.attr('href', message.url);

	li.append(a);
	$('#messages').append(li);
});

$('#message-form').on('submit', function(event) {
	event.preventDefault();

	socket.emit('createMessage', {
		from: 'User',
		text: $('[name=message]').val()
	}, function() {
		$('[name=message]').val('');
	});
});

var locationButton = $('#send-location');
locationButton.on('click', function() {
	if (!navigator.geolocation) {
		return alert('geolocation not supported by your browser');
	}

	locationButton.attr('disabled', 'disabled');

	navigator.geolocation.getCurrentPosition(function(position) {
		console.log(position);
		locationButton.removeAttr('disabled');
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function() {
		locationButton.removeAttr('disabled');
		alert('Unable to fetch location.');
	});
});






