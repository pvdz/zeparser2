// special build of Par, adds lots of meta data
var Par = require('./par.js').Par;

var ENABLE_LOOP_GUARD = false; // throw after a loop has been looped more than x times? use this for debugging endless loops.
var ENABLE_DEBUG_COMMENTS = false; // compile in minor loop boundary comments? were very helpful during development of this transformation :)

function makeFreezable(data){
  var par = new Par(data, {saveTokens:true, createBlackStream:true});
  par.run();
//  console.log('-- finished ('+par.tok.tokenCountAll+' tokens, '+(Date.now()-start)+'ms)');

  var whites = par.tok.tokens;
  var blacks = par.tok.black;
//  console.log(blacks.map(function(o){ return Object.keys(o)}))

  var breakStack = [];
  var callCounter = 0;
  var switchCounter = 0;
  var currentFunc = null;
  var nextCase = 0;
  var hasFreeze = 0;
  var cases = 1;
  var foundVar = false;
  var isRootDir = false;
  var varDecls = [];
  // normally we would go back to front, but this is a non-generic transformation
  // and the target source never contains functions inside targeted functions
  whites.forEach(function(t, tindex){
    if (t.isFunction && t.name.indexOf('this_') === 0) {
      if (breakStack.length > 0) throw 'Expecting to close all loops within the function that opened it';

      currentFunc = t;

      isRootDir = t.name === 'this_par_run'; // calls in this dir are encoded special, to prepare return object
      t.rhc.value =
        '\n' +
        '          return;\n'+
        (ENABLE_LOOP_GUARD?'        default: throw "uncompiled step? ["+step+"]";\n':'')+
        '      }\n' +
        '    }\n' +
        '  };\n'+
        t.rhc.value;

      callCounter = 0;
    }

    if (!foundVar && t.value === 'uniRegex' && blacks[t.black-1].value === 'var') {
      // prepend the frozen var as a zeparser module global
      foundVar = true;
      t.value = 'frozen = false, ' + t.value;
    }
    if (t.type === 15) throw 'Found ASI, this transformer was not built to handle ASI, it messes up the index stream';
    if (!currentFunc) return;

    if (t.value === 'for' || t.value === 'continue') throw 'Not expecting for-loops, input source assertion fail (this is not a generic approach, beware)';
    if ((t.value === '{' || t.value === '}') && !t.keepMe) t.value = ''; // we dont need them, we will splice everything out
    if (t.value === '&&' || t.value === '||') throw 'Found logic operators, they should have been eliminated in an earlier step';

    // return x || y;
    // { var T = x; if (!T) T = y; return T; }

    // foo(x && y);
    // { var T = x; if (T) T = y; foo(T); }

    // if (x && y) { a; b; }
    // { var T = x; if (T) T = y; if (T) { a; b; } }


    // if, while, return, call, assignment

    if (t === currentFunc.rhc) {
      var vars = [];
      var funcs = [];
      while (callCounter--) {
        vars.push('v' + callCounter);
        funcs.push('f' + callCounter);
      }

      currentFunc.lhc.after +=
        '\n' +
        'var step = 1;\n' +
        (vars.length ? 'var ' + vars.join(', ') + ';\n' : '') +
        (funcs.length ? 'var ' + funcs.join(', ') + ';\n' : '') +
        (switchCounter ? 'var switchValue, matched, fellThrough;\n' : '') +
        (varDecls.length ? 'var '+varDecls.join(', ')+';\n' : '')+
        'return function inside_'+currentFunc.name+'(thawValue){\n' +
        (isRootDir ? 'frozen = false;\n':'')+
        (ENABLE_LOOP_GUARD?'  var guard = 100000;\n':'')+
        '  while (true) {\n' +
        (ENABLE_LOOP_GUARD?'    if (--guard <= 0) { debugger; if (guard < -10) { console.trace("loop guard"); throw "loop guard protection"; } }\n':'')+
        '    switch (step) {\n' +
        '      case 1:\n';

      currentFunc = 0;
      cases = 1;
      switchCounter = 0;
      nextCase = 0;
      varDecls = [];
    }

    var bef = breakStack.length;
    var breaktok;
    while (
      (breaktok = breakStack[breakStack.length-1]) &&
      (
        (breaktok.isWhile && breaktok.whileEndToken.white <= tindex) ||
        (breaktok.isDo && breaktok.semiToken.white <= tindex) ||
        (breaktok.isSwitch && breaktok.rhc.white <= tindex)
      )
    ) breakStack.pop();

    if (t.isWhile) {
      // all whiles are recompiled to `while(true) { if (!(cond)) break; body }` in the logic elimination step
      // so we can assume that all while conditions are duds, always true. (not so for `do` or `switch`!)
      // we can also assume all whiles have bracketed bodies, which helps a bit with the jump targeting :)

      // sanity check that the above holds
      if (t.value !== 'while') throw 'assumption broken';
      if (blacks[t.black+1].value !== '(') throw 'assumption broken';
      if (blacks[t.black+2].value !== 'true') throw 'assumption broken';
      if (blacks[t.black+3].value !== ')') throw 'assumption broken';
      if (blacks[t.black+4].value !== '{') throw 'assumption broken';
      if (blacks[t.whileEndToken.black-1].value !== '}') throw 'assumption broken';

      breakStack.push(t);

      t.startCaseId = ++cases;
      t.value =
        (ENABLE_DEBUG_COMMENTS?'\n// while start [black='+t.black+']':'')+
        '\nstep = '+t.startCaseId+';' +
        '\ncase '+t.startCaseId+':' +
        '\n';
      blacks[t.black+1].value = '';
      blacks[t.black+2].value = '';
      blacks[t.black+3].value = '';
      blacks[t.black+4].value = '';

      t.endCaseId = ++cases;
      blacks[t.whileEndToken.black-1].value =
        (ENABLE_DEBUG_COMMENTS?'\n// back to start of while [black='+t.black+']':'')+
        '\nstep = '+t.startCaseId+';'+
        '\ncontinue'+
        (ENABLE_DEBUG_COMMENTS?'\n// end of while [black='+t.black+']':'')+
        '\ncase '+ t.endCaseId+':' +
        '\n';
    }

    if (t.isDo) {
      if (t.semiToken.value !== ';') throw 'Assumed semi value was not changed';

      breakStack.push(t);

      t.startCaseId = ++cases;
      t.value =
        (ENABLE_DEBUG_COMMENTS?'\n// do start [black='+t.black+']':'')+
        '\nstep = '+t.startCaseId+';' +
        '\ncase '+t.startCaseId+':' +
        '\n';

      t.whileToken.value = 'if';
      t.semiToken.before =
        '{ step = '+t.startCaseId+'; continue; }'+
        t.semiToken.before;

      // setup jump target for break
      t.endCaseId = ++cases;
      t.semiToken.value =
        (ENABLE_DEBUG_COMMENTS?' // jump to start of loop [black='+t.black+']':'')+
        (ENABLE_DEBUG_COMMENTS?'\n// do end [black='+t.black+']':'')+
        '\nstep = '+t.endCaseId+';' +
        '\ncase '+t.endCaseId+':\n';
    }

    if (t.isIfHeaderRhp) {
      var ifToken = t.isIfHeaderRhp;

      var a = ++cases;
      var b = ++cases;
      var c = ++cases;

      ifToken.value += '(!';
      t.value +=
        ') { step = '+b+'; continue; }\n'+
        '\nstep = '+a+';\ncase '+a+':\n';

      if (ifToken.elseToken) {
        ifToken.elseToken.value =
          '\nstep = '+c+';\n' +
          'continue;\n' +
          '\nstep = '+b+';\ncase '+b+':\n';

        ifToken.elseEndToken.before +=
          '\nstep = '+c+';\ncase '+c+':\n';
      } else {
        ifToken.ifEndToken.before +=
          '\nstep = '+b+';\ncase '+b+':\n';
      }
    }

    if (t.isCallLhp && blacks[t.black-1].value === 'this_tok_waitForInput') {
      hasFreeze = true;

      var freezeArgs = blacks.slice(t.black+1, t.rhp.black).map(function(t){ return t.value; }).join('');
      whites.slice(t.white-1, t.rhp.white+1).forEach(function(t){ t.value = ''; });
      t.value = 'thawValue'; // this will get the result of freezing ("frozen")

      var p = t.black-1;
      while (p>=0 && !blacks[p].isStatementStart) --p;
      if (p < 0) p = 0;
      var stmtstrt = blacks[p];

      stmtstrt.before +=
        '\nstep = '+(++cases)+';\n'+
        'return (frozen = true), ('+(freezeArgs&&(freezeArgs+"||"))+'undefined);\n'+
        'case '+cases+':\n';

    } else if (t.isCallLhp && blacks[t.black-1].value.indexOf('this_') === 0) {
      // this_tok_foo()
      // ->
      // v1 = (f1 = f1 || this_tok_foo())();
      // if (frozen) return;

      var ident = blacks[t.black-1];

      if (ident.isStatementStart) {
        //
        ident.value =
          'step = '+(++cases)+'; case '+cases+':\n'+ // fixes parseRegex, at least. TOFIX: i think there's a more precise fix for this, this adds a lot of overhead for each statement. need to trim it down a bit.
          'v'+callCounter+' = (f'+callCounter+' = f'+callCounter+' || '+ident.value;

        t.rhp.value +=
          ')(thawValue);\n' +
          'if (frozen) '+
          (isRootDir?'{\n':'')+
          (isRootDir?'          ':'')+
          'return v'+callCounter+';\n'+
          (isRootDir?'        }\n':'')+
          '\nelse f'+callCounter+' = null;\n'+ // generator ran its course, force reset next time (or at least GC)
          'step = '+(++cases)+';\ncase '+cases+':\n';

      } else {
        // slice out entire call, but just the call. we can use it literally, so no need to do magic
        // (ok actually there is need to do magic because the call might contain other calls...)
        var call = whites.slice(ident.white, t.rhp.white+1).map(function(t){
          var s = t.value;
          t.value = '';
          return s;
        }).join('');
        ident.value = 'v'+callCounter;

        var p = ident.black-1;
        while (p>=0 && !blacks[p].isStatementStart && !blacks[p].isDoWhileToken) --p;
        if (p < 0) p = 0;
        var stmtstrt = blacks[p];

        stmtstrt.value =
          '\nstep = '+(++cases)+';\ncase '+cases+':\n'+
          'v'+callCounter+' = (f'+callCounter+' = f'+callCounter+' || '+call+')(thawValue);\n' +
          'if (frozen) '+
          (isRootDir?'{\n':'')+
          (isRootDir?'          ':'')+
          'return v'+callCounter+';\n'+
          (isRootDir?'        }\n':'')+
          '\nelse f'+callCounter+' = null;\n'+ // generator ran its course, force reset next time (or at least GC)
          'step = '+(++cases)+';\ncase '+cases+':\n'+
          stmtstrt.value;
      }
      ++callCounter;
    }

    if (t.isSwitch) {
      if (switchCounter++) throw 'Not expecting multiple switches per function';
      if (t.rhc.value !== '}') throw 'did not expect rhc.value to be updated yet';

      breakStack.push(t);

      t.value =
        '\n' +
        'fellThrough = false;\n' +
        'matched = false;\n' +
        'switchValue = ';

      // setup jump target for break
      t.endCaseId = cases;
      t.rhc.value =
        (ENABLE_DEBUG_COMMENTS?'\n// switch end [black='+t.black+']':'')+
        '\nstep = '+t.endCaseId+';' +
        '\ncase '+t.endCaseId+':\n';
    }

    if (t.isCase) {
      t.value =
        ';\n' +
        (nextCase?'fellThrough = true;\n':'')+
        (nextCase?'\nstep = '+nextCase+';\ncase '+nextCase+':\n':'')+
        'if (!(fellThrough || (!matched && (matched = (switchValue === (';

      t.caseEndToken.value =
        ')))))) { step = '+(++cases)+'; continue; }\n';

      nextCase = cases;
    }

    if (t.isDefault) {
      t.value =
        (nextCase?'\nstep = '+nextCase+';\ncase '+nextCase+':\n':'')+
        'if (!fellThrough && matched) { step = '+(++cases)+'; continue; }\n';

      nextCase = 0; // end of the line

      blacks[t.black+1].value = ''; // colon
    }

    if (t.isSwitchRhc) {
      if (nextCase) {
        t.before =
          (ENABLE_DEBUG_COMMENTS?'\n// switch-case jump-target from last case-test (if fail)':'')+
          '\nstep = '+nextCase+';' +
          '\ncase '+nextCase+':' +
          '\n'+
          t.before;
      }
    }

    if (t.isBreak) {
      if (t.value !== 'break') throw 'assumption fail'; // prevent accidental overwrites, and figure out how to proceed if this does happen
      var loop = breakStack[breakStack.length-1];
      t.value =
        (ENABLE_DEBUG_COMMENTS?'\n// break to loop [black='+loop.black+'] end\n':'')+
        'step = '+loop.endCaseId+';\n'+
        'continue;\n';
    }

    if (t.isVar) {
      t.value = '';
      varDecls.push.apply(varDecls, t.vars.filter(function(n){ return varDecls.indexOf(n) < 0; }));
    }
  });

  if (breakStack.length > 0) throw 'Expecting to close all loops that were opened';

  var out = whites.map(function(t){ return t.before+t.value+t.after; }).join('');

  var last;
  do {
    last = out;
    out = out
      .replace(/if\(!\(true\)\) \{ step = \d+; continue; \}/g, '') // pretty print artifacts
      .replace(/(?:\s*step = \d+;)+(\s*step = \d+;)/g, '$1') // eliminate consecutive step assignments
      .replace(/step = \d+;\s+(case \d+:\s*step = \d+;)/g, '$1') // eliminate unneeded `step=x`
      .replace(/\s*\(A\)\)/g, 'A)') // remove useless group artifact
      .replace(/\)\s*\{\s*step\s*=\s*(\d+)\s*;\s*continue\s*;\s*\}/g, ') { step = $1; continue; }') // pretty print
      .replace(/if\(! */g, 'if (!') // pretty print
      .replace(/\n\s*(\n\s*)+/g, '\n') // remove multiple newlines
      .replace(/(case \d+:\n)\s*;/g, '$1') // remove single ;
      .replace(/continue;\s*;/g, 'continue;') // remove single ;
      .replace(/;  if \(!/g, ';\nif (!') // add newline to artifact
      .replace(/(\s*continue;)(?:\s*step = \d+;)+/g, '$1') // remove dead code
      .replace(/if\s*\(\s*\!\s*\(\s*([\w\d]+)\s*\)\s*\)/g, 'if (!$1)') // remove unnecessary paren wrapping: if (!(v5))
      .replace(/if\s*\(\s*\!\s*\(\s*\!([\w\d]+)\s*\)\s*\)/g, 'if ($1)') // remove unnecessary paren wrapping with double negation: if (!(!v5))
      .replace(/if\s*\(\s*\!\(\s*([\w\d]+)\s*===\s*([\w\d]+)\s*\)\s*\)/g, 'if ($1 !== $2)') // cleanup inverted comparison: if (!(v5 === 0x0A))
    ;
  } while (last !== out)

  return out;
}

module.exports = makeFreezable;
