# ZeParser, v2

This is a JS parser written in JS. It is blazingly faster but doesn't return you a parse tree. It's capable of parsing and validating JS on an OCD level at very high speeds.

There were two goals for this project:

- Write a parser that would parse and validate JS as fast as possible, nothing else
- Write the basis for a complete parser (including parse tree)

This parser tries to be as fast as possible. That is also why it doesn't produce any kind of parse tree. It merely validates the JS.

Feel free to compare this parser to any other. At least if it is beaten, I know it's not due to a specific implementation requirement. If you can write a faster parser (in JS), I'd like to know about it!

The source code is well structured and hand optimized to heck. Unfortunately that does mean using the `ord` of characters in a lot of places and creating exhaustive `if`-`else` branches. Anything to postpone string comparisons (or worse) when possible.

The parser itself has no return value. If the parser doesn't throw before it finishes parsing, the parsed source code is proper JS (ES5).

## Usage

Usage is simple:

```js
new Par(<input:string>).run();
```
## Tests

This parser comes with a huge set of input cases. These cases give me 100% code coverage. That doesn't mean that the parser is complete (because I might be missing a case in the suite) but I'm pretty confident that you won't easily poke a hole into it :)

The tests can be found in `tests/tests.js`. You can run them for the tokenizer (`tests/tokenizer.html`) and for the parser (`tests/parser.html`).

There are some more tests in there in case you are curious. They were mainly used in early development when I was using a regex for certain parts.

## Examples

The `example` folder contains two html files that have an inline example of how to parse a string. In case the usage above was too complex. (Nah, just kidding. I use that to quickly debug specific cases that fail :)

## src

The src folder contains the two main files; `tok.js` and `par.js`. The `profiler.js` file is used by my benchmark project, feel free to ignore it. The `regexes` folder contains scripts that produce regular expressions to parse certain parts. They are _unused_, but I wanted to keep them regardless.

## Results

So the result is a very fast parser. In my benchmarks it's able to gobble an 8mb test file (with various real-world JS files, like jQuery and Gmail) in an average 330ms (10 runs in the same session). That's Chrome, Linux, my (pretty high-end) machine. You will very probably get different results.

Take note that it's not fair to compare these results to other parsers out there. If I were to output even the simplest of an array containing one object per token (token stream), the speed would be quite a bit slower. Still fast, mind you, but nowhere near the 400 mark :)

The source is relatively good to read. The many (hex) numbers may be a bit intimidating, but the bigger picture of the parser is well readable. The tokenizer is well separated from the parser and the code uses an OO style that's easy to maintain and extend.

## Missing

There are two things missing from this parser:

- Unicode characters
- Validating lhs of assignments
- label validation for loops

The unicode characters are pretty easy to plug into, just look for the identifier parserss in the tokenizer. I didn't do that yet because, well, it didn't bother me so much during development. I do plan to add it.

Validating the lhs of assignments is missing because I'm not content with how the spec says it should trigger an early error. The language is a bit ambiguous and leaves it too open. I'm not too bothered with this part not working optimally since it's usually just extra checks that won't ever be triggered. The same could be said about other parts of the code, though.

I've only learned recently that continue may only jump to labels that are scoped to the current loop. I've not yet taken the time to investigate this further so the test case still fails. For now.

## Todos

- Add unicode support
- LHS assignment validation
- Label validation
- Refactoring to globals and replacing constants
- Use as basis for real parser

As said, unicode support will happen and shouldn't be a big problem.

Checking the assignment targets is not tooo difficult, though still a challenge. Especially because you only know that you should validate it after you've encountered the assignment. Which kind of sucks. And you can't simply check the last identifier, or invalidate if the previous part of the statement was not "just" an identifier, because `x = y = z` is also valid.

Label validation is probably easy. The `continue` statement does not look for labels beyond the (inner most?) loop, while `break` does. So there's some trickery involved in getting that right as well. Right now it simply does statement scoping for labels.

The parser can be a bit faster than it is right now by refactoring the prototype based structure to a "global" based structure with regular functions and variables. In that structure no function is embedded in another function and there are virtually no property lookups (which are relatively pretty expensive). All constants are replaced by magic numbers which should reduce lookups even further. The entire process should make everything even faster :)

And finally, when I've done all of the above, this parser will form the basis of a JS parser with full parse tree.

## Portability

The code does not use any odd tricks and is (deliberately) kept basic. Not only does this aim to help browsers optimize the hell out of everything, it also helps you to port the code if you would want to do so :)

## Usages

List of (known) usages of this project:

* [html lit](https://github.com/qfox/zeparser2/tree/html) (extend js with custom html literal syntax, also adds line number detection for source maps)
* [cnjs](https://github.com/qfox/zeparser2/tree/jscn) (extend js with custom php-like class notation, see [JSCN repo](https://github.com/Lcfvs/JSCN))
* astoo (private repo, modifies this parser so it can parse AS2)
