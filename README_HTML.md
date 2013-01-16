# ZeParser, v2, html tag support

For more information about ZeParser v2, see README.md :)

This branch has support for an elaborate html literal support. HTML is treated as if it were a literal, like strings or regular expressions. Their parsing results in a small parse tree, through which they can be revived (or in my use case; transformed).

The following syntax is supported:

## HTML tags as literals

Anything you open, must be closed. Come on... The parser is not relaxed on this one. If you would want support for half-assed html, good luck figuring out when to stop parsing to continue with regular JS.

```js
var div = <div></div>;
```

## Unary tags must be closed too

The parser is agnostic about tags, it doesn't know an `img` from a `span`. If you have a unary tag, close it. On the upshot, _any_ binary tag can be used in this unary sense, if you don't want it to have a body. Browsers tend to frown uppon this, but this parser is not a browser.

```js
var div = <div/>
```

## Assign tag to variable

This syntax is meant to prevent ugly assignments breaking the flow of the code. The name should be any valid JS identifier.

```js
el.appendChild(<div @foo/>);
foo.style.backgroundColor = 'red';
```
Would translate to...
```js
var foo = document.createElement('div');
el.appendChild(div);
foo.style.backgroundColor = 'red';
```
or maybe...
```js
var foo;
el.appendChild(foo = document.createElement('div'));
foo.style.backgroundColor = 'red';
```
Either way; it breaks the pretty flow.

Note that the parser saves this in a `varName` property of the tag, if such a name is supplied anyways.

## Attributes are supported, of course

You can use just the attribute name without a value (for `checked`, `selected`, etc.), or single quoted, double quoted, or unquoted values.

```js
var div = <div foo/>;
var div = <div foo=bar/>;
var div = <div foo="bar"/>;
var div = <div foo=\'bar\'/>;
```

Note that for the unquoted the whitespace, forward slash, or closing angle bracket delimit the value. For quoted values, unescaped quote obviously delimits it.

## Dynamic property value

In this case, the value becomes whatever is returned by the (JS!) expression between the curly braces, converted to a string.

```js
var div = <div foo={5+5}/>;
```

## Dynamic property name

There's special support for dynamic property names. In this syntax, the property name basically becomes the (JS!) expression between the curly braces. The result is converted to a string. If it is the empty string, no attribute is generated.

```js
var div = <div {foo}/>;
```

In this syntax, a value is not supported. It is meant for dynamic value-less attributes, for whom merely setting them counts as "enabled". For instance, you could say `checked=false` but it would still be checked. But using this, you could do:

```js
var option = <option {i===5?'selected':''}/>;
```
And the new tag would only get the selected attribute if `i` were `5`, none otherwise.

## Content

Of course tags can have content.

```js
var div = <div>foo</div>;
```

## Content

Of course there are some special rules concerning this. Namely: dynamic content.

```js
var div = <div>foo{bar}baz</div>;
```

Unlike with the attributes, the result of dynamic content is handled slightly different.

* if the result is of a primitive type, convert it to a string and add it as a text node
* if the result is of an object, add it as a child of the wrapping node
* if the result is the empty string, do nothing (so no extra child on the wrapping node)
* the backslash always escapes exactly one character (no unicode/hex/other escapes are supported)

```js
var name = 'Jack';
document.body.appendChild(<div>Hello {name}!</div>);
// a div with the textnodes "Hello ", "Jack", and "!"

document.body.appendChild(<div>Hello \{world\}!</div>);
// a div with the textnode "Hello {world}!"
```

The dynamic content can occur anywhere, and any amount of times.

```js
var div = <div>{bar}baz</div>;
var div = <div>{bar}baz</div>;
var div = <div>Coord: {x}x{y}</div>;
```

## Multi level tags

Of course there's support for more complex structures. Parsing is recursive, so same rules apply. Most importantly, close what you open.

Unlike browsers, this parser doesn't support unbalanced tags. That means that this crap `<b>x<i>y</b>z</i>` will not work. If you really want to do this you can go die in a fire.

```js
var div = <div><hello/></div>;
var div = <div><bar></bar></div>;
var div = <div><div></div></div>;
var div = <div>foo<div></div></div>;
var div = <div>foo<div>{woot}</div></div>;
```

## Whitespace things

The parser is pretty lenient with whitespace. There are two restrictions for whitespace inside an opening or closing tag: No space between `/>` or `</`. Consider it an operator or something. It makes parsing so much easier, and really, why would you put spaces there anyways :)

Besides that restriction, any whitespace or newline can occur anywhere inside the tag head or tail. This whitespace is not preserved in the parse tree. Any whitespace that's the body of some tag is preserved, however, and not collapsed in the parse tree.

```js
var div = <   div/>;
var div = <   div   />;
var div = <div></   div   >;
```

Note that this parser only results in a parse tree. The transformation of the parse tree of a tag happens in another project :)
