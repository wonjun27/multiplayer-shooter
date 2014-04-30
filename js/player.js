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

			if(input.isDown('DOWN') || input.isDown('s')) {
				this.y += this.speed * delta;
				if(this.y > this.boundary_y[1]) {
					this.y = this.boundary_y[1];
				}
			}

			if(input.isDown('UP') || input.isDown('w')) {
				this.y -= this.speed * delta;
				if(this.y < this.boundary_y[0]) {
					this.y = this.boundary_y[0];
				}		
			}

		    if(input.isDown('LEFT') || input.isDown('a')) {
		        this.x -= this.speed * delta;
				if(this.x < this.boundary_x[0]) {
					this.x = this.boundary_x[0];
				}	 
		    }

		    if(input.isDown('RIGHT') || input.isDown('d')) {
		        this.x += this.speed * delta;
		     	if(this.x > this.boundary_x[1]) {	
					this.x = this.boundary_x[1];
				}	   
		    }

		    return (prevX != this.x || prevY != this.y) ? true : false;	
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
