#!/usr/bin/env node

// TOFIX: concurrent runs of the streaming parser will probably fail due to the build

var showHelp = process.argv[2] === '--help' || process.argv[2] === '?' || process.argv[2] === '-?' || process.argv[2] === '--?';
if (!showHelp) console.log("Building...");

var fs = require('fs');
var path = require('path');

var ROOT_DIR = path.resolve(__dirname+'/..');
var BUILD_DIR = ROOT_DIR + '/build';

// prototype elimination
var ParMeta = require(ROOT_DIR + '/bin/zeparser2-meta.js').Par;

// post process build to make it into a streamer
var eliminateLogic = require(ROOT_DIR + '/bin/streamer/eliminatelogic');
var makeFreezable = require(ROOT_DIR + '/bin/streamer/makefreezable');

// self testing
var Par = require(ROOT_DIR + '/src/par.js').Par;
var Tok = require(ROOT_DIR + '/src/tok.js').Tok;

var noComment = true;
var enableLast = 5;
var showLast = 10;
var dirnameBare = '';
var guardedBuild = false;
var streamer = false;
var buildAll = false;
if (!process.argv[2] || showHelp) {
  if (!showHelp) console.log('(Note: no params found. If you add a param you can name this build and have it auto-added to the gonzales project locally).');
  else {
    console.log('Build script for ZeParser2, puts results in /build or /build/<timestamp>_<name>/ if a name was given');
    console.log('');
    console.log('Flags:');
  }
  console.log('--comments      Leaves comments in, they are omitted without this arg');
  console.log('--show n        To show last n builds in Gonzales (default:10)');
  console.log('--enable n      To enable last n builds in Gonzales (default:5)');
  console.log('--streamer      Builds a streaming parser (zps.js)');
  console.log('--all           Create regular (zp.js) and streaming (zps.js) builds, no name');
  console.log('--guarded       Do not eliminate loop guards');
  if (!showHelp) console.log('--help          Duh');

  if (showHelp) {
    console.log('');
    console.log('Usage: ./build.js [flags]');
    console.log('Usage: ./build.js [flags] name');
    process.exit();
  }
} else {
  var argIndex = 2;
  var next = process.argv[argIndex];
  while (next && next[0] === '-' && next[1] === '-') {
    switch (next.slice(2)) {
      case 'comments':
        console.log('-- Leaving in comments')
        noComment = false;
        break;
      case 'enable':
        var n = parseInt(process.argv[argIndex+1], 10);
        console.log('-- enabling the last '+n+' builds in gonzales');
        if (n+'' === process.argv[argIndex+1]) {
          enableLast = n;
          ++argIndex;
        } else {
          throw 'Bad arg for --enable, expecting int';
        }
        break;
      case 'show':
        var m = parseInt(process.argv[argIndex+1], 10);
        console.log('-- showing the last '+m+' builds in gonzales');
        if (m+'' === process.argv[argIndex+1]) {
          showLast = m;
          ++argIndex;
        } else {
          throw 'Bad arg for --show, expecting int';
        }
        break;
      case 'streamer':
        console.log('-- producing a streaming parser');
        streamer = true;
        break;
      case 'all':
        console.log('-- producing a streaming parser and regular build');
        buildAll = true;
        break;
      case 'guarded':
        console.log('-- leaving in loop guards');
        guardedBuild = true;
        break;
      default:
        console.log('Bailing for unknown flag: '+next);
        process.exit();
    }

    next = process.argv[++argIndex];
  }
  if (enableLast > showLast) showLast = enableLast;

  dirnameBare = process
    .argv
    .slice(argIndex)
    .join('_')
    .replace(/[^\d\w\.-_]/g, '_')
    .replace(/__+/g, '_');
}

var files = [
  'uni.js',
  'tok.js',
  'par.js'
];

