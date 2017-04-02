const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var { generateMessage, generateLocationMessage } = require('./utils/message');

const publicPath = path.join('__dirname', '../public');
const port = process.env.PORT || 3007;
const app = express();
var server = http.createServer(app);

var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

	socket.on('createMessage', (message, callback) => {
		//console.log('createMessage', message);
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback();
		/*socket.broadcast.emit('newMessage', generateMessage(message.from, message.text));*/
	});

	socket.on('createLocationMessage', (coords) => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});

	socket.on('disconnect', () => {
		console.log('User disconnected');
	});
});

server.listen(port, () => {
	console.log('Server up');
	// console.log(server);
});