# Usage

Basic options
	$('ul.list li').smartTruncate();
	$('ul.files li').smartTruncate(true);

Check out the [demo here](http://www.polarblau.com/code/jquery/smarttruncation).
	
Method takes one optional parameter 'isFileName' (BOOLEAN) which determines if the file extension should remain untouched.

The plugin currently doesn't work well with tables. It's all about the CSS. If you can provide a properly scaling block-level container (= "not a table"), then you should be good to go. *CSS is your friend.*
