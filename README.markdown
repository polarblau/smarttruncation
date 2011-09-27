# Usage

Basic options

```javascript
$('.text li').smartTruncation();
```
  
Settings and defaults

```javascript
$('.text-2 li').smartTruncation({
  "truncateCenter" : true // "Hello World" -> "hel..rld"
});
$('.files li').smartTruncation({
  "protectExtensions" : true // "myimagefile.jpg" -> "myimagef...jpg"
});
```

Check out the [demo here](http://www.polarblau.com/code/jquery/smarttruncation).

The plugin currently doesn't work too well with tables (and I realize that that's a big usecase). It's all about the CSS. If you can provide a properly scaling block-level container (= "not a table"), then you should be good to go. *CSS is your friend.*

## Warning!

The plugin is currently merely an experiment on how to provide fast and responsive truncation. When using it e.g. with bigger font sizes you will most likely encounter issues.
I can't promise that these issues will be covercome. Too many variables: browsers, fonts, sizes, kerning, spacing, … 