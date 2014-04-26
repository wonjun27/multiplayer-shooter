
(function() {
	function Sprite(source, position, size, frames) {
		this.source = source;
		this.position = position;
		this.size = size;
		this.frames = frames;

		this._index = 0;
	};

	Sprite.prototype = {
		update: function(delta) {
			this._index += delta * 5;
		},
		render: function(context) {
			var frame = 0;

			var max = this.frames.length;
			var index_floor = Math.floor(this._index);
			frame = this.frames[index_floor % max];

			var x = this.position[0];
			var y = this.position[1];

			x += frame * this.size[0];

			context.drawImage(resources.get(this.source), x, y, this.size[0], this.size[1], 0, 0, this.size[0], this.size[1]);
		}
	};

   window.Sprite = Sprite; 
})();