console.log("concatting all files...");
var code = files.map(function(f){
  console.log('- src/'+f);

  var source = fs.readFileSync(ROOT_DIR+'/src/'+f).toString('utf8');

  // remove individual scope wrappers
  if (source.indexOf("})(typeof exports === 'object' ? exports : window);") < 0) console.warn('Warning: Scope boilerplate not found for '+f+' (this is a problem!)');
  else {
    source = source
      .replace("var Tok = exports.Tok || require(__dirname+'/tok.js').Tok;", '')
      .replace("var uniRegex = exports.uni || require(__dirname+'/uni.js').uni;", '')
    ;

    // change all `this.` occurrences to `this_<f>_`
    var prefix = 'this_'+f.split('.')[0]+'_';
    var tok = ParMeta.parse(source).tok;
    var btree = tok.black;
    var wtree = tok.tokens;
    btree.forEach(function(token, index){
      if (token.value === 'this') {
        var next = btree[index+1];
        var varname = btree[index+2];
        if (next.value !== '.') {
          if (
            btree.slice(index-1, index+2).map(function(t){ return t.value; }).join('') !== 'returnthis;' &&
            btree.slice(index, index+2).map(function(t){ return t.value; }).join('') !== 'this['
          ) {
            console.log('Warning: this without dot? investigate. [' + btree.slice(Math.max(0, index-5), Math.min(btree.length, index+5)).map(function(t){ return t.value; }).join(''));
          }
        }
        else if (varname.type !== Par.IDENTIFIER) console.log('Warning: whitespace after this? investigate');
        else {
          next.value = '';
          token.value = prefix;
        }
      }
    });
    // find all context properties and their initial value (all properties should be initializes
    // on their prototype). we can find them by searching for `name:`, the colon will only occur
    // once (hopefully). note that we ignore the constructor because its body will be invoked "as is"
    // currently, the prototype is declared as `var proto = { .. };`, so we search for `proto`
    var vars = [];
    var protoToken;
    var protoStart = Infinity;
    var protoStop = Infinity;
    btree.forEach(function(token, index){
      if (token.type === Par.IDENTIFIER) {
        if (
          token.value === 'prototype' &&
          (btree[index-2].value === 'Tok' || btree[index-2].value === 'Par') &&
          btree[index-1].value === '.'
        ) {
          if (protoToken) console.log('Warning: prototype occurred twice in '+f+' :(');
          else {
            protoToken = token;
            btree[index+2].targetProtoObject = true;
            protoStart = btree[index-2].white;
            protoStop = btree[index+2].rhc.white;
          }
        } else if (token.lhc && token.lhc.targetProtoObject) {
          var key = prefix+token.value;
          // property of the proto object literal; collect
          if (btree[index+2].value === 'function') {
            // instance method
            // this is ParMeta, so we can easily jump to the last token of the function body
            vars.push('  function '+key+wtree.slice(btree[index+3].white, btree[index+2].rhc.white+1).map(function(t){ return t.value; }).join(''));
          } else {
            // instance property
            // find the first comma and hope i dont do something stupid in tok.js or par.js
            var initializer = '';
            var windex = btree[index+1].white;
            while (wtree[++windex] && wtree[windex].value !== ',') initializer += wtree[windex].value;
            vars.push('  var '+key+' = '+initializer+';');
          }
        }
      }
    });

    source = wtree.map(function(t, i){
      if (i >= protoStart && i <= protoStop) return '';
      return t.value;
    })
      .join('')
      .replace(
        "(function(exports){",
        vars.join('\n')
      )
      .replace("})(typeof exports === 'object' ? exports : window);", '')
      .replace(/this_par_tok\./g, 'this_tok_')
      .replace(/var tok = this_par_tok;/g, '')
      .replace(/tok\./g, 'this_tok_')
    ;
  }



  return '\n//######### '+f+' #########\n\n'+source+'\n\n//######### end of '+f+' #########\n\n';
}).join('');

// my DSL macros
code = code.replace(/^.*\/\/ #zp-build drop line(?: .*)?$/gm, '\n')
if (!guardedBuild) code = code.replace(/^.*\/\/ #zp-build loopguard(?: .*)?$/gm, '\n')

// wrap in nodejs/browser way of exposing an exports object
code = '(function(exports){'+code+'})(typeof exports === "undefined" ? window : exports);\n';

// Inline all constants. this is not generically "safe", but sufficiently safe for this project. be warned.
// Simply get all variables with only uppercase letters or underscores. Track any assignments to them.
// If there were multiple assignments, make sure they are the same, and only primitives. Then and only then;
// find all (identifier) occurrences of this value and replace them with the primitive. Remove the definitions.
// (I declare my vars and constants individually and don't use (uppercased) labels)

var constants = [];
var hash = {};
var tok = Par.parse(code, {saveTokens:true, createBlackStream:true}).tok;
var wtree = tok.tokens;
var btree = tok.black;

// first pass: replace constants
btree.forEach(function(token){
  switch (Par[token.type]) {
    case 'asi':
      console.log('Warning: ASI encountered, might affect build script');
      break;
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
          if (rhs.type === Par.STRING || rhs.type === Par.NUMBER || rhs.value === 'null' || rhs.value === 'true' || rhs.value === 'false') {
            lhs.value = rhs.value;
          } else {
            lhs.valid = false;
          }
        }
      }
      break;
  }
});

// strip comments
wtree.forEach(function(token){
  switch (Par[token.type]) {
    case 'white':
      if (noComment && token.value !== '\n') token.value = ' ';
//      if (noComment && token.value.length > 2) token.value = '#';
      break;
  }
});

