(function(exports){
  var Tok = exports.Tok || require(__dirname+'/tok.js').Tok;

  // indices match slots of the start-regexes (where applicable)
  // this order is determined by regex/parser rules so they are fixed
  var WHITE_SPACE = 1;
  var LINETERMINATOR = 2;
  var COMMENT_SINGLE = 3;
  var COMMENT_MULTI = 4;
  var STRING = 10;
  var STRING_SINGLE = 5;
  var STRING_DOUBLE = 6;
  var NUMBER = 7;
  var NUMERIC_DEC = 11;
  var NUMERIC_HEX = 12;
  var REGEX = 8;
  var PUNCTUATOR = 9;
  var IDENTIFIER = 13;
  var EOF = 14;
  var ASI = 15;
  var ERROR = 16;
  var WHITE = 18; // WHITE_SPACE, LINETERMINATOR COMMENT_SINGLE COMMENT_MULTI

  // extra assignment and for-in checks
  var NOPARSE = 0;
  var NONASSIGNEE = 1; // invalid lhs for assignments
  var NONFORIN = 2; // comma, assignment, non-assignee
  var ASSIGNEE = 4;
  var NEITHER = NONASSIGNEE | NONFORIN;

  var Par = exports.Par = function(input, options){
    this.options = options || {};
    this.tok = new Tok(input, this.options);
  };


  Par.parse = function(input, options){
    var par = new Par(input, options);
    par.run();
    return par;
  };

  Par.prototype = {
    /**
     * This object is shared with Tok.
     *
     * @property {Object} options
     * @property {boolean} [options.functionMode] In function mode, `return` is allowed in global space
//     * @property {boolean} [options.scriptMode] (TODO, #12)
     * @property {boolean} [options.regexNoClassEscape] Don't interpret backslash in regex class as escape
     */
    options: null,

    run: function(){
      // prepare
      this.tok.nextExpr();
      // go!
      this.parseStatements(false, false, false, []);
      if (this.tok.pos != this.tok.len) throw 'Did not complete parsing... '+this.tok.syntaxError();

      return this;
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

      var c = tok.getLastNum();

      if (c === 0x7b) { // {
        tok.nextExpr();
        this.parseBlock(true, inFunction, inLoop, inSwitch, labelSet);
        return true;
      }

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

      if (c === 0x3b) { // ; // empty statement
        // this shouldnt occur very often, but they still do.
        tok.nextExpr();
        return true;
      }

      if (tok.isValue()) {
        this.parseExpressionStatement();
        return true;
      }

      if (!optional) throw 'Expected more input...';
      return false;
    },
    parseIdentifierStatement: function(inFunction, inLoop, inSwitch, labelSet){
      var tok = this.tok;

      // yes, this makes "huge" difference
      var len = tok.lastLen;

      if (len < 2 || len > 8) this.parseExpressionOrLabel(inFunction, inLoop, inSwitch, labelSet);
      else { // bcdfirstvw
        var c = tok.getLastNum();
  //      if (c > 0x66 && c < 0x72 && c != 0x69) this.parseExpressionOrLabel(inFunction, inLoop, inSwitch, labelSet); // i dunno if this is a good idea
        if (c === 0x69 && len === 2 && tok.getLastNum2() === 0x66) this.parseIf(inFunction, inLoop, inSwitch, labelSet);
        else if (c === 0x76 && tok.getLastValue() === 'var') this.parseVar();
        else if (c === 0x72 && tok.getLastValue() === 'return') this.parseReturn(inFunction, inLoop, inSwitch);
        else if (c === 0x66 && tok.getLastValue() === 'function') this.parseFunction(true);
        else if (c === 0x66 && tok.getLastValue() === 'for') this.parseFor(inFunction, inLoop, inSwitch, labelSet);
        // case and default are handled elsewhere
        else if ((c === 0x63 && tok.getLastValue() === 'case') || (c === 0x64 && tok.getLastValue() === 'default')) return false;
        else if (c === 0x62 && tok.getLastValue() === 'break') this.parseBreak(inFunction, inLoop, inSwitch, labelSet);
        else if (c === 0x77 && tok.getLastValue() === 'while') this.parseWhile(inFunction, inLoop, inSwitch, labelSet);
        else if (c === 0x64 && len === 2 && tok.getLastNum2() === 0x6f) this.parseDo(inFunction, inLoop, inSwitch, labelSet);
        else if (c === 0x74 && tok.getLastValue() === 'throw') this.parseThrow();
        else if (c === 0x73 && tok.getLastValue() === 'switch') this.parseSwitch(inFunction, inLoop, inSwitch, labelSet);
        else if (c === 0x74 && tok.getLastValue() === 'try') this.parseTry(inFunction, inLoop, inSwitch, labelSet);
        else if (c === 0x64 && tok.getLastValue() === 'debugger') this.parseDebugger();
        else if (c === 0x77 && tok.getLastValue() === 'with') this.parseWith(inFunction, inLoop, inSwitch, labelSet);
        else if (c === 0x63 && tok.getLastValue() === 'continue') this.parseContinue(inFunction, inLoop, inSwitch, labelSet);
        else this.parseExpressionOrLabel(inFunction, inLoop, inSwitch, labelSet);
      }

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
        if (this.isReservedIdentifier(false)) throw 'var name is reserved';
        tok.mustBeIdentifier(true);
        if (tok.isNum(0x3d) && tok.lastLen === 1) { // =
          tok.nextExpr();
          this.parseExpression();
        }
      } while(tok.nextExprIfNum(0x2c)); // ,
      this.parseSemi();

      return true;
    },
    parseVarPartNoIn: function(){
      var state = NOPARSE;
      var tok = this.tok;

      do {
        if (this.isReservedIdentifier(false)) throw 'var name is reserved';
        tok.mustBeIdentifier(true);

        if (tok.isNum(0x3d) && tok.lastLen === 1) { // =
          tok.nextExpr();
          this.parseExpressionNoIn();
        }
      } while(tok.nextExprIfNum(0x2c) && (state = NONFORIN)); // ,

      return state;
    },
    parseIf: function(inFunction, inLoop, inSwitch, labelSet){
      // if (<exprs>) <stmt>
      // if (<exprs>) <stmt> else <stmt>

      this.tok.nextPunc();
      this.parseStatementHeader();
      this.parseStatement(inFunction, inLoop, inSwitch, labelSet, false);

      this.parseElse(inFunction, inLoop, inSwitch, labelSet);

      return true;
    },
    parseElse: function(inFunction, inLoop, inSwitch, labelSet){
      // else <stmt>;

      var tok = this.tok;
      if (tok.getLastValue() === 'else') {
        tok.nextExpr();
        this.parseStatement(inFunction, inLoop, inSwitch, labelSet, false);
      }
    },
    parseDo: function(inFunction, inLoop, inSwitch, labelSet){
      // do <stmt> while ( <exprs> ) ;

      var tok = this.tok;
      tok.nextExpr(); // do
      this.parseStatement(inFunction, true, inSwitch, labelSet, false);
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
      this.parseStatement(inFunction, true, inSwitch, labelSet, false);
    },
    parseFor: function(inFunction, inLoop, inSwitch, labelSet){
      // for ( <expr-no-in-=> in <exprs> ) <stmt>
      // for ( var <idntf> in <exprs> ) <stmt>
      // for ( var <idntf> = <expr-no-in> in <exprs> ) <stmt>
      // for ( <expr-no-in> ; <expr> ; <expr> ) <stmt>

      var state = NOPARSE;

      var tok = this.tok;
      tok.nextPunc(); // for
      tok.mustBeNum(0x28, true); // (

      if (tok.nextExprIfNum(0x3b)) this.parseForEachHeader(); // ; (means empty first expression in for-each)
      else {

        if (tok.isNum(0x76) && this.tok.nextPuncIfString('var')) state = this.parseVarPartNoIn();
        // expression_s_ because it might be regular for-loop...
        // (though if it isn't, it can't have more than one expr)
        else state = this.parseExpressionsNoIn();

        // 3b = ;

        if (tok.nextExprIfNum(0x3b)) this.parseForEachHeader();
        else if (state) throw 'Encountered illegal for-in lhs';
        else this.parseForInHeader();
      }

      tok.mustBeNum(0x29, true); // )
      this.parseStatement(inFunction, true, inSwitch, labelSet, false);
    },
    parseForEachHeader: function(){
      // <expr> ; <expr> ) <stmt>

      this.parseOptionalExpressions();
      this.tok.mustBeNum(0x3b, true); // ;
      this.parseOptionalExpressions();
    },
    parseForInHeader: function(){
      // in <exprs> ) <stmt>

      var tok = this.tok;
      if (tok.getLastNum() !== 0x69 || tok.getLastNum2() !== 0x6e || tok.lastLen !== 2) {
        throw 'Expected `in` here... '+tok.syntaxError();
      }
      tok.nextExpr();
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

      if (tok.lastNewline || !tok.isType(IDENTIFIER)) { // no label after break?
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

      if (!inFunction && !this.options.functionMode) throw 'Can only return in a function '+this.tok.syntaxError('break');

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
      if (tok.lastNewline) { // TOFIX: what about EOF?
        throw 'No newline allowed directly after a throw, ever. '+tok.syntaxError();
      } else {
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
      this.parseCompleteBlock(true, inFunction, inLoop, inSwitch, labelSet);

      var one = this.parseCatch(inFunction, inLoop, inSwitch, labelSet);
      var two = this.parseFinally(inFunction, inLoop, inSwitch, labelSet);

      if (!one && !two) throw 'Try must have at least a catch or finally block or both: '+this.tok.debug();
    },
    parseCatch: function(inFunction, inLoop, inSwitch, labelSet){
      // catch ( <idntf> ) { <stmts> }

      var tok = this.tok;
      if (tok.nextPuncIfString('catch')) {
        tok.mustBeNum(0x28, false); // (

        // catch var
        if (tok.isType(IDENTIFIER)) {
          if (this.isReservedIdentifier(false)) throw 'Catch scope var name is reserved';
          tok.nextPunc();
        } else {
          throw 'Missing catch scope variable';
        }

        tok.mustBeNum(0x29, false); // )
        this.parseCompleteBlock(true, inFunction, inLoop, inSwitch, labelSet);

        return true;
      }
      return false;
    },
    parseFinally: function(inFunction, inLoop, inSwitch, labelSet){
      // finally { <stmts> }

      if (this.tok.nextPuncIfString('finally')) {
        this.parseCompleteBlock(true, inFunction, inLoop, inSwitch, labelSet);

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
      this.parseStatement(inFunction, inLoop, inSwitch, labelSet, false);
    },
    parseFunction: function(forFunctionDeclaration){
      // function [<idntf>] ( [<param>[,<param>..] ) { <stmts> }

      var tok = this.tok;
      tok.nextPunc(); // 'function'
      if (tok.isType(IDENTIFIER)) { // name
        if (this.isReservedIdentifier(false)) throw 'function name is reserved';
        tok.nextPunc();
      } else if (forFunctionDeclaration) {
        throw 'function declaration name is required';
      }
      this.parseFunctionRemainder(-1, forFunctionDeclaration);
    },
    /**
     * Parse the function param list and body
     *
     * @param {number} paramCount Number of expected params, -1/undefined means no requirement. used for getters and setters
     * @param {boolean} forFunctionDeclaration Are we parsing a function declaration (determines whether we can parse a division next)
     */
    parseFunctionRemainder: function(paramCount, forFunctionDeclaration){
      var tok = this.tok;
      tok.mustBeNum(0x28, false); // (
      this.parseParameters(paramCount);
      tok.mustBeNum(0x29, false); // )
      this.parseCompleteBlock(forFunctionDeclaration, true, false, false, []); // this resets loop and switch status
    },
    parseParameters: function(paramCount){
      // [<idntf> [, <idntf>]]
      var tok = this.tok;
      if (tok.isType(IDENTIFIER)) {
        if (paramCount === 0) throw 'Getters have no parameters';
        if (this.isReservedIdentifier(false)) throw 'Function param name is reserved';
        tok.nextExpr();
        // there are only two valid next tokens; either a comma or a closing paren
        while (tok.nextExprIfNum(0x2c)) { // ,
          if (paramCount === 1) throw 'Setters have exactly one param';

          // param name
          if (tok.isType(IDENTIFIER)) {
            if (this.isReservedIdentifier(false)) throw 'Function param name is reserved';
            tok.nextPunc();
          } else {
            throw 'Missing func param name';
          }
        }
      } else if (paramCount === 1) {
        throw 'Setters have exactly one param';
      }
    },
    parseBlock: function(notForFunctionExpression, inFunction, inLoop, inSwitch, labelSet){
      this.parseStatements(inFunction, inLoop, inSwitch, labelSet);
      // note: this parsing method is also used for functions. the only case where
      // the closing curly can be followed by a division rather than a regex lit
      // is with a function expression. that's why we needed to make this exception
      this.tok.mustBeNum(0x7d, notForFunctionExpression); // }
    },
    parseCompleteBlock: function(notForFunctionExpression, inFunction, inLoop, inSwitch, labelSet){
      this.tok.mustBeNum(0x7b, true); // {
      this.parseBlock(notForFunctionExpression, inFunction, inLoop, inSwitch, labelSet);
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
      if (tok.isNum(0x7d) || (tok.lastNewline && !tok.isType(REGEX)) || tok.isType(EOF)) {
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
      // note that this is a statement that starts with an identifier
      // (could also be new or delete!)
      var found = this.parseExpressionForLabel(inFunction, inLoop, inSwitch, labelSet);
      if (!found) {
        if (this.tok.nextExprIfNum(0x2c)) this.parseExpressions(); // 2c=,
        this.parseSemi();
      }
    },
    parseExpressionForLabel: function(inFunction, inLoop, inSwitch, labelSet){
      // this method is only called at the start of
      // a statement that starts with an identifier.
      var labelName = this.tok.getLastValue();

      // ugly but mandatory label check
      // if this is a label, the parsePrimary parser
      // will have bailed when seeing the colon.
      if (this.parsePrimaryOrLabel()) {

        // the label will have been checked for being a reserved keyword
        // except for the value keywords. so we need to do that here.
        // no need to check for function, because that cant occur here.
        // note that it's pretty rare for the parser to reach this
        // place, so i dont feel it's very important to take the uber
        // optimized route. simple string comparisons will suffice.
        // note that this is already confirmed to be used as a label so
        // if any of these checks match, an error will be thrown.
        if (this.isValueKeyword(labelName)) {
          throw 'Reserved identifier found in label. '+this.tok.syntaxError();
        }

        labelSet.push(labelName);
        this.parseStatement(inFunction, inLoop, inSwitch, labelSet, false);
        labelSet.pop();
        return true;
      }

      this.parseAssignments();
      this.parseNonAssignments();
      return false;
    },
    parseOptionalExpressions: function(){
      var tok = this.tok;
      var tokCount = tok.tokenCountAll;
      this.parseExpressionOptional();
      if (tokCount !== tok.tokenCountAll) {
        while (this.tok.nextExprIfNum(0x2c)) { // ,
          this.parseExpression();
        }
      }
    },
    parseExpressions: function(){
      var state = this.parseExpression();
      while (this.tok.nextExprIfNum(0x2c)) { // ,
        this.parseExpression();
        // not sure, but if the expression was not an assignment, it's probably irrelevant
        // except in the case of a group, in which case it becomes an invalid assignee, so:
        state = NONASSIGNEE;
      }
      return state;
    },
    parseExpression: function(){
      var tok = this.tok;
      var tokCount = tok.tokenCountAll;

      var state = this.parseExpressionOptional();

      // either tokenizer pos moved, or we reached the end (we hadnt reached the end before)
      if (tokCount === tok.tokenCountAll) throw 'Expected to parse an expression, did not find any';

      return state;
    },
    parseExpressionOptional: function(){
      var state = this.parsePrimary();
      // if there was no assignment, state will be the same.
      state = this.parseAssignments(state);

      if (this.parseNonAssignments()) {
        // any binary operator is illegal as assignee and illegal as for-in lhs
        state = NEITHER;
      }

      // cases:
      //   x             - legal assignee, legal for-in
      //   x = y         - legal assignee, illegal for-in
      //   x = 5         - illegal both
      //   x & y         - illegal both
      //   x = y & z     - illegal both
      return state;
    },
    parseAssignments: function(state){
      // assignment ops are allowed until the first non-assignment binary op
      while (this.isAssignmentOperator()) {
        if (state & NONASSIGNEE) throw 'LHS is invalid assignee';
        // any assignment means not a for-in per definition
        state = this.parsePrimaryAfterOperator() | NONFORIN;
      }

      // TODO: make sure I dont forget about `for(x=y in z);` case, for which I removed a check here
      return state;
    },
    parseNonAssignments: function(){
      var parsed = false;
      // keep parsing non-assignment binary/ternary ops
      while (true) {
        if (this.isBinaryOperator()) this.parsePrimaryAfterOperator();
        else if (this.tok.isNum(0x3f)) this.parseTernary(); // ?
        else break;
        // any binary is a non-for-in
        parsed = true;
      }
      return parsed;
    },
    parseTernary: function(){
      var tok = this.tok;
      tok.nextExpr();
      this.parseExpression();
      tok.mustBeNum(0x3a,true); // :
      this.parseExpression();
    },
    parseTernaryNoIn: function(){
      var tok = this.tok;
      tok.nextExpr();
      this.parseExpression();
      tok.mustBeNum(0x3a,true); // :
      this.parseExpressionNoIn();
    },
    parsePrimaryAfterOperator: function(){
      this.tok.nextExpr();
      return this.parsePrimary();
    },
    parseExpressionsNoIn: function(){
      var tok = this.tok;

      var state = this.parseExpressionNoIn();
      while (tok.nextExprIfNum(0x2c)) {
        // lhs of for-in cant be multiple expressions
        state = this.parseExpressionNoIn() | NONFORIN;
      }

      return state;
    },
    parseExpressionNoIn: function(){
      var state = this.parsePrimary();

      state = this.parseAssignments(state);

      var tok = this.tok;
      // keep parsing non-assignment binary/ternary ops unless `in`
      var repeat = true;
      while (repeat) {
        if (this.isBinaryOperator()) {
          // rationale for using getLastNum; this is the `in` check which will succeed
          // about 50% of the time (stats from 8mb of various js). the other time it
          // will check for a primary. it's therefore more likely that an getLastNum will
          // save time because it would cache the charCodeAt for the other token if
          // it failed the check
          if (tok.getLastNum() === 0x69 && tok.getLastNum2() === 0x6e && tok.lastLen === 2) { // in
            repeat = false;
          } else {
            this.parsePrimaryAfterOperator();
            state = NEITHER;
          }
        } else if (tok.isNum(0x3f)) { // 3f=?
          this.parseTernaryNoIn();
          // TODO: add for-in tests that deal with ternary operator in lhs...
          state = NEITHER; // the lhs of a for-in cannot contain a ternary operator
        } else {
          repeat = false;
        }
      }

      return state; // example:`for (x+b++ in y);`
    },
    /**
     * Parse the "primary" expression value. This is like the root
     * value for any expression. Could be a number, string,
     * identifier, etc. The primary can have a prefix (like unary
     * operators) and suffixes (++, --) but they are parsed elsewhere.
     *
     * @return {number}
     */
    parsePrimary: function(){
      // parses parts of an expression without any binary operators
      var state = NOPARSE;
      var parsedUnary = this.parseUnary(); // no unary can be valid in the lhs of an assignment

      var tok = this.tok;
      if (tok.isType(IDENTIFIER)) {
        var identifier = tok.getLastValue();
        if (tok.isNum(0x66) && identifier === 'function') {
          this.parseFunction(false);
          state = NONASSIGNEE;
        } else {
          if (this.isReservedIdentifier(true)) throw 'Reserved identifier found in expression';
          tok.nextPunc();
          // any non-keyword identifier can be assigned to
          if (this.isValueKeyword(identifier)) state = NONASSIGNEE;
        }
      } else {
        state = this.parsePrimaryValue(false);
      }

      var suffixNonAssignable = this.parsePrimarySuffixes();
      if (suffixNonAssignable === ASSIGNEE) state = NOPARSE;
      else if (suffixNonAssignable === NONASSIGNEE) state = NONASSIGNEE;
      // TOFIX: what about new foo.bar?
      else if (suffixNonAssignable === NOPARSE && parsedUnary) state = NONASSIGNEE;

      return state;
    },
    parsePrimaryOrLabel: function(){
      // note: this function is only executed for identifiers...
      // note: this function is only executed for statement starts. the
      //       function keyword will already have been filtered out by
      //       the main statement start parsing method. So we dont have
      //       to check for the function keyword here; it cant occur.
      var tok = this.tok;

      // if we parse any unary, we wont have to check for label
      var hasPrefix = this.parseUnary();

      // simple shortcut: this function is only called if (at
      // the time of calling) the next token was an identifier.
      // if parseUnary returns true, we wont know what the type
      // of the next token is. otherwise it must still be identifier!
      if (!hasPrefix || tok.isType(IDENTIFIER)) {
        // in fact... we dont have to check for any of the statement
        // identifiers (break, return, if) because parseIdentifierStatement
        // will already have ensured a different code path in that case!
        // TOFIX: check how often this is called and whether it's worth investigating...
        if (this.isReservedIdentifier(true)) throw 'Reserved identifier found in expression. '+tok.syntaxError();
        tok.nextPunc();

        // now's the time... you just ticked off an identifier, check the current token for being a colon!
        // (quick check first: if there was a unary operator, this cant be a label)
        if (!hasPrefix) {
          if (this.tok.nextExprIfNum(0x3a)) { // 3a = :
            return true;
          }
        }
      } else {
        // TODO: make constants?
        this.parsePrimaryValue(true);
      }

      this.parsePrimarySuffixes();

      return false;
    },
    parsePrimaryValue: function(required){
      // at this point in the expression parser we will
      // have ruled out anything else. the next token(s) must
      // be some kind of expression value...

      var state = NONASSIGNEE;

      var tok = this.tok;
      if (!tok.nextPuncIfValue()) {
        if (tok.nextExprIfNum(0x28)) state = this.parseGroup(); // (
        else if (tok.nextExprIfNum(0x7b)) this.parseObject(); // {
        else if (tok.nextExprIfNum(0x5b)) this.parseArray(); // [
        else if (required) throw 'Unable to parse required primary value';
      }

      return state;
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

      if (c === 0x74) return tok.getLastValue() === 'typeof';
      else if (c === 0x6e) return tok.getLastValue() === 'new';
      else if (c === 0x64) return tok.getLastValue() === 'delete';
      else if (c === 0x21) return true; // !
      else if (c === 0x76) return tok.getLastValue() === 'void';
      else if (c === 0x2d) {
        if (tok.lastLen === 1) return true; // -
        if (tok.getLastNum2() === 0x2d) return true; // --
      }
      else if (c === 0x2b) {
        if (tok.lastLen === 1) return true; // +
        if (tok.getLastNum2() === 0x2b) return true; // ++
      }
      else if (c === 0x7e) return true; // ~

      return false;
    },
    parsePrimarySuffixes: function(){
      // --
      // ++
      // .<idntf>
      // [<exprs>]
      // (<exprs>)

      var nonAssignee = NOPARSE;

      // TODO: the order of these checks doesn't appear to be optimal (numbers first?)
      var tok = this.tok;
      var repeat = true;
      while (repeat) {
        // need tokenizer to check for a punctuator because it could never be a regex (foo.bar, we're at the dot between)
        if (tok.isType(PUNCTUATOR) && tok.nextExprIfNum(0x2e)) { // .
          tok.mustBeIdentifier(false); // cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          nonAssignee = ASSIGNEE; // property name can be assigned to (for-in lhs)
        } else if (tok.nextExprIfNum(0x28)) { // (
          this.parseOptionalExpressions();
          tok.mustBeNum(0x29, false); // ) cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          nonAssignee = NONASSIGNEE; // call cannot be assigned to (for-in lhs) (ok, there's an IE case, but let's ignore that...)
        } else if (tok.nextExprIfNum(0x5b)) { // [
          this.parseExpressions(); // required
          tok.mustBeNum(0x5d, false); // ] cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          nonAssignee = ASSIGNEE; // dynamic property can be assigned to (for-in lhs), expressions for-in state are ignored
        } else if (tok.isNum(0x2b) && tok.nextPuncIfString('++')) {
          nonAssignee = NONASSIGNEE; // cannot assign to foo++ (for-in lhs)
          repeat = false;
        } else if (tok.isNum(0x2d) && tok.nextPuncIfString('--')) {
          nonAssignee = NONASSIGNEE; // cannot assign to foo-- (for-in lhs)
          repeat = false;
        } else {
          repeat = false;
        }
      }
      return nonAssignee;
    },
    isAssignmentOperator: function(){
      // includes any "compound" operators
      // used to be: /^(?:[+*%&|^\/-]|<<|>>>?)?=$/
      // return (this.regexAssignmentOp.test(val));

      // this method works under the assumption that the current token is
      // part of the set of valid tokens for js. So we don't have to check
      // for string lengths unless we need to disambiguate optional chars

      var tok = this.tok;
      var len = tok.lastLen;

      if (len === 1) return tok.getLastNum() === 0x3d; // =

      else if (len === 2) {
        if (tok.getLastNum2() !== 0x3d) return false; // =
        var c = tok.getLastNum();
        return (
          c === 0x2b || // +
          c === 0x2d || // -
          c === 0x2a || // *
          c === 0x7c || // |
          c === 0x26 || // &
          c === 0x25 || // %
          c === 0x5e || // ^
          c === 0x2f    // /
        );
      }

      else {
        // these <<= >>= >>>= cases are very rare

        if (len === 3 && tok.getLastNum() === 0x3c) {
          return (tok.getLastNum2() === 0x3c && tok.getLastNum3() === 0x3d); // <<=
        }
        else if (tok.getLastNum() === 0x3e) {
          return ((tok.getLastNum2() === 0x3e) && (
            (len === 4 && tok.getLastNum3() === 0x3e && tok.getLastNum4() === 0x3d) || // >>>=
            (len === 3 && tok.getLastNum3() === 0x3d) // >>=
          ));
        }
      }

      return false;
    },
    isBinaryOperator: function(){
      // non-assignment binary operator
      // /^(?:[+*%|^&\/-]|[=!]==?|<=|>=|<<?|>>?>?|&&|instanceof|in|\|\|)$/,
      //return (this.regexNonAssignBinaryOp.test(val));

      // this method works under the assumption that the current token is
      // part of the set of valid _tokens_ for js. So we don't have to check
      // for string lengths unless we need to disambiguate optional chars
      // and we dont need to worry about validation. the operator is either
      // going to be a punctuator, `in`, or `instanceof`. But note that the
      // token might still be a completely unrelated (error) kind of token.
      // We will parse it in such a way that the error condition is always
      // the longest path, though.

      var tok = this.tok;
      var c = tok.getLastNum();

      // so we have a valid  token, checking for binary ops is simple now except
      // that we have to make sure it's not an (compound) assignment!

      // About 80% of the calls to this method result in none of the ifs
      // even matching. The times the method returns `false` is even bigger.
      // To this end, we preliminary check a few cases so we can jump quicker.

      // ) ; , (most frequent, for 27% 23% and 20% of the times this method is
      // called, c will be one of them (simple expression enders)
      if (c === 0x29 || c === 0x3b || c === 0x2c) {
        return false;
      }
      // quite frequent (more than any other single if below it) are } (8%)
      // and ] (7%). Maybe I'll remove this in the future. The overhead may
      // not be worth the gains. Hard to tell... :)
      else if (c === 0x5d || c === 0x7d) {
        return false;
      }


      else if (c === 0x2b) { // +
        // if len is more than 1, it's either a compound assignment (*=, +=, etc) or a unary op (++ --)
        return (tok.lastLen === 1);
      }

      else if (c === 0x3d || c === 0x21) { // = !
        return (tok.getLastNum2() === 0x3d && (tok.lastLen === 2 || tok.getLastNum3() === 0x3d)); // === !==
      }

      else if (c === 0x26) { // &
        return (tok.lastLen === 1 || tok.getLastNum2() === 0x26); // &&
      }

      else if (c === 0x7c) { // |
        return (tok.lastLen === 1 || tok.getLastNum2() === 0x7c); // ||
      }

      else if (c === 0x3c) { // <
        if (tok.lastLen === 1) return true; // <
        var d = tok.getLastNum2();
        // the len check prevents <<=
        return ((d === 0x3c && tok.lastLen === 2) || d === 0x3d); // << <=
      }

      else if (c === 0x2a) { // *
        // if len is more than 1, it's either a compound assignment (*=, +=, etc) or a unary op (++ --)
        return (tok.lastLen === 1);
      }

      else if (c === 0x3e) { // >
        var len = tok.lastLen;
        if (len === 1) return true; // >
        var d = tok.getLastNum2();
        // the len checks prevent >>= and >>>=
        return (d === 0x3d || (len === 2 && d === 0x3e) || (len === 3 && tok.getLastNum3() === 0x3e)); // >= >> >>>
      }

      else if (
        c === 0x25 || // %
        c === 0x5e || // ^
        c === 0x2f || // /
        c === 0x2d    // -
      ) {
        // if len is more than 1, it's either a compound assignment (*=, +=, etc) or a unary op (++ --)
        return (tok.lastLen === 1);
      }

      // if not punctuator, it could still be `in` or `instanceof`...
      else if (c === 0x69) { // i
        return ((tok.lastLen === 2 && tok.getLastNum2() === 0x6e) || (tok.lastLen === 10 && tok.getLastValue() === 'instanceof'));
      }

      return false;
    },

    parseGroup: function(){
      var state = this.parseExpressions(); // required. nonassignable if multiple, or if the single expression is nonassignable
      this.tok.mustBeNum(0x29, false); // 29=)  cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      return state;
    },
    parseArray: function(){
      var tok = this.tok;
      do {
        this.parseExpressionOptional(); // just one because they are all optional (and arent in expressions)
      } while (tok.nextExprIfNum(0x2c)); // elision

      tok.mustBeNum(0x5d, false); // ]  cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
    },
    parseObject: function(){
      var tok = this.tok;
      do {
        // object literal keys can be most values, but not regex literal.
        // since that's an error, it's unlikely you'll ever see that triggered.
        if (tok.isValue() && !tok.isType(REGEX)) this.parsePair();
      } while (tok.nextExprIfNum(0x2c)); // elision
      tok.mustBeNum(0x7d, false); // }  cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
    },
    parsePair: function(){
      var tok = this.tok;
      if (tok.isNum(0x67) && tok.nextPuncIfString('get')) {
        if (tok.isType(IDENTIFIER)) {
          if (this.isReservedIdentifier(false)) throw 'Getter name is reserved';
          tok.nextPunc();

          this.parseFunctionRemainder(0, true);
        }
        else this.parseDataPart();
      } else if (tok.isNum(0x73) && tok.nextPuncIfString('set')) {
        if (tok.isType(IDENTIFIER)) {
          if (this.isReservedIdentifier(false)) throw 'Getter name is reserved';
          tok.nextPunc();

          this.parseFunctionRemainder(1, true);
        }
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
      this.parseExpression();
    },

    /**
     * Return whether the current token is a reserved identifier or not.
     * Presumably only called on identifiers. If the passed on boolean is
     * true, the keywords [true, false, this, function, null] are ignored
     * for this check. This will be the case when parsing expression vars.
     * See also this.isValueKeyword
     *
     * @param {boolean} ignoreValues When true, still returns false even if token is one of [true, false, this, function, null]
     * @return {boolean}
     */
    isReservedIdentifier: function(ignoreValues){
      // note that this function will return false most of the time
      // if it returns true, a syntax error will probably be thrown

      // TOFIX: skip statement keywords when checking for label

      var tok = this.tok;

      if (tok.lastLen > 1) {
        var c = tok.getLastNum();
        if (c >= 0x61 && c <= 0x77) {
          if (c < 0x67 || c > 0x71) {
            if (c === 0x74) {
              var d = tok.getLastNum2();
              if (d === 0x68) {
                var id = tok.getLastValue();
                if (id === 'this') return !ignoreValues;
                return id === 'throw';
              } else if (d === 0x72) {
                var id = tok.getLastValue();
                if (id === 'true') return !ignoreValues;
                if (id === 'try') return true;
              } else if (d === 0x79) {
                return tok.getLastValue() === 'typeof';
              }
            } else if (c === 0x73) {
              var d = tok.getLastNum2();
              if (d === 0x77) {
                return tok.getLastValue() === 'switch';
              } else if (d === 0x75) {
                return tok.getLastValue() === 'super';
              } else {
                return false;
              }
            } else if (c === 0x66) {
              var d = tok.getLastNum2();
              if (d === 0x61) {
                if (ignoreValues) return false;
                return tok.getLastValue() === 'false';
              } else if (d === 0x75) {
                // this is an ignoreValues case as well, but can never be triggered
                // rationale: this function is only called with ignoreValues true
                // when checking a label. labels are first words of statements. if
                // function is the first word of a statement, it will never branch
                // to parsing an identifier expression statement. and never get here.
                return tok.getLastValue() === 'function';
              } else if (d === 0x6f) {
                return tok.getLastValue() === 'for';
              } else if (d === 0x69) {
                return tok.getLastValue() === 'finally';
              }
            } else if (c === 0x64) {
              var d = tok.getLastNum2();
              if (d === 0x6f) {
                return tok.lastLen === 2; // do
              } else if (d === 0x65) {
                var id = tok.getLastValue();
                return id === 'debugger' || id === 'default' || id === 'delete';
              }
            } else if (c === 0x65) {
              var d = tok.getLastNum2();
              if (d === 0x6c) {
                return tok.getLastValue() === 'else';
              } else if (d === 0x6e) {
                return tok.getLastValue() === 'enum';
              } else if (d === 0x78) {
                var id = tok.getLastValue();
                return id === 'export' || id === 'extends';
              }
            } else if (c === 0x62) {
              return tok.getLastNum2() === 0x72 && tok.getLastValue() === 'break';
            } else if (c === 0x63) {
              var d = tok.getLastNum2();
              if (d === 0x61) {
                var id = tok.getLastValue();
                return id === 'case' || id === 'catch';
              } else if (d === 0x6f) {
                var id = tok.getLastValue();
                return id === 'continue' || id === 'const';
              } else if (d === 0x6c) {
                return tok.getLastValue() === 'class';
              }
            } else if (c === 0x72) {
              if (tok.getLastNum2() === 0x65) {
                return tok.getLastValue() === 'return';
              }
            } else if (c === 0x76) {
              var d = tok.getLastNum2();
              if (d === 0x61) {
                return tok.getLastValue() === 'var';
              } else if (d === 0x6f) {
                return tok.getLastValue() === 'void';
              }
            } else if (c === 0x77) {
              var d = tok.getLastNum2();
              if (d === 0x68) {
                return tok.getLastValue() === 'while';
              } else if (d === 0x69) {
                return tok.getLastValue() === 'with';
              }
            }
          // we checked for b-f and r-w, but must not forget
          // to check n and i:
          } else if (c === 0x6e) {
            var d = tok.getLastNum2();
            if (d === 0x75) {
              if (ignoreValues) return false;
              return tok.getLastValue() === 'null';
            } else if (d === 0x65) {
              return tok.getLastValue() === 'new';
            }
          } else if (c === 0x69) {
            var d = tok.getLastNum2();
            if (d === 0x6e) {
              return tok.lastLen === 2 || tok.getLastValue() === 'instanceof'; // 'in'
            } else if (d === 0x66) {
              return tok.lastLen === 2; // 'if'
            } else if (d === 0x6d) {
              return tok.getLastValue() === 'import';
            }
          }
        }
      }

      return false;
    },

    isValueKeyword: function(word){
      return word === 'true' || word === 'false' || word === 'this' || word === 'null';
    },
  };

})(typeof exports === 'object' ? exports : window);
