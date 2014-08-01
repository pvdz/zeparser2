#!/usr/bin/env node

// this can run endless without running out of memory. huzah.


var Par = require('../build/zps.js').Par;
var fs = require('fs');

var FROM_FILE = true;
var FILE = '../gonzales/data/sources/16mb-benchmark.js';
var INPUT = "process.stdin.on('data', function (chunk) { var confirmCount = 0; });\n";

var start = Date.now();
var len = 0;
var max = 0;

var confirmLen = 0;

var p = Par.parse('', {
  functionMode: false,
  regexNoClassEscape: false,
  saveTokens: false,
  strictAssignmentCheck: true,
  strictForInCheck: true,
  runWithoutFurtherInput: false,
  onToken: function(_, v){
    confirmLen += v.length;
  }
});
p.thaw();

if (FROM_FILE) {
  setImmediate(function again() {
    fs.createReadStream(FILE)
      .on('data', function(data) {
        len += data.length;
        p.thaw(data);
      })
      .on('end', function() {
        var lens = len+'';
        while (lens.length < 10) lens = '0'+lens;

        var lens2 = confirmLen+'';
        while (lens2.length < 10) lens2 = '0'+lens2;

        console.log('len='+lens2, 'ontoken len:'+lens2, process.memoryUsage());

        setImmediate(again);
      });
  });
} else {
  setImmediate(function again() {
    for (var i=0; i<100000; ++i) {
      len += INPUT.length;
      p.thaw(INPUT);
    }

    var lens = len+'';
    while (lens.length < 10) lens = '0'+lens;

    var lens2 = confirmLen+'';
    while (lens2.length < 10) lens2 = '0'+lens2;

    console.log('len='+lens2, 'ontoken len:'+lens2, process.memoryUsage());
    setImmediate(again);
  });
}
