describe('smarttruncation', function () {
  
  // Helpers
  
  function makeFixture() {
    var list = [];
    var text = "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum";
    var words = text.split(" ");
    var length = Math.floor(Math.random() * (words.length - 10)) + 10;
    list.push('<ul class="list" id="list" style="width:100px">');
    list.push('<li>');
    list.push(words.slice(0, length).join(' '));
    list.push('</li>');
    list.push('</ul>');
    return $(list.join(''));
  };
  
  function hasNamesSpacedEvent(el, event, namespace) {
    var events = $(el).data("events");
    return events[event] !== undefined && events[event][0].namespace === namespace; 
  };
  
  
  // Custom matchers
  
  var isElementTruncated = function(listItem) {
    var isTruncated = $.contains(listItem, $('span.smarttruncation-wrapper'));
    return isTruncated ? isTruncated : null;
  };

  beforeEach(function () {
    this.addMatchers({
      toBeTruncated: function() {
        return isElementTruncated(this.actual);
      },
      toBeNotTruncated: function() {
        return !isElementTruncated(this.actual);
      }
    });
  });
  

  // Test main features for different font sizes
  
  var testFontSizes = [8, 10, 12, 24, 32];
  var fontFamilies  = ['serif', 'sans-serif'];
  
  $.each(fontFamilies, function(i, family){
    describe('for family ' + family, function(){
      
      $.each(testFontSizes, function(i, size){
        describe('for size ' + size, function(){
          
          beforeEach(function () {
            makeFixture().appendTo('body');
            $('#list li').css({
              'fontSize'  : size + 'px',
              'fontFamily': family
            });
          });

          afterEach(function () {
            $('#list').remove();
            $(window).data('smarttruncation.sizecache', null);
          });
          
          // TEST: Truncation

          it('should trucate the text', function() {
            var $listItem = $('#list li');
            var textBefore = $listItem.text();
            $listItem.smartTruncation();
            var textAfter = $listItem.text();
            expect(textBefore.length > textAfter.length).toBeTruthy();
          });

          it('should append an ellipsis to the text', function() {
            var $listItem = $('#list li');
            var text = $listItem.smartTruncation().text();
            expect(text.slice(-3)).toEqual("...");
          });

          it('should ensure that the text is shorter than the container', function() {
            var $listItem = $('#list li');
            var wrapper = $listItem.smartTruncation().find('span');
            expect($listItem.width() >= wrapper.width()).toBeTruthy();
          });

          // TEST: Settings

          it('should keep an file extension if "protectExtensions" is set to "true"', function() {
            var $listItem = $('#list li');
            $listItem.text("this_is_a_very_very_very_very_very_very_very_very_long_file_name.png")
            var text = $listItem.smartTruncation({ protectExtensions: true }).text();
            expect(text.slice(-3)).toEqual("png");
            expect(text.slice(-6)).toEqual("...png");
          });

          it('should shorten the text still if "truncateCenter" is set to "true"', function() {
            var $listItem = $('#list li');
            var textBefore = $listItem.text();
            $listItem.smartTruncation({ truncateCenter: true });
            var textAfter = $listItem.text();
            expect(textBefore.length > textAfter.length).toBeTruthy();
          });

          it('should not append an ellipsis to the text if "truncateCenter" is set to "true"', function() {
            var $listItem = $('#list li');
            var text = $listItem.smartTruncation({ truncateCenter: true });
            expect(text.slice(-3)).toNotEqual("...");
          });

          it('should insert the ellipsis within the text if "truncateCenter" is set to "true"', function() {
            var $listItem = $('#list li');
            $listItem.smartTruncation({ truncateCenter: true });
            expect($listItem.text().split("...").length).toEqual(2);
          });

          it('should ensure that the text is shorter than the container still if "truncateCenter" is set to "true"', function() {
            var $listItem = $('#list li');
            var wrapper = $listItem.smartTruncation({ truncateCenter: true }).find('span');
            expect($listItem.width() >= wrapper.width()).toBeTruthy();
          });
      
        });
      });
    });
  });
  
  
  // TEST: General jQuery plugin functionality 

  it('should be applicable to multiple elements', function() {
    var $list_1 = makeFixture().appendTo('body');
    var $list_2 = makeFixture().appendTo('body');
    $('.list li').smartTruncation();
    expect($list_1).toBeTruncated();
    expect($list_1.find('li')).toBeTruncated();
    $list_1.remove();
    $list_2.remove();
  });
  
  it('should be chainable', function() {
    var $list = makeFixture().appendTo('body');
    var $listItem = $list.find('li');
    $listItem.smartTruncation().addClass('foo');
    expect($listItem.hasClass('foo')).toBeTruthy();
    $list.remove();
  });
  
});