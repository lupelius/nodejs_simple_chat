/*
** Author: Serdar Senay
** Project: Real time chat system for William Hill interview
** File: index.js file - handling server side requests
*/

//Port to be used, listening to requests
var port = 3131;
//Our variable that holds the expressjs framework scope reference
var express = require("express");
//This is the variable we use as our expressjs application reference
var app = express();

//Set the folder which contains jade template files
app.set('views', __dirname + '/tpl');

//Set the template engine of expressjs to jade
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

//Handle get requests on app's server side
app.get("/", function(req, res){
    res.render("chat-page");
});

//Here we tell our express.js application to use public folder as frontend files location
app.use(express.static(__dirname + '/public'));

//Pass expressjs application server to socket.io to handle
var socketio = require('socket.io').listen(app.listen(port));

//Here we declare the callback to each connection to socketio handler, and broadcast welcome message to all users upon new connection, and broadcast sent message each time a user types one. Broadcast happens with socketio's "emit" function
socketio.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'Welcome to the chat' });
    socket.on('send', function (data) {
        socketio.sockets.emit('message', data);
    });
});
//Log the fact that the application is running on cmd line
console.log("Running the application, listening to requests on port " + port);