// second pass: drop constants
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

// reconstruct (note: macros happen at the top because all comments are stripped at this point)
code = wtree
  .map(function(t){ return t.value; })
  .join('')

  // remove more than one whitespaces, trim both sides
  //  .replace(/^[\t ]+|[\t ]+$|([\t ])[\t ]+/g, '$1')

  // normalize newlines
  .replace(/[\r\n]/g, '\n')
  .replace(/ +([\n\r])+/g, '$1') // trim
  .replace(/\n\n\n+/g, '\n\n')
;

// post process transform the build into a streaming parser?
if (streamer || buildAll) {
  var regular = code;
  console.log('Applying Streamer post processing');
  console.log('- eliminate logic');
  code = eliminateLogic(code);
  fs.writeFileSync(BUILD_DIR+'/zp-nologic.js', code);
  console.log('- make freezable');
  code = makeFreezable(code);
}

if (buildAll || !streamer) {
  console.log('Writing regular build to build/zp.js');
  fs.writeFileSync(BUILD_DIR+'/zp.js', regular || code);
  console.log('Done!');
}
if (buildAll || streamer) {
  console.log('Writing streaming build to build/zps.js');
  fs.writeFileSync(BUILD_DIR + '/zps.js', code);
  console.log('Done!');
}

if (dirnameBare) {
  console.log('Also exporting to '+BUILD_DIR+'/'+dirnameBare);

  // find all existing build dirs, ignore _ prefixes
  var dirs = fs
    .readdirSync(BUILD_DIR)
    .filter(function(s){
      return s && s[0] !== '_' && fs.statSync(BUILD_DIR+'/'+s).isDirectory();
    })
    .map(function(s){
      return {
        full: s,
        bare: s.slice(s.indexOf('_') + 1),
      };
    });

  // reuse existing dir if same name
  var found = dirs.filter(function(o){
    return (dirnameBare === o.bare);
  })[0];

  if (found) {
    dirname = found.full;
  } else {
    dirname = new Date().getTime()+'_'+dirnameBare;
    dirs.unshift({full:dirname, bare:dirnameBare});
  }

  var fullDirname = BUILD_DIR+'/'+dirname;
  if (!found) fs.mkdirSync(fullDirname);

  // copy all source files and the build to this build dir for posterity
  files.forEach(function(file){
    fs.createReadStream(ROOT_DIR+'/src/'+file).pipe(fs.createWriteStream(fullDirname+'/'+file));
  });
  fs.writeFileSync(fullDirname+'/build.js', code);

  // update the gonzales config file
  var gonzalesParsers = ROOT_DIR+'/../gonzales/data/zeparsers.js';
  var templateFile = fs.readFileSync(gonzalesParsers).toString('utf-8');

  var TEMPLATE_START = 'TEMPLATE_START';
  var TEMPLATE_END = 'TEMPLATE_END';
  var RESULT_START = 'RESULT_START';
  var RESULT_END = 'RESULT_END';
  var TEMPLATE_NAME = 'TEMPLATE_NAME';
  var TEMPLATE_SOURCE = 'TEMPLATE_SOURCE';
  var TEMPLATE_ENABLED = 'TEMPLATE_ENABLED';

  var template = templateFile.slice(
    templateFile.indexOf('\n', templateFile.indexOf(TEMPLATE_START))+1,
    templateFile.lastIndexOf('\n', templateFile.indexOf(TEMPLATE_END))
  );

  // copy all builds as a gonzales source
  var result = dirs
    .sort(function(a,b){
      if (a.full > b.full) return -1;
      if (a.full < b.full) return 1;
      return 0;
    })
    .map(function(o, index){
      var file = BUILD_DIR+'/'+ o.full;
      if (index < showLast && o.full[0] !== '_' && fs.existsSync(file) && fs.statSync(file).isDirectory()) {
        return template
          .replace(TEMPLATE_NAME, "'"+o.bare.replace(/_/g, ' ')+"'")
          .replace(TEMPLATE_SOURCE, "['../../zeparser2/build/"+o.full+'/build.js\']')
          .replace(TEMPLATE_ENABLED, index<enableLast);
      }
      return '';
    })
    .join('\n')
  ;

  // and final gonzales config file looks like:
  var totalFile =
    templateFile.slice(0, templateFile.indexOf('\n', templateFile.indexOf(RESULT_START))+1) +
    result +
    templateFile.slice(templateFile.lastIndexOf('\n', templateFile.indexOf(RESULT_END)))
  ;

  fs.writeFileSync(gonzalesParsers, totalFile);
  console.log('Export done');
}
