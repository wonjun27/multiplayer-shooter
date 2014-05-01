(function() {
	function BulletManager() {
		this.bullets = [];
		this.bulletSpeed = 500;
	};

	BulletManager.prototype = {
		update: function(delta) {
			for(var i = 0; i < this.bullets.length; i++) {
				var bullet = this.bullets[i];
				bullet.y -= this.bulletSpeed * delta;

				if(bullet.y < -bullet.sprite.size[1]) {
					this.bullets.splice(i, 1);
				}
			}
		},
		render: function(context) {
			for(var i = 0; i < this.bullets.length; i++) {
				context.save();
    			context.translate(this.bullets[i].x, this.bullets[i].y);	
				this.bullets[i].sprite.render(context);
				context.restore();
			}	
		},
		addBullet: function(posX, posY, isLocal) {
		    this.bullets.push({
		    	x: posX,
		    	y: posY,
		    	isLocal: isLocal,
		    	sprite: new Sprite('images/game/characters.png', [107,145], [7, 25], [0])
		    });
		},
		getBullets: function() {
			return this.bullets; 
		},
		removeBullet: function(index) {
			this.bullets.splice(index, 1);
		}
	};

   window.BulletManager = BulletManager; 
})();
