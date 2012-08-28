var Par = function(input){
    this.tok = new Tok(input);
};

Par.prototype = {
  run: function(){
    // prepare
//    if (this.tok.input === '500') debugger
    this.tok.nextExpr();
    // go!
    this.parseStatements(false, false, false, []);
    if (this.tok.pos != this.tok.len) throw 'Did not complete parsing... '+this.tok.syntaxError();
  },

  parseStatements: function(inFunction, inLoop, inSwitch, labelSet){
    // note: statements are optional, this function might not parse anything
    while (!this.tok.isType(EOF) && this.parseStatement(inFunction, inLoop, inSwitch, labelSet, true));
  },
  parseStatement: function(inFunction, inLoop, inSwitch, labelSet, optional){
    var tok = this.tok;
    if (tok.isType(IDENTIFIER)) {
      // dont "just" return true. case and default still return false
      return this.parseIdentifierStatement(inFunction, inLoop, inSwitch, labelSet);
    }

    if (tok.isValue()) {
      this.parseExpressionStatement();
      return true;
    }

    var c = tok.getLastNum();
    if (
      c === 0x28 || // (
      c === 0x5b || // [
      c === 0x7e || // ~
      c === 0x2b || // + (either + or ++)
      c === 0x2d || // - (either - or --)
      c === 0x21    // !
    ) {
      this.parseExpressionStatement();
      return true;
    }

    if (c === 0x7b) { // {
      tok.nextExpr();
      this.parseBlock(inFunction, inLoop, inSwitch, labelSet);
      return true;
    }
    if (c === 0x3b) { // [
      tok.nextExpr();
      return true;
    } // empty statement

    if (!optional) throw 'Expected more input...';
    return false;
  },
  parseIdentifierStatement: function(inFunction, inLoop, inSwitch, labelSet){
    var tok = this.tok;

    // yes, this makes "huge" difference
    var c = this.tok.getLastNum();

    if (c === 0x76 && tok.getLastValue() === 'var') this.parseVar();
    else if (c === 0x69 && tok.getLastValue() === 'if') this.parseIf(inFunction, inLoop, inSwitch, labelSet);
    else if (c === 0x64 && tok.getLastValue() === 'do') this.parseDo(inFunction, inLoop, inSwitch, labelSet);
    else if (c === 0x77 && tok.getLastValue() === 'while') this.parseWhile(inFunction, inLoop, inSwitch, labelSet);
    else if (c === 0x66 && tok.getLastValue() === 'for') this.parseFor(inFunction, inLoop, inSwitch, labelSet);
    else if (c === 0x74 && tok.getLastValue() === 'throw') this.parseThrow();
    else if (c === 0x73 && tok.getLastValue() === 'switch') this.parseSwitch(inFunction, inLoop, inSwitch, labelSet);
    else if (c === 0x74 && tok.getLastValue() === 'try') this.parseTry(inFunction, inLoop, inSwitch, labelSet);
    else if (c === 0x64 && tok.getLastValue() === 'debugger') this.parseDebugger();
    else if (c === 0x77 && tok.getLastValue() === 'with') this.parseWith(inFunction, inLoop, inSwitch, labelSet);
    else if (c === 0x66 && tok.getLastValue() === 'function') this.parseFunction();
    else if (c === 0x63 && tok.getLastValue() === 'continue') this.parseContinue(inFunction, inLoop, inSwitch, labelSet);
    else if (c === 0x62 && tok.getLastValue() === 'break') this.parseBreak(inFunction, inLoop, inSwitch, labelSet);
    else if (c === 0x72 && tok.getLastValue() === 'return') this.parseReturn(inFunction, inLoop, inSwitch);
    // case and default are handled elsewhere
    else if ((c === 0x63 && tok.getLastValue() === 'case') || (c === 0x64 && tok.getLastValue() === 'default')) return false;
    else this.parseExpressionOrLabel(inFunction, inLoop, inSwitch, labelSet);

    return true;
  },
  parseStatementHeader: function(){
    var tok = this.tok;
    tok.mustBeNum(0x28, true); // (
    this.parseExpressions();
    tok.mustBeNum(0x29, true); // )
  },

  parseVar: function(){
    // var <vars>
    // - foo
    // - foo=bar
    // - ,foo=bar

    var tok = this.tok;
    tok.nextPunc();
    do {
      if (this.isReservedIdentifier()) throw 'var name is reserved';
      tok.mustBeIdentifier(true);
      if (tok.nextExprIfNum(0x3d)) { // =
        this.parseExpression(false);
      }
    } while(tok.nextPuncIfNum(0x2c)); // ,
    this.parseSemi();

    return true;
  },
  parseVarPartNoIn: function(){
    var tok = this.tok;
    tok.nextPunc();
    do {
      if (this.isReservedIdentifier()) throw 'var name is reserved';
      tok.mustBeIdentifier(true);
      if (tok.nextExprIfNum(0x3d)) { // =
          this.parseExpressionNoIn(true);
      }
    } while(tok.nextPuncIfNum(0x2c)); // ,
  },
  parseIf: function(inFunction, inLoop, inSwitch, labelSet){
    // if (<exprs>) <stmt>
    // if (<exprs>) <stmt> else <stmt>

    this.tok.nextPunc();
    this.parseStatementHeader();
    this.parseStatement(inFunction, inLoop, inSwitch, labelSet);

    this.parseElse(inFunction, inLoop, inSwitch, labelSet);

    return true;
  },
  parseElse: function(inFunction, inLoop, inSwitch, labelSet){
    // else <stmt>;

    var tok = this.tok;
    if (tok.getLastValue() === 'else') {
      tok.nextExpr();
      this.parseStatement(inFunction, inLoop, inSwitch, labelSet);
    }
  },
  parseDo: function(inFunction, inLoop, inSwitch, labelSet){
    // do <stmt> while ( <exprs> ) ;

    var tok = this.tok;
    tok.nextExpr(); // do
    this.parseStatement(inFunction, true, inSwitch, labelSet);
    tok.mustBeString('while', false);
    tok.mustBeNum(0x28, true); // (
    this.parseExpressions();
    tok.mustBeNum(0x29, false); // ) (no regex following because it's either semi or newline without asi if a forward slash follows it
    this.parseSemi();
  },
  parseWhile: function(inFunction, inLoop, inSwitch, labelSet){
    // while ( <exprs> ) <stmt>

    this.tok.nextPunc();
    this.parseStatementHeader();
    this.parseStatement(inFunction, true, inSwitch, labelSet);
  },
  parseFor: function(inFunction, inLoop, inSwitch, labelSet){
    // for ( <expr-no-in-=> in <exprs> ) <stmt>
    // for ( var <idntf> in <exprs> ) <stmt>
    // for ( var <idntf> = <exprs> in <exprs> ) <stmt>
    // for ( <expr-no-in> ; <expr> ; <expr> ) <stmt>

    // need to excavate this... investigate specific edge cases for `for-in`

    var tok = this.tok;
    tok.nextPunc(); // for
    tok.mustBeNum(0x28, true); // (

    if (tok.nextExprIfNum(0x3b)) this.parseForEachHeader(); // ; (means empty first expression in for-each)
    else {
      if (tok.isString('var')) this.parseVarPartNoIn();
      else this.parseExpressionsNoIn();

      // 3b = ;
      if (tok.nextExprIfNum(0x3b)) this.parseForEachHeader();
      else this.parseForInHeader();
    }

    tok.mustBeNum(0x29, true); // )
    this.parseStatement(inFunction, true, inSwitch, labelSet);
  },
  parseForEachHeader: function(){
    // <expr> ; <expr> ) <stmt>

    this.parseOptionalExpressions();
    this.tok.mustBeNum(0x3b, true); // ;
    this.parseOptionalExpressions();
  },
  parseForInHeader: function(){
    // in <exprs> ) <stmt>

    this.tok.mustBeString('in', true);
    this.parseExpressions();
  },
  parseContinue: function(inFunction, inLoop, inSwitch, labelSet){
    // continue ;
    // continue <idntf> ;
    // newline right after keyword = asi

    if (!inLoop) throw 'Can only continue in a loop. '+this.tok.syntaxError();

    var tok = this.tok;
    tok.nextPunc(); // token after continue cannot be a regex, either way.

    if (!tok.lastNewline && tok.isType(IDENTIFIER)) {
      this.parseLabel(labelSet);
    }

    this.parseSemi();
  },
  parseBreak: function(inFunction, inLoop, inSwitch, labelSet){
    // break ;
    // break <idntf> ;
    // break \n <idntf> ;
    // newline right after keyword = asi

    var tok = this.tok;
    tok.nextPunc(); // token after break cannot be a regex, either way.

    var noLabel = tok.lastNewline || !tok.isType(IDENTIFIER);

    if (noLabel) {
      if (!inLoop && !inSwitch) {
        // break without label
        throw 'Break without value only in loops or switches. '+tok.syntaxError();
      }
    } else {
      this.parseLabel(labelSet);
    }

    this.parseSemi();
  },
  parseLabel: function(labelSet){
    var tok = this.tok;
    // next tag must be an identifier
    var label = tok.getLastValue();
    if (labelSet.indexOf(label) >= 0) {
      tok.nextExpr(); // label
    } else {
      throw 'Label ['+label+'] not found in label set. '+tok.syntaxError();
    }
  },
  parseReturn: function(inFunction, inLoop, inSwitch){
    // return ;
    // return <exprs> ;
    // newline right after keyword = asi

    if (!inFunction) throw 'Can only return in a function '+this.tok.syntaxError('break');

    var tok = this.tok;
    tok.nextExpr();
    if (tok.lastNewline) this.addAsi();
    else {
      this.parseOptionalExpressions();
      this.parseSemi();
    }
  },
  parseThrow: function(){
    // throw <exprs> ;

    var tok = this.tok;
    tok.nextExpr();
    if (tok.lastNewline) this.addAsi();
    else {
      this.parseExpressions();
      this.parseSemi();
    }
  },
  parseSwitch: function(inFunction, inLoop, inSwitch, labelSet){
    // switch ( <exprs> ) { <switchbody> }

    var tok = this.tok;
    tok.nextPunc();
    this.parseStatementHeader();
    tok.mustBeNum(0x7b, true); // {
    this.parseSwitchBody(inFunction, inLoop, true, labelSet);
    tok.mustBeNum(0x7d, true); // }
  },
  parseSwitchBody: function(inFunction, inLoop, inSwitch, labelSet){
    // [<cases>] [<default>] [<cases>]

    // default can go anywhere...
    this.parseCases(inFunction, inLoop, inSwitch, labelSet);
    if (this.tok.nextPuncIfString('default')) {
      this.parseDefault(inFunction, inLoop, inSwitch, labelSet);
      this.parseCases(inFunction, inLoop, inSwitch, labelSet);
    }
  },
  parseCases: function(inFunction, inLoop, inSwitch, labelSet){
    while (this.tok.nextPuncIfString('case')) {
      this.parseCase(inFunction, inLoop, inSwitch, labelSet);
    }
  },
  parseCase: function(inFunction, inLoop, inSwitch, labelSet){
    // case <value> : <stmts-no-case-default>
    this.parseExpressions();
    this.tok.mustBeNum(0x3a,true); // :
    this.parseStatements(inFunction, inLoop, inSwitch, labelSet);
  },
  parseDefault: function(inFunction, inLoop, inSwitch, labelSet){
    // default <value> : <stmts-no-case-default>
    this.tok.mustBeNum(0x3a,true); // :
    this.parseStatements(inFunction, inLoop, inSwitch, labelSet);
  },
  parseTry: function(inFunction, inLoop, inSwitch, labelSet){
    // try { <stmts> } catch ( <idntf> ) { <stmts> }
    // try { <stmts> } finally { <stmts> }
    // try { <stmts> } catch ( <idntf> ) { <stmts> } finally { <stmts> }

    this.tok.nextPunc();
    this.parseCompleteBlock(inFunction, inLoop, inSwitch, labelSet);

    var one = this.parseCatch(inFunction, inLoop, inSwitch, labelSet);
    var two = this.parseFinally(inFunction, inLoop, inSwitch, labelSet);

    if (!one && !two) throw 'Try must have at least a catch or finally block or both: '+this.tok.debug();
  },
  parseCatch: function(inFunction, inLoop, inSwitch, labelSet){
    // catch ( <idntf> ) { <stmts> }

    var tok = this.tok;
    if (tok.nextPuncIfString('catch')) {
      tok.mustBeNum(0x28, false); // (
      tok.mustBeIdentifier(false);
      tok.mustBeNum(0x29, false); // )
      this.parseCompleteBlock(inFunction, inLoop, inSwitch, labelSet);

      return true;
    }
    return false;
  },
  parseFinally: function(inFunction, inLoop, inSwitch, labelSet){
    // finally { <stmts> }

    if (this.tok.nextPuncIfString('finally')) {
      this.parseCompleteBlock(inFunction, inLoop, inSwitch, labelSet);

      return true;
    }
    return false;
  },
  parseDebugger: function(){
    // debugger ;

    this.tok.nextPunc();
    this.parseSemi();
  },
  parseWith: function(inFunction, inLoop, inSwitch, labelSet){
    // with ( <exprs> ) <stmts>

    this.tok.nextPunc();
    this.parseStatementHeader();
    this.parseStatement(inFunction, inLoop, inSwitch, labelSet);
  },
  parseFunction: function(){
    // function [<idntf>] ( [<param>[,<param>..] ) { <stmts> }

    var tok = this.tok;
    tok.nextPunc(); // 'function'
    if (tok.isType(IDENTIFIER)) { // name
      if (this.isReservedIdentifier()) throw 'function name is reserved';
      tok.nextPunc();
    }
    this.parseFunctionRemainder(-1);
  },
  parseNamedFunction: function(hasName){
    // function [<idntf>] ( [<param>[,<param>..] ) { <stmts> }

    var tok = this.tok;
    tok.nextPunc(); // 'function'
    tok.mustBeIdentifier(false); // name
    this.parseFunctionRemainder(-1);
  },
  /**
   * Parse the function param list and body
   *
   * @param {number} paramCount Number of expected params, -1/undefined means no requirement. used for getters and setters
   */
  parseFunctionRemainder: function(paramCount){
    var tok = this.tok;
    tok.mustBeNum(0x28, false); // (
    this.parseParameters(paramCount);
    tok.mustBeNum(0x29, false); // )
    this.parseCompleteBlock(true, false, false, []); // this resets loop and switch status
  },
  parseParameters: function(paramCount){
    // [<idntf> [, <idntf>]]
    var tok = this.tok;
    if (tok.isType(IDENTIFIER)) {
      if (paramCount === 0) throw 'Getters have no parameters';
      if (this.isReservedIdentifier()) throw 'param name is reserved';
      tok.nextPunc();
      while (tok.nextPuncIfNum(0x2c)) { // ,
        if (paramCount === 1) throw 'Setters have exactly one param';
        tok.mustBeIdentifier(false);
      }
    } else if (paramCount === 1) {
      throw 'Setters have exactly one param';
    }
  },
  parseBlock: function(inFunction, inLoop, inSwitch, labelSet){
    this.parseStatements(inFunction, inLoop, inSwitch, labelSet);
    this.tok.mustBeNum(0x7d, true); // }
    return true; // why again?
  },
  parseCompleteBlock: function(inFunction, inLoop, inSwitch, labelSet){
    this.tok.mustBeNum(0x7b, true); // {
    this.parseBlock(inFunction, inLoop, inSwitch, labelSet);
  },
  parseSemi: function(){
    if (this.tok.nextExprIfNum(0x3b)) return PUNCTUATOR; // ;
    if (this.parseAsi()) return ASI;
    throw 'Unable to parse semi, unable to apply ASI. '+this.tok.syntaxError();
  },
  parseAsi: function(){
    // asi at EOF, if next token is } or if there is a newline between prev and next (black) token
    // asi prevented if asi would be empty statement, no asi in for-header, no asi if next token is regex

    var tok = this.tok;
    // 0x7d=}
    if (tok.isNum(0x7d) || (tok.lastNewline && !tok.isType(REGEX) || tok.isType(EOF))) {
      return this.addAsi();
    }
    return false;
  },
  addAsi: function(){
    ++this.tok.tokenCount;
    return ASI;
  },

  parseExpressionStatement: function(){
    this.parseExpressions();
    this.parseSemi();

    return true;
  },
  parseExpressionOrLabel: function(inFunction, inLoop, inSwitch, labelSet){
    var found = this.parseExpressionForLabel(inFunction, inLoop, inSwitch, labelSet);
    if (!found) {
      if (this.tok.nextExprIfNum(0x2c)) this.parseExpressions();
      this.parseSemi();
    }
  },
  parseExpressionForLabel: function(inFunction, inLoop, inSwitch, labelSet){
    // dont check for label if you can already see it'll fail
    var checkLabel = this.tok.isType(IDENTIFIER);
    if (checkLabel) {
      var labelName = this.tok.getLastValue();

      // ugly but mandatory label check
      // if this is a label, the parsePrimary parser
      // will have bailed when seeing the colon.
      if (this.parsePrimaryOrLabel() && this.tok.nextPuncIfNum(0x3a)) { // :
        labelSet.push(labelName);
        this.parseStatement(inFunction, inLoop, inSwitch, labelSet);
        labelSet.pop();
        return true;
      }
    } else {
      // parse a value and then just random stuff
      this.parsePrimary(false, false);
      this.parseNonAssignments();
    }

    this.parseAssignments();
    this.parseNonAssignments();
    return false;
  },
  parseOptionalExpressions: function(){
    if (this.parseExpression(true)) {
      while (this.tok.nextExprIfNum(0x2c)) { // ,
        this.parseExpression(false);
      }
    }
  },
  parseExpressions: function(){
    if (this.parseExpression(false)) {
      while (this.tok.nextExprIfNum(0x2c)) { // ,
        this.parseExpression(false);
      }
    }
  },
  parseExpression: function(optional){
    var tok = this.tok;
    if (tok.isType(EOF)) throw 'Missing expression (EOF). '+tok.syntaxError();
    var pos = tok.pos;

    this.parsePrimary(optional, false);

    this.parseAssignments();
    this.parseNonAssignments();

    if (!optional && tok.pos === pos && !tok.isType(EOF)) throw 'Missing expression. '+tok.syntaxError();
    return tok.pos !== pos;
  },
  parseAssignments: function(){
    var parsed = false;
    // assignment ops are allowed until the first non-assignment binary op
    while (this.isAssignmentOperator()) {
      this.parsePrimaryAfter();
      parsed = true;
    }
    return parsed; // for for-in header checks
  },
  parseNonAssignments: function(){
    // keep parsing non-assignment binary/ternary ops
    while (true) {
      if (this.isBinaryOperator()) this.parsePrimaryAfter();
      else if (this.tok.isNum(0x3f)) this.parseTernary(); // ?
      else break;
    }
  },
  parseTernary: function(){
    var tok = this.tok;
    tok.nextExpr();
    this.parseExpression(false);
    tok.mustBeNum(0x3a,true); // :
    this.parseExpression(false);
  },
  parseTernaryNoIn: function(){
    var tok = this.tok;
    tok.nextExpr();
    this.parseExpression(false);
    tok.mustBeNum(0x3a,true); // :
    this.parseExpressionNoIn(true);
  },
  parsePrimaryAfter: function(){
    this.tok.nextExpr();
    this.parsePrimary(false, false);
  },
  parseExpressionsNoIn: function(){
    var tok = this.tok;
    do {
      this.parseExpressionNoIn();
    } while (tok.nextExprIfNum(0x2c));
  },
  parseExpressionNoIn: function(canHaveAssignment){
    this.parsePrimary(false, true);

    // TOFIX: i think i should drop first while to fix `illegal bare assignment in for-in`
    //        because `for (x=y in z);` is not valid syntax (`for ((x=y)in z);` would be)
    //        but note that this is used for both var and non-var for-in's, so check for that.

    var parsedAssignment = this.parseAssignments();

    var tok = this.tok;
    // keep parsing non-assignment binary/ternary ops unless `in`
    while (true) {
      if (this.isBinaryOperator()) {
        // TOFIX: check the `n` as a number too...
        // rationale for checking number; this is the `in` check which will succeed
        // about 50% of the time (stats from 8mb of various js). the other time it
        // will check for a primary. it's therefore more likely that an isnum will
        // save time because it would cache the charCodeAt for the other token if
        // it failed the check
        if (tok.isNum(0x69) && tok.isString('in')) {
          if (parsedAssignment && !canHaveAssignment) throw 'No regular assignments in a for-in lhs...';
          break;
        } else {
          this.parsePrimaryAfter();
        }
      }
      else if (tok.isNum(0x3f)) this.parseTernaryNoIn(); // ?
      else break;
    }
  },
  /**
   * Parse the "primary" expression value. This is like the root
   * value for any expression. Could be a number, string,
   * identifier, etc. The primary can have a prefix (like unary
   * operators) and suffixes (++, --) but they are parsed elsewhere.
   *
   * @param {boolean} optional=false Whether the primary might be absent (for optional expressions)
   * @param {boolean} noIn=false Whether the `in` operator may be parsed (for-in header lhs)
   */
  parsePrimary: function(optional, noIn){
    // parses parts of an expression without any binary operators

    this.parseUnary();
    var tok = this.tok;
    if (tok.isType(IDENTIFIER)) {
      if (tok.isNum(0x66) && tok.getLastValue() === 'function') {
        this.parseFunction();
      } else {
        if (this.isReservedNonValueIdentifier()) throw 'Reserved identifier found in expression';
        tok.nextPunc();
      }
    } else if (!tok.nextPuncIfValue(VALUE)) {
      // group is most likely, then object, then array, hardly never an error
      if (tok.nextExprIfNum(0x28)) this.parseGroup(noIn);
      else if (tok.nextPuncIfNum(0x7b)) this.parseObject();
      else if (tok.nextExprIfNum(0x5b)) this.parseArray();
      else if (!optional) throw 'Missing expression part. '+tok.syntaxError();
    }

    this.parsePrimarySuffixes();
  },
  parsePrimaryOrLabel: function(){
    var tok = this.tok;
    if (tok.isType(EOF)) throw 'Missing expression part or label. '+tok.syntaxError();
    // parses parts of an expression without any binary operators

    var pos = tok.pos;

    // if we parse any unary, we wont have to check for label
    var hasPrefix = this.parseUnary();

    if (tok.isType(IDENTIFIER)) {
      if (tok.isNum(0x66) && tok.getLastValue() === 'function') {
        this.parseFunction();
      } else {
        if (this.isReservedNonValueIdentifier()) throw 'Reserved identifier found in expression. '+tok.syntaxError();
        tok.nextPunc();

        // now's the time... you just ticked off an identifier, check the current token for being a colon!
        if (!hasPrefix) {
          // 3a = :
          if (tok.isNum(0x3a)) {
            if (this.isValueKeyword()) throw 'Reserved identifier found in label. '+tok.syntaxError();
            return true;
          }
        }
      }
    } else if (!tok.nextPuncIfValue()) {
      if (tok.nextExprIfNum(0x5b)) this.parseArray();
      else if (tok.nextPuncIfNum(0x7b)) this.parseObject();
      else if (tok.nextExprIfNum(0x28)) this.parseGroup();
      else throw 'Missing expression part. '+tok.syntaxError();
    }

    this.parsePrimarySuffixes();

    if (tok.pos === pos && !tok.isType(EOF)) throw 'Missing expression part. '+tok.syntaxError();

    return false;
  },
  parseUnary: function(){
    var parsed = false;
    var tok = this.tok;
    while (!tok.isType(EOF) && this.testUnary()) {
      tok.nextExpr();
      parsed = true;
    }
    return parsed; // return bool to determine possibility of label
  },
  testUnary: function(){
    // this method works under the assumption that the current token is
    // part of the set of valid tokens for js. So we don't have to check
    // for string lengths unless we need to disambiguate optional chars

    // regexUnary: /^(?:delete|void|typeof|new|\+\+?|--?|~|!)$/,
    var tok = this.tok;
    var c = tok.getLastNum();

    if (c === 0x6e && tok.getLastValue() === 'new') return true;
    if (c === 0x74 && tok.getLastValue() === 'typeof') return true;
    if (c === 0x64 && tok.getLastValue() === 'delete') return true;
    if (c === 0x2b) {
      if (tok.lastStop - tok.lastStart === 1) return true; // +
      if (tok.getLastValue().charCodeAt(1) === 0x2b) return true; // ++
    }
    if (c === 0x2d) {
      if (tok.lastStop - tok.lastStart === 1) return true; // -
      if (tok.getLastValue().charCodeAt(1) === 0x2d) return true; // --
    }
    if (c === 0x7e || c === 0x21) return true; // ~ !
    if (c === 0x76 && tok.getLastValue() === 'void') return true;

    return false;
  },
  parsePrimarySuffixes: function(){
    // --
    // ++
    // .<idntf>
    // [<exprs>]
    // (<exprs>)

    var tok = this.tok;
    while (true) {
      // need to check for punctuator because it could also be a number...
      if (tok.isType(PUNCTUATOR) && tok.nextPuncIfNum(0x2e)) { // .
        tok.mustBeIdentifier(false); // cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      }
      else if (tok.nextExprIfNum(0x28)) { // (
        this.parseOptionalExpressions();
        tok.mustBeNum(0x29, false); // ) cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      }
      else if (tok.nextExprIfNum(0x5b)) { // [
        this.parseExpressions();
        tok.mustBeNum(0x5d, false); // ] cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      }
      else if (tok.nextPuncIfString('--')) break; // ends primary expressions
      else if (tok.nextPuncIfString('++')) break; // ends primary expressions
      else break;
    }
  },
  isAssignmentOperator: function(){
    // includes any "compound" operators
    // used to be: /^(?:[+*%&|^\/-]|<<|>>>?)?=$/
    // return (this.regexAssignmentOp.test(val));

    // this method works under the assumption that the current token is
    // part of the set of valid tokens for js. So we don't have to check
    // for string lengths unless we need to disambiguate optional chars

    var tok = this.tok;
    var len = tok.lastStop - tok.lastStart;
    var c = tok.getLastNum();

    if (len === 1) return c === 0x3d; // =

    else if (len === 2) {
      return (
        c === 0x2b || // +
        c === 0x2a || // *
        c === 0x25 || // %
        c === 0x26 || // &
        c === 0x7c || // |
        c === 0x5e || // ^
        c === 0x2f || // /
        c === 0x2d    // -
      ) && tok.getLastValue().charCodeAt(1) === 0x3d; // =
    }

    else if (len === 3 && c === 0x3c) {
      var val = tok.getLastValue();
      return (val.charCodeAt(1) === 0x3c && val.charCodeAt(2) === 0x3d); // <<=
    }

    else if (c === 0x3e) {
      var val = tok.getLastValue();
      return ((val.charCodeAt(1) === 0x3e) && (
         (len === 4 && val.charCodeAt(2) === 0x3e && val.charCodeAt(3) === 0x3d) || // >>>=
         (len === 3 && val.charCodeAt(2) === 0x3d) // >>=
      ));
    }

    return false;
  },
  isBinaryOperator: function(){
    // non-assignment binary operator
    // /^(?:[+*%|^&\/-]|[=!]==?|<=|>=|<<?|>>?>?|&&|instanceof|in|\|\|)$/,
    //return (this.regexNonAssignBinaryOp.test(val));

    // this method works under the assumption that the current token is
    // part of the set of valid tokens for js. So we don't have to check
    // for string lengths unless we need to disambiguate optional chars

    var tok = this.tok;
    // if not punctuator, it could still be `in` or `instanceof`. otherwise it's just false :)
    if (!tok.isType(PUNCTUATOR)) {
      if (tok.isType(IDENTIFIER)) {
        if (tok.isNum(0x69)) {
          var val = tok.getLastValue();
          return (val === 'in' || val === 'instanceof');
        }
      }
      return false;
    }

    // so we have a valid punctuator token, checking for binary ops is simple now except
    // that we have to make sure it's not a(n compound) assignment!

    var c = tok.getLastNum();

    if ((
      c === 0x2b || // +
      c === 0x2a || // *
      c === 0x25 || // %
      c === 0x5e || // ^
      c === 0x2f || // /
      c === 0x2d    // -
    )) {
      // if len is more than 1, it's either a compound assignment (*=, +=, etc) or a unary op (++ --)
      return (tok.lastStop - tok.lastStart === 1);
    }

    else if (c === 0x3d || c === 0x21) { // = !
      var val = tok.getLastValue();
      return (val.charCodeAt(1) === 0x3d && (tok.lastStop - tok.lastStart === 2 || val.charCodeAt(2) === 0x3d)); // === !==
    }

    else if (c === 0x3c) {
      if (tok.lastStop - tok.lastStart === 1) return true; // <
      var d = tok.getLastValue().charCodeAt(1);
      // the len check prevents <<=
      return ((d === 0x3c && (tok.lastStop - tok.lastStart === 2)) || d === 0x3d); // << <=
    }

    else if (c === 0x3e) {
      var len = tok.lastStop - tok.lastStart;
      if (len === 1) return true; // >
      var val = tok.getLastValue();
      var d = val.charCodeAt(1);
      // the len checks prevent >>= and >>>=
      return (d === 0x3d || (len === 2 && d === 0x3e) || (len === 3 && val.charCodeAt(2) === 0x3e)); // >= >> >>>
    }

    else if (c === 0x26) {
      return (tok.lastStop - tok.lastStart === 1 || tok.getLastValue().charCodeAt(1) === 0x26); // &&
    }

    else if (c === 0x7c) {
      return (tok.lastStop - tok.lastStart === 1 || tok.getLastValue().charCodeAt(1) === 0x7c); // ||
    }

    return false;
  },

  parseGroup: function(noIn){
    if (noIn) this.parseExpressionNoIn(true);
    else this.parseExpressions();
    this.tok.mustBeNum(0x29, false); // )  cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
  },
  parseArray: function(){
    var tok = this.tok;
    do {
      this.parseExpression(true); // just one because they are all optional (and arent in expressions)
    } while (tok.nextExprIfNum(0x2c)); // elision

    tok.mustBeNum(0x5d, false); // ]  cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
  },
  parseObject: function(){
    var tok = this.tok;
    do {
      if (tok.isValue()) this.parsePair();
    } while (tok.nextExprIfNum(0x2c)); // elision
    tok.mustBeNum(0x7d, false); // }  cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
  },
  parsePair: function(){
    var tok = this.tok;
    if (tok.nextPuncIfString('get')) {
      if (tok.nextPuncIfType(IDENTIFIER)) this.parseFunctionRemainder(0);
      else this.parseDataPart();
    } else if (tok.nextPuncIfString('set')) {
      if (tok.nextPuncIfType(IDENTIFIER)) this.parseFunctionRemainder(1);
      else this.parseDataPart();
    } else {
      this.parseData();
    }
  },
  parseData: function(){
    this.tok.nextPunc();
    this.parseDataPart();
  },
  parseDataPart: function(){
    this.tok.mustBeNum(0x3a, true); // :
    this.parseExpression(false);
  },

  isReservedIdentifier: function(){
    // note that this function will return false most of the time
    // if it returns true, a syntax error will probably be thrown

    var tok = this.tok;
    // yep, this really makes a difference
    var c = tok.getLastNum();

    if (c === 0x62) {
      return tok.getLastValue() === 'break';
    } else if (c === 0x63) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'case' ||
        identifier === 'catch' ||
        identifier === 'continue' ||
        identifier === 'class' ||
        identifier === 'const'
      );
    } else if (c === 0x64) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'do' ||
        identifier === 'debugger' ||
        identifier === 'default' ||
        identifier === 'delete'
      );
    } else if (c === 0x65) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'else' ||
        identifier === 'enum' ||
        identifier === 'export' ||
        identifier === 'extends'
      );
    } else if (c === 0x66) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'false' ||
        identifier === 'function' ||
        identifier === 'for' ||
        identifier === 'finally'
      );
    } else if (c === 0x69) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'instanceof' ||
        identifier === 'in' ||
        identifier === 'if' ||
        identifier === 'import'
      );
    } else if (c === 0x6e) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'null' ||
        identifier === 'new'
      );
    } else if (c === 0x72) {
      return tok.getLastValue() === 'return';
    } else if (c === 0x73) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'switch' ||
        identifier === 'super'
      );
    } else if (c === 0x74) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'this' ||
        identifier === 'true' ||
        identifier === 'typeof' ||
        identifier === 'throw' ||
        identifier === 'try'
      );
    } else if (c === 0x76) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'var' ||
        identifier === 'void'
      );
    } else if (c === 0x77) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'while' ||
        identifier === 'with'
      );
    }

    return false;
  },
  isReservedNonValueIdentifier: function(){
    // note that this function will return false most of the time
    // if it returns true, a syntax error will probably be thrown

    var tok = this.tok;
    // yep, this really makes a difference
    var c = tok.getLastNum();

    if (c === 0x62) {
      return tok.getLastValue() === 'break';
    } else if (c === 0x63) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'case' ||
        identifier === 'catch' ||
        identifier === 'continue' ||
        identifier === 'class' ||
        identifier === 'const'
      );
    } else if (c === 0x64) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'do' ||
        identifier === 'debugger' ||
        identifier === 'default' ||
        identifier === 'delete'
      );
    } else if (c === 0x65) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'else' ||
        identifier === 'enum' ||
        identifier === 'export' ||
        identifier === 'extends'
      );
    } else if (c === 0x66) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'for' ||
        identifier === 'finally'
      );
    } else if (c === 0x69) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'instanceof' ||
        identifier === 'in' ||
        identifier === 'if' ||
        identifier === 'import'
      );
    } else if (c === 0x6e) {
      return tok.getLastValue() === 'new';
    } else if (c === 0x72) {
      return tok.getLastValue() === 'return';
    } else if (c === 0x73) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'switch' ||
        identifier === 'super'
      );
    } else if (c === 0x74) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'typeof' ||
        identifier === 'throw' ||
        identifier === 'try'
      );
    } else if (c === 0x76) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'var' ||
        identifier === 'void'
      );
    } else if (c === 0x77) {
      var identifier = tok.getLastValue();
      return (
        identifier === 'while' ||
        identifier === 'with'
      );
    }

    return false;
  },
  isValueKeyword: function(){
    // returns true if identifier is a value-holding keyword

    var tok = this.tok;
    var c = tok.getLastNum();
    var identifier;

    return (
      // keywords:
      (c === 0x66 && (
        (identifier = tok.getLastValue()) === 'function' ||
        identifier === 'false'
      )) ||
      (c === 0x74 && (
        (identifier = tok.getLastValue()) === 'this' ||
        identifier === 'true'
      )) ||
      (c === 0x6e && (identifier = tok.getLastValue()) === 'null')
    );
  }
};
