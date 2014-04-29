// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function() {
    return window.requestAnimationFrame       
    	|| window.webkitRequestAnimationFrame 
        || window.mozRequestAnimationFrame    
        || window.oRequestAnimationFrame      
        || window.msRequestAnimationFrame
        || function(callback) {
            	window.setTimeout(callback, 1000 / 60);
        	};
})();

var time_game = 0;

//Create a canvas
var canvas, 
	context,
	localPlayer,
	remotePlayers,
	socket;

// Background image
var isBackgroundReady = false;
var imageBackground = new Image();
imageBackground.onload = function () {
	isBackgroundReady = true;
};

imageBackground.src = "images/interface/background.jpg";


var score = 0;

// Main Loop
var time_last;	
function main() {
    var now = Date.now();
    var delta = (now - time_last) / 1000.0;

    update(delta);
    render();

    time_last = now;
    requestAnimFrame(main);
};

// Game state
var bullets = [];
var bulletSpeed = 500;

function update(delta) {
    localPlayer.update(delta);
    handleInput(delta);
	updateEntities(delta);
}

function handleInput(delta) {
    if(input.isDown('SPACE')) {
    	var x = localPlayer.getX() + 7;
    	var y = localPlayer.getY() - 15;

    	bullets.push({
    		pos: [x, y],
    		sprite: new Sprite('images/game/characters.png', [107,145], [7, 25], [0])
    	});
    }
}

function updateEntities(delta) {
	localPlayer.sprite.update(delta);

	for(var i = 0; i < bullets.length; i++) {
		var bullet = bullets[i];
		bullet.pos[1] -= bulletSpeed * delta;

		if(bullet.pos[1] < -bullet.sprite.size[1]) {
			bullets.splice(i, 1);
		}
	}
}

function render() {
	if (isBackgroundReady) {
		context.drawImage(imageBackground, 0, 0, canvas.width, canvas.height);

		// Score
		context.fillStyle = "rgb(250, 250, 250)";
		context.font = "32px unicorn bold";
		context.textAlign = "left";
		context.textBaseline = "top";
		context.fillText(score, 155, 50);

		localPlayer.render(context);
		renderEntities(bullets);
	}
}

function renderEntity(entity) {
	context.save();
    context.translate(entity.pos[0], entity.pos[1]);	
	entity.sprite.render(context);
	context.restore();
}

function renderEntities(list) {
	for(var i = 0; i < list.length; i++) {
		renderEntity(list[i]);
	}
}

function init() {
	canvas = document.createElement("canvas");
	context = canvas.getContext("2d");
	canvas.width = 320;
	canvas.height = 480;
	document.body.appendChild(canvas);

	localPlayer = new Player(145, 430	);
	remotePlayers = [];

	if(typeof io !== 'undefined') {
		socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
		setEventHandlers();	
	}
	
	
	time_last = Date.now();
	main();	
}

resources.load([
    'images/game/characters.png'
]);
resources.onReady(init);


var setEventHandlers = function() {
	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on("new player", onNewPlayer);
	socket.on("move player", onMovePlayer);
	socket.on("remove player", onRemovePlayer);
};

function onSocketConnected() {
	console.log("Connected to socket server");
	socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY()});
}

function onSocketDisconnect() {
	console.log("Disconntected from socket server");
}

function onNewPlayer(data) {
	console.log("New Player connected: " + data.id);

	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = data.id;

	remotePlayers.push(newPlayer);	
}

function onMovePlayer(data) {
	var playerToMove = getPlayer(data.id);

	if(!playerToMove) {
		console.log("Player not found: " + data.id);
		return;
	}

	playerToMove.setX(data.x);
	playerToMove.setY(data.y);
}

function onRemovePlayer(data) {
	var playerToRemove = getPlayer(data.id);

	if(!playerToRemove) {
		console.log("Player not found: " + data.id);
		return;
	}

	remotePlayers.splice(remotePlayers.indexOf(playerToRemove), 1);
}

function getPlayer(id) {
	for(var int = 0; i < remotePlayers.length; i++) {
		if(remotePlayers[i].id == id) {
			return remotePlayers[i];
		}
	}

	return false;
}

