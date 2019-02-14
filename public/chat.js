$(function () {
	//make connection
	var socket = io.connect('http://localhost:3000')

	//buttons and inputs
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")
	var usernameSelected = $("#username-selected")
	usernameSelected.hide();
	send_message.attr('disabled','disabled');	
	message.attr('disabled','disabled');

	//Emit message
	send_message.click(function () {
		socket.emit('new_message', {
			message: message.val()
		})
	})

	message.bind("enterKey", function (e) {
		socket.emit('new_message', {
			message: message.val()
		})
	});
	message.keyup(function (e) {
		if (e.keyCode == 13) {
			$(this).trigger("enterKey");
		}
	});

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');

		if (username.val() === data.username) {
			chatroom.append("<p class='message-white'>" + data.username + ": " + data.message + "</p>")
		} else {
			chatroom.append("<p class='message-color'>" + data.username + ": " + data.message + "</p>")
		}


	})

	//Emit a username
	send_username.click(function () {
		send_message.removeAttr('disabled');
		message.removeAttr('disabled');
		message.attr('placeholder', 'Type your message....');

		socket.emit('change_username', {
			username: username.val()
		})
		username.hide()
		usernameSelected.html(username.val())
		usernameSelected.show();
	})

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
});