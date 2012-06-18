/*!
 * Smart truncation jQuery plugin
 *
 * Copyright (c) 2012 Florian Plank (http://www.polarblau.com/)
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
      "truncateCenter"    : false
    });

    return $(this).each(function() {
      var $this = $(this);

      // cache
      if (!$(window).data('smarttruncation.sizecache')) $(window).data('smarttruncation.sizecache', {});

      var fontAttributes = {
        'fontSize'  : $this.css('fontSize'),
        'fontFamily': $this.css('fontFamily'),
        'fontWeight': $this.css('fontWeight'),
        'fontStyle' : $this.css('fontStyle')
      };

      // use font properties for cachekey
      var cacheKey = (function(attributes) {
        var key = "";
        for (key in attributes) key += attributes[key];
        return key;
      })(fontAttributes);


      var sizes = {};

      // has text with identical font properties been measure before?
      if ($(window).data('smarttruncation.sizecache')[cacheKey]) {
        sizes = $(window).data('smarttruncation.sizecache')[cacheKey];

      } else {

        // let's get the width of the most common characters
        // in the current font-size
        var letters = "a b c d e f g h i j k l m n o p q r s t u v w x y z".split(" ");
        var numbers = "1 2 3 4 5 6 7 8 9 0".split(" ");
        var other   = "! § $ % & / ( ) = ? @ * ' + # - ; , : . < >".split(" ");
        var all     = letters.concat([" ", '"', "'"]).concat(numbers).concat(other).concat($.map(letters, function(letter) {
          return letter.toUpperCase();
        }));

        // build a test container
        var $testWrapper = $('<span/>').css($.extend({
          'visibility': 'hidden'
        }, fontAttributes)).appendTo('body');

        // place each character into the container and take it's width
        $.each(all, function(i, e) {
          sizes[e] = $testWrapper.text(e).width();
        });
        $testWrapper.remove();
        // cache the result for re-use
        $(window).data('smarttruncation.sizecache')[cacheKey] = sizes;
      }

      // wrap content in a inline element to get exact width
      var $wrapper   = $this
        .wrapInner('<span/>', {
          'class' : 'smarttruncation-wrapper'
        })
        .find('span').css({
          'whiteSpace': 'nowrap'
        });

      var origText   = $.trim($wrapper.text());
      var outerWidth = $wrapper.width();
      var tracking   = parseInt($this.css('letterSpacing'), 10) || -1;

      // keep extension visibile if file name
      var extension  = "";
      var fileName   = origText;

      if (settings.protectExtensions) {
        var str      = origText.split('.');
        extension    = str.pop();
        fileName     = str.join('.');
      }

      // truncate if necessary and append ellipsis
      var update = function() {
        // how much do we need to shave off including the ellipsis we want to append?
        var diff = $this.width() - outerWidth - 3 * sizes['.'];
        var safety;

        // do we need to truncate
        if (diff <= 0) {

          // split the string into separate characters
          var chunks  = fileName.split("");


          // do we truncate from the inside out?
          if (settings.truncateCenter) {

            // cut the string in two, left holds one half, chunks the other
            var left        = chunks.slice(0, Math.floor(chunks.length/2));
            var right       = chunks;
            var lengthLeft  = left.length;
            var lengthRight = right.length;

            // take one character at time from which ever side is bigger off
            while (diff <= 0) {
              var next = lengthLeft > lengthRight? left[--lengthLeft] : left[--lengthRight];
              // update the difference between wanted and actual size by checking the size
              // of the character from the sizes dictionary and add tracking
              // use the letter "h" in case the current character does not exist in the
              // sizes dictionary
              diff = diff + (sizes[next] || sizes['h']) + tracking;
            }

            // put the truncated text back plus ellipsis and file extension
            $wrapper.text(
              $.trim(left.slice(0, lengthLeft).join(""))
                + "..."
                + $.trim(right.slice(right.length - lengthRight).join(""))
                + extension
            );

            // fallback: sometimes (3-5%) the string still doesn't fit:
            // insure that text stays within bounds under all circumstances by popping
            // one letter at time, while switching sides, trying to fit every time
            if ($wrapper.width() > $this.width()) {
              while ($wrapper.width() > $this.width()) {
                lengthLeft > lengthRight? lengthLeft-- : lengthRight--;
                $wrapper.text(
                  $.trim(left.slice(0, lengthLeft).join(""))
                    + "..."
                    + $.trim(right.slice(right.length - lengthRight).join(""))
                    + extension
                );
              }
            } else {

              // allow for a little bit room, if we check for absolutes,
              // the browser will get caught in a loop and the sky will come down
              // let's use 40% of the fontsize
              safety = parseInt(fontAttributes.fontSize, 10) * 0.4;
              if ($wrapper.width() + safety < $this.width()) {
                while ($wrapper.width() + safety < $this.width()) {
                  lengthLeft < lengthRight? lengthLeft++ : lengthRight++;
                  $wrapper.text(
                    $.trim(left.slice(0, lengthLeft).join(""))
                      + "..."
                      + $.trim(right.slice(right.length - lengthRight).join(""))
                      + extension
                  );
                }
              }
            }

          // we only truncate the end, possibly keeping the file extension
          } else {

            var length = chunks.length;

            while (diff <= 0) {

              // update the difference between wanted and actual size by checking the size
              // of the character from the sizes dictionary and add tracking
              // use the letter "h" in case the current character does not exist in the
              // sizes dictionary
              diff = diff + (sizes[--length] || sizes['h']) + tracking / 2;
            }
            $wrapper.text($.trim(chunks.slice(0, length).join("")) + "..." + extension);

            // fallback: sometimes (3-5%) the string still doesn't fit:
            // insure that text stays within bounds under all circumstances by popping
            // one letter at time, trying to fit every time
            if ($wrapper.width() > $this.width()) {
              while ($wrapper.width() > $this.width()) {
                $wrapper.text($.trim(chunks.slice(0, --length).join("")) + "..." + extension);
              }
            } else {

              // allow for a little bit room, if we check for absolutes,
              // the browser will get caught in a loop and the sky will come down
              // let's use 40% of the fontsize
              safety = parseInt(fontAttributes.fontSize, 10) * 0.4;
              if ($wrapper.width() + safety < $this.width()) {
                while ($wrapper.width() + safety < $this.width()) {
                  $wrapper.text($.trim(chunks.slice(0, ++length).join("")) + "..." + extension);
                }
              }
            }
          }
        } else {
         $wrapper.text(origText);
        }
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
