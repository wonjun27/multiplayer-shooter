var Player = function(posX, posY) {
	var x = posX,
		y = posY,
		isSpawningEnemies = false,
		id;

	var setID = function(value) {
		id = value;
	}

	var getID = function() {
		return id;
	}

	var getX = function() {
		return x;
	}

	var getY = function() {
		return y;
	}

	var setX = function(posX) {
		x = posX;
	}

	var setY = function(posY) {
		y = posY;
	}	
	
	var setSpawningEnemies = function(value) {
		isSpawningEnemies = value;
	}

	var isSpawningEnemies = function() {
		return isSpawningEnemies;
	}

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		getID: getID,
		setID: setID,
		setSpawningEnemies: setSpawningEnemies,
		isSpawningEnemies: isSpawningEnemies
	}
};

exports.Player = Player;