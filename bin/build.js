#!/usr/bin/env node

console.log("Building...");

var fs = require('fs');
var path = require('path');

var ROOT_DIR = path.resolve(__dirname+'/..');
var BUILD_DIR = ROOT_DIR + '/build';

// prototype elimination
var ParMeta = require('./zeparser2-meta.js').Par;

// self testing
var Par = require(ROOT_DIR + '/src/par.js').Par;
var Tok = require(ROOT_DIR + '/src/tok.js').Tok;

if (!process.argv[2]) {
  console.log('(Note: no params found. If you add a param you can name this build and have it auto-added to the gonzales project locally)')
}

var files = [
  'uni.js',
  'tok.js',
  'par.js'
];

console.log("concatting all files...");
var all = files.map(function(f){
  console.log('- src/'+f);

  var source = fs.readFileSync(ROOT_DIR+'/src/'+f).toString('utf8');

  // remove individual scope wrappers
  if (source.indexOf("})(typeof exports === 'object' ? exports : window);") < 0) console.warn('Warning: Scope boilerplate not found for '+f);
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
        else if (varname.type !== Tok.IDENTIFIER) console.log('Warning: whitespace after this? investigate');
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
    var workaroundToken;
    btree.forEach(function(token, index){
      if (token.type === Tok.IDENTIFIER) {
        if (token.value === 'proto' && btree[index-1].value === 'var') {
          if (protoToken) console.log('Warning: proto occurred twice in '+f+' :(');
          else {
            protoToken = token;
            btree[index+2].targetProtoObject = true;
          }
        } else if (token.value === 'chromeWorkaround') {
          if (workaroundToken) console.log('Warning: workaround token occurred twice in '+f+' :(');
          workaroundToken = token;
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

    if (f !== 'uni.js') {
      // strip prototype object and chromeWorkaround IIFE
      if (!protoToken) console.log('Proto not found in '+f);
      else {
        // var proto = { ... };
        // wipe everything from index-1 to index+2.rhc
        var from = btree[protoToken.black-1].white;
        var to = btree[protoToken.black+2].rhc.white+1;
        for (var i=from; i<=to; ++i) wtree[i].value = '';
      }

      if (!workaroundToken) console.log('Workaround not found in '+f);
      else {
        // (function chromeWorkaround(){ ... })();
        // index-3 ~ rhc+4
        var from = btree[workaroundToken.black-2].white;
        var to = btree[workaroundToken.black-1].rhc.white+4; // +4 should actually be in blacks, but i can assume that there's no whitespace because i'm me
        for (var i=from; i<=to; ++i) wtree[i].value = '';
      }
    }

    source = wtree.map(function(t){ return t.value; }).join('')
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

all = tok
  .tokens
  .map(function(t){ return t.value; })
  .join('')
  .replace(/[\r\n]/g, '\n')
  .replace(/ +[\n\r]+/g, '')
  .replace(/\n\n\n+/g, '\n\n')
;

console.log('Writing build to build/zp.js');
fs.writeFileSync(BUILD_DIR+'/zp.js', all);
console.log('Done!');

if (process.argv[2]) {
  var dirnameBare = process
    .argv
    .slice(2)
    .join('_')
    .replace(/[^\d\w\.-_]/g, '_')
    .replace(/__+/g, '_');

  if (dirnameBare) {
    console.log('Exporting to '+BUILD_DIR+'/'+dirnameBare);

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
      var d = new Date();


      var ts = parseInt(''+d.getMonth()+d.getDate()+(new Date(1970, 0, 1, d.getHours(), d.getMinutes(), 0).getTime()/60/1000)+Math.floor(d.getSeconds()/10), 10).toString(36);

      dirname = ts+'_'+dirnameBare;
      dirs.unshift({full:dirname, bare:dirnameBare});
    }

    var fullDirname = BUILD_DIR+'/'+dirname;
    if (!found) fs.mkdirSync(fullDirname);

    // copy all source files and the build to this build dir for posterity
    files.forEach(function(file){
      fs.createReadStream(ROOT_DIR+'/src/'+file).pipe(fs.createWriteStream(fullDirname+'/'+file));
    });
    fs.writeFileSync(fullDirname+'/build.js', all);

    // update the gonzales config file
    var gonzalesParsers = ROOT_DIR+'/../gonzales/data/zeparser.js';
    var templateFile = fs.readFileSync(gonzalesParsers).toString('utf-8');

    var TEMPLATE_START = 'TEMPLATE_START';
    var TEMPLATE_END = 'TEMPLATE_END';
    var RESULT_START = 'RESULT_START';
    var RESULT_END = 'RESULT_END';
    var TEMPLATE_NAME = 'TEMPLATE_NAME';
    var TEMPLATE_SOURCE = 'TEMPLATE_SOURCE';

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
      .map(function(o){
        var file = BUILD_DIR+'/'+ o.full;
        if (o.full[0] !== '_' && fs.existsSync(file) && fs.statSync(file).isDirectory()) {
          return template
            .replace(TEMPLATE_NAME, "'"+o.full+"'")
            .replace(TEMPLATE_SOURCE, "['../../zeparser2/build/"+o.full+'/build.js\']');
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
  }
}
