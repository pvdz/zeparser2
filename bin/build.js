#!/usr/bin/env node

console.log("Building...");

var fs = require('fs');
var path = require('path');
var root = path.resolve(__dirname+'/..');

var Par = require(__dirname+'/../src/par.js').Par;
var Tok = require(__dirname+'/../src/tok.js').Tok;

var files = [
  'uni.js',
  'tok.js',
  'par.js'
];

console.log("concatting all files...");
var all = files.map(function(f){
  console.log('- src/'+f);
  return '\n;\n//######### '+f+' #########\n\n'+fs.readFileSync(root+'/src/'+f)+'\n\n//######### end of '+f+' #########\n\n';
}).join('');

// wrap in nodejs/browser way of exposing an exports object
all = '(function(exports){'+all+'})(typeof exports === "undefined" ? window : exports);\n';

// Inline all constants. this is not generically "safe", but sufficiently safe for this project. be warned.
// Simply get all variables with only uppercase letters or underscores. Track any assignments to them.
// If there were multiple assignments, make sure they are the same, and only primitives. Then and only then;
// find all (identifier) occurrences of this value and replace them with the primitive. Remove the definitions.
// (I declare my vars and constants individually and don't use (uppercased) labels)

var constants = [];
var hash = {};
var tok = Par.parse(all, {saveTokens:true, createBlackStream:true}).tok;
var btree = tok.black;
btree.forEach(function(token){
  switch (Tok[token.type]) {
    case 'identifier':
      if (token.value.toUpperCase() === token.value && btree[token.black-1] !== '.') { // only leading primary
        if (!hash[token.value]) constants.push(hash[token.value] = {name:token.value, value:undefined, valid:true});
      }
      break;
    case 'punctuator':
      if (token.value === '=') {
        // verify that the lhs is a variable found to be a constant
        // verify that the rhs is a primitive
        var lhs = hash[btree[token.black-1].value];
        if (lhs && lhs.valid && btree[token.black-2].value !== '.') {
          var rhs = btree[token.black+1];
          if (rhs.type === Tok.STRING || rhs.type === Tok.NUMBER || rhs.value === 'null' || rhs.value === 'true' || rhs.value === 'false') {
            lhs.value = rhs.value;
          } else {
            lhs.valid = false;
          }
        }
      }
      break;
  }
});
btree.forEach(function(token){
  var target = hash[token.value];
  if (target && target.valid) {
    if (btree[token.black-1].value === 'var') {
      btree[token.black-1].value = ''; // var
      token.value = ''; // varname
      btree[token.black+1].value = ''; // =
      btree[token.black+2].value = ''; // value
      if (btree[token.black+3].value === ';') btree[token.black+3].value = '';
    } else if (target.value && btree[token.black-1].value !== '.') {
      token.value = target.value;
    }
  }
  return token.value;
});

all = tok.tokens.map(function(t){ return t.value; }).join('');

console.log('Writing build to build/zp.js');
fs.writeFileSync(root+'/build/zp.js', all);
console.log('Done!');
