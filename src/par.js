// If you see magic numbers and bools all over the place, it means this
// file has been post-processed by a build script. If you want to read
// this file, see https://github.com/qfox/zeparser2

// TOFIX: generate huge benchmark files and derive specific coding styles from them; tabs vs spaces, newline (cr/lf/crlf), minified vs normal, unicode identifiers/jquery/underscore heavy/uppercase, if/else vs &&||, labels usage (build script), etc
// TOFIX: check `(x-a^x-b)<0` rangecheck hack from http://codegolf.stackexchange.com/questions/8649/shortest-code-to-check-if-a-number-is-in-a-range-in-javascript

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

  // boolean constants
  var OPTIONAL = true;
  var REQUIRED = false;
  var NOTFORFUNCTIONEXPRESSION = true;
  var PARSEDSOMETHING = true;
  var PARSEDNOTHING = false;
  var FORFUNCTIONDECL = true;
  var NOTFORFUNCTIONDECL = false;
  var NEXTTOKENCANBEREGEX = true;
  var NEXTTOKENCANBEDIV = false;
  var INLOOP = true;
  var NOTINLOOP = false;
  var INSWITCH = true;
  var NOTINSWITCH = false;
  var INFUNCTION = true;
  var NOTINFUNCTION = false;
  var IGNOREVALUES = true;
  var DONTIGNOREVALUES = false;
  var HASPREFIX = true;
  var HASNOPREFIX = false;
  var HASNEW = true;
  var HASNONEW = false;
  var NOTASSIGNABLE = false;
  var ASSIGNABLE = true;
  var MAYBELABEL = true;
  var NOTLABEL = false;

  var ORD_L_A = 0x61;
  var ORD_L_B = 0x62;
  var ORD_L_C = 0x63;
  var ORD_L_D = 0x64;
  var ORD_L_E = 0x65;
  var ORD_L_F = 0x66;
  var ORD_L_G = 0x67;
  var ORD_L_H = 0x68;
  var ORD_L_I = 0x69;
  var ORD_L_J = 0x6a;
  var ORD_L_K = 0x6b;
  var ORD_L_L = 0x6c;
  var ORD_L_M = 0x6d;
  var ORD_L_N = 0x6e;
  var ORD_L_O = 0x6f;
  var ORD_L_P = 0x70;
  var ORD_L_Q = 0x71;
  var ORD_L_R = 0x72;
  var ORD_L_S = 0x73;
  var ORD_L_T = 0x74;
  var ORD_L_U = 0x75;
  var ORD_L_V = 0x76;
  var ORD_L_W = 0x77;
  var ORD_L_X = 0x78;
  var ORD_L_Y = 0x79;
  var ORD_L_Z = 0x7a;

  var ORD_OPEN_CURLY = 0x7b;
  var ORD_CLOSE_CURLY = 0x7d;
  var ORD_OPEN_PAREN = 0x28;
  var ORD_CLOSE_PAREN = 0x29;
  var ORD_OPEN_SQUARE = 0x5b;
  var ORD_CLOSE_SQUARE = 0x5d;
  var ORD_TILDE = 0x7e;
  var ORD_PLUS = 0x2b;
  var ORD_MIN = 0x2d;
  var ORD_EXCL = 0x21;
  var ORD_QMARK = 0x3f;
  var ORD_COLON = 0x3a;
  var ORD_SEMI = 0x3b;
  var ORD_IS = 0x3d;
  var ORD_COMMA = 0x2c;
  var ORD_DOT = 0x2e;
  var ORD_STAR = 0x2a;
  var ORD_OR = 0x7c;
  var ORD_AND = 0x26;
  var ORD_PERCENT = 0x25;
  var ORD_XOR = 0x5e;
  var ORD_FWDSLASH = 0x2f;
  var ORD_LT = 0x3c;
  var ORD_GT = 0x3e;

  var EMPTY_LABELSET = '';

  var Par = exports.Par = function(input, options){
    this.options = options = options || {};

    if (!options.saveTokens) options.saveTokens = false;
    if (!options.createBlackStream) options.createBlackStream = false;
    if (!options.functionMode) options.functionMode = false;
    if (!options.regexNoClassEscape) options.regexNoClassEscape = false;
    if (!options.strictForInCheck) options.strictForInCheck = false;
    if (!options.strictAssignmentCheck) options.strictAssignmentCheck = false;

    // `this['tok'] prevents build script mangling :)
    this['tok'] = new Tok(input, this.options);
    if (options.nextToken) this['tok'].nextTokenIfElse_search = options.nextToken;
    this['run'] = this.run; // used in Par.parse
  };

  Par.updateTok = function(T) {
    Tok = T;
  };

  Par.parse = function(input, options){
    var par = new Par(input, options);
    par.run();

    return par;
  };

  var proto = {
    /**
     * This object is shared with Tok.
     *
     * @property {Object} options
     * @property {boolean} [options.saveTokens=false] Make the tokenizer put all found tokens in .tokens
     * @property {boolean} [options.createBlackStream=false] Requires saveTokens, put black tokens in .black
     * @property {boolean} [options.functionMode=false] In function mode, `return` is allowed in global space
//     * @property {boolean} [options.scriptMode=false] (TOFIX, #12)
     * @property {boolean} [options.regexNoClassEscape=false] Don't interpret backslash in regex class as escape
     * @property {boolean} [options.strictForInCheck=false] Reject the lhs for a `for` if it's technically bad (not superseded by strict assignment option)
     * @property {boolean} [options.strictAssignmentCheck=false] Reject the lhs for assignments if it can't be correct at runtime (does not supersede for-in option)
     */
    options: null,

    /**
     * @property {Tok} tok
     */
    tok: null,

    run: function(){
      var tok = this.tok;
      // prepare
      tok.nextExpr();
      // go!
      this.parseStatements(NOTINFUNCTION, NOTINLOOP, NOTINSWITCH, EMPTY_LABELSET);

      if (tok.pos !== tok.len || tok.lastType !== EOF) throw 'Did not complete parsing... '+tok.syntaxError();

      return this;
    },

    parseStatements: function(inFunction, inLoop, inSwitch, labelSet){
      var tok = this.tok;
      // note: statements are optional, this function might not parse anything
      while (!tok.isType(EOF) && this.parseStatement(inFunction, inLoop, inSwitch, labelSet, OPTIONAL));
    },
    parseStatement: function(inFunction, inLoop, inSwitch, labelSet, optional){
      if (this.tok.isType(IDENTIFIER)) {
        // this might be `false` when encountering `case` or `default` (or `else`?), which are handled elsewhere
        // TOFIX: would it be terrible if `case` and `default` went recursive here?
        return this.parseIdentifierStatement(inFunction, inLoop, inSwitch, labelSet);
      } else {
        return this.parseNonIdentifierStatement(inFunction, inLoop, inSwitch, labelSet, optional);
      }
    },
    parseNonIdentifierStatement: function(inFunction, inLoop, inSwitch, labelSet, optional) {
      var tok = this.tok;
      var c = tok.getLastNum();

      if (c === ORD_CLOSE_CURLY) { // 65.6%
        if (!optional) throw 'Expected more input...'; // {if(x)}
        return PARSEDNOTHING;
      }

      if (c === ORD_OPEN_CURLY) { // 33.2%
        tok.nextExpr();
        this.parseBlock(NOTFORFUNCTIONEXPRESSION, inFunction, inLoop, inSwitch, labelSet);
        return PARSEDSOMETHING;
      }

      return this.parseNonIdentifierStatementNonCurly(c, optional);
    },
    parseNonIdentifierStatementNonCurly: function(c, optional){
      var tok = this.tok;

      if (c === ORD_OPEN_PAREN) { // 0.67%
        this.parseExpressionStatement();
        return PARSEDSOMETHING;
      }

      if (c === ORD_SEMI) { // 0.31% empty statement
        // this shouldnt occur very often, but they still do.
        tok.nextExpr();
        return PARSEDSOMETHING;
      }

      if (c === ORD_PLUS || c === ORD_MIN) { // 0.06% 0.04%
        if (tok.getNum(1) === c || tok.getLastLen() === 1) {
          this.parseExpressionStatement();
          return PARSEDSOMETHING;
        }
        throw 'Statement cannot start with binary op.'+tok.syntaxError();
      }

      // rare
      if (tok.isValue() || c === ORD_OPEN_SQUARE) {
        this.parseExpressionStatement();
        return PARSEDSOMETHING;
      }

      // almost never
      if (c === ORD_EXCL) { // 0.03% 0.03%
        if (tok.getLastLen() === 1) {
          this.parseExpressionStatement();
          return PARSEDSOMETHING;
        }
        throw 'Statement cannot start with binary op.'+tok.syntaxError();
      }

      // almost never
      if (c === ORD_TILDE) {
        this.parseExpressionStatement();
        return PARSEDSOMETHING;
      }

      // TOFIX: is there any case where empty optional does not end with curly close? otherwise we can drop this check.
      if (!optional) throw 'Expected more input...';
      // EOF? i'm not sure happens for any other reason.
      return PARSEDNOTHING;
    },
    parseIdentifierStatement: function(inFunction, inLoop, inSwitch, labelSet){
      var tok = this.tok;

      // The current token is an identifier. Either its value will be
      // checked in this function (parseIdentifierStatement) or in the
      // parseExpressionOrLabel function. So we can just get it now.
      var value = tok.getLastValue();

      var len = tok.getLastLen();

      // TOFIX: could add identifier check to conditionally call parseExpressionOrLabel vs parseExpression

      // yes, this check makes a *huge* difference
      if (len >= 2 && len <= 8) {
        // bcdfirstvw, not in that order.
        var c = tok.getLastNum();

        if (c === ORD_L_T) {
          if (value === 'try') return this.parseTry(inFunction, inLoop, inSwitch, labelSet);
          if (value === 'throw') return this.parseThrow();
        }
        else if (c === ORD_L_I && len === 2 && tok.getNum(1) === ORD_L_F) return this.parseIf(inFunction, inLoop, inSwitch, labelSet);
        else if (c === ORD_L_V && value === 'var') return this.parseVar();
        else if (c === ORD_L_R && value === 'return') return this.parseReturn(inFunction, inLoop, inSwitch);
        else if (c === ORD_L_F) {
          if (value === 'function') return this.parseFunction(FORFUNCTIONDECL);
          if (value === 'for') return this.parseFor(inFunction, inLoop, inSwitch, labelSet);
        }
        else if (c === ORD_L_C) {
          if (value === 'continue') return this.parseContinue(inFunction, inLoop, inSwitch, labelSet);
          if (value === 'case') return PARSEDNOTHING; // case is handled elsewhere
        }
        else if (c === ORD_L_B && value === 'break') return this.parseBreak(inFunction, inLoop, inSwitch, labelSet);
        else if (c === ORD_L_D) {
          if (value === 'default') return PARSEDNOTHING; // default is handled elsewhere
          if (len === 2 && tok.getNum(1) === ORD_L_O) return this.parseDo(inFunction, inLoop, inSwitch, labelSet);
          if (value === 'debugger') return this.parseDebugger();
        }
        else if (c === ORD_L_S && value === 'switch') return this.parseSwitch(inFunction, inLoop, inSwitch, labelSet);
        else if (c === ORD_L_W) {
          if (value === 'while') return this.parseWhile(inFunction, inLoop, inSwitch, labelSet);
          if (value === 'with') return this.parseWith(inFunction, inLoop, inSwitch, labelSet);
        }
      }

      // this function _must_ parse _something_, if we parsed nothing, it's an expression statement or labeled statement
      this.parseExpressionOrLabel(value, inFunction, inLoop, inSwitch, labelSet);

      return PARSEDSOMETHING;
    },
    parseStatementHeader: function(){
      var tok = this.tok;
      tok.mustBeNum(ORD_OPEN_PAREN, NEXTTOKENCANBEREGEX);
      this.parseExpressions();
      tok.mustBeNum(ORD_CLOSE_PAREN, NEXTTOKENCANBEREGEX);
    },

    parseVar: function(){
      // var <vars>
      // - foo
      // - foo=bar
      // - ,foo=bar

      var tok = this.tok;
      tok.nextPunc();
      do {
        if (this.isReservedIdentifier(DONTIGNOREVALUES)) throw 'Var name is reserved.'+tok.syntaxError();
        tok.mustBeIdentifier(NEXTTOKENCANBEREGEX);
        if (tok.isNum(ORD_IS) && tok.getLastLen() === 1) {
          tok.nextExpr();
          this.parseExpression();
        }
      } while(tok.nextExprIfNum(ORD_COMMA));
      this.parseSemi();

      return PARSEDSOMETHING;
    },
    parseVarPartNoIn: function(){
      var tok = this.tok;
      var vars = 0;

      do {
        if (this.isReservedIdentifier(DONTIGNOREVALUES)) throw 'Var name is reserved.'+tok.syntaxError();
        tok.mustBeIdentifier(NEXTTOKENCANBEREGEX);
        ++vars;

        if (tok.isNum(ORD_IS) && tok.getLastLen() === 1) {
          tok.nextExpr();
          this.parseExpressionNoIn();
        }

      } while(tok.nextExprIfNum(ORD_COMMA));

      return vars === 1;
    },
    parseIf: function(inFunction, inLoop, inSwitch, labelSet){
      // if (<exprs>) <stmt>
      // if (<exprs>) <stmt> else <stmt>

      var tok = this.tok;

      tok.nextPunc();
      this.parseStatementHeader();
      this.parseStatement(inFunction, inLoop, inSwitch, labelSet, REQUIRED);

      if (tok.getLastValue() === 'else') {
        tok.nextExpr();
        this.parseStatement(inFunction, inLoop, inSwitch, labelSet, REQUIRED);
      }

      return PARSEDSOMETHING;
    },
    parseDo: function(inFunction, inLoop, inSwitch, labelSet){
      // do <stmt> while ( <exprs> ) ;

      var tok = this.tok;

      tok.nextExpr(); // do
      this.parseStatement(inFunction, INLOOP, inSwitch, labelSet, REQUIRED);
      tok.mustBeString('while', NEXTTOKENCANBEDIV);
      tok.mustBeNum(ORD_OPEN_PAREN, NEXTTOKENCANBEREGEX);
      this.parseExpressions();
      tok.mustBeNum(ORD_CLOSE_PAREN, NEXTTOKENCANBEDIV); //no regex following because it's either semi or newline without asi if a forward slash follows it
      // TOFIX: support browsers that allow semi to be omitted w/o asi?
      this.parseSemi();

      return PARSEDSOMETHING;
    },
    parseWhile: function(inFunction, inLoop, inSwitch, labelSet){
      // while ( <exprs> ) <stmt>

      this.tok.nextPunc();
      this.parseStatementHeader();
      this.parseStatement(inFunction, INLOOP, inSwitch, labelSet, REQUIRED);

      return PARSEDSOMETHING;
    },
    parseFor: function(inFunction, inLoop, inSwitch, labelSet){
      // for ( <expr-no-in-=> in <exprs> ) <stmt>
      // for ( var <idntf> in <exprs> ) <stmt>
      // for ( var <idntf> = <expr-no-in> in <exprs> ) <stmt>
      // for ( <expr-no-in> ; <expr> ; <expr> ) <stmt>

      var tok = this.tok;
      tok.nextPunc(); // for
      tok.mustBeNum(ORD_OPEN_PAREN, NEXTTOKENCANBEREGEX);

      if (tok.nextExprIfNum(ORD_SEMI)) this.parseForEachHeader(); // empty first expression in for-each
      else {
        var validForInLhs;

        if (tok.isNum(ORD_L_V) && tok.nextPuncIfString('var')) validForInLhs = this.parseVarPartNoIn();
        // expression_s_ because it might be regular for-loop...
        // (though if it isn't, it can't have more than one expr)
        else validForInLhs = this.parseExpressionsNoIn();

        if (tok.nextExprIfNum(ORD_SEMI)) this.parseForEachHeader();
        else if (tok.getLastNum() !== ORD_L_I || tok.getNum(1) !== ORD_L_N || tok.getLastLen() !== 2) throw 'Expected `in` or `;` here...'+tok.syntaxError();
        else if (!validForInLhs && this.options.strictForInCheck) throw 'Encountered illegal for-in lhs.'+tok.syntaxError();
        else this.parseForInHeader();
      }

      tok.mustBeNum(ORD_CLOSE_PAREN, NEXTTOKENCANBEREGEX);
      this.parseStatement(inFunction, INLOOP, inSwitch, labelSet, REQUIRED);

      return PARSEDSOMETHING;
    },
    parseForEachHeader: function(){
      // <expr> ; <expr> ) <stmt>

      this.parseOptionalExpressions();
      this.tok.mustBeNum(ORD_SEMI, NEXTTOKENCANBEREGEX);
      this.parseOptionalExpressions();
    },
    parseForInHeader: function(){
      // in <exprs> ) <stmt>

      var tok = this.tok;
      tok.nextExpr(); // `in` validated by `parseFor`
      this.parseExpressions();
    },
    parseContinue: function(inFunction, inLoop, inSwitch, labelSet){
      // continue ;
      // continue <idntf> ;
      // newline right after keyword = asi

      var tok = this.tok;

      if (!inLoop) throw 'Can only continue in a loop.'+tok.syntaxError();

      tok.nextPunc(); // token after continue cannot be a regex, either way.

      if (!tok.getLastNewline() && tok.isType(IDENTIFIER)) {
        this.parseLabel(labelSet);
      }

      this.parseSemi();

      return PARSEDSOMETHING;
    },
    parseBreak: function(inFunction, inLoop, inSwitch, labelSet){
      // break ;
      // break <idntf> ;
      // break \n <idntf> ;
      // newline right after keyword = asi

      var tok = this.tok;
      tok.nextPunc(); // token after break cannot be a regex, either way.

      if (tok.getLastNewline() || !tok.isType(IDENTIFIER)) { // no label after break?
        if (!inLoop && !inSwitch) {
          // break without label
          throw 'Break without value only in loops or switches.'+tok.syntaxError();
        }
      } else {
        this.parseLabel(labelSet);
      }

      this.parseSemi();

      return PARSEDSOMETHING;
    },
    parseLabel: function(labelSet){
      var tok = this.tok;
      // next tag must be an identifier
      var label = tok.getLastValue();
      if (labelSet && labelSet.indexOf(label) >= 0) {
        tok.nextExpr(); // label (already validated)
      } else {
        throw 'Label ['+label+'] not found in label set ['+labelSet+'].'+tok.syntaxError();
      }
    },
    parseReturn: function(inFunction, inLoop, inSwitch){
      // return ;
      // return <exprs> ;
      // newline right after keyword = asi

      var tok = this.tok;

      if (!inFunction && !this.options.functionMode) throw 'Can only return in a function.'+tok.syntaxError('break');

      // TOFIX: I think I can invert this logic structure and just do parseSemi if !last newline.
      tok.nextExpr();
      if (tok.getLastNewline()) this.addAsi();
      else {
        this.parseOptionalExpressions();
        this.parseSemi();
      }

      return PARSEDSOMETHING;
    },
    parseThrow: function(){
      // throw <exprs> ;

      var tok = this.tok;
      tok.nextExpr();
      if (tok.getLastNewline()) {
        throw 'No newline allowed directly after a throw, ever.'+tok.syntaxError();
      }

      this.parseExpressions();
      this.parseSemi();

      return PARSEDSOMETHING;
    },
    parseSwitch: function(inFunction, inLoop, inSwitch, labelSet){
      // switch ( <exprs> ) { <switchbody> }

      var tok = this.tok;
      tok.nextPunc();
      this.parseStatementHeader();
      tok.mustBeNum(ORD_OPEN_CURLY, NEXTTOKENCANBEREGEX);
      this.parseSwitchBody(inFunction, inLoop, INSWITCH, labelSet);
      tok.mustBeNum(ORD_CLOSE_CURLY, NEXTTOKENCANBEREGEX);

      return PARSEDSOMETHING;
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
      // note: since we're inside a switch body and at the start
      // of a case/default, the only valid tokens would be a
      // case, default, or the end of the switch. It cannot
      // validly be anything else. Thus the div flag is void.
      // The default keyword might no longer be possible either. TOFIX: optimize that.
      var tok = this.tok;
      while (tok.nextPuncIfString('case')) {
        this.parseCase(inFunction, inLoop, inSwitch, labelSet);
      }
    },
    parseCase: function(inFunction, inLoop, inSwitch, labelSet){
      // case <value> : <stmts-no-case-default>
      this.parseExpressions();
      this.tok.mustBeNum(ORD_COLON, NEXTTOKENCANBEREGEX);
      this.parseStatements(inFunction, inLoop, inSwitch, labelSet);
    },
    parseDefault: function(inFunction, inLoop, inSwitch, labelSet){
      // default <value> : <stmts-no-case-default>

      // TOFIX: this can be folded into parseCaseRemainder for <x>: statements
      this.tok.mustBeNum(ORD_COLON, NEXTTOKENCANBEREGEX);
      this.parseStatements(inFunction, inLoop, inSwitch, labelSet);
    },
    parseTry: function(inFunction, inLoop, inSwitch, labelSet){
      // try { <stmts> } catch ( <idntf> ) { <stmts> }
      // try { <stmts> } finally { <stmts> }
      // try { <stmts> } catch ( <idntf> ) { <stmts> } finally { <stmts> }

      this.tok.nextPunc();
      this.parseCompleteBlock(NOTFORFUNCTIONEXPRESSION, inFunction, inLoop, inSwitch, labelSet);

      var one = this.parseCatch(inFunction, inLoop, inSwitch, labelSet);
      var two = this.parseFinally(inFunction, inLoop, inSwitch, labelSet);

      if (!one && !two) throw 'Try must have at least a catch or finally block or both.'+this.tok.syntaxError();
      return PARSEDSOMETHING;
    },
    parseCatch: function(inFunction, inLoop, inSwitch, labelSet){
      // catch ( <idntf> ) { <stmts> }

      var tok = this.tok;
      if (tok.nextPuncIfString('catch')) {
        tok.mustBeNum(ORD_OPEN_PAREN, NEXTTOKENCANBEDIV);

        // catch var
        if (tok.isType(IDENTIFIER)) {
          if (this.isReservedIdentifier(DONTIGNOREVALUES)) throw 'Catch scope var name is reserved.'+tok.syntaxError();
          tok.nextPunc();
        } else {
          throw 'Missing catch scope variable.'+tok.syntaxError();
        }

        tok.mustBeNum(ORD_CLOSE_PAREN, NEXTTOKENCANBEDIV);
        this.parseCompleteBlock(NOTFORFUNCTIONEXPRESSION, inFunction, inLoop, inSwitch, labelSet);

        return PARSEDSOMETHING;
      }
      return PARSEDNOTHING;
    },
    parseFinally: function(inFunction, inLoop, inSwitch, labelSet){
      // finally { <stmts> }

      if (this.tok.nextPuncIfString('finally')) {
        this.parseCompleteBlock(NOTFORFUNCTIONEXPRESSION, inFunction, inLoop, inSwitch, labelSet);

        return PARSEDSOMETHING;
      }
      return PARSEDNOTHING;
    },
    parseDebugger: function(){
      // debugger ;

      this.tok.nextPunc();
      this.parseSemi();

      return PARSEDSOMETHING;
    },
    parseWith: function(inFunction, inLoop, inSwitch, labelSet){
      // with ( <exprs> ) <stmts>

      this.tok.nextPunc();
      this.parseStatementHeader();
      this.parseStatement(inFunction, inLoop, inSwitch, labelSet, REQUIRED);

      return PARSEDSOMETHING;
    },
    parseFunction: function(forFunctionDeclaration){
      // function [<idntf>] ( [<param>[,<param>..] ) { <stmts> }

      var tok = this.tok;
      tok.nextPunc(); // 'function'
      if (tok.isType(IDENTIFIER)) { // name
        if (this.isReservedIdentifier(DONTIGNOREVALUES)) throw 'Function name ['+this.tok.getLastValue()+'] is reserved.'+tok.syntaxError();
        tok.nextPunc();
      } else if (forFunctionDeclaration) {
        throw 'Function declaration requires a name.'+tok.syntaxError();
      }
      this.parseFunctionRemainder(-1, forFunctionDeclaration);

      return PARSEDSOMETHING;
    },
    /**
     * Parse the function param list and body
     *
     * @param {number} paramCount Number of expected params, -1/undefined means no requirement. used for getters and setters
     * @param {boolean} forFunctionDeclaration Are we parsing a function declaration (determines whether we can parse a division next)
     */
    parseFunctionRemainder: function(paramCount, forFunctionDeclaration){
      var tok = this.tok;
      tok.mustBeNum(ORD_OPEN_PAREN, NEXTTOKENCANBEDIV);
      this.parseParameters(paramCount);
      tok.mustBeNum(ORD_CLOSE_PAREN, NEXTTOKENCANBEDIV);
      this.parseCompleteBlock(forFunctionDeclaration, INFUNCTION, NOTINLOOP, NOTINSWITCH, EMPTY_LABELSET);
    },
    parseParameters: function(paramCount){
      // [<idntf> [, <idntf>]]
      var tok = this.tok;
      if (tok.isType(IDENTIFIER)) {
        if (paramCount === 0) throw 'Getters have no parameters.'+tok.syntaxError();
        if (this.isReservedIdentifier(DONTIGNOREVALUES)) throw 'Function param name is reserved.'+tok.syntaxError();
        tok.nextExpr();
        // there are only two valid next tokens; either a comma or a closing paren
        while (tok.nextExprIfNum(ORD_COMMA)) {
          if (paramCount === 1) throw 'Setters have exactly one param.'+tok.syntaxError();

          // param name
          if (tok.isType(IDENTIFIER)) {
            if (this.isReservedIdentifier(DONTIGNOREVALUES)) throw 'Function param name is reserved.'+tok.syntaxError();
            tok.nextPunc();
          } else {
            throw 'Missing func param name.'+tok.syntaxError();
          }
        }
      } else if (paramCount === 1) {
        throw 'Setters have exactly one param.'+tok.syntaxError();
      }
    },
    // TOFIX: rename `notForFunctionExpression` to indicate `firstTokenAfterFunctionCanBeRegex / Div` instead, flush through all callers
    parseBlock: function(notForFunctionExpression, inFunction, inLoop, inSwitch, labelSet){
      this.parseStatements(inFunction, inLoop, inSwitch, labelSet);
      // note: this parsing method is also used for functions. the only case where
      // the closing curly can be followed by a division rather than a regex lit
      // is with a function expression. that's why we needed to make it a parameter
      this.tok.mustBeNum(ORD_CLOSE_CURLY, notForFunctionExpression);
    },
    parseCompleteBlock: function(notForFunctionExpression, inFunction, inLoop, inSwitch, labelSet){
      this.tok.mustBeNum(ORD_OPEN_CURLY, NEXTTOKENCANBEREGEX);
      this.parseBlock(notForFunctionExpression, inFunction, inLoop, inSwitch, labelSet);
    },
    parseSemi: function(){
      if (this.tok.nextExprIfNum(ORD_SEMI)) return PUNCTUATOR;
      if (this.parseAsi()) return ASI;
      throw 'Unable to parse semi, unable to apply ASI.'+this.tok.syntaxError();
    },
    parseAsi: function(){
      // asi at EOF, if next token is } or if there is a newline between prev and next (black) token
      // asi prevented if asi would be empty statement, no asi in for-header, no asi if next token is regex

      var tok = this.tok;
      if (tok.isNum(ORD_CLOSE_CURLY) || (tok.getLastNewline() && !tok.isType(REGEX)) || tok.isType(EOF)) {
        return this.addAsi();
      }
      return PARSEDNOTHING;
    },
    addAsi: function(){
      ++this.tok.tokenCountAll;
      return ASI;
    },

    parseExpressionStatement: function(){
      this.parseExpressions();
      this.parseSemi();
    },
    parseExpressionOrLabel: function(labelName, inFunction, inLoop, inSwitch, labelSet){
      // this method is only called at the start of a statement that starts
      // with an identifier that is neither `function` nor a statement keyword

      // store value of identifier for label validation below.
      var identifier = this.tok.getLastValue();

      // this will stop before consuming the colon, if any.
      var assignable = this.parsePrimaryOrPrefix(REQUIRED, HASNONEW, MAYBELABEL);

      this.parseAssignments(assignable);
      this.parseNonAssignments();

      if (this.tok.nextExprIfNum(ORD_COLON)) {
        if (!assignable) throw 'Label ['+identifier+'] is a reserved keyword.'+this.tok.syntaxError();
        this.parseStatement(inFunction, inLoop, inSwitch, labelSet+' '+labelName, REQUIRED);
      } else {
        if (this.tok.nextExprIfNum(ORD_COMMA)) this.parseExpressions();
        this.parseSemi();
      }

    },
    parseOptionalExpressions: function(){
      var tok = this.tok;
      var tokCount = tok.tokenCountAll;
      this.parseExpressionOptional();
      if (tokCount !== tok.tokenCountAll) {
        while (tok.nextExprIfNum(ORD_COMMA)) {
          this.parseExpression();
        }
      }
    },
    parseExpressions: function(){
      // track for parseGroup, if this expression is wrapped, is it still assignable?
      var groupAssignable = this.parseExpression();
      var tok = this.tok;
      while (tok.nextExprIfNum(ORD_COMMA)) {
        this.parseExpression();
        groupAssignable = false;
      }
      return groupAssignable;
    },
    parseExpression: function(){
      var tok = this.tok;
      var tokCount = tok.tokenCountAll;

      // track for parseGroup whether this expression still assignable when
      var groupAssignable = this.parseExpressionOptional();

      // either tokenizer pos moved, or we reached the end (we hadnt reached the end before)
      if (tokCount === tok.tokenCountAll) throw 'Expected to parse an expression, did not find any.'+tok.syntaxError();

      return groupAssignable;
    },
    parseExpressionOptional: function(){
      var count = this.tok.tokenCountAll;
      var assignable = this.parsePrimary(OPTIONAL);
      var beforeAssignments = this.tok.tokenCountAll;
      if (count !== beforeAssignments) {
        this.parseAssignments(assignable);
        var beforeNonAssignments = this.tok.tokenCountAll;
        this.parseNonAssignments();
        var endCount = this.tok.tokenCountAll;

        // if there was a non-assign binary op, the whole thing is nonassign
        // if there were only assign ops, the whole thing is assignable
        // if there were no binary ops, the whole thing is whatever the primary was

        assignable = (beforeNonAssignments === endCount) && (beforeAssignments !== beforeNonAssignments || assignable);
      }

      // return state for parseGroup, to determine whether the group as a whole can be assignment lhs
      // the group needs to know about the prim expr AND any binary ops (inc assignments).
      return assignable;
    },
    parseAssignments: function(assignable){
      // assignment ops are allowed until the first non-assignment binary op
      var tok = this.tok;
      while (this.isAssignmentOperator()) {
        if (!assignable && this.options.strictAssignmentCheck) throw 'LHS of this assignment is invalid assignee.'+tok.syntaxError();
        // any assignment means not a for-in per definition
        tok.nextExpr();
        assignable = this.parsePrimary(REQUIRED);
      }
    },
    parseNonAssignments: function(){
      var tok = this.tok;
      // keep parsing non-assignment binary/ternary ops
      while (true) {
        if (this.isBinaryOperator()) {
          tok.nextExpr();
          this.parsePrimary(REQUIRED);
        }
        else if (tok.isNum(ORD_QMARK)) this.parseTernary();
        else break;
      }
    },
    parseTernary: function(){
      var tok = this.tok;
      tok.nextExpr();
      this.parseExpression();
      tok.mustBeNum(ORD_COLON, NEXTTOKENCANBEREGEX);
      this.parseExpression();
    },
    parseTernaryNoIn: function(){
      var tok = this.tok;
      tok.nextExpr();
      this.parseExpression();
      tok.mustBeNum(ORD_COLON, NEXTTOKENCANBEREGEX);
      this.parseExpressionNoIn();
    },
    parseExpressionsNoIn: function(){
      var tok = this.tok;

      var validForInLhs = this.parseExpressionNoIn();
      while (tok.nextExprIfNum(ORD_COMMA)) {
        // lhs of for-in cant be multiple expressions
        this.parseExpressionNoIn();
        validForInLhs = false;
      }

      return validForInLhs;
    },
    parseExpressionNoIn: function(){
      var assignable = this.parsePrimary(REQUIRED);
      var tok = this.tok;

      var count = tok.tokenCountAll;
      this.parseAssignments(assignable);

      // keep parsing non-assignment binary/ternary ops unless `in`
      var repeat = true;
      while (repeat) {
        if (this.isBinaryOperator()) {
          // rationale for using getLastNum; this is the `in` check which will succeed
          // about 50% of the time (stats from 8mb of various js). the other time it
          // will check for a primary. it's therefore more likely that an getLastNum will
          // save time because it would cache the charCodeAt for the other token if
          // it failed the check
          if (tok.getLastNum() === ORD_L_I && tok.getNum(1) === ORD_L_N && tok.getLastLen() === 2) { // in
            repeat = false;
          } else {
            tok.nextExpr();
            this.parsePrimary(REQUIRED);
          }
        } else if (tok.isNum(ORD_QMARK)) {
          this.parseTernaryNoIn();
        } else {
          repeat = false;
        }
      }

      return (assignable && count === tok.tokenCountAll);
    },

    /**
     * Parse a primary value including any prefix operators but without any
     * of the binary or postfix operators.
     *
     * @return {boolean} Is entire primary (prefix+core+suffix) assignable?
     */
    parsePrimary: function(optional){
      return this.parsePrimaryOrPrefix(optional, HASNONEW, NOTLABEL);
    },
    parsePrimaryOrPrefix: function(optional, hasNew, maybeLabel){
//      len:
//      1=387k
//      4=196k (this=126k)
//      3=68k
//      8=67k
//      2=60k
//
//      type:
//      13=741k
//      9=102k
//      10:81k
//      7=80k

      var tok = this.tok;
      var len = tok.getLastLen();
      var c = tok.getLastNum();

      if (tok.isType(IDENTIFIER)) {
        if (len > 2) {
          if (c === ORD_L_T) {
            if (len === 6 && tok.nextExprIfString('typeof')) {
              if (hasNew) throw 'typeof is illegal right after new.' + tok.syntaxError();
              this.parsePrimaryOrPrefix(REQUIRED, HASNONEW, NOTLABEL);
              return NOTASSIGNABLE;
            }
          } else if (tok.isNum(ORD_L_F) && tok.isString('function')) {
              this.parseFunction(NOTFORFUNCTIONDECL);

              // can never assign to function directly
              return this.parsePrimarySuffixes(NOTASSIGNABLE, hasNew, NOTLABEL);
          } else if (c === ORD_L_N) {
            if (tok.nextExprIfString('new')) {
              // new is actually assignable if it has a trailing property AND at least one paren pair
              return this.parsePrimaryOrPrefix(REQUIRED, HASNEW || hasNew, NOTLABEL);
            }
          } else if (c === ORD_L_D) {
            if (len === 6 && tok.nextExprIfString('delete')) {
              if (hasNew) throw 'delete is illegal right after new.'+tok.syntaxError();
              this.parsePrimaryOrPrefix(REQUIRED, HASNONEW, NOTLABEL);
              return NOTASSIGNABLE;
            }
          } else if (c === ORD_L_V) {
            if (tok.nextExprIfString('void')) {
              if (hasNew) throw 'void is illegal right after new.'+tok.syntaxError();
              this.parsePrimaryOrPrefix(REQUIRED, HASNONEW, NOTLABEL);
              return NOTASSIGNABLE;
            }
          }
        }

        return this.parsePrimaryCoreIdentifier(optional, hasNew, maybeLabel);
      }

      if ((c === ORD_EXCL || c === ORD_TILDE) && tok.getLastLen() === 1) {
        if (hasNew) throw '! and ~ are illegal right after new.'+tok.syntaxError();
        tok.nextExpr();
        this.parsePrimaryOrPrefix(REQUIRED, HASNONEW, NOTLABEL);
        return NOTASSIGNABLE;
      }

      if (c === ORD_MIN || c === ORD_PLUS) {
        if (hasNew) throw 'illegal operator right after new.'+tok.syntaxError();
        // have to verify len anyways, for += and -= case
        if (tok.getLastLen() === 1) {
          tok.nextExpr();
          this.parsePrimaryOrPrefix(REQUIRED, HASNONEW, NOTLABEL);
        } else if (tok.getNum(1) === c) {
          tok.nextExpr();
          var assignable = this.parsePrimaryOrPrefix(REQUIRED, HASNONEW, NOTLABEL);
          if (!assignable && this.options.strictAssignmentCheck) throw 'The rhs of ++ or -- was not assignable.' + tok.syntaxError();
        }
        return NOTASSIGNABLE;
      }

      // TOFIX: I think maybeLabel should just be false here...?
      return this.parsePrimaryCoreOther(optional, hasNew, maybeLabel);
    },
    parsePrimaryCoreIdentifier: function(optional, hasNew, maybeLabel){
      var tok = this.tok;
      var identifier = tok.getLastValue();
      var c = tok.getLastNum();

      if (maybeLabel ? this.isReservedIdentifierSpecial() : this.isReservedIdentifier(IGNOREVALUES)) {
        throw 'Reserved identifier ['+identifier+'] found in expression.'+tok.syntaxError();
      }

      tok.nextPunc();

      // can not assign to keywords, anything else is fine here
      return this.parsePrimarySuffixes(!this.isValueKeyword(c, identifier), hasNew, maybeLabel);
    },
    parsePrimaryCoreOther: function(optional, hasNew, maybeLabel){
      var assignable = this.parsePrimaryValue(optional);
      return this.parsePrimarySuffixes(assignable, hasNew, maybeLabel);
    },
    parsePrimaryValue: function(optional){
      // at this point in the expression parser we will have ruled out anything else.
      // the next token(s) must be some kind of non-identifier expression value...
      // returns whether the entire thing is assignable

      var tok = this.tok;

      // we know it's going to be a punctuator so we wont use tok.isValue() here
      var t = tok.lastType;
      if (t === STRING || t === NUMBER || t === REGEX) {
        tok.nextPunc();
        return NOTASSIGNABLE;
      }

      if (tok.nextExprIfNum(ORD_OPEN_PAREN)) {
        return this.parseGroup();
      }

      if (tok.nextExprIfNum(ORD_OPEN_CURLY)) {
        // TOFIX: make test for this being non-assignable
        this.parseObject();
        return NOTASSIGNABLE;
      }

      if (tok.nextExprIfNum(ORD_OPEN_SQUARE)) {
        // TOFIX: make test for this being non-assignable
        this.parseArray();
        return NOTASSIGNABLE;
      }

      if (!optional) throw 'Unable to parse required primary value.'+tok.syntaxError();
      // if the primary was optional but not found, the return value here is irrelevant
      return ASSIGNABLE;
    },
    parsePrimarySuffixes: function(assignable, unassignableUntilAfterCall, maybeLabel){
      // --
      // ++
      // .<idntf>
      // [<exprs>]
      // (<exprs>)

      // label edge case. if any suffix parsed, colon is no longer valid
      var colonIsError = false;

      if (unassignableUntilAfterCall) assignable = false; // for new, must have trailing property _after_ a call

      var tok = this.tok;
      while (true) {
        // see c frequency stats in /stats/primary suffix start.txt
        var c = tok.getLastNum();
        if (c > 0x2e) {
          // only c>0x2e relevant is OPEN_SQUARE
          if (c !== ORD_OPEN_SQUARE) break;
          tok.nextExpr();
          this.parseExpressions(); // required
          tok.mustBeNum(ORD_CLOSE_SQUARE, NEXTTOKENCANBEDIV); // ] cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          if (!unassignableUntilAfterCall) assignable = true; // trailing property
        } else if (c === ORD_DOT) {
          if (!tok.isType(PUNCTUATOR)) throw 'Dot/Number (?) after identifier?'+tok.syntaxError(); // can we remove this line for build?
          tok.nextPunc();
          tok.mustBeIdentifier(NEXTTOKENCANBEDIV); // cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          if (!unassignableUntilAfterCall) assignable = true; // trailing property
        } else if (c === ORD_OPEN_PAREN) {
          tok.nextExpr();
          this.parseOptionalExpressions();
          tok.mustBeNum(ORD_CLOSE_PAREN, NEXTTOKENCANBEDIV); // ) cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          unassignableUntilAfterCall = false;
          assignable = false; // call, only assignable in IE (case ignored)
        } else {

          if ((c === ORD_PLUS || c === ORD_MIN) && tok.getNum(1) === c) {
            if (!assignable && this.options.strictAssignmentCheck) throw 'Postfix increment not allowed here.' + this.tok.syntaxError();
            tok.nextPunc();
            assignable = false; // ++
          }

          break;
        }
        colonIsError = true;
      }
      if (colonIsError && maybeLabel && c === ORD_COLON) throw 'Invalid label here, I think.'+tok.syntaxError();
      return assignable;
    },
    isAssignmentOperator: function(){
      // includes any "compound" operators

      // this method works under the assumption that the current token is
      // part of the set of valid tokens for js. So we don't have to check
      // for string lengths unless we need to disambiguate optional chars

      var tok = this.tok;
      var len = tok.getLastLen();
      var c = tok.getLastNum();

      if (len === 1) return c === ORD_IS;

      if (len === 2) {
        // if a token, which must be valid at this point has the equal sign
        // as second char and length 2 there is a white list and black list
        // of possible options;
        // good: += -= *= |= &= ^= /= ~=
        // bad: == >= <= !=
        // the danger here is testing becomes very hard because it doesnt
        // see the difference between assignment op and nonassign binary op
        // the gain is minimal since compound ops dont occur very often

        return ((
            c === ORD_PLUS ||
            c === ORD_MIN ||
            c === ORD_OR ||
            c === ORD_AND ||
            c === ORD_FWDSLASH
          ) && (tok.getNum(1) === ORD_IS)) ||
          c === ORD_STAR ||
          c === ORD_PERCENT ||
          c === ORD_XOR;
      }

      // these <<= >>= >>>= cases are very rare

      // valid tokens starting with < are: < <= << <<= only len=3 is what we want here
      if (c === ORD_LT) return len === 3;

      // valid tokens starting with > are: > >> >= >>= >>> >>>=, we only look for >>= and >>>=
      if (c === ORD_GT) return (len === 4 || (len === 3 && tok.getNum(2) === ORD_IS));

      return false;
    },
    isBinaryOperator: function(){
      // _non-assignment binary operator

      // this method works under the assumption that the current token is
      // part of the set of valid _tokens_ for js. That means we only have
      // to do extra checks for a token to disambiguate other valid tokens,
      // usually to eliminate assignments.

      // if the input token is not a punctuator or identifier (-> in/instanceof)
      // the code will result in an error.
      // identifier happens about 0.5% of the time
      // punctuator is 99.5%

      // len=1: 93%
      // len=2: 5%
      // len=3: 1%
      // len>3: nearly 1%

      // function returns false in 86% of the calls

      var tok = this.tok;
      var c = tok.getLastNum();
      var len = tok.getLastLen();

      if (c === ORD_SEMI || c === ORD_CLOSE_PAREN || c === ORD_COMMA) return false; // expression enders: 26% 24% 20%
      if (len === 1) {
        if (c === ORD_CLOSE_SQUARE || c === ORD_CLOSE_CURLY) return false; // expression/statement enders: 7% 6%
        return c === ORD_PLUS || c === ORD_STAR || c === ORD_LT || c === ORD_MIN || c === ORD_GT || c === ORD_FWDSLASH || c === ORD_AND || c === ORD_OR || c === ORD_PERCENT || c === ORD_XOR;
      }
      if (len === 2) {
        return c === ORD_IS || c === ORD_EXCL || c === ORD_LT || c === ORD_GT || (c === ORD_AND && tok.getNum(1) === ORD_AND) || (c === ORD_OR && tok.getNum(1) === ORD_OR) || tok.isString('in');
      }
      if (len === 3) {
        return c === ORD_IS || c === ORD_EXCL || (c === ORD_GT && tok.getNum(2) === ORD_GT)
      }
      if (len === 10) return tok.isString('instanceof');

      // not a (non-assignment) binary operator
      return false;
    },

    parseGroup: function(){
      // the expressions is required, the group is nonassignable if:
      // - wraps multiple expressions
      // - if the single expression is nonassignable
      // - if it wraps an assignment
      var groupAssignable = this.parseExpressions();

      // groups cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      this.tok.mustBeNum(ORD_CLOSE_PAREN, NEXTTOKENCANBEDIV);

      return groupAssignable;
    },
    parseArray: function(){
      var tok = this.tok;
      do {
        this.parseExpressionOptional(); // just one because they are all optional (and arent in expressions)
      } while (tok.nextExprIfNum(ORD_COMMA)); // elision

      // array lits cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      tok.mustBeNum(ORD_CLOSE_SQUARE, NEXTTOKENCANBEDIV);
    },
    parseObject: function(){
      var tok = this.tok;
      do {
        // note: __isValue also passes for a REGEX, objlits dont allow this. we need to check extra.
        // TOFIX: can we perhaps postpone this check till the end? it only fails if there's a syntax error or }
        if (tok.isValue() && !tok.isType(REGEX)) this.parsePair();
      } while (tok.nextExprIfNum(ORD_COMMA)); // elision

      // obj lits cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      tok.mustBeNum(ORD_CLOSE_CURLY, NEXTTOKENCANBEDIV);
    },
    parsePair: function(){
      var tok = this.tok;
      if (tok.isNum(ORD_L_G) && tok.nextPuncIfString('get')) {
        if (tok.isType(IDENTIFIER)) {
          if (this.isReservedIdentifier(DONTIGNOREVALUES)) throw 'Getter name is reserved.'+tok.syntaxError();
          tok.nextPunc();

          this.parseFunctionRemainder(0, FORFUNCTIONDECL);
        }
        else this.parseDataPart();
      } else if (tok.isNum(ORD_L_S) && tok.nextPuncIfString('set')) {
        if (tok.isType(IDENTIFIER)) {
          if (this.isReservedIdentifier(DONTIGNOREVALUES)) throw 'Getter name is reserved.'+tok.syntaxError();
          tok.nextPunc();

          this.parseFunctionRemainder(1, FORFUNCTIONDECL);
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
      this.tok.mustBeNum(ORD_COLON, NEXTTOKENCANBEREGEX);
      this.parseExpression();
    },

    isReservedIdentifierSpecial: function(){
      // Same as isReservedIdentifier but without the statement
      // keywords, value keywords and unary operators because
      // they'll be valid at this point. This check is specific
      // to the expression or label parsing func.

      // Note that none of these checks should pass.
      // This function returns 100% false. Let's be quick about it.

      var value;
      var tok = this.tok;
      var c = tok.getLastNum();

      // stats:
      // len: 1:26%, 2:6%, 3:6%, 4:34%, 5:5%, 6:5%, 7:3%, 8:3%
      // chr: a:5%, b:4%, c:5%, d:3%, e:3%, f:1%, g:2%, h:1%, i:1%, j:1%, k:1%, l:1%, m:2%, n:2%, o:1%, p:2%, q:0%, r:2%, s:2%, t:30%, u:1%, v:1%, w:1%, x:0%, y:0%, z:0%, rest: 28%
      // so: len=1 and c=t and c as non-lowercase-letter should exit early

      if (
        c < ORD_L_C || // 38%
        c === ORD_L_T || // 30%
        tok.getLastLen() === 1 // 14%
      ) return false;

      // stats now:
      // len: 1:0, 2:3%, 3:2%, 4:3%, 5:2%, 6:2%, 7:2%, 8:1%, >8:4%
      // chr: a:0, b:0, c:2%, d:1%, e:1%, f:1%, g:1%, h:1%, i:1%, j:0%, k:0%, l:1%, m:1%, n:1%, o:1%, p:2%, q:0%, r:1%, s:2%, t:0, u:0%, v:1%, w:0%, x:0%, y:0%, z:0%, rest:0
      // so: meh. note: no rest because capitals and such are already discarded with the <c check. same goes for _ and $.

      // rest true: 9%, false: 11%?

      if (c === ORD_L_C) { // 2.5%
        var d = tok.getNum(1);
        return (d === ORD_L_O && tok.getLastValue() === 'const') || (d === ORD_L_A && ((value=tok.getLastValue()) === 'catch' || value === 'case')) || (d === ORD_L_L && tok.getLastValue() === 'class')
      }

      if (c === ORD_L_S) { // 1.8%
        return tok.getNum(1) === ORD_L_U && tok.getLastValue() === 'super';
      }

      if (c === ORD_L_D) { // 1.5%
        return tok.getNum(1) === ORD_L_E && tok.getLastValue() === 'default';
      }

      if (c === ORD_L_E) { // 1.1%
        var d = tok.getNum(1);
        return (d === ORD_L_L && tok.getLastValue() === 'else') || (d === ORD_L_N && tok.getLastValue() === 'enum') || (d === ORD_L_X && ((value=tok.getLastValue()) === 'export' || value === 'extends'));
      }

      if (c === ORD_L_F) { // 0.8%
        return tok.getNum(1) === ORD_L_I && tok.getLastValue() === 'finally';
      }

      if (c === ORD_L_I) { // 0.8%
        var d = tok.getNum(1);
        return (d === ORD_L_N && (tok.getLastLen() === 2 || tok.getLastValue() === 'instanceof')) || (d === ORD_L_M && tok.getLastValue() === 'import');
      }

      return false;
    },

    /**
     * Return whether the current token is a reserved identifier or not.
     * Presumably only called on identifiers. If the boolean arg is
     * true, the keywords [true, false, this, function, null] are ignored
     * for this check. This will be the case when parsing expression vars.
     * See also this.isValueKeyword
     *
     * @param {boolean} ignoreValues When true, still returns false even if token is one of [true, false, this, function, null]
     * @return {boolean}
     */
    isReservedIdentifier: function(ignoreValues){
      // Note that this function will return false most of the time
      // If it returns true a syntax error will probably be thrown.
      // In all non-error cases input token will be an identifier

      // len=1: 36%
      // len=2: 7%
      // len=3: 7%
      // len=4: 24%
      // len=5: 5%
      // len=6: 4%
      // len=7: 3%
      // len=8: 3%
      // each len >8 is <=2%, combined: 11%

      // keywords per len (from the 16mb bench file):
      // 1:
      // 2: do if in: never happens (could it validly?)
      // 3: new var for try: never happens (could it validly?)
      // 4: case else void this with enum true null: 17% [this:15.5%, true:1%, null:1.2%]
      // 5: break catch while throw class super const false: 1% [false: 1%]
      // 6: typeof return switch delete export import: never
      // 7: finally default extends: never
      // 8: continue debugger function: never
      // 9:
      // 10: instanceof: never

      // From the above it's obvious that only value keywords might be found
      // by this function. anything else is probably an error.
      // The reason statement keywords are not found here is because that is
      // handled by a function that specifically scans them.

      var value;
      var tok = this.tok;
      var c = tok.getLastNum();
      var len = tok.getLastLen();

      // a:8%, b:6%, c:6%, d:4%, e:4%, f:3%, g:2%, h:2%, i:4%, j:1%, k:1%, l:2%, m:2%, n:4%, o:2%, p:3%, q:0%, r:2%, s:3%, t:17%, u:1%, v:2%, w:1%, x:1%, y:1%, z:0%, rest:17%

      if (len === 1) return false; // 39%

      // stats after only dropping len=1:
      // len: 1:0, 2:7%, 3:7%, 4:22%, 5:5%, 6:4%, 7:3%, 8:3%, rest:10%
      // chr: a:2%, b:2%, c:3%, d:2%, e:2%, f:2%, g:1%, h:1%, i:2%, j:0%, k:1%, l:1%, m:1%, n:3%, o:1%, p:2%, q:0%, r:1%, s:3%, t:16%, u:1%, v:1%, w:1%, x:0%, y:0%, z:0%, rest: 12%
      // conclusion: len=4 (22%) has a significance. c=t (12%) does too. probably the same step, unfortunately. can probably do the <=a trick here as well

      if (c <= ORD_L_A) return false; // 14%

      // after dropping <=a
      // 1:0, 2:2%, 3:2%, 4:8%, 5:2%, 6:1%, 7:1%, 8:1%, rest: 3%
      // a:0, b:1%, c:1%, d:1%, e:1%, f:0%, g:0%, h:0%, i:1%, j:0%, k:0%, l:0%, m:1%, n:1%, o:1%, p:1%, q:0%, s:1%, t:7%, u:0%, v:1%, w:0%, x:0%, y:0%, z:0%, rest:0
      // so: only c=t and len=4 are standing out, slightly. rest is negligible

      if (len === 4) { // 19%
        // case else void this with enum true null
        // relevant character stats per position:
        // 1: t:14% n:2% (centvw)
        // 2: h:12% a:1% e:1% o:1% r:1% u:2% (ahilnoru)
        // 3: i:13% d:1% e:1% l:2% u:1% (ilstu)
        // 4: s:13% e:3% l:2% t:1% (dehmls)

        // true
        // this
        if (c === ORD_L_T) {
          if (ignoreValues) return false;
          var value = tok.getLastValue();
          return (value === 'this' || value === 'true');
        }

        // null
        if (c === ORD_L_N) {
          return !ignoreValues && tok.getLastValue() === 'null';
        }

        // else
        // enum
        if (c === ORD_L_E) {
          // case else true
          var value = tok.getLastValue();
          return (value === 'else' || value === 'enum');
        }

        // case
        if (c === ORD_L_C) {
          return tok.getLastValue() === 'case';
        }

        if (c < ORD_L_V) return false; // 2.3% (way more than the 0.15% of v and w)

        // void
        if (c === ORD_L_V) {
          return !ignoreValues && tok.getLastValue() === 'void';
        }

        // with
        if (c === ORD_L_W) {
          return tok.getLastValue() === 'with';
        }

        return false;
      }

//      bcdefinrstvw

      // 1:0 2:4.6 3:4 4:0 5:4.2 6:3 7:2.7 8:2.2 >8:6.9 = 27.6
      // a:0 b:1.5 c:2.5 d:1.5 e:1.5 f:2 g:1 h:0.5 i:1.5 j:0.5 k:0.5 l:1 m:1: n:1 o:1.5 p:2: q:0 r:1.5 s:2.5 t:1.5 u:1: v:1 w:0.5 x:0.5 y:0 z:0

      if (len >= 7) { // 11.7%

        // 7: finally default extends: never
        // 8: continue debugger function: never
        // 10: instanceof: never
        // cdefi

        if (c > ORD_L_I) return false; // 6.4%

        if (c === ORD_L_C) { // 1.5%
          return tok.getLastValue() === 'continue';
        }

        if (c === ORD_L_D) { // 0.8%
          var value = tok.getLastValue();
          return value === 'default' || value === 'debugger';
        }

        if (c === ORD_L_E) { // 0.8%
          return tok.getLastValue() === 'extends';
        }

        if (c === ORD_L_F) { // 0.5%
          var value = tok.getLastValue();
          return value === 'finally' || value === 'function';
        }

        if (c === ORD_L_I) { // 0.7%
          return tok.getLastValue() === 'instanceof';
        }

        return false; // 1%
      }

      // 3: new var for try : 4
      // 5: break catch while throw class super const false: 4.2
      // 6: typeof return switch delete export import: never: 3

      if (len === 2) { // 4.6%
        if (c === ORD_L_I) {
          var value = tok.getLastValue();
          return value === 'if' || value === 'in';
        }
        if (c === ORD_L_D) return tok.getLastValue() === 'do';
        return false;
      }

      if (len === 5) { // 4.2%
        if (c === ORD_L_F) return !ignoreValues && tok.getLastValue() === 'false';
        if (c === ORD_L_S) return tok.getLastValue() === 'super';
        if (c === ORD_L_C) {
          var value = tok.getLastValue();
          return value === 'catch' || value === 'class' || value === 'const';
        }
        if (c === ORD_L_T) return tok.getLastValue() === 'throw';
        if (c === ORD_L_B) return tok.getLastValue() === 'break';
        if (c === ORD_L_W) return tok.getLastValue() === 'while';
        return false;
      }

      if (len === 3) { // 4%
        if (c === ORD_L_N) return !ignoreValues && tok.getLastValue() === 'new';
        if (c === ORD_L_V) return tok.getLastValue() === 'var';
        if (c === ORD_L_T) return tok.getLastValue() === 'try';
        if (c === ORD_L_F) return tok.getLastValue() === 'for';
        return false;
      }

      // 3%

      if (c === ORD_L_S) return tok.getLastValue() === 'switch';
      if (c === ORD_L_R) return tok.getLastValue() === 'return';
      if (c === ORD_L_T) return !ignoreValues && tok.getLastValue() === 'typeof';
      if (c === ORD_L_I) return tok.getLastValue() === 'import';
      if (c === ORD_L_E) return tok.getLastValue() === 'export';
      if (c === ORD_L_D) return !ignoreValues && tok.getLastValue() === 'delete';
      return false;
    },

    isValueKeyword: function(c, word){
      if (c === ORD_L_T) return word.length === 4 && (word === 'true' || word === 'this');
      if (c === ORD_L_F) return word === 'false';
      return c === ORD_L_N && word === 'null';
    },
  };

  (function chromeWorkaround(){
    // workaround for https://code.google.com/p/v8/issues/detail?id=2246
    var o = {};
    for (var k in proto) o[k] = proto[k];
    Par.prototype = o;
  })();

})(typeof exports === 'object' ? exports : window);
