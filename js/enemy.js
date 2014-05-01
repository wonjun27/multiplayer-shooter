(function() {
	function Enemy(x, y) {
		this.id = null;
		this.x = x;
		this.y = y;
		this.speed = 30;
		this.hits = 25;
		this.boundary_x = [18, canvas.width - 42];
		this.boundary_y = [100, canvas.height - 50];
		this.sprite = new Sprite('images/game/characters.png', [360, 290], [40, 35], [0,1,0,1,2]);
		this.timeElapsed = 0;
	};

	Enemy.prototype = {
		update: function(delta) {
			this.timeElapsed += delta;
			this.x = 140 + (Math.sin(this.timeElapsed) * 110);
			this.y += delta * this.speed;
			this.sprite.update(delta);
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
		},
		takeHit: function(value) {
			this.hits -= value;
			return this.hits;
		}
	};

   window.Enemy = Enemy; 
})();
