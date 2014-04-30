(function() {
	function EnemyManager() {
		this.enemies = [];
		this.totalDeltas = 0;
		this.kills = 0;
	};

	EnemyManager.prototype = {
		update: function(delta) {
		    if(this.totalDeltas > 2) {
		    	var enemy = new Enemy(145, 20);
		        this.enemies.push(enemy);
		        this.totalDeltas = 0;
		    }

			for(var i = 0; i < this.enemies.length; i++) {
		    	this.enemies[i].update(delta);

		    	if(this.enemies[i].getY() > canvas.height) {
		    		this.enemies.splice(this.enemies[i], 1);
		    	}
		    }

		    this.totalDeltas += delta;
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
		},
		checkBulletHits: function(pos, size) {
			for(var i = 0; i < this.enemies.length; i++) {
    			var x = this.enemies[i].getX();
    	    	var y = this.enemies[i].getY();		
    			var enemy_size = this.enemies[i].getSize();

    			if(boxCollides([x,y], enemy_size, pos, size))
    			{
    				if(this.enemies[i].takeHit(1) <= 0) {
    					this.kills++;
    					this.enemies.splice(i, 1);	
    					return true;
    				}

    				return true;
    			}
    		}		
		},
		getKills: function() {
			return this.kills;
		},
	};

   window.EnemyManager = EnemyManager; 
})();
