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

//Create a canvas
var canvas, 
	context,
	localPlayer,
	remotePlayers,
	socket,
	enemyManager,
	bulletManager,
	score,
	isGameOver;

// Background image
var isBackgroundReady = false;
var imageBackground = new Image();
imageBackground.onload = function () {
	isBackgroundReady = true;
};
imageBackground.src = "images/interface/background.jpg";

// Game state
var time_game = 0;
var explosions = [];

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

	updateEntities(delta);
	checkCollisions();
	
	score = enemyManager.getKills();
}

function updateEntities(delta) {
	if(!isGameOver) {
	    localPlayer.update(delta);
	}
    
	for(var i = 0; i < remotePlayers.length; i++) {
    	remotePlayers[i].update(delta);
    }

	enemyManager.update(delta);
	bulletManager.update(delta);

    for(var i = 0; i < explosions.length; i++) {
        explosions[i].sprite.update(delta);

        // Remove if animation is done
        if(explosions[i].sprite.done) {
            explosions.splice(i, 1);
            i--;
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
		bulletManager.render(context);

		renderEntities(explosions);

		// Score
		context.fillStyle = "rgb(250, 250, 250)";
		context.font = "32px unicorn bold";
		context.textAlign = "left";
		context.textBaseline = "top";
		context.fillText(score, 155, 50);
		
		if(remotePlayers.length == 0) {
			context.fillStyle = "rgb(0, 250, 0)";
			context.font = "18px unicorn bold";
			context.fillText("Single Player Mode: Try Multiplayer!", 25, 10);
		}
		else {
			context.fillStyle = "rgb(0, 250, 0)";
			context.font = "18px unicorn bold";
			context.fillText("Multiplayer Mode!", 25, 10);
		}
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

	var bullets = bulletManager.getBullets();
	for(var i = 0; i < bullets.length; i++) {
		var bullet = bullets[i];
		if(enemyManager.checkBulletHits([bullet.x,bullet.y], [7,25], bullet.isLocal)) {
			bulletManager.removeBullet(i); 
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
	bulletManager = new BulletManager();

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
    enemyManager.resetKills();

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
	socket.on("new bullet", onNewBullet);
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

function onNewBullet(data) {
	bulletManager.addBullet(data.x, data.y, false);
}

function getPlayer(id) {
	for(var i = 0; i < remotePlayers.length; i++) {
		if(remotePlayers[i].getID() == id) {
			return remotePlayers[i];
		}
	}

	return false;
}