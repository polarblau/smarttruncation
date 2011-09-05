# Usage

Basic options

	$('.text li').smartTruncation();
	
Settings and defaults

	$('.text-2 li').smartTruncation({
		"truncateCenter" : true // "Hello World" -> "hel..rld"
	});
	$('.files li').smartTruncation({
		"protectExtensions" : true // "myimagefile.jpg" -> "myimagef...jpg"
	});

Check out the [demo here](http://www.polarblau.com/code/jquery/smarttruncation).

The plugin currently doesn't work too well with tables. It's all about the CSS. If you can provide a properly scaling block-level container (= "not a table"), then you should be good to go. *CSS is your friend.*
