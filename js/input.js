(function() {
	var pressedKeys = {},
    	x = 0,
    	y = 0,
    	is_tabbed = false;

	function setKey(event, status) {
		var code = event.keyCode;
		var key;

		switch(code) {
			case 32:
				key = 'SPACE'; break;
			case 37:
				key = 'LEFT'; break;
			case 38:
				key = 'UP'; break;
			case 39:
				key = 'RIGHT'; break;
			case 40:
				key = 'DOWN'; break;
			default:
				//Convert ASCII codes to letters
				key = String.fromCharCode(code);
		}

		pressedKeys[key] = status;
	}

	document.addEventListener('keydown', function(e) {
		setKey(e, true);
	});

	document.addEventListener('keyup', function(e) {
		setKey(e, false);
	});

	window.addEventListener('blur', function() {
		pressedKeys = {};
	});

	// listen for clicks
    window.addEventListener('click', function(e) {
        e.preventDefault();
    }, false);

    // listen for touches
    window.addEventListener('touchstart', function(e) {
        e.preventDefault();
        // the event object has an array
        // called touches, we just want
        // the first touch
        //POP.Input.set(e.touches[0]);
        x = e.touches[0].pageX; 
        y = e.touches[0].pageY; 
        is_tabbed = true;

    }, false);
    window.addEventListener('touchmove', function(e) {
        // we're not interested in this
        // but prevent default behaviour
        // so the screen doesn't scroll
        // or zoom
        e.preventDefault();
    }, false);
    window.addEventListener('touchend', function(e) {
        // as above
        e.preventDefault();
        is_tabbed = false;
    }, false);

	window.input = {
		isDown: function(key) {
			return pressedKeys[key.toUpperCase()];
		},
		isTouch: function() {
			return is_tabbed;
		},
		getTouchPosX: function() {
			return x;
		},
		getTouchPosY: function() {
			return y;
		}
	};
})();