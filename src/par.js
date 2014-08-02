// If you see magic numbers and bools all over the place, it means this
// file has been post-processed by a build script. If you want to read
// this file, see https://github.com/qfox/zeparser2

// TOFIX: generate huge benchmark files and derive specific coding styles from them;
// - tabs vs spaces,
// - newline (cr/lf/crlf),
// - minified vs normal,
// - unicode identifiers/jquery/underscore heavy/uppercase,
// - if/else vs &&||,
// - labels usage (build script),

// TOFIX: `(c|1) === ORD_LS_2029` or `(c ^ ORD_PS_2028) <= 1` or `c === ORD_PS || c === ORD_LS`?

(function(exports){
  var Tok = exports.Tok || require(__dirname+'/tok.js').Tok;

  var USE_LOOP_GUARDS = true; // #zp-build loopguard

  // indices match slots of the start-regexes (where applicable)
  // this order is determined by regex/parser rules so they are fixed
  var STRING = 10;
  var NUMBER = 7;
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
  var PARSEDSOMETHING = true;
  var PARSEDNOTHING = false;
  var FORFUNCTIONDECL = true;
  var NOTFORFUNCTIONDECL = false;
  var NEXTTOKENCANBEREGEX = true;
  var NEXTTOKENCANBEDIV = false;
  var INLOOP = ' ';
  var NOTINLOOP = '';
  var EMPTY_LABELSET = '';
  var INSWITCH = true;
  var NOTINSWITCH = false;
  var INFUNCTION = true;
  var NOTINFUNCTION = false;
  var IGNOREVALUES = true;
  var DONTIGNOREVALUES = false;
  var HASNEW = true;
  var HASNONEW = false;
  var NOTASSIGNABLE = 0;
  var ASSIGNABLE = 1;
  var ASSIGNABLEUNLESSGROUPED = 2;
  var MAYBELABEL = true;
  var NOTLABEL = false;
  var EXPR = true;
  var PUNC = false;
  var NOARGS = 0;
  var ONEARG = 1;
  var ANYARGS = 2;

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

  var Par = exports.Par = function(input, options){
    this.options = options = (options || {});

    if (!options.saveTokens) options.saveTokens = false;
    if (!options.createBlackStream) options.createBlackStream = false;
    if (!options.functionMode) options.functionMode = false;
    if (!options.regexNoClassEscape) options.regexNoClassEscape = false;
    if (!options.strictForInCheck) options.strictForInCheck = false;
    if (!options.strictAssignmentCheck) options.strictAssignmentCheck = false;
    if (!options.checkAccessorArgs) options.checkAccessorArgs = false;
    if (!options.requireDoWhileSemi) options.requireDoWhileSemi = false;
    options.allowCallAssignment = options.allowCallAssignment ? ASSIGNABLE : NOTASSIGNABLE;

    // `this['xxx'] prevents build script mangling :)
    this.tok = new Tok(input, this.options);
    this['run'] = this.run; // used in Par.parse

    // special build
    if (typeof frozen !== 'undefined') {
      this['frozenObject'] = {
        frozen: true,
        thaw: null
      };
    }
  };

  Par[WHITE] = 'white space';
  Par[STRING] = 'string';
  Par[NUMBER] = 'number';
  Par[REGEX] = 'regex';
  Par[PUNCTUATOR] = 'punctuator';
  Par[IDENTIFIER] = 'identifier';
  Par[EOF] = 'EOF';
  Par[ASI] = 'ASI';
  Par[ERROR] = 'error';

  Par.WHITE = WHITE; // WHITE_SPACE LINETERMINATOR COMMENT_SINGLE COMMENT_MULTI
  Par.STRING = STRING;
  Par.NUMBER = NUMBER;
  Par.REGEX = REGEX;
  Par.PUNCTUATOR = PUNCTUATOR;
  Par.IDENTIFIER = IDENTIFIER;
  Par.EOF = EOF;
  Par.ASI = ASI;
  Par.ERROR = ERROR;

  Par.Tok = Tok;

  Par.updateTok = function(T) {
    Tok = T;
    Par.Tok = Tok;
  };

  Par.parse = function(input, options){
    var par = new Par(input, options);

    // no need for .call; for streamer the generator ignores it, we call/apply below.
    // We consider runWithoutFurtherInput a testing mechanism so dont have to care
    // about the api there either. Regular build works fine without call here.
    var f = par.run();

    // `frozen` is added as a module global in an extra build step
    if (typeof frozen !== 'undefined') {
      // f will be a generator

      // The browser will yield when the parser needs more input the first time
      // (it will always do this, even at a "proper" EOF). If you supplied a
      // `frozenCallback` option, that function will be called with the `thawValue`.
      // This is optional though. It is either way up to you to call `thaw` to
      // continue parsing. Passing on `false` will treat the current EOF as an
      // actual EOF and act accordingly. Otherwise it will accept the argument
      // as new string input, concat it to the existing input and continue parsing.

      if (options && options.runWithoutFurtherInput) {
        // testing
        do {
          // start parsing nao
          var yieldValue = f.call(par, false);
        } while (frozen);
        f = yieldValue;
      } else {
        var thaw = f;
        f = par.frozenObject;
        f.thaw = function(){ return thaw.apply(par, arguments); };
      }
    }

    return f;
  };

  // note: this causes deopt in chrome by this bug: https://code.google.com/p/v8/issues/detail?id=2246
  Par.prototype = {
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
     * @property {number} [options.allowCallAssignment=false] Note that you should pass on a boolean, internally constants are used. Under strictAssignmentCheck or strictForInCheck this still allows `x()=y`, IE legacy crap.
     * @property {boolean} [options.checkAccessorArgs=false] Formally, getters have no arg and setters exactly one. Browsers are more lax in this though.
     * @property {boolean} [options.requireDoWhileSemi=false] Formally the do-while should be terminated by a semi-colon (or asi) but browsers dont enforce this.
     * @property {boolean} [options.neverThrow=false] Dont throw on syntax errors. Will mark the current token an error token and continue parsing. Not yet battle hardened, use at own risk. TOFIX
     * @property {boolean} [options.skipRegexFlagCheck=false] Dont throw for invalid regex flags, this mean anything other than gim or repeated flags.
     * @property {boolean} [options.runWithoutFurtherInput=false] When in streamer mode, Par.parse() will act as non-streaming mode and run through immediately. Mostly for testing because, well, what's the point otherwise :)
     */
    options: null,

    /**
     * @property {Tok} tok
     */
    tok: null,

    run: function(){
      var tok = this.tok;
      // prepare
      tok.next(EXPR);

      // go!
      this.parseStatements(NOTINFUNCTION, NOTINLOOP, NOTINSWITCH, EMPTY_LABELSET);

      if (tok.pos !== tok.len || tok.lastType !== EOF) tok.throwSyntaxError('Did not complete parsing..');

      if (this['frozenObject']) this['frozenObject'].frozen = false;
      return {
        par: this,
        tok: this.tok,
        options: this.options,
        whites: this.tok.tokens,
        blacks: this.tok.black,
        tokenCountWhite: this.tok.tokenCountAll,
        tokenCountBlack: this.tok.tokenCountBlack,
      };
    },

    parseStatements: function(inFunction, inLoop, inSwitch, labelSet){
      var tok = this.tok;
      if (USE_LOOP_GUARDS) var guard = 100000; // #zp-build loopguard
      // note: statements are optional, this function might not parse anything
      while (this.parseStatement(inFunction, inLoop, inSwitch, labelSet, OPTIONAL, EMPTY_LABELSET))
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security';else // #zp-build loopguard
        ;
    },
    parseStatement: function(inFunction, inLoop, inSwitch, labelSet, optional, freshLabels){
      if (this.tok.lastType === IDENTIFIER) {
        this.parseIdentifierStatement(inFunction, inLoop, inSwitch, labelSet, freshLabels);
        return PARSEDSOMETHING;
      }
      // can be false for close curly and eof
      return this.parseNonIdentifierStatement(inFunction, inLoop, inSwitch, labelSet, optional);
    },
    parseNonIdentifierStatement: function(inFunction, inLoop, inSwitch, labelSet, optional) {
      var tok = this.tok;
      var c = tok.firstTokenChar;

      if (c === ORD_CLOSE_CURLY) { // 65.6%
        if (!optional) tok.throwSyntaxError('Expected more input..'); // {if(x)}
        return PARSEDNOTHING;
      }

      if (c === ORD_OPEN_CURLY) { // 33.2%
        tok.next(EXPR);
        this.parseBlock(NEXTTOKENCANBEREGEX, inFunction, inLoop, inSwitch, labelSet);
        return PARSEDSOMETHING;
      }

      return this.parseNonIdentifierStatementNonCurly(c, optional);
    },
    parseNonIdentifierStatementNonCurly: function(c, optional){
      var tok = this.tok;

      // relative to this function: punc=96%, string=4%, number=1%, rest 0%

      if (c === ORD_OPEN_PAREN) { // 56%
        this.parseExpressionStatement();
        return PARSEDSOMETHING;
      }

      if (c === ORD_SEMI) { // 26% empty statement
        // this shouldnt occur very often, but they still do.
        tok.next(EXPR);
        return PARSEDSOMETHING;
      }

      if (c === ORD_PLUS || c === ORD_MIN) { // 5% 3%
        if (tok.getNum(1) === c || tok.lastLen === 1) {
          this.parseExpressionStatement();
          return PARSEDSOMETHING;
        }
        tok.throwSyntaxError('Statement cannot start with binary op');
      }

      var type = tok.lastType;

      // rare
      if (type === STRING || c === ORD_OPEN_SQUARE) { // 4% 2%
        this.parseExpressionStatement();
        return PARSEDSOMETHING;
      }

      // almost never
      if (c === ORD_EXCL) { // 2%
        if (tok.lastLen === 1) {
          this.parseExpressionStatement();
          return PARSEDSOMETHING;
        }
        tok.throwSyntaxError('Statement cannot start with binary op');
      }

      // now you're just running tests
      if (type === NUMBER || c === ORD_TILDE || type === REGEX) { // 1% 0% 0%
        this.parseExpressionStatement();
        return PARSEDSOMETHING;
      }

      // note: need this check because EOF is always valid at the end of the
      // program and, I think, will always trigger once, of course.
      if (!optional) tok.throwSyntaxError('Expected more input..');

      // EOF (I dont think there's any other valid reason?)
      return PARSEDNOTHING;
    },
    parseIdentifierStatement: function(inFunction, inLoop, inSwitch, labelSet, freshLabels){
      var tok = this.tok;

      // The current token is an identifier. Either its value will be
      // checked in this function (parseIdentifierStatement) or in the
      // parseExpressionOrLabel function. So we can just get it now.
      var value = tok.getLastValue();

      var len = tok.lastLen;

      // yes, this check makes a *huge* difference
      if (len >= 2) {
        // bcdfirstvw, not in that order.
        var c = tok.firstTokenChar;

        if (c === ORD_L_T) {
          if (len !== 4) { // often `this`, only 7% (abs) passes here
            if (value === 'try') return this.parseTry(inFunction, inLoop, inSwitch, labelSet);
            if (value === 'throw') return this.parseThrow();
          }
        }
        else if (c === ORD_L_I) {
          if (value === 'if') return this.parseIf(inFunction, inLoop, inSwitch, labelSet);
        }
        else if (c === ORD_L_V) {
          if (value === 'var') return this.parseVar();
        }
        else if (c === ORD_L_R) {
          if (value === 'return') return this.parseReturn(inFunction);
        }
        else if (c === ORD_L_F) {
          if (value === 'for') return this.parseFor(inFunction, inSwitch, labelSet, inLoop+freshLabels);
          if (value === 'function') return this.parseFunction(FORFUNCTIONDECL);
        }
        else if (c === ORD_L_C) {
          if (value === 'case') return this.parseCase(inSwitch);
          if (value === 'continue') return this.parseContinue(inLoop, labelSet);
        }
        else if (c === ORD_L_B) {
          if (value === 'break') return this.parseBreak(inLoop, inSwitch, labelSet);
        }
        else if (c === ORD_L_D) {
          if (value === 'default') return this.parseDefault(inSwitch);
          if (value === 'do') return this.parseDo(inFunction, inSwitch, labelSet, inLoop+freshLabels);
          if (value === 'debugger') return this.parseDebugger();
        }
        else if (c === ORD_L_S) {
          if (value === 'switch') return this.parseSwitch(inFunction, inLoop, labelSet);
        }
        else if (c === ORD_L_W) {
          if (value === 'while') return this.parseWhile(inFunction, inSwitch, labelSet, inLoop+freshLabels);
          if (value === 'with') return this.parseWith(inFunction, inLoop, inSwitch, labelSet);
        }
      }

      // this function _must_ parse _something_, if we parsed nothing, it's an expression statement or labeled statement
      this.parseExpressionOrLabel(value, inFunction, inLoop, inSwitch, labelSet, freshLabels);
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
      tok.next(PUNC);
      if (USE_LOOP_GUARDS) var guard = 100000; // #zp-build loopguard

      do {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        if (this.isReservedIdentifier(DONTIGNOREVALUES)) tok.throwSyntaxError('Var name is reserved');
        tok.mustBeIdentifier(NEXTTOKENCANBEREGEX);
        if (tok.firstTokenChar === ORD_IS && tok.lastLen === 1) {
          tok.next(EXPR);
          this.parseExpression();
        }
      } while(tok.nextExprIfNum(ORD_COMMA));
      this.parseSemi();
    },
    parseVarPartNoIn: function(){
      var tok = this.tok;
      var vars = 0;
      if (USE_LOOP_GUARDS) var guard = 100000; // #zp-build loopguard
      do {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        if (this.isReservedIdentifier(DONTIGNOREVALUES)) tok.throwSyntaxError('Var name ['+tok.getLastValue()+'] is reserved');
        tok.mustBeIdentifier(NEXTTOKENCANBEREGEX);
        ++vars;

        if (tok.firstTokenChar === ORD_IS && tok.lastLen === 1) {
          tok.next(EXPR);
          this.parseExpressionNoIn();
        }

      } while(tok.nextExprIfNum(ORD_COMMA));

      return vars === 1;
    },
    parseIf: function(inFunction, inLoop, inSwitch, labelSet){
      // if (<exprs>) <stmt>
      // if (<exprs>) <stmt> else <stmt>

      var tok = this.tok;

      tok.next(PUNC);
      this.parseStatementHeader();
      this.parseStatement(inFunction, inLoop, inSwitch, labelSet, REQUIRED, EMPTY_LABELSET);

      if (tok.getLastValue() === 'else') {
        tok.next(EXPR);
        this.parseStatement(inFunction, inLoop, inSwitch, labelSet, REQUIRED, EMPTY_LABELSET);
      }
    },
    parseDo: function(inFunction, inSwitch, labelSet, inLoop){
      // do <stmt> while ( <exprs> ) ;

      var tok = this.tok;

      tok.next(EXPR); // do
      this.parseStatement(inFunction, inLoop || INLOOP, inSwitch, labelSet, REQUIRED, EMPTY_LABELSET);
      tok.mustBeString('while', NEXTTOKENCANBEDIV);
      tok.mustBeNum(ORD_OPEN_PAREN, NEXTTOKENCANBEREGEX);
      this.parseExpressions();
      tok.mustBeNum(ORD_CLOSE_PAREN, NEXTTOKENCANBEREGEX);

      // spec requires the semi but browsers made it optional
      if (this.options.requireDoWhileSemi || tok.firstTokenChar === ORD_SEMI) {
        this.parseSemi();
      }
    },
    parseWhile: function(inFunction, inSwitch, labelSet, inLoop){
      // while ( <exprs> ) <stmt>

      this.tok.next(PUNC);
      this.parseStatementHeader();
      this.parseStatement(inFunction, inLoop || INLOOP, inSwitch, labelSet, REQUIRED, EMPTY_LABELSET);
    },
    parseFor: function(inFunction, inSwitch, labelSet, inLoop){
      // for ( <expr-no-in-=> in <exprs> ) <stmt>
      // for ( var <idntf> in <exprs> ) <stmt>
      // for ( var <idntf> = <expr-no-in> in <exprs> ) <stmt>
      // for ( <expr-no-in> ; <expr> ; <expr> ) <stmt>

      var tok = this.tok;
      tok.next(PUNC); // for
      tok.mustBeNum(ORD_OPEN_PAREN, NEXTTOKENCANBEREGEX);

      if (tok.nextExprIfNum(ORD_SEMI)) this.parseForEachHeader(); // empty first expression in for-each
      else {
        var validForInLhs;

        if (tok.firstTokenChar === ORD_L_V && tok.nextPuncIfString('var')) validForInLhs = this.parseVarPartNoIn();
        // expression_s_ because it might be regular for-loop...
        // (though if it isn't, it can't have more than one expr)
        else validForInLhs = this.parseExpressionsNoIn();

        if (tok.nextExprIfNum(ORD_SEMI)) this.parseForEachHeader();
        else if (tok.firstTokenChar !== ORD_L_I || tok.getNum(1) !== ORD_L_N || tok.lastLen !== 2) tok.throwSyntaxError('Expected `in` or `;` here..');
        else if (!validForInLhs && this.options.strictForInCheck) tok.throwSyntaxError('Encountered illegal for-in lhs');
        else this.parseForInHeader();
      }

      tok.mustBeNum(ORD_CLOSE_PAREN, NEXTTOKENCANBEREGEX);
      this.parseStatement(inFunction, inLoop || INLOOP, inSwitch, labelSet, REQUIRED, EMPTY_LABELSET);
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
      tok.next(EXPR); // `in` validated by `parseFor`
      this.parseExpressions();
    },
    parseContinue: function(inLoop, labelSet){
      // continue ;
      // continue <idntf> ;
      // newline right after keyword = asi

      var tok = this.tok;

      if (!inLoop) tok.throwSyntaxError('Can only continue in a loop');

      var type = tok.next(PUNC); // token after continue cannot be a regex, either way.

      if (type === IDENTIFIER && !tok.lastNewline) {
        var label = tok.getLastValue();
        if (!labelSet || labelSet.indexOf(' '+label+' ') < 0) {
          tok.throwSyntaxError('Label ['+label+'] not found in label set ['+labelSet+']');
        }
        if (!inLoop || inLoop.indexOf(' '+label+' ') < 0) {
          tok.throwSyntaxError('Label ['+label+'] is not a valid label for this loop');
        }
        tok.next(EXPR); // label (already validated)
      }
      // continue without a label. note that this doesnt "allow" non-identifiers since it'll require a semi/asi next.

      this.parseSemi();
    },
    parseBreak: function(inLoop, inSwitch, labelSet){
      // break ;
      // break <idntf> ;
      // break \n <idntf> ;
      // newline right after keyword = asi

      var tok = this.tok;
      var type = tok.next(PUNC); // token after break cannot be a regex, either way.

      if (type !== IDENTIFIER || tok.lastNewline) {
        // break without a label. note that this doesnt "allow" non-identifiers since it'll require a semi/asi next.
        if (!inLoop && !inSwitch) {
          // break without label
          tok.throwSyntaxError('Break without value only in loops or switches');
        }
      } else {
        var label = tok.getLastValue();
        if (!labelSet || labelSet.indexOf(' '+label+' ') < 0) {
          tok.throwSyntaxError('Label ['+label+'] not found in label set ['+labelSet+']');
        }
        tok.next(EXPR); // label (already validated)
      }

      this.parseSemi();
    },
    parseReturn: function(inFunction){
      // return ;
      // return <exprs> ;
      // newline right after keyword = asi

      var tok = this.tok;

      if (!inFunction && !this.options.functionMode) tok.throwSyntaxError('Can only return in a function');

      tok.next(EXPR);
      if (!tok.lastNewline) this.parseOptionalExpressions();
      this.parseSemi();
    },
    parseThrow: function(){
      // throw <exprs> ;

      var tok = this.tok;
      tok.next(EXPR);
      if (tok.lastNewline) tok.throwSyntaxError('No newline allowed directly after a throw, ever');

      this.parseExpressions();
      this.parseSemi();
    },
    parseSwitch: function(inFunction, inLoop, labelSet){
      // switch ( <exprs> ) { <switchbody> }

      var tok = this.tok;
      tok.next(PUNC);
      this.parseStatementHeader();
      tok.mustBeNum(ORD_OPEN_CURLY, NEXTTOKENCANBEREGEX);

      var value = tok.getLastValue();
      var defaults = 0;
      if (value === 'default') ++defaults;
      if (value !== 'case' && !defaults && value !== '}') tok.throwSyntaxError('Switch body must begin with case or default or be empty');

      if (USE_LOOP_GUARDS) var guard = 100000; // #zp-build loopguard
      while (this.parseStatement(inFunction, inLoop, INSWITCH, labelSet, OPTIONAL, EMPTY_LABELSET)) {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        // switches are quite infrequent so this overhead is okay, compared ot the alternatives
        if (tok.getLastValue() === 'default' && ++defaults > 1) tok.throwSyntaxError('Only one default allowed per switch');
      }

      tok.mustBeNum(ORD_CLOSE_CURLY, NEXTTOKENCANBEREGEX);
    },
    parseCase: function(inSwitch){
      var tok = this.tok;
      if (!inSwitch) tok.throwSyntaxError('Can only use case in a switch');
      tok.next(EXPR);
      this.parseExpressions();
      tok.mustBeNum(ORD_COLON, NEXTTOKENCANBEDIV);
    },
    parseDefault: function(inSwitch){
      var tok = this.tok;
      if (!inSwitch) tok.throwSyntaxError('Can only use default in a switch'); // cant really hit this right now because label checks supersede it
      tok.next(EXPR);
      tok.mustBeNum(ORD_COLON, NEXTTOKENCANBEDIV);
    },
    parseTry: function(inFunction, inLoop, inSwitch, labelSet){
      // try { <stmts> } catch ( <idntf> ) { <stmts> }
      // try { <stmts> } finally { <stmts> }
      // try { <stmts> } catch ( <idntf> ) { <stmts> } finally { <stmts> }

      var tok = this.tok;
      tok.next(PUNC);
      this.parseCompleteBlock(NEXTTOKENCANBEREGEX, inFunction, inLoop, inSwitch, labelSet);

      var count = tok.tokenCountAll;
      this.parseCatch(inFunction, inLoop, inSwitch, labelSet);
      this.parseFinally(inFunction, inLoop, inSwitch, labelSet);
      if (count === tok.tokenCountAll) this.tok.throwSyntaxError('Try must have at least a catch or finally block or both');
    },
    parseCatch: function(inFunction, inLoop, inSwitch, labelSet){
      // catch ( <idntf> ) { <stmts> }

      var tok = this.tok;
      if (tok.nextPuncIfString('catch')) {
        var type = tok.mustBeNum(ORD_OPEN_PAREN, NEXTTOKENCANBEDIV);

        // catch var
        if (type === IDENTIFIER) {
          if (this.isReservedIdentifier(DONTIGNOREVALUES)) tok.throwSyntaxError('Catch scope var name is reserved');
          tok.next(PUNC);
        } else {
          tok.throwSyntaxError('Missing catch scope variable');
        }

        tok.mustBeNum(ORD_CLOSE_PAREN, NEXTTOKENCANBEDIV);
        this.parseCompleteBlock(NEXTTOKENCANBEREGEX, inFunction, inLoop, inSwitch, labelSet);
      }
    },
    parseFinally: function(inFunction, inLoop, inSwitch, labelSet){
      // finally { <stmts> }

      if (this.tok.nextPuncIfString('finally')) {
        this.parseCompleteBlock(NEXTTOKENCANBEREGEX, inFunction, inLoop, inSwitch, labelSet);
      }
    },
    parseDebugger: function(){
      // debugger ;

      this.tok.next(EXPR);
      this.parseSemi();
    },
    parseWith: function(inFunction, inLoop, inSwitch, labelSet){
      // with ( <exprs> ) <stmts>

      this.tok.next(PUNC);
      this.parseStatementHeader();
      this.parseStatement(inFunction, inLoop, inSwitch, labelSet, REQUIRED, EMPTY_LABELSET);
    },
    parseFunction: function(forFunctionDeclaration){
      // function [<idntf>] ( [<param>[,<param>..] ) { <stmts> }

      var tok = this.tok;
      var type = tok.next(PUNC); // 'function'
      if (type === IDENTIFIER) { // name
        if (this.isReservedIdentifier(DONTIGNOREVALUES)) tok.throwSyntaxError('Function name ['+this.tok.getLastValue()+'] is reserved');
        tok.next(PUNC);
      } else if (forFunctionDeclaration) {
        tok.throwSyntaxError('Function declaration requires a name');
      }
      this.parseFunctionRemainder(ANYARGS, forFunctionDeclaration);
    },
    /**
     * Parse the function param list and body
     *
     * @param {number} paramCount Number of expected params, -1/undefined means no requirement. used for getters and setters
     * @param {boolean} nextExpr Are we parsing a function declaration (determines whether we can parse a division afterwards)
     */
    parseFunctionRemainder: function(paramCount, nextExpr){
      var tok = this.tok;
      tok.mustBeNum(ORD_OPEN_PAREN, NEXTTOKENCANBEDIV);
      this.parseParameters(paramCount);
      tok.mustBeNum(ORD_CLOSE_PAREN, NEXTTOKENCANBEDIV);
      this.parseCompleteBlock(nextExpr, INFUNCTION, NOTINLOOP, NOTINSWITCH, EMPTY_LABELSET);
    },
    parseParameters: function(paramCount){
      // [<idntf> [, <idntf>]]
      var tok = this.tok;
      if (tok.lastType === IDENTIFIER) {
        if (paramCount === NOARGS) tok.throwSyntaxError('Getters have no parameters');
        if (this.isReservedIdentifier(DONTIGNOREVALUES)) tok.throwSyntaxError('Function param name is reserved.');
        tok.next(EXPR);
        // there are only two valid next tokens; either a comma or a closing paren
        if (USE_LOOP_GUARDS) var guard = 100000; // #zp-build loopguard
        while (tok.nextExprIfNum(ORD_COMMA)) {
          if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
          if (paramCount === ONEARG) tok.throwSyntaxError('Setters have exactly one param');

          // param name
          if (tok.lastType === IDENTIFIER) {
            if (this.isReservedIdentifier(DONTIGNOREVALUES)) tok.throwSyntaxError('Function param name is reserved');
            tok.next(PUNC);
          } else {
            tok.throwSyntaxError('Missing func param name');
          }
        }
      } else if (paramCount === 1) {
        tok.throwSyntaxError('Setters have exactly one param');
      }
    },
    parseBlock: function(nextExpr, inFunction, inLoop, inSwitch, labelSet){
      this.parseStatements(inFunction, inLoop, inSwitch, labelSet);
      // note: this parsing method is also used for functions. the only case where
      // the closing curly can be followed by a division rather than a regex lit
      // is with a function expression. that's why we needed to make it a parameter
      this.tok.mustBeNum(ORD_CLOSE_CURLY, nextExpr);
    },
    parseCompleteBlock: function(nextExpr, inFunction, inLoop, inSwitch, labelSet){
      this.tok.mustBeNum(ORD_OPEN_CURLY, NEXTTOKENCANBEREGEX);
      this.parseBlock(nextExpr, inFunction, inLoop, inSwitch, labelSet);
    },
    parseSemi: function(){
      var tok = this.tok;
      if (tok.nextExprIfNum(ORD_SEMI)) return PUNCTUATOR;
      if (this.parseAsi()) return ASI;
      tok.throwSyntaxError('Unable to parse semi, unable to apply ASI');
    },
    parseAsi: function(){
      // asi at EOF, if next token is } or if there is a newline between prev and next (black) token
      // asi prevented if asi would be empty statement, no asi in for-header, no asi if next token is regex

      var tok = this.tok;
      if (tok.firstTokenChar === ORD_CLOSE_CURLY || tok.lastNewline || tok.lastType === EOF) {
        return this.addAsi();
      }
      return PARSEDNOTHING;
    },
    addAsi: function(){
      var tok = this.tok;
      var pos = tok.pos;
      var options = tok.options;
      var white = tok.tokenCountAll++;

      if (options.saveTokens) {
        // at this point we probably already parsed some whitespace and the next black token
        // we dont have to care about the whitespace, but the black token will have to be
        // updated with a new black and white index, and a new token has to be put before it.

        // this is the white and black of the token after the ASI (oldTop)
        var black = tok.tokenCountBlack++;

        var oldTop = tok.tokens.pop();

        var asi = {type:ASI, value:'', start:oldTop.start, stop:oldTop.start, white:white-1, black:black-1};

        oldTop.white = white;
        oldTop.black = black;

        tok.tokens.push(asi, oldTop);
        if (options.createBlackStream) {
          tok.black.push(asi, oldTop);
        }
      }

      // this kind of sucks since it probably already emitted the following token... we can't really help this atm.
      // (yes we could by delaying emitting by one token, but think of the perf-dren!)
      // pass on -1 for start/stop because we probably wont know it at this point (we could do this as well at a cost)
      if (options.onToken) options.onToken(ASI, '', -1, -1, white-1);

      return ASI;
    },

    parseExpressionStatement: function(){
      this.parseExpressions();
      this.parseSemi();
    },
    parseExpressionOrLabel: function(labelName, inFunction, inLoop, inSwitch, labelSet, freshLabels){
      // this method is only called at the start of a statement that starts
      // with an identifier that is neither `function` nor a statement keyword

      var tok = this.tok;

      // store value of identifier for label validation below.
      var identifier = tok.getLastValue();

      // this will stop before consuming the colon, if any.
      var assignable = this.parsePrimaryOrPrefix(REQUIRED, HASNONEW, MAYBELABEL);

      var count = tok.tokenCountAll;
      this.parseAssignments(assignable);
      // note: no need for grouped assignment check here (we cannot be in a group right now)
      this.parseNonAssignments();

      if (tok.firstTokenChar === ORD_COLON) {
        if (tok.tokenCountAll !== count) tok.throwSyntaxError('Unexpected colon encountered');
        if (!assignable) tok.throwSyntaxError('Label ['+identifier+'] is a reserved keyword');
        var labelSpaced = labelName + ' ';
        if (labelSet.indexOf(' ' + labelSpaced) >= 0) tok.throwSyntaxError('Label ['+identifier+'] is already defined');
        tok.next(EXPR);

        if (inLoop) inLoop += labelSpaced; // these are the only valid jump targets for `continue`
        this.parseStatement(inFunction, inLoop, inSwitch, (labelSet || ' ')+labelSpaced, REQUIRED, (freshLabels||' ')+labelSpaced);
      } else {
        if (tok.nextExprIfNum(ORD_COMMA)) this.parseExpressions();
        this.parseSemi();
      }

    },
    parseOptionalExpressions: function(){
      var tok = this.tok;
      var tokCount = tok.tokenCountAll;
      this.parseExpressionOptional();
      if (tokCount !== tok.tokenCountAll) {
        if (USE_LOOP_GUARDS) var guard = 100000; // #zp-build loopguard
        while (tok.nextExprIfNum(ORD_COMMA)) {
          if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
          this.parseExpression();
        }
      }
    },
    parseExpressions: function(){
      // track for parseGroup, if this expression is wrapped, is it still assignable?
      var groupAssignable = this.parseExpression();
      var tok = this.tok;
      if (USE_LOOP_GUARDS) var guard = 100000; // #zp-build loopguard
      while (tok.nextExprIfNum(ORD_COMMA)) {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        this.parseExpression();
        groupAssignable = NOTASSIGNABLE;
      }
      return groupAssignable;
    },
    parseExpression: function(){
      var tok = this.tok;
      var tokCount = tok.tokenCountAll;

      // track for parseGroup whether this expression still assignable when
      var groupAssignable = this.parseExpressionOptional();

      // either tokenizer pos moved, or we reached the end (we hadnt reached the end before)
      if (tokCount === tok.tokenCountAll) tok.throwSyntaxError('Expected to parse an expression, did not find any');

      return groupAssignable;
    },
    parseExpressionOptional: function(){
      var tok = this.tok;
      var count = tok.tokenCountAll;
      var assignable = this.parsePrimary(OPTIONAL);
      var beforeAssignments = tok.tokenCountAll;
      if (count !== beforeAssignments) {
        this.parseAssignments(assignable);
        var beforeNonAssignments = tok.tokenCountAll;
        this.parseNonAssignments();
        var endCount = tok.tokenCountAll;

        // if there was a non-assign binary op, the whole thing is nonassign
        // if there were only assign ops, the whole thing is assignable unless grouped
        // if there were no binary ops, the whole thing is whatever the primary was

        if (beforeNonAssignments !== endCount) assignable = NOTASSIGNABLE;
        else if (beforeAssignments !== beforeNonAssignments) assignable = ASSIGNABLEUNLESSGROUPED;
      }

      // return state for parseGroup, to determine whether the group as a whole can be assignment lhs
      // the group needs to know about the prim expr AND any binary ops (inc assignments).
      return assignable;
    },
    parseAssignments: function(assignable){
      // assignment ops are allowed until the first non-assignment binary op
      var tok = this.tok;
      var strictAssign = this.options.strictAssignmentCheck;
      if (USE_LOOP_GUARDS) var guard = 100000; // #zp-build loopguard
      while (this.isAssignmentOperator()) {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        if (!assignable && strictAssign) tok.throwSyntaxError('LHS of this assignment is invalid assignee');
        // any assignment means not a for-in per definition
        tok.next(EXPR);
        assignable = this.parsePrimary(REQUIRED);
      }
    },
    parseNonAssignments: function(){
      var tok = this.tok;
      // keep parsing non-assignment binary/ternary ops
      if (USE_LOOP_GUARDS) var guard = 100000; // #zp-build loopguard
      while (true) {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        if (this.isBinaryOperator()) {
          tok.next(EXPR);
          this.parsePrimary(REQUIRED);
        }
        else if (tok.firstTokenChar === ORD_QMARK) this.parseTernary();
        else break;
      }
    },
    parseTernary: function(){
      var tok = this.tok;
      tok.next(EXPR);
      this.parseExpression();
      tok.mustBeNum(ORD_COLON, NEXTTOKENCANBEREGEX);
      this.parseExpression();
    },
    parseTernaryNoIn: function(){
      var tok = this.tok;
      tok.next(EXPR);
      this.parseExpression();
      tok.mustBeNum(ORD_COLON, NEXTTOKENCANBEREGEX);
      this.parseExpressionNoIn();
    },
    parseExpressionsNoIn: function(){
      var tok = this.tok;

      var validForInLhs = this.parseExpressionNoIn();
      if (USE_LOOP_GUARDS) var guard = 100000; // #zp-build loopguard
      while (tok.nextExprIfNum(ORD_COMMA)) {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        // lhs of for-in cant be multiple expressions
        this.parseExpressionNoIn();
        validForInLhs = NOTASSIGNABLE;
      }

      return validForInLhs;
    },
    parseExpressionNoIn: function(){
      var assignable = this.parsePrimary(REQUIRED);
      var tok = this.tok;

      var count = tok.tokenCountAll;
      this.parseAssignments(assignable); // any assignment is illegal in for-in, with and without group. no need to check here.

      // keep parsing non-assignment binary/ternary ops unless `in`
      var repeat = true;
      if (USE_LOOP_GUARDS) var guard = 100000; // #zp-build loopguard
      while (repeat) {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        if (this.isBinaryOperator()) {
          // rationale for using getLastNum; this is the `in` check which will succeed
          // about 50% of the time (stats from 8mb of various js). the other time it
          // will check for a primary. it's therefore more likely that an getLastNum will
          // save time because it would cache the charCodeAt for the other token if
          // it failed the check
          if (tok.firstTokenChar === ORD_L_I && tok.getNum(1) === ORD_L_N && tok.lastLen === 2) { // in
            repeat = false;
          } else {
            tok.next(EXPR);
            this.parsePrimary(REQUIRED);
          }
        } else if (tok.firstTokenChar === ORD_QMARK) {
          this.parseTernaryNoIn();
        } else {
          repeat = false;
        }
      }

      return count === tok.tokenCountAll ? assignable : NOTASSIGNABLE;
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
      var len = tok.lastLen;
      var c = tok.firstTokenChar;

      if (tok.lastType === IDENTIFIER) {
        if (len > 2) {
          if (c === ORD_L_T) {
            if (len === 6 && tok.nextExprIfString('typeof')) {
              if (hasNew) tok.throwSyntaxError('typeof is illegal right after new');
              this.parsePrimaryOrPrefix(REQUIRED, HASNONEW, NOTLABEL);
              return NOTASSIGNABLE;
            }
          } else if (tok.firstTokenChar === ORD_L_F && tok.getLastValue() === 'function') {
              this.parseFunction(NOTFORFUNCTIONDECL);

              // can never assign to function directly
              return this.parsePrimarySuffixes(NOTASSIGNABLE, hasNew, NOTLABEL);
          } else if (c === ORD_L_N) {
            if (tok.nextExprIfString('new')) {
              // new is actually assignable if it has a trailing property AND at least one paren pair
              // TOFIX: isn't the OR flawed? HASNEW is a constant...
              return this.parsePrimaryOrPrefix(REQUIRED, HASNEW || hasNew, NOTLABEL);
            }
          } else if (c === ORD_L_D) {
            if (len === 6 && tok.nextExprIfString('delete')) {
              if (hasNew) tok.throwSyntaxError('delete is illegal right after new');
              this.parsePrimaryOrPrefix(REQUIRED, HASNONEW, NOTLABEL);
              return NOTASSIGNABLE;
            }
          } else if (c === ORD_L_V) {
            if (tok.nextExprIfString('void')) {
              if (hasNew) tok.throwSyntaxError('void is illegal right after new');
              this.parsePrimaryOrPrefix(REQUIRED, HASNONEW, NOTLABEL);
              return NOTASSIGNABLE;
            }
          }
        }

        return this.parsePrimaryCoreIdentifier(hasNew, maybeLabel);
      }

      if ((c === ORD_EXCL || c === ORD_TILDE) && tok.lastLen === 1) {
        if (hasNew) tok.throwSyntaxError('! and ~ are illegal right after new');
        tok.next(EXPR);
        this.parsePrimaryOrPrefix(REQUIRED, HASNONEW, NOTLABEL);
        return NOTASSIGNABLE;
      }

      if (c === ORD_MIN || c === ORD_PLUS) {
        if (hasNew) tok.throwSyntaxError('illegal operator right after new');
        // have to verify len anyways, for += and -= case
        if (tok.lastLen === 1) {
          tok.next(EXPR);
          this.parsePrimaryOrPrefix(REQUIRED, HASNONEW, NOTLABEL);
        } else if (tok.getNum(1) === c) {
          tok.next(EXPR);
          var assignable = this.parsePrimaryOrPrefix(REQUIRED, HASNONEW, NOTLABEL);
          if (!assignable && this.options.strictAssignmentCheck) tok.throwSyntaxError('The rhs of ++ or -- was not assignable');
        } else {
          // this is a += or -= token (there's no other possibility left)
          // I believe it is illegal at this point :)
          tok.throwSyntaxError('Illegal operator, expecting primary core');
        }
        return NOTASSIGNABLE;
      }

      return this.parsePrimaryCoreOther(optional, hasNew);
    },
    parsePrimaryCoreIdentifier: function(hasNew, maybeLabel){
      var tok = this.tok;
      var identifier = tok.getLastValue();
      var c = tok.firstTokenChar;

      // dont use ?: here (build script)
      var fail;
      if (maybeLabel) fail = this.isReservedIdentifierSpecial();
      else fail = this.isReservedIdentifier(IGNOREVALUES);
      if (fail) tok.throwSyntaxError('Reserved identifier ['+identifier+'] found in expression');

      tok.next(PUNC);

      // can not assign to keywords, anything else is fine here
      var assignable = !this.isValueKeyword(c, identifier) ? ASSIGNABLE : NOTASSIGNABLE;
      return this.parsePrimarySuffixes(assignable, hasNew, maybeLabel);
    },
    parsePrimaryCoreOther: function(optional, hasNew){
      var tok = this.tok;
      var count = tok.tokenCountAll;
      var assignable = this.parsePrimaryValue(optional);
      if (count === tok.tokenCountAll) {
        if (optional) return NOTASSIGNABLE; // prevents `return.foo`
        tok.throwSyntaxError('Missing required primary'); // TOFIX: find case for this
      }
      return this.parsePrimarySuffixes(assignable, hasNew, NOTLABEL);
    },
    parsePrimaryValue: function(optional){
      // at this point in the expression parser we will have ruled out anything else.
      // the next token(s) must be some kind of non-identifier expression value...
      // returns whether the entire thing is assignable

      var tok = this.tok;

      // we know it's going to be a punctuator so we wont use tok.isValue here
      var t = tok.lastType;
      if (t === STRING || t === REGEX) {
        tok.next(PUNC);
        return NOTASSIGNABLE;
      }

      if (t === NUMBER) {
        // special case: numbers must always be followed by whitespace (or EOF)
        tok.nextWhiteAfterNumber();
        return NOTASSIGNABLE;
      }

      if (tok.nextExprIfNum(ORD_OPEN_PAREN)) {
        return this.parseGroup();
      }

      if (tok.nextExprIfNum(ORD_OPEN_CURLY)) {
        this.parseObject();
        return NOTASSIGNABLE;
      }

      if (tok.nextExprIfNum(ORD_OPEN_SQUARE)) {
        this.parseArray();
        return NOTASSIGNABLE;
      }

      if (!optional) tok.throwSyntaxError('Unable to parse required primary value');
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
      var allowCallAssignment = this.options.allowCallAssignment;

      if (unassignableUntilAfterCall) assignable = NOTASSIGNABLE; // for new, must have trailing property _after_ a call

      var tok = this.tok;
      if (USE_LOOP_GUARDS) var guard = 100000; // #zp-build loopguard
      while (true) {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        // see c frequency stats in /stats/primary suffix start.txt
        var c = tok.firstTokenChar;
        if (c > 0x2e) {
          // only c>0x2e relevant is OPEN_SQUARE
          if (c !== ORD_OPEN_SQUARE) break;
          tok.next(EXPR);
          this.parseExpressions(); // required
          tok.mustBeNum(ORD_CLOSE_SQUARE, NEXTTOKENCANBEDIV); // ] cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          if (!unassignableUntilAfterCall && !assignable) assignable = ASSIGNABLE; // trailing property
        } else if (c === ORD_DOT) {
          if (tok.lastType === NUMBER) break; // ASI: foo\n.5 -> [foo][\n][.5]
          else if (tok.lastType !== PUNCTUATOR) tok.throwSyntaxError('Dot/Number (?) after identifier?'); // #zp-build drop line
          tok.next(PUNC);
          tok.mustBeIdentifier(NEXTTOKENCANBEDIV); // cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          if (!unassignableUntilAfterCall && !assignable) assignable = ASSIGNABLE; // trailing property
        } else if (c === ORD_OPEN_PAREN) {
          tok.next(EXPR);
          this.parseOptionalExpressions();
          tok.mustBeNum(ORD_CLOSE_PAREN, NEXTTOKENCANBEDIV); // ) cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          unassignableUntilAfterCall = false;
          assignable = allowCallAssignment; // call, only assignable in IE
        } else {
          // postfix inc/dec are restricted, so no newline allowed here
          if (!tok.lastNewline && (c === ORD_PLUS || c === ORD_MIN) && tok.getNum(1) === c) {
            if (!assignable && this.options.strictAssignmentCheck) tok.throwSyntaxError('Postfix increment not allowed here');
            tok.next(PUNC);
            assignable = NOTASSIGNABLE; // ++
          }

          break;
        }
        colonIsError = true;
      }
      if (colonIsError && maybeLabel && c === ORD_COLON) tok.throwSyntaxError('Invalid label here, I think');
      return assignable;
    },
    isAssignmentOperator: function(){
      // includes any "compound" operators

      // this method works under the assumption that the current token is
      // part of the set of valid tokens for js. So we don't have to check
      // for string lengths unless we need to disambiguate optional chars

      var tok = this.tok;
      var len = tok.lastLen;
      var c = tok.firstTokenChar;

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
      var c = tok.firstTokenChar;
      var len = tok.lastLen;

      if (c === ORD_SEMI || c === ORD_CLOSE_PAREN || c === ORD_COMMA) return false; // expression enders: 26% 24% 20%
      if (len === 1) {
        if (c === ORD_CLOSE_SQUARE || c === ORD_CLOSE_CURLY) return false; // expression/statement enders: 7% 6%
        return c === ORD_PLUS || c === ORD_STAR || c === ORD_LT || c === ORD_MIN || c === ORD_GT || c === ORD_FWDSLASH || c === ORD_AND || c === ORD_OR || c === ORD_PERCENT || c === ORD_XOR;
      }
      if (len === 2) {
        return c === ORD_IS || c === ORD_EXCL || c === ORD_LT || c === ORD_GT || (c === ORD_AND && tok.getNum(1) === ORD_AND) || (c === ORD_OR && tok.getNum(1) === ORD_OR) || tok.getLastValue() === 'in';
      }
      if (len === 3) {
        return c === ORD_IS || c === ORD_EXCL || (c === ORD_GT && tok.getNum(2) === ORD_GT);
      }
      if (len === 10) return tok.getLastValue() === 'instanceof';

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

      if (groupAssignable === ASSIGNABLEUNLESSGROUPED) groupAssignable = NOTASSIGNABLE;

      return groupAssignable;
    },
    parseArray: function(){
      var tok = this.tok;
      if (USE_LOOP_GUARDS) var guard = 100000; // #zp-build loopguard
      do {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        this.parseExpressionOptional(); // just one because they are all optional (and arent in expressions)
      } while (tok.nextExprIfNum(ORD_COMMA)); // elision

      // array lits cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      tok.mustBeNum(ORD_CLOSE_SQUARE, NEXTTOKENCANBEDIV);
    },
    parseObject: function(){
      var tok = this.tok;
      if (USE_LOOP_GUARDS) var guard = 100000; // #zp-build loopguard
      do {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        var type = tok.lastType;
        if (type === IDENTIFIER || type === STRING || type === NUMBER) this.parsePair(); // 84% 9% 1% = 94%
      } while (tok.nextExprIfNum(ORD_COMMA)); // elision

      // obj lits cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      tok.mustBeNum(ORD_CLOSE_CURLY, NEXTTOKENCANBEDIV);
    },
    parsePair: function(){
      var tok = this.tok;

      if (tok.lastLen !== 3) return this.parseData(); // 92%

      var c = tok.firstTokenChar;
      if (c === ORD_L_G && tok.nextPuncIfString('get')) {
        if (tok.lastType === IDENTIFIER) {
          tok.next(PUNC);
          this.parseFunctionRemainder(this.options.checkAccessorArgs ? NOARGS : ANYARGS, FORFUNCTIONDECL);
        }
        else this.parseDataPart();
      } else if (c === ORD_L_S && tok.nextPuncIfString('set')) {
        if (tok.lastType === IDENTIFIER) {
          tok.next(PUNC);
          this.parseFunctionRemainder(this.options.checkAccessorArgs ? ONEARG : ANYARGS, FORFUNCTIONDECL);
        }
        else this.parseDataPart();
      } else {
        this.parseData();
      }
    },
    parseData: function(){
      this.tok.next(PUNC);
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
      var c = tok.firstTokenChar;

      // stats:
      // len: 1:26%, 2:6%, 3:6%, 4:34%, 5:5%, 6:5%, 7:3%, 8:3%
      // chr: a:5%, b:4%, c:5%, d:3%, e:3%, f:1%, g:2%, h:1%, i:1%, j:1%, k:1%, l:1%, m:2%, n:2%, o:1%, p:2%, q:0%, r:2%, s:2%, t:30%, u:1%, v:1%, w:1%, x:0%, y:0%, z:0%, rest: 28%
      // so: len=1 and c=t and c as non-lowercase-letter should exit early

      if (
        c < ORD_L_C || // 38%
        c === ORD_L_T || // 30%
        tok.lastLen === 1 // 14%
      ) return false;

      // stats now:
      // len: 1:0, 2:3%, 3:2%, 4:3%, 5:2%, 6:2%, 7:2%, 8:1%, >8:4%
      // chr: a:0, b:0, c:2%, d:1%, e:1%, f:1%, g:1%, h:1%, i:1%, j:0%, k:0%, l:1%, m:1%, n:1%, o:1%, p:2%, q:0%, r:1%, s:2%, t:0, u:0%, v:1%, w:0%, x:0%, y:0%, z:0%, rest:0
      // so: meh. note: no rest because capitals and such are already discarded with the <c check. same goes for _ and $.

      // rest true: 9%, false: 11%?

      if (c === ORD_L_C) { // 2.5%
        var d = tok.getNum(1);
        if (d === ORD_L_O && tok.getLastValue() === 'const') return true;
        if (d === ORD_L_L && tok.getLastValue() === 'class') return true;
        if (d !== ORD_L_A) return false;
        var value = tok.getLastValue();
        return (value === 'catch' || value === 'case');
      }

      if (c === ORD_L_S) { // 1.8%
        return tok.getNum(1) === ORD_L_U && tok.getLastValue() === 'super';
      }

      if (c === ORD_L_D) { // 1.5%
        return tok.getNum(1) === ORD_L_E && tok.getLastValue() === 'default';
      }

      if (c === ORD_L_E) { // 1.1%
        var d = tok.getNum(1);
        if ((d === ORD_L_L && tok.getLastValue() === 'else') || (d === ORD_L_N && tok.getLastValue() === 'enum')) return true;
        if (d !== ORD_L_X) return false;
        var value = tok.getLastValue();
        return (value === 'export' || value === 'extends');
      }

      if (c === ORD_L_F) { // 0.8%
        return tok.getNum(1) === ORD_L_I && tok.getLastValue() === 'finally';
      }

      if (c === ORD_L_I) { // 0.8%
        var d = tok.getNum(1);
        return (d === ORD_L_N && (tok.lastLen === 2 || tok.getLastValue() === 'instanceof')) || (d === ORD_L_M && tok.getLastValue() === 'import');
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

      var tok = this.tok;
      var c = tok.firstTokenChar;
      var len = tok.lastLen;

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
      if (word.length === 4) {
        if (c === ORD_L_T) return word === 'this' || word === 'true';
        return c === ORD_L_N && word === 'null';
      }
      return c === ORD_L_F && word.length === 5 && word === 'false';
    },
  };

})(typeof exports === 'object' ? exports : window);
