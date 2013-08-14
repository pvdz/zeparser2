#!/usr/bin/env node

// echo "foo" | cli.js
var Par = require(__dirname+'/../src/par.js').Par;

var data = '';
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
  data += chunk;
});

process.stdin.on('end', function () {
  console.log(data);
  var par = new Par(data);
  par.run();
  console.log('-- finished ('+par.tok.tokenCount+' tokens)');
});
