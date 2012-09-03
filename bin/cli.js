#!/usr/bin/env node

console.log("Building...");

var fs = require('fs');
var path = require('path');
var root = path.resolve(__dirname+'/..');

var files = [
    'tok.js',
    'par.js'
];

console.log("concatting all files...");
var all = files.map(function(f){
    console.log('- src/'+f);
    return '\n;\n//######### '+f+' #########\n\n'+fs.readFileSync(root+'/src/'+f)+'\n\n//######### end of '+f+' #########\n\n';
}).join('');

// wrap in nodejs/browser way of exposing an exports object
all = '(function(exports){'+all+'})(this);\n';


console.log('Writing build to build/zp.js');
fs.writeFileSync(root+'/build/zp.js', all);
console.log('Done!');
