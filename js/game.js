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
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.width = 320;
canvas.height = 480;
document.body.appendChild(canvas);

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
var player = {
    pos: [145, 430],
    speed: 100,
    boundary_x: [18, canvas.width - 42],
    boundary_y: [100, canvas.height - 50],
    sprite: new Sprite('images/game/characters.png', [121, 185], [27, 30], [0,1,2])
};

var bullets = [];
var bulletSpeed = 500;

function update(delta) {
    handleInput(delta);	
	updateEntities(delta);
}

function handleInput(delta) {
	
	if(input.isDown('DOWN') || input.isDown('s')) {
		player.pos[1] += player.speed * delta;
		if(player.pos[1] > player.boundary_y[1]) {
			player.pos[1] = player.boundary_y[1];
		}
	}

	if(input.isDown('UP') || input.isDown('w')) {
		player.pos[1] -= player.speed * delta;
		if(player.pos[1] < player.boundary_y[0]) {
			player.pos[1] = player.boundary_y[0];
		}		
	}

    if(input.isDown('LEFT') || input.isDown('a')) {
        player.pos[0] -= player.speed * delta;
		if(player.pos[0] < player.boundary_x[0]) {
			player.pos[0] = player.boundary_x[0];
		}	 
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += player.speed * delta;
     	if(player.pos[0] > player.boundary_x[1]) {
			player.pos[0] = player.boundary_x[1];
		}	   
    }

    if(input.isDown('SPACE')) {
    	var x = player.pos[0] + 7;
    	var y = player.pos[1] - 15;

    	bullets.push({
    		pos: [x, y],
    		sprite: new Sprite('images/game/characters.png', [107,145], [7, 25], [0])
    	});
    }
}

function updateEntities(delta) {
	player.sprite.update(delta);

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
	}

	renderEntity(player);
	renderEntities(bullets);
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
	time_last = Date.now();
	main();
}

resources.load([
    'images/game/characters.png'
]);
resources.onReady(init);