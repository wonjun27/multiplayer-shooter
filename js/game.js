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
	enemyManager,
	socket,
	isGameOver;

// Background image
var isBackgroundReady = false;
var imageBackground = new Image();
imageBackground.onload = function () {
	isBackgroundReady = true;
};
imageBackground.src = "images/interface/background.jpg";

// Game state
var bullets = [];
var explosions = [];
var bulletSpeed = 500;
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



function update(delta) {
    handleInput(delta);
	updateEntities(delta);
	checkCollisions();
	
	score = enemyManager.getKills();
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
	if(!isGameOver) {
	    if(localPlayer.update(delta)) {
	    	if(socket) {
				socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
	    	}
	    }
	}
    
	for(var i = 0; i < remotePlayers.length; i++) {
    	remotePlayers[i].update(delta);
    }

	enemyManager.update(delta);

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

		localPlayer.render(context);

		for(var i = 0; i < remotePlayers.length; i++) {
    		remotePlayers[i].render(context);
    	}

		enemyManager.render(context);
		renderEntities(bullets);

		// Score
		context.fillStyle = "rgb(250, 250, 250)";
		context.font = "32px unicorn bold";
		context.textAlign = "left";
		context.textBaseline = "top";
		context.fillText(score, 155, 50);
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

function checkCollisions() {
	//check collision with the local player
	if(enemyManager.checkCollisions([localPlayer.getX(),localPlayer.getY()], localPlayer.getSize())) {
		gameOver();
	}

	for(var i = 0; i < bullets.length; i++) {
		var bullet = bullets[i];
		if(enemyManager.checkBulletHits([bullet.pos[0],bullet.pos[1]], [7,25])) {
			bullets.splice(i, 1);
		}
	}
}

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !( r <= x2 
    	   	|| x > r2
    	   	|| b <= y2 
    	   	|| y > b2);
}

function boxCollides(pos, size, pos2, size2) {
	//console.log(pos[0] + " " + pos[1] + " " + size + " " +pos2[0] + " " +pos2[1] + " "+ size2)
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}


function init() {
	canvas = document.createElement("canvas");
	context = canvas.getContext("2d");
	canvas.width = 320;
	canvas.height = 480;
	document.body.appendChild(canvas);

	document.getElementById('play-again').addEventListener('click', function() {
        reset();
    });

	localPlayer = new Player(145, 430, true);
	remotePlayers = [];
	enemyManager = new EnemyManager();

	if(typeof io !== 'undefined') {
		socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
		setEventHandlers();	
	}
	
	reset();
	time_last = Date.now();
	main();	
}


function reset() {
	document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    
    isGameOver = false;
    score = 0;

    localPlayer = new Player(145, 430, true); 
}

resources.load([
    'images/game/characters.png'
]);
resources.onReady(init);


function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
}

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

	var newPlayer = new Player(data.x, data.y, false);
	newPlayer.setID(data.id);

	remotePlayers.push(newPlayer);	
}

function onMovePlayer(data) {
	console.log("other player moved" + " " + data.x + " " +data.y);
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
	for(var i = 0; i < remotePlayers.length; i++) {
		if(remotePlayers[i].getID() == id) {
			return remotePlayers[i];
		}
	}

	return false;
}