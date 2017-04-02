var socket = io();

function scrollToBottom() {
	var messages = $('#messages');
	var newMessage = messages.children('li:last-child');

	//Heights
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	console.log(clientHeight, scrollTop, newMessageHeight, lastMessageHeight, scrollHeight);
	console.log(messages);
	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		console.log('Should scroll');
		messages.scrollTop(scrollHeight);
	}
}

socket.on('connect', function() {
	console.log('Connected to server');
});

socket.on('disconnect', function() {
	console.log('Disconnected to server');
});

socket.on('newMessage', function(message) {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = $('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});

	$('#messages').append(html);
	scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = $('#location-message-template').html();
	var html = Mustache.render(template, {
		url: message.url,
		from: message.from,
		createdAt: formattedTime
	});

	$('#messages').append(html);
	scrollToBottom();
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






