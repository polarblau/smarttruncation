describe('smarttruncation', function () {
  
  // Helpers
  
  function hasNamesSpacedEvent(el, event, namespace) {
    var events = $(el).data("events");
    return events[event] !== undefined && events[event][0].namespace === namespace; 
  };
  
  
  // Custom matchers
  
  var isElementTruncated = function(input) {
    var isTruncated = true; // how do we test for this?
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
  
  // Build and remove fixtures in setup and teardown
  
  beforeEach(function () {
    
  });

  afterEach(function () {
    $(window).data('smarttruncation.sizecache', null);
  });

  //
  
  // TEST: Settings
  
  
  // TEST: CSS & Attrbutes 
  
  
  // TEST: General jQuery plugin functionality 

  it('should be applicable to multiple elements', function() {

  });
  
  it('should be chainable', function() {
  
  });
  
});