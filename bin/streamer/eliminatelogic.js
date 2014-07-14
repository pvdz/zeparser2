// special build of Par, adds lots of meta data
var Par = require('./par.js').Par;

function eliminateLogic(data){

  var A = 'A'.charCodeAt(0); // ascii code for A
  var L; // ascii index of current letter (reset per statement, for multiple replacements in one statement)
  var V; // current letter in string

  // last encountered statement start (wont generically work with sub-functions, but suffices in my model)
  var currentStatementStart;
  // each statement that gets transformed only needs one layer of wrapping. enforce this to just once or branching problems can occur.
  var statementWrapped = false;

  // sanity check sweeps only
  function hasLogic(whites, start, stop){
    for (var i = start; i < stop; ++i) {
      var t = whites[i];
      var v = t.value;
      if (v === '&&' || v === '||') return true;
    }
    return false;
  }

  // process body of code (global, function)
  function body(blacks, whites, start, stop){
    for (var i = start; i < stop; ++i) {
      var t = whites[i];

      if (t.isStatementStart) {
        statement(blacks, whites, i, t.stmtEnd.white);
        i = t.stmtEnd.white - 1;
      }

      // func decls arent marked as statements
      if (t.isFunction) {
        body(blacks, whites, t.lhc.white + 1, t.rhc.white);
        i = t.rhc.white;
      }
    }
  }

  // process statement (including substatements, if any)
  function statement(blacks, whites, start, stop){
    var t = currentStatementStart = whites[start];
    statementWrapped = false;

    L = A;
    V = String.fromCharCode(L);

    if (t.isExpressionStart) {
      expression(blacks, whites, start, t.exprStop.white);
      return;
    }

    var ts, te;
    switch (t.value) {
      case '{':
        body(blacks, whites, t.white + 1, t.stmtEnd.white - 1);
        break;

      case 'if':
        ts = blacks[t.black + 2];
        te = blacks[t.black + 1].rhp;
        expression(blacks, whites, ts.white, te.white);

        ts = blacks[te.black + 1];
        te = ts.stmtEnd;
        statement(blacks, whites, ts.white, te.white);

        if (t.elseStartToken) {
          ts = t.elseStartToken;
          te = ts.stmtEnd;
          statement(blacks, whites, ts.white, te.white);
        }

        break;

      //    case 'else': // note: subsumed by the `if`

      case 'while':
        // note: always rewrite this! the makeFreezable step relies on all while's to just be while(true)
        t.before += 'while(true){';

        ts = blacks[t.black + 2];
        te = blacks[t.black + 1].rhp;
        expression(blacks, whites, ts.white, te.white);

        // while (a && b) c;
        // =>
        // while(true){{{{{ var A = a ; } if (A) {A =  b; }}}if (!(A)) break;
        //   c;
        // } }

        t.value = 'if';
        t.lhp.value = '(!(';
        t.rhp.value = ')) break;';
        t.stmtEnd.before += ' }';


        ts = blacks[te.black + 1];
        te = ts.stmtEnd;
        statement(blacks, whites, ts.white, te.white);

        break;

      case 'do':
        ts = blacks[t.black + 1];
        te = ts.stmtEnd;
        statement(blacks, whites, ts.white, te.white);

        // do a; while (b && c);
        // =>
        // do{{
        //   c;
        // }{{{{ var A = a ; } if (A) {A =  b; }}}}}while (A);

        t.after = '{{{' + t.after;

        currentStatementStart = t.whileToken;
        currentStatementStart.stmtEnd = t.whileToken;

        ts = te;
        te = blacks[te.black + 1].rhp;
        expression(blacks, whites, ts.white, te.white);

        t.whileToken.before += '}}}'

        break;

      case 'return':
        ts = blacks[t.black + 1];
        if (ts.isExpressionStart) {
          te = ts.exprStop;
          expression(blacks, whites, ts.white, te.white);
        }

        break;

      case 'var':

        ts = whites[t.white + 1];
        te = whites[t.stmtEnd.white - 1]; // it's probably even - more but that's fine
        expression(blacks, whites, ts.white, te.white);
        break;

      case 'switch': // switches do not contain my target
        // sanity check that it stays this way
        if (hasLogic(whites, t.white, t.stmtEnd.white)) {
          throw 'Assumption fail: Not expecting && or || in a switch';
        }
        break;

      case 'for':
        if (hasLogic(whites, t.white, t.stmtEnd.white)) {
          throw 'Assumption fail: Not expecting && or || in a `for`';
        }
        break;

      case 'try':
      case 'catch':
      case 'finally':
        throw 'Assumption fail: not expecting code to contain these statements';

      //    case 'case': // expression not important for my target
      //    case 'for': // not supported, i dont use it in my target
      //    case 'try': // dito
    }
  }

  // process expression (including subexpressions, if any)
  function expression(blacks, whites, start, stop, openedBefore){
    for (var i = start; i < stop; ++i) {
      var t = whites[i];

      if (t.value === '?') {
        if (hasLogic(whites, currentStatementStart.white, currentStatementStart.stmtEnd.white)) {
          console.log(t);
          throw 'Assumption fail: Not expecting && or || inside ?:';
        }
      } else if (t.isFunction) {
        body(blacks, whites, t.lhc.white + 1, t.rhc.white);
        i = t.rhc.white;
      } else if (t.value === '(') {
        expression(blacks, whites, t.white + 1, t.rhp.white)
      } else if (t.value === '=' || t.value === '+=') {
        // prevent assignments from breaking; `x=y=a||b;` (not super generic)
        start = i + 1;
      } else if (t.value === ',') {
        // argument, subexpression, element

        if (openedBefore) {
          var sub = copyAndErase(whites, start, i);
          currentStatementStart.before += V + ' = ' + sub + '; }}}';
          whites[start].value = V;
        }

        V = String.fromCharCode(++L);
        expression(blacks, whites, i + 1, stop);

        return;
      } else if (t.value === '&&') {
        // slice out start-now, assign to temp var before statement
        // mark it as being open...
        // remember end-var for entire logic expression being moved
        // blank out original
        // continue next expression part

        t.value = '';

        var sub = copyAndErase(whites, start, i);
        if (!openedBefore) {
          if (!statementWrapped) currentStatementStart.before += '{';
          currentStatementStart.before += '{{{ var ' + V + ' ';
          if (!statementWrapped) currentStatementStart.stmtEnd.before = '}' + currentStatementStart.stmtEnd.before;
          statementWrapped = true;
        }
        else currentStatementStart.before += V + ' ';

        currentStatementStart.before += '= ' + sub + '; } if (' + V + ') {';

        expression(blacks, whites, t.white + 1, stop, true);

        return;
      } else if (t.value === '||') {
        t.value = '';

        var sub = copyAndErase(whites, start, i);

        if (!openedBefore) {
          if (!statementWrapped) currentStatementStart.before += '{';
          currentStatementStart.before += '{{{ var ' + V + ' ';
          if (!statementWrapped) currentStatementStart.stmtEnd.before = '}' + currentStatementStart.stmtEnd.before;
          statementWrapped = true;
        }
        else currentStatementStart.before += V + ' ';

        currentStatementStart.before += '= ' + sub + '; }} if (!' + V + ') {{';
        expression(blacks, whites, t.white + 1, stop, true);
        return;
      }
    }

    if (openedBefore) {
      var sub = copyAndErase(whites, start, stop);

      currentStatementStart.before += V + ' = ' + sub + '; }}}';
      whites[start].value = V;
    }
  }

  function copyAndErase(whites, start, stop){
    var sub = '';
    for (var i = start; i < stop; ++i) {
      sub += whites[i].value;
      whites[i].value = '';
    }
    return sub;
  }

  // process entire script
  var par = new Par(data, {saveTokens: true, createBlackStream: true});
  par.run();

  var whites = par.tok.tokens;
  var blacks = par.tok.black;

  body(blacks, whites, 0, whites.length);

  var out = whites.map(function(t){ return t.before + t.value + t.after; }).join('');

  out = out
    .replace(/if \(!\(true\)\) break;/g, '')
    .replace(/\(A\)\)/g, 'A)')

  return out;
}

module.exports = eliminateLogic;
