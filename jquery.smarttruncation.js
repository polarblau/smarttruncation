/*!
 * Smart truncation jQuery plugin
 *
 * Copyright (c) 2010 Florian Plank (http://www.polarblau.com/)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * USAGE:
 * 
 * $('.text li').smartTruncation();
 * $('.text-2 li').smartTruncation({
 *   "truncateCenter" : true
 * });
 * $('.files li').smartTruncation({
 *   protectExtensions" : true
 * });
 * 
 */

(function($) {
	$.fn.smartTruncation = function(options) {
		var settings = $.merge(options || {}, {
		  "protectExtensions" : false,
		  "truncateCenter" : false
		});
		return $(this).each(function(i, e) {
			var $e = $(e);

			// cache 
			if (!$(window).data('smarttruncation.sizecache')) $(window).data('smarttruncation.sizecache', {});

			var fontAttributes = {
				'fontSize': $e.css('fontSize'),
				'fontFamily': $e.css('fontFamily'),
				'fontWeight': $e.css('fontWeight'),
				'fontStyle': $e.css('fontStyle')
			};

			// use font properties for cachekey
			var cacheKey = (function(attributes) {
				var key = "";
				for (key in attributes) key += attributes[key];
				return key;
			})(fontAttributes);

			// used cached sizes if available
			var sizes = {};
			if ($(window).data('smarttruncation.sizecache')[cacheKey]) {
				sizes = $(window).data('smarttruncation.sizecache')[cacheKey];
			} else {
				// let's get the width of the most common characters
				// in the current font-size
				var letters = "a b c d e f g h i j k l m n o p q r s t u v w x y z".split(" ");
				var numbers = "1 2 3 4 5 6 7 8 9 0".split(" ");
				var other = "! § $ % & / ( ) = ? @ * ' + # - ; , : . < >".split(" ");
				var all = letters.concat([" ", '"', "'"]).concat(numbers).concat(other).concat($.map(letters, function(letter) {
					return letter.toUpperCase();
				}));

				var $testWrapper = $('<span/>').css($.merge(fontAttributes, {
					'visibility': 'hidden'
				})).appendTo('body');
				$.each(all, function(i, e) {
					sizes[e] = $testWrapper.text(e).width();
				});
				$testWrapper.remove();
				$(window).data('smarttruncation.sizecache')[cacheKey] = sizes;
			}

			// wrap content in a inline element to get exact width
			$e.data('wrapper', $e.wrapInner('<span/>').find('span').css({
				'whiteSpace': 'nowrap'
			}));
			var $wrapper = $e.data('wrapper');
			var origText = $.trim($wrapper.text());
			var outerWidth = $wrapper.width();
			var tracking = parseInt($e.css('letterSpacing'), 10) || -1;

			// keep extension visibile if file name
			var extension = settings.protectExtensions ? origText.split('.').pop() : "";
			var fileName = settings.protectExtensions ? (function(string) {
				string = string.split('.');
				string.pop();
				return string.join('.');
			})(origText) : origText;

			// truncate if necessary and append ellipse
			var update = function() {
				var diff = $e.width() - outerWidth - 3 * sizes['.'];
				if (diff <= 0) {
					var chunks = fileName.split("");
					if (settings.truncateCenter) {
					  var left = chunks.splice(0, Math.floor(chunks.length/2));
					  while (diff <= 0) {
					    var next = left.length > chunks.length ? left.pop() : chunks.shift();
					    diff = diff + (sizes[next] || sizes['h']) + tracking;
					  }
					  $wrapper.text($.trim(left.join("")) + "..." + $.trim(chunks.join("")) + extension);
					} else {
  					while (diff <= 0) diff = diff + (sizes[chunks.pop()] || sizes['h']) + tracking / 2;
  					$wrapper.text($.trim(chunks.join("")) + "..." + extension);
  				}
				} else $wrapper.text(origText);
			};

			// call if window resized
			$(window).bind('resize.smarttruncation', function() {
				update();
			});

			// initialize
			update();
		});
	};
})(jQuery);
