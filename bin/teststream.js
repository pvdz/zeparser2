#!/usr/bin/env node

// > cat ../gonzales/data/sources/16mb-benchmark.js | bin/teststream.js
// -- finished (15723571 bytes, 5960817 tokens, 7544ms, biggest chunk: 65536 bytes)
// > cat ../gonzales/data/sources/kate.js.jo.35mb.js | bin/teststream.js
// -- finished (40971930 bytes, 21974110 tokens, 38054ms, biggest chunk: 65536 bytes)

var util = require('util');
var Par = require('../build/zps.js').Par;

var start = Date.now();
var len = 0;
var max = 0;

var confirmLen = 0;
var confirmCount = 0;

process.stdin.resume();
process.stdin.setEncoding('utf8');

//console.log(util.inspect(process.memoryUsage()));

var p = Par.parse('', {
  functionMode: false,
  regexNoClassEscape: false,
  saveTokens: false,
  strictAssignmentCheck: true,
  strictForInCheck: true,
  runWithoutFurtherInput: false,
  onToken: function(_, val){
    confirmLen += val.length;
    ++confirmCount;
  }
});
p.thaw();

process.stdin.on('data', function (chunk) {
  len += chunk.length;
  if (chunk.length > max) max = chunk.length;
  p.thaw(chunk);
});

process.stdin.on('end', function () {
  var par = p.thaw(false);
  console.log('-- finished ('+len+' bytes, '+par.tokenCountWhite+' tokens, '+(Date.now()-start)+'ms, biggest chunk: '+max+' bytes)');
  if (confirmLen !== len) console.log('Warning: onToken saw '+confirmLen+' bytes! Not the same.');
  if (confirmCount !== par.tokenCountWhite) console.log('Warning: onToken saw '+confirmCount+' tokens! Not the same.');
//  console.log(util.inspect(process.memoryUsage()));
});
