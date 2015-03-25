/*
** Author: Serdar Senay
** Project: Real time chat system for William Hill interview
** File: chat.js file - handling front end of the application
*/

//When the page loads, execute the inline callback function
window.onload = function() {
	//Our array to store all messages
    var messages = [];
	//Socket obj that has a reference to socketio connection to our back end
    var socket = io.connect('http://mt4dc-win7lt-08:3131');
	
	//Variables present in our frontend jade template, text box field, send button and content
    var messageField = document.getElementById("message-field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
	
	//When an event named "message" happens, callback and handle data
    socket.on('message', function (data) {
		//If data has a valid message property
        if(data.message) {
			//add the message sent by a client to our array
            messages.push(data);
			//variable to be used to hold all previous messages, including latest one
            var html = '';
			//Add all messages to html variable to make up and display in the html dump inside content div element
            for(var i=0; i < messages.length; i++) {
				var client_name = (messages[i].username ? messages[i].username : 'Server');
				//Add username prior to message
                html += '<b>' + client_name + ': </b>';
				//Add the message client has typed
				html += messages[i].message + '<br />';
            }
			//Get all the generated html above into the content div tag
            content.innerHTML = html;
        } else {
			//Log the problem on the console
            console.log("There is a problem:", data);
        }
    });
 
    sendButton.onclick = function() {
		var text = messageField.value;
		var uname = name.value;
		//Pop up a simple jscript alertbox if either username or chat msg is missing
		if (uname == '' || text == '') {
			alert('Type your name and a valid chat message, please!');
		} else {
			socket.emit('send', { message: text, username: uname });
			//Clear message field, but keep username
			messageField.value = '';
		}
    };
 
}