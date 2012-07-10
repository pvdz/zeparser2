This is an intermittent build of this version of the parser. It uses three different styles of coding, and a combination of two. It wants to test the difference between the revealing pattern, the prototypal pattern and the no-namespace pattern. Basically:

prototypal.js: Both tokenizer and parser are written as "classes" that use prototypal methods.
revealing.js: Both tokenizer and parser are written as "classes" that only reveal functions for the api.
hybrid.js: Tokenizer is revealing, parser is prototypal.
globals.js: Tokenizer and parser only use regular functions (no namespacing) all in the same scope.

The point is to find out whether the global way of coding is indeed faster when micro optimizations matter. This parser is an ideal test case for this.

Check out the Gonzales project for details :)
