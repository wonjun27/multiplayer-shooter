(function() {
	function Player(x, y) {
		this.x = x;
		this.y = y;		
		this.speed = 100;
		this.boundary_x = [18, canvas.width - 42];
		this.boundary_y = [100, canvas.height - 50];
		this.sprite = new Sprite('images/game/characters.png', [121, 185], [27, 30], [0,1,2]);
	};

	Player.prototype = {
		update: function(delta) {
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
		},
		render: function(context) {
			context.save();
		    context.translate(this.x, this.y);	
			this.sprite.render(context);
			context.restore();
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
			this.x = posY;
		},		
	};

   window.Player = Player; 
})();
