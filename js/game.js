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
    pos: [145, 440],
    sprite: new Sprite('images/game/characters.png', [121, 185], [27, 30], [0,1,2])
};

function update(delta) {
	updateEntities(delta)
}

function updateEntities(delta) {
	player.sprite.update(delta);
}

function render() {
	if (isBackgroundReady) {
		context.drawImage(imageBackground, 0, 0, canvas.width, canvas.height);

		// Score
		context.fillStyle = "rgb(250, 250, 250)";
		context.font = "32px unicorn bold";
		context.textAlign = "left";
		context.textBaseline = "top";
		context.fillText(score, 155, 65);
	}

	render_entity(player);
}

function render_entity(entity) {
	context.save();
    context.translate(entity.pos[0], entity.pos[1]);	
	entity.sprite.render(context);
	context.restore();
}

function init() {
	time_last = Date.now();
	main();
}

resources.load([
    'images/game/characters.png'
]);
resources.onReady(init);