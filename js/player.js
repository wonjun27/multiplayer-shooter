(function() {
	function Player(x, y, isLocal) {
		this.id = null;
		this.x = x;
		this.y = y;
		this.isLocal = isLocal;		
		this.speed = 100;
		this.boundary_x = [18, canvas.width - 42];
		this.boundary_y = [100, canvas.height - 50];
		this.sprite = new Sprite('images/game/characters.png', [121, 185], [27, 30], [0,1,2]);
	};

	Player.prototype = {
		update: function(delta) {
			this.sprite.update(delta);

			if(!this.isLocal) {
				//no need to hanlde input for remote players
				return false;
			}

			var prevX = this.x,
			 	prevY = this.y;

			var touchDown = false,
				touchUp = false,
				touchLeft = false,
				touchRight = false,
				touchCharacter = false,
				TOUCH_MARGIN = 10;

			if(input.isTouch()) {
		    	var touchX = input.getTouchPosX();
		    	var touchY = input.getTouchPosY();

		    	if(touchX > this.x - TOUCH_MARGIN && touchX < this.x + this.sprite.getSizeX() + TOUCH_MARGIN
		    	&& touchY > this.y - TOUCH_MARGIN && touchY < this.y + this.sprite.getSizeY() + TOUCH_MARGIN) {
		    		touchCharacter = true
		    	}
		    	else {
		    		
		    		if(touchX < this.x - TOUCH_MARGIN) {
		    			touchLeft = true;
		    		}

		    		if(touchX > this.x + this.sprite.getSizeX() + TOUCH_MARGIN) {
		    			touchRight = true;
		    		}

					if(touchY < this.y - TOUCH_MARGIN) {
		    			touchUp = true;
		    		}

					if(touchY > this.y + this.sprite.getSizeY() + TOUCH_MARGIN) {
		    			touchDown = true;
		    		}	    				    		
		    	}
		    }

			if(input.isDown('DOWN') || input.isDown('s') || touchDown) {
				this.y += this.speed * delta;
				if(this.y > this.boundary_y[1]) {
					this.y = this.boundary_y[1];
				}
			}

			if(input.isDown('UP') || input.isDown('w') || touchUp) {
				this.y -= this.speed * delta;
				if(this.y < this.boundary_y[0]) {
					this.y = this.boundary_y[0];
				}		
			}

		    if(input.isDown('LEFT') || input.isDown('a') || touchLeft) {
		        this.x -= this.speed * delta;
				if(this.x < this.boundary_x[0]) {
					this.x = this.boundary_x[0];
				}	 
		    }

		    if(input.isDown('RIGHT') || input.isDown('d') || touchRight) {
		        this.x += this.speed * delta;
		     	if(this.x > this.boundary_x[1]) {	
					this.x = this.boundary_x[1];
				}	   
		    }

		   	if(socket) {
		   		if(prevX != this.x || prevY != this.y) {
					socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
		   		}
	    	}

	    	if(input.isDown('SPACE') || touchCharacter) {
		    	var x = this.x + 7;
		    	var y = this.y - 15;

		    	bulletManager.addBullet(x, y, true);

		    	if(socket) {
		    		socket.emit("new bullet", {x: x, y: y});
		    	}
		    }
		},
		render: function(context) {
			context.save();
		    context.translate(this.x, this.y);	
			this.sprite.render(context);
			context.restore();
		},
		getID: function() {
			return this.id;
		},
		setID: function(value) {
			this.id = value;
		},
		getX: function() {
			return this.x;
		},
		getY: function() {
			return this.y;
		},
		setX: function(posX) {
			this.x = posX;
		},
		setY: function(posY) {
			this.y = posY;
		},
		getSize: function() {
			return this.sprite.size;
		}
	};

   window.Player = Player; 
})();
