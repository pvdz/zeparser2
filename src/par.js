// If you see magic numbers and bools all over the place, it means this
// file has been post-processed by a build script. If you want to read
// this file, see https://github.com/qfox/zeparser2

// TOFIX: generate huge benchmark files and derive specific coding styles from them; tabs vs spaces, newline (cr/lf/crlf), minified vs normal, unicode identifiers/jquery/underscore heavy/uppercase, if/else vs &&||, labels usage (build script), etc

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

  var ORD_L_A = 0x61;
  var ORD_L_B = 0x62;
  var ORD_L_C = 0x63;
  var ORD_L_D = 0x64;
  var ORD_L_E = 0x65;
  var ORD_L_F = 0x66;
  var ORD_L_G = 0x67;
  var ORD_L_H = 0x68;
  var ORD_L_I = 0x69;
  var ORD_L_L = 0x6c;
  var ORD_L_M = 0x6d;
  var ORD_L_N = 0x6e;
  var ORD_L_O = 0x6f;
  var ORD_L_Q = 0x71;
  var ORD_L_R = 0x72;
  var ORD_L_S = 0x73;
  var ORD_L_T = 0x74;
  var ORD_L_U = 0x75;
  var ORD_L_V = 0x76;
  var ORD_L_W = 0x77;
  var ORD_L_X = 0x78;
  var ORD_L_Y = 0x79;

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
      if (tok.pos !== tok.len) throw 'Did not complete parsing... '+tok.syntaxError();

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

      var tok = this.tok;
      var assignable = true;
      var parsedUnary = this.parseUnary();

      if (parsedUnary) {
        assignable = false;
        this.parsePrimary(REQUIRED);
      } else {
        // verify label name and check if it's succeeded by a colon

        // TOFIX: we dont have to check for any of the statement identifiers (break, return, if). can we optimize this case? is it worth it?
        if (this.isReservedIdentifier(IGNOREVALUES)) throw 'Reserved identifier ['+this.tok.getLastValue()+'] found in expression.'+tok.syntaxError();
        tok.nextPunc();

        var isValueKeyword = this.isValueKeyword(labelName);

        if (tok.nextExprIfNum(ORD_COLON)) {
          if (isValueKeyword) throw 'Label is a reserved keyword.'+this.syntaxError();
          this.parseStatement(inFunction, inLoop, inSwitch, labelSet+' '+labelName, REQUIRED);
          return; // return undefined, not boolean
        }

        assignable = !isValueKeyword;
      }

      assignable = this.parsePrimarySuffixes(assignable) && !parsedUnary;

      this.parseAssignments(assignable);
      this.parseNonAssignments();

      if (this.tok.nextExprIfNum(ORD_COMMA)) this.parseExpressions();
      this.parseSemi();
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
      // any kind of operator in a group makes it unassignable (except new with trailing prop...)
      var assignable = this.parsePrimary(OPTIONAL);

      // TOFIX: we havent validated actually having a primary yet. this might pass `f(=a)` kinds of crap
      var count = this.tok.tokenCountAll;
      this.parseAssignments(assignable);
      this.parseNonAssignments();

      // return state for parseGroup, to determine whether the group as a whole can be assignment lhs
      // the group needs to know about the prim expr AND any binary ops (inc assignments).
      return (assignable && count === this.tok.tokenCountAll);
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
     * Parse the "primary" expression value. This is like the root
     * value for any expression. Could be a number, string,
     * identifier, etc. The primary can have a prefix (like unary
     * operators) and suffixes (++, --) but they are parsed elsewhere.
     *
     * @return {boolean}
     */
    parsePrimary: function(optional){
      // parses parts of an expression without any binary operators
      // TOFIX: unary ++ -- should also report error if rest of primary before suffix is unassignable

      // should make unary parse remainder of primary if it exists, check if its assignable, reject if not with ++--
      // should add special suffix-is-assignable args for new

      var parsedUnary = this.parseUnary(); // no unary can be valid in the lhs of an assignment
      var assignable;

      var tok = this.tok;
      if (tok.isType(IDENTIFIER)) {
        var identifier = tok.getLastValue();
        // TOFIX: confirm whether we should do an isnum check before a reserved identifier check (the identifier check subsumes it)
        if (tok.isNum(ORD_L_F) && identifier === 'function') {
          this.parseFunction(NOTFORFUNCTIONDECL);

          // can never assign to function directly
          assignable = false;
        } else {
          // TOFIX: maybe we can have isReservedIdentifier return a number indicating a value or not and skip the mandatory value check later
          if (this.isReservedIdentifier(IGNOREVALUES)) throw 'Reserved identifier found in expression.'+tok.syntaxError();
          tok.nextPunc();

          // any non-keyword identifier can be assigned to
          assignable = !this.isValueKeyword(identifier);
        }

      } else {
        assignable = this.parsePrimaryValue(optional, parsedUnary);
      }

      assignable = this.parsePrimarySuffixes(assignable);

      // TOFIX: exception for `new` and a trailing property
      return parsedUnary ? false : assignable;
    },
    parsePrimaryValue: function(optional, parsedUnary){
      // at this point in the expression parser we will have ruled out anything else.
      // the next token(s) must be some kind of non-identifier expression value...
      // returns whether the entire thing is assignable

      var tok = this.tok;

      if (tok.nextPuncIfValue()) {
        return false;
      }

      if (tok.nextExprIfNum(ORD_OPEN_PAREN)) {
        return this.parseGroup();
      }

      if (tok.nextExprIfNum(ORD_OPEN_CURLY)) {
        // TOFIX: make test for this being non-assignable
        this.parseObject();
        return false;
      }

      if (tok.nextExprIfNum(ORD_OPEN_SQUARE)) {
        // TOFIX: make test for this being non-assignable
        this.parseArray();
        return false;
      }

      if (!optional || parsedUnary) throw 'Unable to parse required primary value.'+tok.syntaxError();

      // if the primary was optional but not found, the return value here is irrelevant
      return true;
    },
    parseUnary: function(){
      var parsed = PARSEDNOTHING;
      var tok = this.tok;
      // EOF check: `++` will run into infinite loop otherwise
      while (!tok.isType(EOF) && this.testUnary()) {
        tok.nextExpr();
        parsed = PARSEDSOMETHING;
      }
      return parsed; // influences possibility of label, assignability of primary
    },
    testUnary: function(){

      // this method works under the assumption that the current token is
      // part of the set of valid tokens for js. So we don't have to check
      // for string lengths unless we need to disambiguate optional chars

      var tok = this.tok;
      var len = tok.getLastLen();

      // TOFIX: we can probably improve on this ... my initial attempt failed though.
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

      if (len > 2) {
        var c = tok.getLastNum();
        if (c === ORD_L_T) return (len === 6 && tok.getLastValue() === 'typeof');
        if (c === ORD_L_N) return (tok.getLastValue() === 'new');
        if (c === ORD_L_D) return (len === 6 && tok.getLastValue() === 'delete');
        if (c === ORD_L_V) return (tok.getLastValue() === 'void');
      } else if (len === 1) {
        var c = tok.getLastNum();
        return c === ORD_EXCL || c === ORD_MIN || c === ORD_PLUS || c === ORD_TILDE;
      } else {
        var c = tok.getLastNum();
        return (c === ORD_MIN || c === ORD_PLUS) && tok.getNum(1) === c;
      }

      return false;
    },
    parsePrimarySuffixes: function(assignable){
      // --
      // ++
      // .<idntf>
      // [<exprs>]
      // (<exprs>)

      // TOFIX: the order of these checks doesn't appear to be optimal (numbers first?)
      var tok = this.tok;
      var repeat = true;
      while (repeat) {
        var c = tok.getLastNum();
        // need tokenizer to check for a punctuator because it could never be a regex (foo.bar, we're at the dot between)
//        if (((c/10)|0)!==4) { // ORD_DOT ORD_OPEN_PAREN ORD_PLUS ORD_MIN are all 40's
        if (c > 0x2e) { // ORD_DOT ORD_OPEN_PAREN ORD_PLUS ORD_MIN are all 40's
          if (c === ORD_OPEN_SQUARE) {
            tok.nextExpr();
            this.parseExpressions(); // required
            tok.mustBeNum(ORD_CLOSE_SQUARE, NEXTTOKENCANBEDIV); // ] cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
            assignable = true; // trailing property
          } else {
            repeat = false;
          }
        } else if (c === ORD_DOT) {
          if (!tok.isType(PUNCTUATOR)) throw 'Dot/Number (?) after identifier?'+tok.syntaxError();
          tok.nextPunc();
          tok.mustBeIdentifier(NEXTTOKENCANBEDIV); // cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          assignable = true; // trailing property
        } else if (c === ORD_OPEN_PAREN) {
          // TOFIX: if expression was non-assignable up to here, this is an error under the assignment flag
          tok.nextExpr();
          this.parseOptionalExpressions();
          tok.mustBeNum(ORD_CLOSE_PAREN, NEXTTOKENCANBEDIV); // ) cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          assignable = false; // call, only assignable in IE (case ignored)
        } else if (c === ORD_PLUS && tok.getNum(1) === ORD_PLUS) {
          if (!assignable && this.options.strictAssignmentCheck) throw 'Postfix increment not allowed here.'+this.tok.syntaxError();
          // TOFIX: if expression was non-assignable up to here, this is an error under the assignment flag
          tok.nextPunc();
          assignable = false; // ++
          repeat = false;
        } else if (c === ORD_MIN &&  tok.getNum(1) === ORD_MIN) {
          if (!assignable && this.options.strictAssignmentCheck) throw 'Postfix decrement not allowed here.'+this.tok.syntaxError();
          tok.nextPunc();
          assignable = false; // --
          repeat = false;
        } else {
          repeat = false;
        }
      }
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

      else if (len === 2) {
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

      else {
        // TOFIX: len checks may be optimized away. can they fail at this point?
        // these <<= >>= >>>= cases are very rare
        if (len === 3 && c === ORD_LT) {
          return (tok.getNum(1) === ORD_LT && tok.getNum(2) === ORD_IS); // <<=
        }
        else if (c === ORD_GT) {
          return ((tok.getNum(1) === ORD_GT) && (
            (len === 4 && tok.getNum(2) === ORD_GT && tok.getNum(3) === ORD_IS) || // >>>=
            (len === 3 && tok.getNum(2) === ORD_IS) // >>=
          ));
        }
      }

      return false;
    },
    isBinaryOperator: function(){
      // _non-assignment binary operator

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

      // (most frequent, for 27% 23% and 20% of the times this method is
      // called, c will be one of them (simple expression enders)
      if (c === ORD_CLOSE_PAREN || c === ORD_SEMI || c === ORD_COMMA) return false;

      // quite frequent (more than any other single if below it) are } (8%)
      // and ] (7%). Maybe I'll remove this in the future. The overhead may
      // not be worth the gains. Hard to tell... :)
      else if (c === ORD_CLOSE_SQUARE || c === ORD_CLOSE_CURLY) return false;

      // if len is more than 1, it's either a compound assignment (+=) or a unary op (++)
      else if (c === ORD_PLUS) return (tok.getLastLen() === 1);

      // === !==
      else if (c === ORD_IS || c === ORD_EXCL) {
        // we already know token is valid. all tokens that start with = and ! are:
        // = ! == != === !==, so we must only make sure length > 1
        return tok.getLastLen() > 1;
      }

      // & &&
      else if (c === ORD_AND) return (tok.getLastLen() === 1 || tok.getNum(1) === ORD_AND);

      // | ||
      else if (c === ORD_OR) return (tok.getLastLen() === 1 || tok.getNum(1) === ORD_OR);

      else if (c === ORD_LT) {
        // we already know token is valid. all tokens that start with < are:
        // < <= << <<=, so we must only make sure it's not length=3.
        return tok.getLastLen() < 3;
      }

      // if len is more than 1, it's a compound assignment (*=)
      else if (c === ORD_STAR) return (tok.getLastLen() === 1);

      else if (c === ORD_GT) {
        // >
        // >>
        // >>>
        // >=
        // >>=
        // >>>=

        var len = tok.getLastLen();
        // all the len 1 or 2 tokens are fine here. len 3 might be assignment. 4 is always assignment (only one)
        // note: tokenizer already makes sure each token is valid. we can skip some checks here
        return (len < 3 || (len === 3 && tok.getNum(2) === ORD_GT)); // >= >> >>>
      }

      // if len is more than 1, it's a compound assignment (%=, ^=, /=, -=)
      else if (c === ORD_PERCENT || c === ORD_XOR || c === ORD_FWDSLASH || c === ORD_MIN) return (tok.getLastLen() === 1);

      // if not punctuator, it could still be `in` or `instanceof`...
      else if (c === ORD_L_I) {
        var len = tok.getLastLen();
        return (len === 2 && tok.getNum(1) === ORD_L_N) || (len === 10 && tok.getLastValue() === 'instanceof');
      }

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
      // TOFIX: should ignoreValues also skip `function`?

      var tok = this.tok;

      if (tok.getLastLen() > 1) {
        var c = tok.getLastNum();
        if (c >= ORD_L_A && c <= ORD_L_W) {
          if (c < ORD_L_G || c > ORD_L_Q) {
            if (c === ORD_L_T) {
              var d = tok.getNum(1);
              if (d === ORD_L_H) {
                var id = tok.getLastValue();
                if (id === 'this') return !ignoreValues;
                return id === 'throw';
              } else if (d === ORD_L_R) {
                var id = tok.getLastValue();
                if (id === 'true') return !ignoreValues;
                if (id === 'try') return true;
              } else if (d === ORD_L_Y) {
                return tok.getLastValue() === 'typeof';
              }
            } else if (c === ORD_L_S) {
              var d = tok.getNum(1);
              if (d === ORD_L_W) {
                return tok.getLastValue() === 'switch';
              } else if (d === ORD_L_U) {
                return tok.getLastValue() === 'super';
              } else {
                return false;
              }
            } else if (c === ORD_L_F) {
              var d = tok.getNum(1);
              if (d === ORD_L_A) {
                if (ignoreValues) return false;
                return tok.getLastValue() === 'false';
              } else if (d === ORD_L_U) {
                // this is an ignoreValues case as well, but can never be triggered
                // rationale: this function is only called with ignoreValues true
                // when checking a label. labels are first words of statements. if
                // function is the first word of a statement, it will never branch
                // to parsing an identifier expression statement. and never get here.
                return tok.getLastValue() === 'function';
              } else if (d === ORD_L_O) {
                return tok.getLastValue() === 'for';
              } else if (d === ORD_L_I) {
                return tok.getLastValue() === 'finally';
              }
            } else if (c === ORD_L_D) {
              var d = tok.getNum(1);
              if (d === ORD_L_O) {
                return tok.getLastLen() === 2; // do
              } else if (d === ORD_L_E) {
                var id = tok.getLastValue();
                return id === 'debugger' || id === 'default' || id === 'delete';
              }
            } else if (c === ORD_L_E) {
              var d = tok.getNum(1);
              if (d === ORD_L_L) {
                return tok.getLastValue() === 'else';
              } else if (d === ORD_L_N) {
                return tok.getLastValue() === 'enum';
              } else if (d === ORD_L_X) {
                var id = tok.getLastValue();
                return id === 'export' || id === 'extends';
              }
            } else if (c === ORD_L_B) {
              return tok.getNum(1) === ORD_L_R && tok.getLastValue() === 'break';
            } else if (c === ORD_L_C) {
              var d = tok.getNum(1);
              if (d === ORD_L_A) {
                var id = tok.getLastValue();
                return id === 'case' || id === 'catch';
              } else if (d === ORD_L_O) {
                var id = tok.getLastValue();
                return id === 'continue' || id === 'const';
              } else if (d === ORD_L_L) {
                return tok.getLastValue() === 'class';
              }
            } else if (c === ORD_L_R) {
              if (tok.getNum(1) === ORD_L_E) {
                return tok.getLastValue() === 'return';
              }
            } else if (c === ORD_L_V) {
              var d = tok.getNum(1);
              if (d === ORD_L_A) {
                return tok.getLastValue() === 'var';
              } else if (d === ORD_L_O) {
                return tok.getLastValue() === 'void';
              }
            } else if (c === ORD_L_W) {
              var d = tok.getNum(1);
              if (d === ORD_L_H) {
                return tok.getLastValue() === 'while';
              } else if (d === ORD_L_I) {
                return tok.getLastValue() === 'with';
              }
            }
          // we checked for b-f and r-w, but must not forget
          // to check n and i:
          } else if (c === ORD_L_N) {
            var d = tok.getNum(1);
            if (d === ORD_L_U) {
              if (ignoreValues) return false;
              return tok.getLastValue() === 'null';
            } else if (d === ORD_L_E) {
              return tok.getLastValue() === 'new';
            }
          } else if (c === ORD_L_I) {
            var d = tok.getNum(1);
            if (d === ORD_L_N) {
              return tok.getLastLen() === 2 || tok.getLastValue() === 'instanceof'; // 'in'
            } else if (d === ORD_L_F) {
              return tok.getLastLen() === 2; // 'if'
            } else if (d === ORD_L_M) {
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

  (function chromeWorkaround(){
    // workaround for https://code.google.com/p/v8/issues/detail?id=2246
    var o = {};
    for (var k in proto) o[k] = proto[k];
    Par.prototype = o;
  })();

})(typeof exports === 'object' ? exports : window);
