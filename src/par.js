var Par = function(input){
    this.tok = new Tok(input);
};

Par.prototype = {
  run: function(){
    // prepare
    this.tok.nextExpr();

    // go!
    this.parseStatements(false, false, false, []);
  },

  parseStatements: function(inFunction, inLoop, inSwitch, labelSet){
    // note: statements are optional, this function might not parse anything
    while (!this.tok.isType(EOF) && this.parseStatement(inFunction, inLoop, inSwitch, labelSet, true));
  },
  parseStatement: function(inFunction, inLoop, inSwitch, labelSet, optional){
    if (this.tok.isType(IDENTIFIER)) {
      // dont "just" return true. case and default still return false
      return this.parseIdentifierStatement(inFunction, inLoop, inSwitch, labelSet);
    }

    if (this.tok.isValue()) {
      this.parseExpressionStatement();
      return true;
    }

    var c = this.tok.getLastNum();
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
      this.tok.nextExpr();
      this.parseBlock(inFunction, inLoop, inSwitch, labelSet);
      return true;
    }
    if (c === 0x3b) { // [
      this.tok.nextExpr();
      return true;
    } // empty statement

    if (!optional) throw 'Expected more input...';
    if (this.tok.isType(EOF)) return false;
  },
  parseIdentifierStatement: function(inFunction, inLoop, inSwitch, labelSet){
    var val = this.tok.getLastValue();

    // yes, this makes "huge" difference
    var c = this.tok.getLastNum();

    if (c === 0x76 && val === 'var') this.parseVar();
    else if (c === 0x69 && val === 'if') this.parseIf(inFunction, inLoop, inSwitch, labelSet);
    else if (c === 0x64 && val === 'do') this.parseDo(inFunction, inLoop, inSwitch, labelSet);
    else if (c === 0x77 && val === 'while') this.parseWhile(inFunction, inLoop, inSwitch, labelSet);
    else if (c === 0x66 && val === 'for') this.parseFor(inFunction, inLoop, inSwitch, labelSet);
    else if (c === 0x74 && val === 'throw') this.parseThrow();
    else if (c === 0x73 && val === 'switch') this.parseSwitch(inFunction, inLoop, inSwitch, labelSet);
    else if (c === 0x74 && val === 'try') this.parseTry(inFunction, inLoop, inSwitch, labelSet);
    else if (c === 0x64 && val === 'debugger') this.parseDebugger();
    else if (c === 0x77 && val === 'with') this.parseWith(inFunction, inLoop, inSwitch, labelSet);
    else if (c === 0x66 && val === 'function') this.parseFunction();
    else if (c === 0x63 && val === 'continue') this.parseContinue(inFunction, inLoop, inSwitch, labelSet);
    else if (c === 0x62 && val === 'break') this.parseBreak(inFunction, inLoop, inSwitch, labelSet);
    else if (c === 0x72 && val === 'return') this.parseReturn(inFunction, inLoop, inSwitch);
    // case and default are handled elsewhere
    else if ((c === 0x63 && val === 'case') || (c === 0x64 && val === 'default')) return false;
    else this.parseExpressionOrLabel(inFunction, inLoop, inSwitch, labelSet);

    return true;
  },
  parseStatementHeader: function(){
    this.tok.mustBeNum(0x28, true); // (
    this.parseExpressions();
    this.tok.mustBeNum(0x29, true); // )
  },

  parseVar: function(){
    // var <vars>
    // - foo
    // - foo=bar
    // - ,foo=bar

    this.tok.nextPunc();
    do {
      if (this.isReservedIdentifier()) throw 'var name is reserved';
      this.tok.mustBeIdentifier(true);
      if (this.tok.nextExprIfNum(0x3d)) { // =
        this.parseExpression(false);
      }
    } while(this.tok.nextPuncIfNum(0x2c)); // ,
    this.parseSemi();

    return true;
  },
  parseVarPartNoIn: function(){
    this.tok.nextPunc();
    do {
      if (this.isReservedIdentifier()) throw 'var name is reserved';
      this.tok.mustBeIdentifier(true);
      if (this.tok.nextExprIfNum(0x3d)) { // =
          this.parseExpressionNoIn(true);
      }
    } while(this.tok.nextPuncIfNum(0x2c)); // ,
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

    if (this.tok.getLastValue() === 'else') {
      this.tok.nextExpr();
      this.parseStatement(inFunction, inLoop, inSwitch, labelSet);
    }
  },
  parseDo: function(inFunction, inLoop, inSwitch, labelSet){
    // do <stmt> while ( <exprs> ) ;

    this.tok.nextExpr(); // do
    this.parseStatement(inFunction, true, inSwitch, labelSet);
    this.tok.mustBeString('while', false);
    this.tok.mustBeNum(0x28, true); // (
    this.parseExpressions();
    this.tok.mustBeNum(0x29, false); // ) (no regex following because it's either semi or newline without asi if a forward slash follows it
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

    this.tok.nextPunc(); // for
    this.tok.mustBeNum(0x28, true); // (

    if (this.tok.nextExprIfNum(0x3b)) this.parseForEachHeader(); // ; (means empty first expression in for-each)
    else {
      if (this.tok.isString('var')) this.parseVarPartNoIn();
      else this.parseExpressionsNoIn();

      // 3b = ;
      if (this.tok.nextExprIfNum(0x3b)) this.parseForEachHeader();
      else this.parseForInHeader();
    }

    this.tok.mustBeNum(0x29, true); // )
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

    this.tok.nextPunc(); // token after continue cannot be a regex, either way.

    if (!this.tok.lastNewline && this.tok.isType(IDENTIFIER)) {
      this.parseLabel(labelSet);
    }

    this.parseSemi();
  },
  parseBreak: function(inFunction, inLoop, inSwitch, labelSet){
    // break ;
    // break <idntf> ;
    // break \n <idntf> ;
    // newline right after keyword = asi

    this.tok.nextPunc(); // token after break cannot be a regex, either way.

    var noLabel = this.tok.lastNewline || !this.tok.isType(IDENTIFIER);

    if (noLabel) {
      if (!inLoop && !inSwitch) {
        // break without label
        throw 'Break without value only in loops or switches. '+this.tok.syntaxError();
      }
    } else {
      this.parseLabel(labelSet);
    }

    this.parseSemi();
  },
  parseLabel: function(labelSet){
    // next tag must be an identifier
    var label = this.tok.getLastValue();
    if (labelSet.indexOf(label) >= 0) {
      this.tok.nextExpr(); // label
    } else {
      throw 'Label ['+label+'] not found in label set. '+this.tok.syntaxError();
    }
  },
  parseReturn: function(inFunction, inLoop, inSwitch){
    // return ;
    // return <exprs> ;
    // newline right after keyword = asi

    if (!inFunction) throw 'Can only return in a function '+this.tok.syntaxError('break');

    this.tok.nextExpr();
    if (this.tok.lastNewline) this.addAsi();
    else {
      this.parseOptionalExpressions();
      this.parseSemi();
    }
  },
  parseThrow: function(){
    // throw <exprs> ;

    this.tok.nextExpr();
    if (this.tok.lastNewline) this.addAsi();
    else {
      this.parseExpressions();
      this.parseSemi();
    }
  },
  parseSwitch: function(inFunction, inLoop, inSwitch, labelSet){
    // switch ( <exprs> ) { <switchbody> }

    this.tok.nextPunc();
    this.parseStatementHeader();
    this.tok.mustBeNum(0x7b, true); // {
    this.parseSwitchBody(inFunction, inLoop, true, labelSet);
    this.tok.mustBeNum(0x7d, true); // }
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

    if (this.tok.nextPuncIfString('catch')) {
      this.tok.mustBeNum(0x28, false); // (
      this.tok.mustBeIdentifier(false);
      this.tok.mustBeNum(0x29, false); // )
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

    this.tok.nextPunc(); // 'function'
    if (this.tok.isType(IDENTIFIER)) { // name
      if (this.isReservedIdentifier()) throw 'function name is reserved';
      this.tok.nextPunc();
    }
    this.parseFunctionRemainder(-1);
  },
  parseNamedFunction: function(hasName){
    // function [<idntf>] ( [<param>[,<param>..] ) { <stmts> }

    this.tok.nextPunc(); // 'function'
    this.tok.mustBeIdentifier(false); // name
    this.parseFunctionRemainder(-1);
  },
  /**
   * Parse the function param list and body
   *
   * @param {number} paramCount Number of expected params, -1/undefined means no requirement. used for getters and setters
   */
  parseFunctionRemainder: function(paramCount){
    this.tok.mustBeNum(0x28, false); // (
    this.parseParameters(paramCount);
    this.tok.mustBeNum(0x29, false); // )
    this.parseCompleteBlock(true, false, false, []); // this resets loop and switch status
  },
  parseParameters: function(paramCount){
    // [<idntf> [, <idntf>]]
    if (this.tok.isType(IDENTIFIER)) {
      if (paramCount === 0) throw 'Getters have no parameters';
      if (this.isReservedIdentifier()) throw 'param name is reserved';
      this.tok.nextPunc();
      while (this.tok.nextPuncIfNum(0x2c)) { // ,
        if (paramCount === 1) throw 'Setters have exactly one param';
        this.tok.mustBeIdentifier(false);
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

    // 0x7d=}
    if (this.tok.isType(EOF) || this.tok.isNum(0x7d) || (this.tok.lastNewline && !this.tok.isType(REGEX))) {
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
    if (this.tok.isType(EOF)) throw 'Missing expression (EOF). '+this.tok.syntaxError();
    var pos = this.tok.pos;

    this.parsePrimary(optional, false);

    this.parseAssignments();
    this.parseNonAssignments();

    if (!optional && this.tok.pos === pos && !this.tok.isType(EOF)) throw 'Missing expression. '+this.tok.syntaxError();
    return this.tok.pos !== pos;
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
    this.tok.nextExpr();
    this.parseExpression(false);
    this.tok.mustBeNum(0x3a,true); // :
    this.parseExpression(false);
  },
  parseTernaryNoIn: function(){
    this.tok.nextExpr();
    this.parseExpression(false);
    this.tok.mustBeNum(0x3a,true); // :
    this.parseExpressionNoIn(true);
  },
  parsePrimaryAfter: function(){
    this.tok.nextExpr();
    this.parsePrimary(false, false);
  },
  parseExpressionsNoIn: function(){
    do {
      this.parseExpressionNoIn();
    } while (this.tok.nextExprIfNum(0x2c));
  },
  parseExpressionNoIn: function(canHaveAssignment){
    this.parsePrimary(false, true);

    // TOFIX: i think i should drop first while to fix `illegal bare assignment in for-in`
    //        because `for (x=y in z);` is not valid syntax (`for ((x=y)in z);` would be)
    //        but note that this is used for both var and non-var for-in's, so check for that.

    var parsedAssignment = this.parseAssignments();

    // keep parsing non-assignment binary/ternary ops unless `in`
    while (true) {
      if (this.isBinaryOperator()) {
        if (this.tok.isString('in')) {
          if (parsedAssignment && !canHaveAssignment) throw 'No regular assignments in a for-in lhs...';
          break;
        }
        else this.parsePrimaryAfter();
      }
      else if (this.tok.isNum(0x3f)) this.parseTernaryNoIn();
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

    if (this.tok.isType(IDENTIFIER)) {
      if (this.tok.getLastNum() === 0x66 && this.tok.getLastValue() === 'function') {
        this.parseFunction();
      } else {
        if (this.isReservedNonValueIdentifier()) throw 'Reserved identifier found in expression';
        this.tok.nextPunc();
      }
    } else if (!this.tok.nextPuncIfValue(VALUE)) {
      if (this.tok.nextExprIfNum(0x5b)) this.parseArray();
      else if (this.tok.nextPuncIfNum(0x7b)) this.parseObject();
      else if (this.tok.nextExprIfNum(0x28)) this.parseGroup(noIn);
      else if (!optional) throw 'Missing expression part. '+this.tok.syntaxError();
    }

    this.parsePrimarySuffixes();
  },
  parsePrimaryOrLabel: function(){
    if (this.tok.isType(EOF)) throw 'Missing expression part or label. '+this.tok.syntaxError();
    // parses parts of an expression without any binary operators

    var pos = this.tok.pos;

    // if we parse any unary, we wont have to check for label
    var hasPrefix = this.parseUnary();

    if (this.tok.isType(IDENTIFIER)) {
      if (this.tok.getLastNum() === 0x66 && this.tok.getLastValue() === 'function') {
        this.parseFunction();
      } else {
        if (this.isReservedNonValueIdentifier()) throw 'Reserved identifier found in expression. '+this.tok.syntaxError();
        this.tok.nextPunc();

        // now's the time... you just ticked off an identifier, check the current token for being a colon!
        if (!hasPrefix) {
          // 3a = :
          if (this.tok.isNum(0x3a)) {
            if (this.isValueKeyword()) throw 'Reserved identifier found in label. '+this.tok.syntaxError();
            return true;
          }
        }
      }
    } else if (!this.tok.nextPuncIfValue()) {
      if (this.tok.nextExprIfNum(0x5b)) this.parseArray();
      else if (this.tok.nextPuncIfNum(0x7b)) this.parseObject();
      else if (this.tok.nextExprIfNum(0x28)) this.parseGroup();
      else throw 'Missing expression part. '+this.tok.syntaxError();
    }

    this.parsePrimarySuffixes();

    if (this.tok.pos === pos && !this.tok.isType(EOF)) throw 'Missing expression part. '+this.tok.syntaxError();

    return false;
  },
  parseUnary: function(){
    var parsed = false;
    while (!this.tok.isType(EOF) && this.testUnary()) {
      this.tok.nextExpr();
      parsed = true;
    }
    return parsed; // return bool to determine possibility of label
  },
  testUnary: function(){
    // this method works under the assumption that the current token is
    // part of the set of valid tokens for js. So we don't have to check
    // for string lengths unless we need to disambiguate optional chars

    // regexUnary: /^(?:delete|void|typeof|new|\+\+?|--?|~|!)$/,
    var c = this.tok.getLastNum();

    if (c === 0x6e && this.tok.getLastValue() === 'new') return true;
    if (c === 0x74 && this.tok.getLastValue() === 'typeof') return true;
    if (c === 0x64 && this.tok.getLastValue() === 'delete') return true;
    if (c === 0x2b) {
      if (this.tok.lastStop - this.tok.lastStart === 1) return true; // +
      if (this.tok.getLastValue().charCodeAt(1) === 0x2b) return true; // ++
    }
    if (c === 0x2d) {
      if (this.tok.lastStop - this.tok.lastStart === 1) return true; // -
      if (this.tok.getLastValue().charCodeAt(1) === 0x2d) return true; // --
    }
    if (c === 0x7e || c === 0x21) return true; // ~ !
    if (c === 0x76 && this.tok.getLastValue() === 'void') return true;

    return false;
  },
  parsePrimarySuffixes: function(){
    // --
    // ++
    // .<idntf>
    // [<exprs>]
    // (<exprs>)

    while (true) {
      // need to check for punctuator because it could also be a number...
      if (this.tok.isType(PUNCTUATOR) && this.tok.nextPuncIfNum(0x2e)) { // . (is this double che
        this.tok.mustBeIdentifier(false); // cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      }
      else if (this.tok.nextExprIfNum(0x28)) { // (
        this.parseOptionalExpressions();
        this.tok.mustBeNum(0x29, false); // ) cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      }
      else if (this.tok.nextExprIfNum(0x5b)) { // [
        this.parseExpressions();
        this.tok.mustBeNum(0x5d, false); // ] cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      }
      else if (this.tok.nextPuncIfString('--')) break; // ends primary expressions
      else if (this.tok.nextPuncIfString('++')) break; // ends primary expressions
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

    var len = this.tok.lastStop - this.tok.lastStart;
    var c = this.tok.getLastNum();

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
      ) && this.tok.getLastValue().charCodeAt(1) === 0x3d; // =
    }

    else if (len === 3 && c === 0x3c) {
      var val = this.tok.getLastValue();
      return (val.charCodeAt(1) === 0x3c && val.charCodeAt(2) === 0x3d); // <<=
    }

    else if (c === 0x3e) {
      var val = this.tok.getLastValue();
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

    // if not punctuator, it could still be `in` or `instanceof`. otherwise it's just false :)
    if (!this.tok.isType(PUNCTUATOR)) {
      if (this.tok.isType(IDENTIFIER)) {
        var c = this.tok.getLastNum();
        if (c === 0x69) {
          var val = this.tok.getLastValue();
          return (val === 'in' || val === 'instanceof');
        }

      }
      return false;
    }


    // so we have a valid punctuator token, checking for binary ops is simple now except
    // that we have to make sure it's not a(n compound) assignment!

    var c = this.tok.getLastNum();

    if ((
      c === 0x2b || // +
      c === 0x2a || // *
      c === 0x25 || // %
      c === 0x5e || // ^
      c === 0x2f || // /
      c === 0x2d    // -
    )) {
      // if len is more than 1, it's either a compound assignment (*=, +=, etc) or a unary op (++ --)
      return (this.tok.lastStop - this.tok.lastStart === 1);
    }

    else if (c === 0x3d || c === 0x21) { // = !
      var val = this.tok.getLastValue();
      return (val.charCodeAt(1) === 0x3d && (this.tok.lastStop - this.tok.lastStart === 2 || val.charCodeAt(2) === 0x3d)); // === !==
    }

    else if (c === 0x3c) {
      if (this.tok.lastStop - this.tok.lastStart === 1) return true; // <
      var d = this.tok.getLastValue().charCodeAt(1);
      // the len check prevents <<=
      return ((d === 0x3c && (this.tok.lastStop - this.tok.lastStart === 2)) || d === 0x3d); // << <=
    }

    else if (c === 0x3e) {
      var len = this.tok.lastStop - this.tok.lastStart;
      if (len === 1) return true; // >
      var val = this.tok.getLastValue();
      var d = val.charCodeAt(1);
      // the len checks prevent >>= and >>>=
      return (d === 0x3d || (len === 2 && d === 0x3e) || (len === 3 && val.charCodeAt(2) === 0x3e)); // >= >> >>>
    }

    else if (c === 0x26) {
      return (this.tok.lastStop - this.tok.lastStart === 1 || this.tok.getLastValue().charCodeAt(1) === 0x26); // &&
    }

    else if (c === 0x7c) {
      return (this.tok.lastStop - this.tok.lastStart === 1 || this.tok.getLastValue().charCodeAt(1) === 0x7c); // ||
    }

    return false;
  },

  parseGroup: function(noIn){
    if (noIn) this.parseExpressionNoIn(true);
    else this.parseExpressions();
    this.tok.mustBeNum(0x29, false); // )  cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
  },
  parseArray: function(){
    do {
      this.parseExpression(true); // just one because they are all optional (and arent in expressions)
    } while (this.tok.nextExprIfNum(0x2c)); // elision

    this.tok.mustBeNum(0x5d, false); // ]  cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
  },
  parseObject: function(){
    do {
      if (this.tok.isValue()) this.parsePair();
    } while (this.tok.nextExprIfNum(0x2c)); // elision
    this.tok.mustBeNum(0x7d, false); // }  cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
  },
  parsePair: function(){
    if (this.tok.nextPuncIfString('get')) {
      if (this.tok.nextPuncIfType(IDENTIFIER)) this.parseFunctionRemainder(0);
      else this.parseDataPart();
    } else if (this.tok.nextPuncIfString('set')) {
      if (this.tok.nextPuncIfType(IDENTIFIER)) this.parseFunctionRemainder(1);
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

    // yep, this really makes a difference
    var c = this.tok.getLastNum();

    if (c === 0x62) {
      return this.tok.getLastValue() === 'break';
    } else if (c === 0x63) {
      var identifier = this.tok.getLastValue();
      return (
        identifier === 'case' ||
        identifier === 'catch' ||
        identifier === 'continue' ||
        identifier === 'class' ||
        identifier === 'const'
      );
    } else if (c === 0x64) {
      var identifier = this.tok.getLastValue();
      return (
        identifier === 'do' ||
        identifier === 'debugger' ||
        identifier === 'default' ||
        identifier === 'delete'
      );
    } else if (c === 0x65) {
      var identifier = this.tok.getLastValue();
      return (
        identifier === 'else' ||
        identifier === 'enum' ||
        identifier === 'export' ||
        identifier === 'extends'
      );
    } else if (c === 0x66) {
      var identifier = this.tok.getLastValue();
      return (
        identifier === 'false' ||
        identifier === 'function' ||
        identifier === 'for' ||
        identifier === 'finally'
      );
    } else if (c === 0x69) {
      var identifier = this.tok.getLastValue();
      return (
        identifier === 'instanceof' ||
        identifier === 'in' ||
        identifier === 'if' ||
        identifier === 'import'
      );
    } else if (c === 0x6e) {
      var identifier = this.tok.getLastValue();
      return (
        identifier === 'null' ||
        identifier === 'new'
      );
    } else if (c === 0x72) {
      return this.tok.getLastValue() === 'return';
    } else if (c === 0x73) {
      var identifier = this.tok.getLastValue();
      return (
        identifier === 'switch' ||
        identifier === 'super'
      );
    } else if (c === 0x74) {
      var identifier = this.tok.getLastValue();
      return (
        identifier === 'this' ||
        identifier === 'true' ||
        identifier === 'typeof' ||
        identifier === 'throw' ||
        identifier === 'try'
      );
    } else if (c === 0x76) {
      var identifier = this.tok.getLastValue();
      return (
        identifier === 'var' ||
        identifier === 'void'
      );
    } else if (c === 0x77) {
      var identifier = this.tok.getLastValue();
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

    // yep, this really makes a difference
    var c = this.tok.getLastNum();

    if (c === 0x62) {
      return this.tok.getLastValue() === 'break';
    } else if (c === 0x63) {
      var identifier = this.tok.getLastValue();
      return (
        identifier === 'case' ||
        identifier === 'catch' ||
        identifier === 'continue' ||
        identifier === 'class' ||
        identifier === 'const'
      );
    } else if (c === 0x64) {
      var identifier = this.tok.getLastValue();
      return (
        identifier === 'do' ||
        identifier === 'debugger' ||
        identifier === 'default' ||
        identifier === 'delete'
      );
    } else if (c === 0x65) {
      var identifier = this.tok.getLastValue();
      return (
        identifier === 'else' ||
        identifier === 'enum' ||
        identifier === 'export' ||
        identifier === 'extends'
      );
    } else if (c === 0x66) {
      var identifier = this.tok.getLastValue();
      return (
        identifier === 'for' ||
        identifier === 'finally'
      );
    } else if (c === 0x69) {
      var identifier = this.tok.getLastValue();
      return (
        identifier === 'instanceof' ||
        identifier === 'in' ||
        identifier === 'if' ||
        identifier === 'import'
      );
    } else if (c === 0x6e) {
      return this.tok.getLastValue() === 'new';
    } else if (c === 0x72) {
      return this.tok.getLastValue() === 'return';
    } else if (c === 0x73) {
      var identifier = this.tok.getLastValue();
      return (
        identifier === 'switch' ||
        identifier === 'super'
      );
    } else if (c === 0x74) {
      var identifier = this.tok.getLastValue();
      return (
        identifier === 'typeof' ||
        identifier === 'throw' ||
        identifier === 'try'
      );
    } else if (c === 0x76) {
      var identifier = this.tok.getLastValue();
      return (
        identifier === 'var' ||
        identifier === 'void'
      );
    } else if (c === 0x77) {
      var identifier = this.tok.getLastValue();
      return (
        identifier === 'while' ||
        identifier === 'with'
      );
    }

    return false;
  },
  isValueKeyword: function(){
    // returns true if identifier is a value-holding keyword

    var c = this.tok.getLastNum();
    var identifier;

    return (
      // keywords:
      (c === 0x66 && (
        (identifier = this.tok.getLastValue()) === 'function' ||
        identifier === 'false'
      )) ||
      (c === 0x74 && (
        (identifier = this.tok.getLastValue()) === 'this' ||
        identifier === 'true'
      )) ||
      (c === 0x6e && (identifier = this.tok.getLastValue()) === 'null')
    );
  }
};
