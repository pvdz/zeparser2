#!/usr/bin/env node

var build = process.argv[2] === '--build';
var streamer = process.argv[2] === '--stream';
if (build) console.log('Using build parser (build/zp.js)');
if (streamer) console.log('Using streaming parser (build/zps.js)');
else console.log('Using dev parser (src/par.js)');
console.log('(Use --stream for streaming parser, --build for the build, nothing for dev parser)');
console.log('----------');

var parserFile = __dirname+'/../src/par.js';
if (build) parserFile = __dirname+'/../build/zp.js'
if (streamer) parserFile = __dirname+'/../build/zps.js'

var Par = require(parserFile).Par;

var data = '';
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
  data += chunk;
});

process.stdin.on('end', function () {
  if (data.length < 2000) console.log(data);
  console.log('----------');
  var start = Date.now();
  var par = Par.parse(data, {noMoreInput:true});
  console.log('-- finished ('+par.tokenCountWhite+' tokens, '+data.length+' bytes, '+(Date.now()-start)+'ms)');
});

/*

 // runtime info, combined with runtime meta functions
 node --trace_opt --trace_opt_verbose --trace_deopt --trace-bailout --allow-natives-syntax run.js

 // all v8 flags :D
 node --v8-options

 // trace which functions do and dont inline and why
 node --trace-inlining run.js

 // trace gc sweeps
 node --trace-gc run.js

 // dump profiler details in v8.log
 node --prof run.js


 // http://wingolog.org/archives/2011/08/02/a-closer-look-at-crankshaft-v8s-optimizing-compiler
 The function to be inlined is less than 600 characters long.

 Neither the inner nor the outer functions may contain heap-allocated variables. (In practice, this means that neither function may contain lexical closures.)

 Inlining of for-in, with, and some other expression types is not currently supported.

 There is a limit on the maximum inlining depth.

 A function's call to itself will not be inlined.

 There is a limit to the number of nodes added to the AST.

 */
