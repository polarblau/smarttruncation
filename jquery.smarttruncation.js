/*!
 * Smart truncation jQueryplugin
 *
 * Copyright (c) 2010 Florian Plank (http://www.polarblau.com/)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * USAGE:
 * 
 * 
 * $('ul.text li').smartTruncation();
 * $('ul.files li').smartTruncation(true);
 */

(function($){
  $.fn.smartTruncation = function(isFileName){
		return $(this).each(function(i, e){
			var $e = $(e);
			
			// let's get the width of the most common characters
			// in the current font-size 
			var letters = "a b c d e f g h i j k l m n o p q r s t u v w x y z".split(" ");
			var numbers = "1 2 3 4 5 6 7 8 9 0".split(" ");
			var other = "! § $ % & / ( ) = ? @ * ' + # - ; , : . < >".split(" ");
			var all = letters
		            .concat([" ", '"', "'"])
			          .concat(numbers)
			          .concat(other)
			          .concat($.map(letters, function(letter){ return letter.toUpperCase(); }));
			var sizes = {};
			var $testWrapper = $('<span/>').css({
				'visibility' : 'hidden', 
				'fontSize'   : $e.css('fontSize'),
				'fontFamily' : $e.css('fontFamily'),
				'fontWeight' : $e.css('fontWeight'),
				'fontStyle'  : $e.css('fontStyle')
			}).appendTo('body');
			$.each(all, function(i, e){ sizes[e] = $testWrapper.text(e).width(); });
			$testWrapper.remove();
			
			// wrap content in a inline element to get exact width
			var $wrapper = $e.wrapInner('<span/>').find('span').css({
				'whiteSpace' : 'nowrap'
			});
			var origText = $wrapper.text();
			var outerWidth = $wrapper.width();
			var tracking = parseInt($e.css('letterSpacing'), 10) || -1;
			
			// keep extension visibile if file name
			var extension = isFileName ? origText.split('.').pop() : "";
			var fileName = isFileName ? (function(t){t=t.split('.');t.pop();return t.join('.');})(origText) : origText;

			// truncate if necessary and append ellipse
			var update = function(){
				var chunks = fileName.split("");
				var diff = $e.width() - outerWidth - 3 * sizes['.'];
				if (diff <= 0) {
					while (diff <= 0) diff = diff + (sizes[chunks.pop()] || sizes['h']) + tracking/2;
					$wrapper.text($.trim(chunks.join(""))+"..."+extension);
				} else $wrapper.text(origText);
			};
			
			// call if window resized
			$(window).bind('resize', function(){ update(); });
			
			// initialize
			update();
		});
	};
})(jQuery);