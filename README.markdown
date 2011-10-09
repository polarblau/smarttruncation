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

Get more info and try a demo [here](http://polarblau.github.com/smarttruncation).

The plugin currently doesn't work too well with tables (and I realize that that's a big usecase). It's all about the CSS. If you can provide a properly scaling block-level container around the element you want to truncate, then you should be good to go. *CSS is your friend.*