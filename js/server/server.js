var util = require("util"), 
	io = require("socket.io"),
	Player = require("./Player").Player;

var socket, 
 	players;

function init() {
	players = [];
	socket = io.listen(8000);

	socket.configure(function(){
		socket.set("transports", ["websocket"]);
		socket.set("log level", 2);
	});

	setEventHandlers();
}

var setEventHandlers = function() {
	socket.sockets.on("connection", onSocketConnection);
}

function onSocketConnection(client) {
	util.log("New player has connected: " +  client.id);
	client.on("disconnect", onClientDisconnect);
	client.on("new player", onNewPlayer);
	client.on("move player", onMovePlayer);
}

function onClientDisconnect() {
	util.log("Player has disconnected: " + this.id);

	var playerToRemove = getPlayer(this.id);

	if(!playerToRemove) {
		console.log("Player not found: " + this.id);
		return;
	}

	players.splice(players.indexOf(playerToRemove), 1);

	this.broadcast.emit("remove player", {id: this.id});
}

function onNewPlayer(data) {
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = this.id;

	this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

	var existingPlayer;
	for(var i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
	}

	players.push(newPlayer);
};

function onMovePlayer(data) {
	var playerToMove = getPlayer(this.id);

	// Player not found
	if (!playerToMove) {
		util.log("Player not found: " + this.id);
		return;
	};

	// Update player position
	playerToMove.setX(data.x);
	playerToMove.setY(data.y);

	this.broadcast.emit("move player", {id: playerToMove.getID(), x: playerToMove.getX(), y: playerToMove.getY()});	
}

function getPlayer(id) {
	for(var int = 0; i < players.length; i++) {
		if(players[i].id == id) {
			return players[i];
		}
	}

	return false;
}


init();