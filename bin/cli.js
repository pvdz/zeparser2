#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var root = path.resolve(__dirname+'/..');

var files = [
    'substringStartRegex.js',
    'stringBodyRegex.js',
    'numberRegex.js',
    'tok.js',
    'par.js'
];

console.log("concatting all files...");
var all = files.map(function(f){
    console.log('- src/'+f);
    return '\n;\n//######### '+f+' #########\n\n'+fs.readFileSync(root+'/src/'+f)+'\n\n//######### end of '+f+' #########\n\n';
}).join('');

// wrap in nodejs/browser way of exposing an exports object
all = '(function(exports){'+all+'})(typeof window == \'undefined\' ? module.exports : window);\n';


console.log('writing to build/zp.js');
fs.writeFileSync(root+'/build/zp.js', all);
console.log('done!');
