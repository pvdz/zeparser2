#!/usr/bin/env node

// Simple bootstrap script for my profiler (http://github.com/qfox/heatfiler)
// Node edition. Assumes heatfiler shares same root dir as zeparser2. Output
// is written to ../../heatfiler/profiler_stats.js by this script.
// In HeatFiler, go to the NodeJS tab (obviously). The rest is magic.

// heatfiler will hook into require, we dont need its returnvalue
require('../../heatfiler/src/heatfiler.js').bootstrap('../../heatfiler/stats.js', [
  '/media/bob/Dropbox/private/zeparser2/src/par.js',
  '/media/bob/Dropbox/private/zeparser2/src/tok.js',
]);

var fs = require('fs');
var Par = require(__dirname+'/../src/par.js').Par;

//var input = fs.readFileSync('../../gonzales/data/sources/jquery.js');
var input = fs.readFileSync('../../gonzales/data/sources/8mb-benchmark.js');

console.log("Starting parse...");
Par.parse(input.toString('utf8'));
console.log("Done");
