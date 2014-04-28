(function() {
	function Player(position) {
		this.pos = position;
		this.speed = 100;
		this.boundary_x = [18, canvas.width - 42];
		this.boundary_y = [100, canvas.height - 50];
		this.sprite = new Sprite('images/game/characters.png', [121, 185], [27, 30], [0,1,2]);
	};

	Player.prototype = {
		update: function(delta) {
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
		},
		render: function(context) {
			context.save();
		    context.translate(this.pos[0], this.pos[1]);	
			this.sprite.render(context);
			context.restore();
		}
	};

   window.Player = Player; 
})();
