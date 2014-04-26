
(function() {
	var cache = {};
	var readyCallbacks = [];

	function load(sourceOrArray) {
		if(sourceOrArray instanceof Array) {
			sourceOrArray.forEach(function(source) {
				_load(source);
			});
		}
		else {
			_load(sourceOrArray);
		}
	}

	function _load(source) {
		if(cache[source]) {
			return cache[source];
		}
		else {
			var image = new Image();
			image.onload = function() {
				cache[source] = image;

				if(isReady) {
					readyCallbacks.forEach(function(func) { func(); });
				}
			}
			cache[source] = false;
			image.src = source;
		}
	}
			
	function get(source) {
		return cache[source];
	}

	function isReady() {
		for(var i in cache) {
			if(!cache.hasOwnProperty(i) || !cache[i]) {
				return false;
			}
		}

		return true;
	}

	function onReady(func) {
		readyCallbacks.push(func);
	}

	window.resources = {
		load: load,
		get: get,
		onReady: onReady,
		isReady: isReady
	};
})();

