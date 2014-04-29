var Player = function(posX, posY) {
	var x = posX,
		y = posY,
		id;

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

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		getID: getID
	}
};

exports.Player = Player;