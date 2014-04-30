(function() {
	function EnemyManager() {
		this.enemies = [];
		this.timeLastSpawned = 0;
	};

	EnemyManager.prototype = {
		update: function(delta) {
		    if(Date.now() - this.timeLastSpawned > 5000 && this.enemies.length < 1) {
		    	var enemy = new Enemy(145, 20);
		        this.enemies.push(enemy);
		        this.timeLastSpawned = Date.now();
		    }

			for(var i = 0; i < this.enemies.length; i++) {
		    	this.enemies[i].update(delta);

		    	if(this.enemies[i].getY() > canvas.height) {
		    		this.enemies.splice(this.enemies[i], 1);
		    	}
		    }
		},
		render: function(context) {
			for(var i = 0; i < this.enemies.length; i++) {
    			this.enemies[i].render(context);
    		}
		},
		reset: function() {
			this.enemies = [];
		},
		checkCollisions: function(pos, size) {
			for(var i = 0; i < this.enemies.length; i++) {
    			var x = this.enemies[i].getX();
    	    	var y = this.enemies[i].getY();		
    			var enemy_size = this.enemies[i].getSize();

    			if(boxCollides([x,y], enemy_size, pos, size))
    			{
    				return true;
    			}
    		}		
		}
	};

   window.EnemyManager = EnemyManager; 
})();
