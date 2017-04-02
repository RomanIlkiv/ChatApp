const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join('__dirname', '../public');
const port = process.env.PORT || 3007;
const app = express();
var server = http.createServer(app);

var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	socket.emit('newMessage', {
		from: "Jone",
		text: "Hey. What is going on.",
		createdAt: 123123
	});

	socket.on('createMessage', (message) => {
		console.log('createMessage', message);
	});

	socket.on('disconnect', () => {
		console.log('User disconnected');
	});
});

server.listen(port, () => {
	console.log('Server up');
	// console.log(server);
});