(function(exports){
  var uniRegex = exports.uni || require(__dirname+'/uni.js').uni;

  var USE_LOOP_GUARDS = true; // #zp-build loopguard

  // punctuator occurrence stats: http://qfox.nl/weblog/301
  // token start stats: http://qfox.nl/weblog/302

  // TOFIX: should `/x/y()` and `new /x/y()` be allowed? firefox used to do this, legacy syntax?
  // TOFIX: ASI messes up white index? difference in token index and white index...

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
  var WHITE = 18; // WHITE_SPACE LINETERMINATOR COMMENT_SINGLE COMMENT_MULTI

  // reverse lookup (only used for error messages..)
  var typeToString = {};
  typeToString[STRING] = 'string';
  typeToString[NUMBER] = 'number';
  typeToString[REGEX] = 'regex';
  typeToString[PUNCTUATOR] = 'punctuator';
  typeToString[IDENTIFIER] = 'identifier';
  typeToString[EOF] = 'eof';
  typeToString[ASI] = 'asi';
  typeToString[ERROR] = 'error';
  typeToString[WHITE] = 'white space';

  var EXPR = true;
  var PUNC = false;

  // note: making REQUIRED `true` wont change the test outcome, but does allow the parser
  // to parse beyond input (and bail on the bad cases anyways, with random errors).
  var REQUIRED = false;
  var OPTIONALLY = true;

  var UNICODE_LIMIT_127 = 127;

  var ORD_L_A_61 = 0x61;
  var ORD_L_A_UC_41 = 0x41;
  var ORD_L_B_62 = 0x62;
  var ORD_L_B_UC_42 = 0x42;
  var ORD_L_C_63 = 0x63;
  var ORD_L_C_UC_43 = 0x43;
  var ORD_L_D_64 = 0x64;
  var ORD_L_D_UC_44 = 0x44;
  var ORD_L_E_65 = 0x65;
  var ORD_L_E_UC_45 = 0x45;
  var ORD_L_F_66 = 0x66;
  var ORD_L_F_UC_46 = 0x46;
  var ORD_L_G_67 = 0x67;
  var ORD_L_G_UC_47 = 0x47;
  var ORD_L_H_68 = 0x68;
  var ORD_L_H_UC_48 = 0x48;
  var ORD_L_I_69 = 0x69;
  var ORD_L_I_UC_49 = 0x49;
  var ORD_L_J_6A = 0x6A;
  var ORD_L_J_UC_4A = 0x4A;
  var ORD_L_K_6B = 0x6B;
  var ORD_L_K_UC_4B = 0x4B;
  var ORD_L_L_6C = 0x6C;
  var ORD_L_L_UC_4C = 0x4C;
  var ORD_L_M_6D = 0x6D;
  var ORD_L_M_UC_4D = 0x4D;
  var ORD_L_N_6E = 0x6E;
  var ORD_L_N_UC_4E = 0x4E;
  var ORD_L_O_6F = 0x6F;
  var ORD_L_O_UC_4F = 0x4F;
  var ORD_L_P_70 = 0x70;
  var ORD_L_P_UC_50 = 0x50;
  var ORD_L_Q_71 = 0x71;
  var ORD_L_Q_UC_51 = 0x51;
  var ORD_L_R_72 = 0x72;
  var ORD_L_R_UC_52 = 0x52;
  var ORD_L_S_73 = 0x73;
  var ORD_L_S_UC_53 = 0x53;
  var ORD_L_T_74 = 0x74;
  var ORD_L_T_UC_54 = 0x54;
  var ORD_L_U_75 = 0x75;
  var ORD_L_U_UC_55 = 0x55;
  var ORD_L_V_76 = 0x76;
  var ORD_L_V_UC_56 = 0x56;
  var ORD_L_W_77 = 0x77;
  var ORD_L_W_UC_57 = 0x57;
  var ORD_L_X_78 = 0x78;
  var ORD_L_X_UC_58 = 0x58;
  var ORD_L_Y_79 = 0x79;
  var ORD_L_Y_UC_59 = 0x59;
  var ORD_L_Z_7A = 0x7a;
  var ORD_L_Z_UC_5A = 0x5a;
  var ORD_L_0_30 = 0x30;
  var ORD_L_1_31 = 0x31;
  var ORD_L_2_33 = 0x32;
  var ORD_L_3_34 = 0x33;
  var ORD_L_4_34 = 0x34;
  var ORD_L_5_35 = 0x35;
  var ORD_L_6_36 = 0x36;
  var ORD_L_7_37 = 0x37;
  var ORD_L_8_38 = 0x38;
  var ORD_L_9_39 = 0x39;

  var ORD_OPEN_CURLY_7B = 0x7b;
  var ORD_CLOSE_CURLY_7D = 0x7d;
  var ORD_OPEN_PAREN_28 = 0x28;
  var ORD_CLOSE_PAREN_29 = 0x29;
  var ORD_OPEN_SQUARE_5B = 0x5b;
  var ORD_CLOSE_SQUARE_5D = 0x5d;
  var ORD_TILDE_7E = 0x7e;
  var ORD_PLUS_2B = 0x2b;
  var ORD_DASH_2D = 0x2d;
  var ORD_EXCL_21 = 0x21;
  var ORD_HASH_23 = 0x23;
  var ORD_$_24 = 0x24;
  var ORD_QMARK_3F = 0x3f;
  var ORD_COLON_3A = 0x3a;
  var ORD_SEMI_3B = 0x3b;
  var ORD_IS_3D = 0x3d;
  var ORD_COMMA_2C = 0x2c;
  var ORD_DOT_2E = 0x2e;
  var ORD_STAR_2A = 0x2a;
  var ORD_OR_7C = 0x7c;
  var ORD_AND_26 = 0x26;
  var ORD_PERCENT_25 = 0x25;
  var ORD_XOR_5E = 0x5e;
  var ORD_FWDSLASH_2F = 0x2f;
  var ORD_BACKSLASH_5C = 0x5c;
  var ORD_LT_3C = 0x3c;
  var ORD_GT_3E = 0x3e;
  var ORD_SQUOTE_27 = 0x27;
  var ORD_DQUOTE_22 = 0x22;
  var ORD_SPACE_20 = 0x20;
  var ORD_NBSP_A0 = 0xA0;
  var ORD_TAB_09 = 0x09;
  var ORD_VTAB_0B = 0x0B;
  var ORD_FF_0C = 0x0C;
  var ORD_BOM_FEFF = 0xFEFF;
  var ORD_LF_0A = 0x0A; // \n
  var ORD_CR_0D = 0x0D; // \r
  var ORD_LS_2029 = 0x2029;
  var ORD_PS_2028 = 0x2028;
  var ORD_ZWS = 0x200B;
  var ORD_LODASH_5F = 0x5f;

  /**
   * Tokenizer for JS. After initializing the constructor
   * you can fetch the next tokens by calling tok.next()
   * if the next token could be a division, or tok.nextExpr()
   * if the next token could be a regular expression.
   * Obviously you'll need a parser (or magic) to determine this.
   *
   * @constructor
   * @param {string} input
   */
  var Tok = exports.Tok = function(input, opt){
    var options = this.options = {
      saveToken: false,
      createBlackStream: false,
      regexNoClassEscape: false,
      neverThrow: false,
      onToken: null,
      allowCallAssignment: false,
      skipRegexFlagCheck: false,
    };

    if (opt.saveTokens) options.saveTokens = true;
    if (opt.createBlackStream) options.createBlackStream = true;
    if (opt.regexNoClassEscape) options.regexNoClassEscape = true;
    if (opt.neverThrow) options.neverThrow = true; // warning: not yet battle hardened yet
    if (opt.onToken) options.onToken = opt.onToken;
    if (opt.skipRegexFlagCheck) options.skipRegexFlagCheck = opt.skipRegexFlagCheck;

    this.input = (input||'');
    this.len = this.input.length;

    // v8 "appreciates" it when all instance properties are set explicitly
    this.pos = 0;
    this.offset = 0;
    this.reachedEof = false;

    this.lastOffset = 0;
    this.lastStop = 0;
    this.lastLen = 0;
    this.lastType = 0;
    this.lastNewline = false;

    // 0 means uninitialized. if we ever parse a nul it probably results in a syntax error so the overhead is okay for that case.
    this.firstTokenChar = 0;

    this.tokenCountAll = 0;
    this.tokenCountBlack = 0;

    if (options.saveTokens) {
      this.tokens = [];
      if (options.createBlackStream) this.black = [];
    }

    // for testing the builds
    this['_getTrickedTokenCount'] = function(){ return this.tokenCountAll; };
    this['_isFrozen'] = function(){ return frozen; };
    this['_thaw'] = function(){ frozen = false; };
    this['_nextToken'] = this.nextAnyToken;
  };

  // note: this causes deopt in chrome by this bug: https://code.google.com/p/v8/issues/detail?id=2246
  Tok.prototype = {
    /** @property {string} input */
    input: '',
    /** @property {number} len */
    len: 0,
    /** @property {number} pos */
    pos: 0,
    /** @property {number} offset */
    offset: 0,
    /** @property {boolean} reachedEof Becomes true when you reach end of stream */
    reachedEof: false,

    /**
     * Shared with Par.
     * Only properties relevant to Tok are listed in this jsdoc.
     *
     * @property {Object} options
     * @property {boolean} [options.saveTokens=false] Put all found tokens in .tokens
     * @property {boolean} [options.createBlackStream=false] Requires saveTokens, put black tokens in .black
     * @property {boolean} [options.regexNoClassEscape=false] Don't interpret backslash in regex class as escape
     * @property {Function} [options.onToken=null] Call for every token
     * @property {boolean} [options.neverThrow=false] Never throw on syntax errors (use at own risk)
     * @property {boolean} [options.skipRegexFlagCheck=false] Dont throw for invalid regex flags, this mean anything other than gim or repeated flags.
     */
    options: null,

    // parser can look at these positions to see where in the input the last token was
    // this way the tokenizer can simply return number-constants-as-types.
    /** @property {number} lastOffset Start pos of the last token */
    lastOffset: 0,
    /** @property {number} lastStop End pos of the last token */
    lastStop: 0,
    /** @property {number} lastLen */
    lastLen: 0,
    /** @property {number} lastType Type of the last token */
    lastType: 0,
    /** @property {boolean} lastNewline Was the current token preceeded by a newline? For determining ASI. */
    lastNewline: false,

    // .charCodeAt(this.lastOffset) cache
    firstTokenChar: 0,

    /** @property {number} tokenCountAll Add one for any token, including EOF (Par relies on this) */
    tokenCountAll: 0,
    /** @property {number} tokenCountBlack Number of non-whitespace tokens */
    tokenCountBlack: 0,

    // TOFIX: rename tokens/black to whiteTokens/blackTokens
    /** @property {Object[]} tokens List of (all) tokens, if saving them is enabled (this.options.saveTokens) */
    tokens: null,
    /** @property {Object[]} black List of only black tokens, if saving them is enabled (this.options.saveTokens) and createBlackStream is too */
    black: null,

    /**
     * Call whenever reaching EOF.
     *
     * @param {boolean} eofAllowed Throw unexpected EOF error if there is no more input?
     * @param {number} extraLen=1 How many bytes should we at least get now?
     * @returns {boolean}
     */
    getMoreInput: function(eofAllowed, extraLen){
      var had = false;
      if (!extraLen) extraLen = 1;

      if (!this.reachedEof) {
        // trunc the input, eliminating the consumed part
        if (this.lastOffset > this.offset) {
          this.input = this.input.slice(this.lastOffset - this.offset);
          this.offset = this.lastOffset;
        }

        var guard = 100000; // #zp-build loopguard
        do {
          if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
          had = this.waitForInput();
          if (had) {
            // note: this is why you cant cache this.input
            this.input += had;
            extraLen -= had.length;
          }
        } while (had !== false && extraLen > 0);

        // note: this is why you cant cache this.len
        this.len = this.offset + this.input.length;
      }

      if (had === false) {
        // if there was no more input, next time skip the freeze part
        this.reachedEof = true;
        if (!eofAllowed) this.throwSyntaxError('Unexpected EOF');
        return false;
      }

      return true;
    },
    /**
     * TOFIX: we can probably drop this
     *
     * External api endpoint.
     * Call with new input, then thaw the parser.
     *
     * @param {string} input
     */
    updateInput: function(input){
      this.input += input;
      this.len += input.length;
    },

    /**
     * Should not be callable after being processed for streaming parser
     * @returns {boolean} false
     */
    waitForInput: function(){
      // noop
      return false;
    },

    // some of these regular expressions are so complex that i had to
    // write scripts to construct them. the only way to keep my sanity

    /**
     * Parse the next token if the first character
     * of the current starts with a character (as
     * a number) equal to num. Next token is parsed
     * possibly expecting a regex (so not a division).
     *
     * @param {number} num
     * @return {boolean}
     */
    nextExprIfNum: function(num){
      var equals = this.firstTokenChar === num;
      if (equals) this.next(EXPR);
      return equals;
    },
    /**
     * Parse the next token if the input range of
     * the current token matches the given string.
     * The next token will be parsed expecting a
     * possible division, not a regex.
     *
     * @param {string} str
     * @return {boolean}
     */
    nextPuncIfString: function(str){
      var equals = this.getLastValue() === str;
      if (equals) this.next(PUNC);
      return equals;
    },
    nextExprIfString: function(str){
      var equals = this.getLastValue() === str;
      if (equals) this.next(EXPR);
      return equals;
    },

    /**
     * Parser requires the current token to start with (or be) a
     * certain character. Parse the next token if that's the case.
     * Throw a syntax error otherwise.
     *
     * @param {number} num
     * @param {boolean} nextIsExpr=false
     */
    mustBeNum: function(num, nextIsExpr){
      if (this.firstTokenChar === num) return this.next(nextIsExpr);
      this.throwSyntaxError('Expected char=' + String.fromCharCode(num) + ' ('+num+') got=' + String.fromCharCode(this.firstTokenChar)+' ('+this.firstTokenChar+')');
    },
    /**
     * Parser requires the current token to be any identifier.
     * Parse the next token if that's the case. Throw a syntax
     * error otherwise.
     *
     * @param {boolean} nextIsExpr
     */
    mustBeIdentifier: function(nextIsExpr){
      if (this.lastType === IDENTIFIER) return this.next(nextIsExpr);
      this.throwSyntaxError('Expecting current type to be IDENTIFIER but is '+typeToString[this.lastType]+' ('+this.lastType+')');
    },
    /**
     * Parser requires the current token to be this
     * string. Parse the next token if that's the
     * case. Throw a syntax error otherwise.
     *
     * @param {string} str
     * @param {boolean} nextIsExpr=false
     */
    mustBeString: function(str, nextIsExpr){
      if (this.getLastValue() === str) return this.next(nextIsExpr);
      this.throwSyntaxError('Expecting current value to be ['+str+'] is ['+this.getLastValue()+']');
    },

    next: function(expressionStart){
      this.lastNewline = false;

      var options = this.options;
      var saveTokens = options.saveTokens;
      var onToken = options.onToken;
      var tokens = this.tokens;

      var guard = 100000; // #zp-build loopguard
      do {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        var type = this.nextAnyToken(expressionStart);
        if (saveTokens) {
          var token = {type:type, value:this.getLastValue(), start:this.lastOffset, stop:this.pos, white:this.tokenCountAll};
          tokens.push(token);
        }
        if (onToken) {
          onToken(type, this.getLastValue(), this.lastOffset, this.pos, this.tokenCountAll);
        }
        ++this.tokenCountAll;
      } while (type === WHITE);

      if (saveTokens) {
        token.black = this.tokenCountBlack++;
        if (options.createBlackStream) {
          this.black.push(token);
        }
      }

      this.lastType = type;
      return type;
    },
    /**
     * This case is only to prevent `3in x` and `3instanceof x` cases.
     * The next character must not be an identifier start or decimal digit.
     * First note: http://es5.github.io/#x7.8.3
     * Note: numbers at EOF always get an ASI so token count will diff
     * at least 2 in case of EOF.
     *
     * @return {number}
     */
    nextWhiteAfterNumber: function(){
      var count = this.tokenCountAll;
      var type = this.next(PUNC);
      if ((type === IDENTIFIER || type === NUMBER) && this.tokenCountAll === count+1) {
        this.throwSyntaxError('Must be at least one whitespace token between numbers and identifiers or other numbers');
      }
      return type;
    },
    nextAnyToken: function(expressionStart){
      // note: this is one of the most called functions of zeparser...

      // note: the offset might change in the newline+space optim trick, so dont re-use it
      var fullStart = this.lastOffset = this.pos;

      if (fullStart >= this.len && !this.getMoreInput(OPTIONALLY)) {
        this.firstTokenChar = 0;
        return EOF;
      }
      var nextChar = this.firstTokenChar = this.inputCharAt_offset(fullStart) | 0;

      var type = this.nextTokenDeterminator(nextChar, expressionStart);
      this.lastLen = (this.lastStop = this.pos) - this.lastOffset;

      return type;
    },

    // current selector
    nextTokenDeterminator: function(c, expressionStart) {
      if (c < ORD_L_1_31) return this.nextTokenDeterminator_a(c, expressionStart);

      var b = c & 0xffdf; // clear 0x20. note that input string must be in range of utf-16, so 0xffdf will suffice.
      if (b >= ORD_L_A_UC_41 && b <= ORD_L_Z_UC_5A) return this.parseIdentifier();

      if (c > ORD_L_9_39) return this.nextTokenDeterminator_b(c);
      return this.parseDecimalNumber();
    },
    nextTokenDeterminator_a: function(c, expressionStart) {
      switch (c) {
        case ORD_SPACE_20: // note: many spaces are caught by immediate newline checks (see parseCR and parseVerifiedNewline)
          return ++this.pos,(WHITE);
        case ORD_DOT_2E:
          return this.parseLeadingDot();
        case ORD_OPEN_PAREN_28:
          return ++this.pos,(PUNCTUATOR);
        case ORD_CLOSE_PAREN_29:
          return ++this.pos,(PUNCTUATOR);
        case ORD_CR_0D:
          return this.parseCR();
        case ORD_LF_0A:
          return this.parseVerifiedNewline(this.pos, 0);
        case ORD_COMMA_2C:
          return ++this.pos,(PUNCTUATOR);
        case ORD_TAB_09:
          return ++this.pos,(WHITE);
        case ORD_DQUOTE_22:
          return this.parseDoubleString();
        case ORD_PLUS_2B:
          return this.parseSameOrCompound(c);
        case ORD_L_0_30:
          return this.parseLeadingZero();
        case ORD_FWDSLASH_2F:
          return this.parseFwdSlash(expressionStart);
        case ORD_EXCL_21:
          return this.parseEqualSigns();
        case ORD_AND_26:
          return this.parseSameOrCompound(c);
        case ORD_DASH_2D:
          return this.parseSameOrCompound(c);
        case ORD_SQUOTE_27:
          return this.parseSingleString();
        case ORD_STAR_2A:
          return this.parseCompoundAssignment();
        case ORD_$_24:
          return this.parseIdentifier();
        case ORD_PERCENT_25:
          return this.parseCompoundAssignment();
        case ORD_FF_0C:
          return ++this.pos,(WHITE);
        case ORD_VTAB_0B:
          return ++this.pos,(WHITE);
        default:
          // cannot be unicode because it's < ORD_L_A and ORD_L_A_UC
          this.throwSyntaxError('Unexpected character in token scanner... fixme! [' + c + ']');
      }
    },
    nextTokenDeterminator_b: function(c) {
      switch (c) {
        case ORD_SEMI_3B:
          return ++this.pos,(PUNCTUATOR);
        case ORD_IS_3D:
          return this.parseEqualSigns();
        case ORD_OPEN_CURLY_7B:
          return ++this.pos,(PUNCTUATOR);
        case ORD_CLOSE_CURLY_7D:
          return ++this.pos,(PUNCTUATOR);
        case ORD_OPEN_SQUARE_5B:
          return ++this.pos,(PUNCTUATOR);
        case ORD_CLOSE_SQUARE_5D:
          return ++this.pos,(PUNCTUATOR);
        case ORD_COLON_3A:
          return ++this.pos,(PUNCTUATOR);
        case ORD_LODASH_5F:
          return this.parseIdentifier();
        case ORD_OR_7C:
          return this.parseSameOrCompound(c);
        case ORD_QMARK_3F:
          return ++this.pos,(PUNCTUATOR);
        case ORD_LT_3C:
          return this.parseLtgtPunctuator(c);
        case ORD_GT_3E:
          return this.parseLtgtPunctuator(c);
        case ORD_XOR_5E:
          return this.parseCompoundAssignment();
        case ORD_TILDE_7E:
          return this.parseCompoundAssignment();
        case ORD_PS_2028:
          return this.parseVerifiedNewline(this.pos, 0);
        case ORD_LS_2029:
          return this.parseVerifiedNewline(this.pos, 0);
        case ORD_BACKSLASH_5C:
          return this.parseBackslash();
        default:
          return this.parseOtherUnicode(c);
      }
    },

    parseOtherUnicode: function(c){
      if (this.isExoticWhitespace(c)) return ++this.pos,(WHITE);
      if (uniRegex.test(String.fromCharCode(c))) return this.parseIdentifier();

      this.throwSyntaxError('Unexpected character in token scanner... fixme! [' + c + ']');
    },
    isExoticWhitespace: function(c){
      // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp
      // http://en.wikipedia.org/wiki/Whitespace_character
      // note that this is nearly the last line of defense and virtually never executed.
      switch (c) {
        case ORD_NBSP_A0:
        case ORD_BOM_FEFF:
        case 0x0085: // NEL
        case 0x1680:
        case 0x180e: // not uni whitespace but accepted, regardless
        case 0x2000:
        case 0x2001:
        case 0x2002:
        case 0x2003:
        case 0x2004:
        case 0x2005:
        case 0x2006:
        case 0x2007:
        case 0x2008:
        case 0x2009:
        case 0x200a:
//        case ORD_ZWS: // not accepted AFAICS
        case 0x202f:
        case 0x205f:
        case 0x3000:
          return true;
      }
      return false;
    },

    parseBackslash: function(){
      // this is currently causing the top test to fail
      this.parseAndValidateUnicodeAsIdentifier(this.pos, true); // TOFIX: replace bool with constant, figure out why dropping input here only doesnt affect tests (missing test)
      this.pos += 6;

      // parseIdentifierRest assumes the first char still needs to be consumed, if we dont rewind the next char is consumed unchecked
      --this.pos;

      this.pos = this.parseIdentifierRest();
      return IDENTIFIER;
    },

    parseFwdSlash: function(expressionStart){
      if (this.pos+1 >= this.len) this.getMoreInput(REQUIRED);
      var d = this.inputCharAt_offset(this.pos+1);
      if (d === ORD_FWDSLASH_2F) return this.parseSingleComment();
      if (d === ORD_STAR_2A) return this.parseMultiComment();
      if (expressionStart) return this.parseRegex();
      return this.parseDivPunctuator(d);
    },

    parseCR: function(){
      // next char confirmed to be CR. check the next char for LF to
      // consume it for the CRLF case. this is completely optional.

      var pos = this.pos;
      if (pos+1 >= this.len) this.getMoreInput(OPTIONALLY);
      var crlf = (pos+1 < this.len && this.inputCharAt_offset(pos+1)) === ORD_LF_0A ? 1 : 0;

      return this.parseVerifiedNewline(pos + crlf, crlf);
    },
    parseVerifiedNewline: function(pos, extraForCrlf){
      // mark for ASI
      this.lastNewline = true;

      var tokens = this.tokens;
      var saveTokens = this.options.saveTokens;
      var onToken = this.options.onToken;
      var count = this.tokenCountAll;

      // in JS source it's common to find spaces or tabs after newlines
      // due to indentation. we optimize here by eliminating the scanner
      // overhead by directly checking for spaces and tabs first.
      // note: first loop consumes the verified newline.

      // only check for EOF, get new input elsewhere, no need to stream here
      var guard = 100000; // #zp-build loopguard
      while (++pos < this.len) {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        var c = this.inputCharAt_offset(pos);

        if (c !== ORD_SPACE_20 && c !== ORD_TAB_09) break;

        if (saveTokens) {
          // we just checked another token, stash the _previous_ one.
          var s = pos-(1+extraForCrlf);
          var v = this.inputSlice_offset(s, pos);
          tokens.push({type:WHITE, value:v, start:s, stop:pos, white:count});
        }
        if (onToken) {
          var s = pos-(1+extraForCrlf);
          var v = this.inputSlice_offset(s, pos);
          onToken(WHITE, v, s, pos, count);
        }

        extraForCrlf = 0; // only first iteration char is newline
        ++count;
      }

      this.tokenCountAll = count;
      this.lastOffset = pos-(1+extraForCrlf);
      this.pos = pos;

      return WHITE;
    },

    parseSameOrCompound: function(c){
      // |&-+

      var pos = this.pos+1;
      if (pos >= this.len) this.getMoreInput(REQUIRED);
      var d = this.inputCharAt_offset(pos);
      // pick one, any one :) (this func runs too infrequent to make a significant difference)
//      this.pos += (d === c || d === ORD_IS_3D) ? 2 : 1;
//      this.pos += 1 + (!(d - c && d - ORD_IS_3D) |0);
//      this.pos += (d === c || d === ORD_IS_3D) ? 2 : 1;
//      this.pos += 1 + ((!(c-d))|0) + ((!(d-ORD_IS_3D))|0);
//      this.pos += 1 + (d === c | d === ORD_IS_3D);
//      this.pos += 1 + !(d-c && d-ORD_IS_3D);

      this.pos = pos + ((d === c || d === ORD_IS_3D) ? 1 : 0);

      return PUNCTUATOR;
    },
    parseEqualSigns: function(){
      var len = 1;
      var offset = this.lastOffset;
      if (offset+1 >= this.len) this.getMoreInput(REQUIRED);
      if (this.inputCharAt_offset(offset+1) === ORD_IS_3D) {
        if (offset+2 >= this.len) this.getMoreInput(REQUIRED);
        if (this.inputCharAt_offset(offset+2) === ORD_IS_3D) len = 3;
        else len = 2;
      }
      this.pos += len;
      return PUNCTUATOR;
    },
    parseLtgtPunctuator: function(c){
      var len = 1;
      var offset = this.lastOffset;
      if (offset+1 >= this.len) this.getMoreInput(REQUIRED);
      var d = this.inputCharAt_offset(offset+1);
      if (d === ORD_IS_3D) len = 2;
      else if (d === c) {
        len = 2;
        if (offset+2 >= this.len) this.getMoreInput(REQUIRED);
        var e = this.inputCharAt_offset(offset+2);
        if (e === ORD_IS_3D) len = 3;
        else if (e === c && c !== ORD_LT_3C) {
          len = 3;
          if (offset+3 >= this.len) this.getMoreInput(REQUIRED);
          if (this.inputCharAt_offset(offset+3) === ORD_IS_3D) len = 4;
        }
      }
      this.pos += len;
      return PUNCTUATOR;
    },
    parseCompoundAssignment: function(){
      var len = 1;
      if (this.pos+1 >= this.len) this.getMoreInput(REQUIRED);
      if (this.inputCharAt_offset(this.pos+1) === ORD_IS_3D) len = 2;
      this.pos += len;
      return PUNCTUATOR;
    },
    parseDivPunctuator: function(d){
      // cant really be a //, /* or regex because they should have been checked before calling this function
      // could rewrite this to OR magic and eliminate a branch
      if (d === ORD_IS_3D) this.pos += 2;
      else ++this.pos;
      return PUNCTUATOR;
    },

    parseSingleComment: function(){
      var pos = this.pos + 1;

      // note: although we _know_ a newline will happen next; explicitly checking for it is slower than not.

      var guard = 100000; // #zp-build loopguard
      do {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        if (++pos >= this.len && !this.getMoreInput(OPTIONALLY)) break;
        var c = this.inputCharAt_offset(pos);
        if (!c || c === ORD_CR_0D || c === ORD_LF_0A || (c ^ ORD_PS_2028) <= 1) break; // c !== ORD_PS && c !== ORD_LS
      } while (true);

      this.pos = pos;

      return WHITE;

/* // reverted: this is slightly slower
      var start = this.pos;
      var pos = start + 1; // +2 but the second char is start of loop
      var input = this.input; // note: cannot cache input here
      var len = input.length;

      var foundCr = false;
      var notEof;

      while (notEof = (++pos < len)) {
        var c = input.charCodeAt(pos);
        if (c === ORD_CR_0D) { foundCr  = true; break; }
        if (c === ORD_LF_0A || (c ^ ORD_PS_2028) <= 1) break; // c !== ORD_PS && c !== ORD_LS
      }

      this.pos = pos;
      if (!notEof) return WHITE; // not EOF because we DID already parse two forward slashes

      // we _know_ there'll be a next newline token, so consume the comment now and continue with newline parser
      ++this.tokenCountAll;
      if (this.options.saveTokens) {
        // we just checked another token, stash the previous one. it gets a bit ugly now :/
        this.tokens.push({type:WHITE, value:input.slice(start, pos), start:start, stop:pos, white:this.tokens.length});
      }

      this.lastOffset = pos;

      if (foundCr) return this.parseCR();
      return this.parseVerifiedNewline(this.pos, 0);
*/
    },
    parseMultiComment: function(){
      var pos = this.pos + 2;

      var noNewline = true;
      var c = 0;
      if (pos >= this.len) this.getMoreInput(REQUIRED);
      var d = this.inputCharAt_offset(pos);
      var guard = 100000; // #zp-build loopguard
      while (d) {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        c = d;
        if (++pos >= this.len) this.getMoreInput(REQUIRED);
        d = this.inputCharAt_offset(pos);

        if (c === ORD_STAR_2A && d === ORD_FWDSLASH_2F) {
          this.pos = pos+1;
          // yes I hate the double negation, but it saves doing ! above
          if (!noNewline) this.lastNewline = true;

          return WHITE;
        }
        if (noNewline) noNewline = !(c === ORD_CR_0D || c === ORD_LF_0A || (c ^ ORD_PS_2028) <= 1); // c === ORD_PS || c === ORD_LS
      }

      this.throwSyntaxError('Unterminated multi line comment found');
    },
    parseSingleString: function(){
      return this.parseString(ORD_SQUOTE_27);
    },
    parseDoubleString: function(){
      return this.parseString(ORD_DQUOTE_22);
    },
    parseString: function(targetChar){
      var pos = this.pos + 1;
      var guard = 100000; // #zp-build loopguard
      do {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        if (pos >= this.len) this.getMoreInput(REQUIRED);
        var c = this.inputCharAt_offset(pos++);

        if (c === targetChar) {
          this.pos = pos;
          return STRING;
        }

        // &8: all newlines and backslash have their 4th bit set (prevents additional checks for 63%)
        if ((c & 8) === 8) {
          if (c === ORD_BACKSLASH_5C) pos = this.parseStringEscape(pos);
            // c&83<3: it's a filter :) all newlines have their 5th bit set and 7th bit unset.
            // none of them have first AND second bit set. this filters about 95%
            // ftr: c&80 filters 84%, c&3<3 filters 75%. together they filter 95% :)
          else if ((c & 83) < 3 && (c === ORD_LF_0A || c === ORD_CR_0D || c === ORD_PS_2028 || c === ORD_LS_2029)) {
            this.throwSyntaxError('No newlines in strings!');
          }
        }
      } while (c);

      this.throwSyntaxError('Unterminated string found');
    },
    parseStringEscape: function(pos){
      if (pos >= this.len) this.getMoreInput(REQUIRED);
      var c = this.inputCharAt_offset(pos);

      // unicode escapes
      if (c === ORD_L_U_75) {
        if (this.parseUnicodeEscapeBody(pos+1)) pos += 4;
        else this.throwSyntaxError('Invalid unicode escape');
      // line continuation; skip windows newlines as if they're one char
      } else if (c === ORD_CR_0D) {
        // keep in mind, we are already skipping a char. no need to check
        // for other line terminators here. we are merely checking to see
        // whether we need to skip an additional character for CRLF.
        if (pos+1 >= this.len) this.getMoreInput(REQUIRED);
        if (this.inputCharAt_offset(pos+1) === ORD_LF_0A) ++pos;
      // hex escapes
      } else if (c === ORD_L_X_78) {
        if (pos+2 >= this.len) this.getMoreInput(REQUIRED, pos+3-this.len);

        var a = this.inputCharAt_offset(pos+1);
        var b = this.inputCharAt_offset(pos+2);
        if (this.parseHexDigit(a) && this.parseHexDigit(b)) pos += 2;
        else this.throwSyntaxError('Invalid hex escape');
      }
      return pos+1;
    },
    parseUnicodeEscapeBody: function(pos){
      if (pos+3 >= this.len) this.getMoreInput(REQUIRED, pos+4-this.len);
      var a = this.inputCharAt_offset(pos);
      var b = this.inputCharAt_offset(pos+1);
      var c = this.inputCharAt_offset(pos+2);
      var d = this.inputCharAt_offset(pos+3);
      return this.parseHexDigit(a) && this.parseHexDigit(b) && this.parseHexDigit(c) && this.parseHexDigit(d);
    },
    parseHexDigit: function(c){
      // 0-9, a-f, A-F
      return ((c <= ORD_L_9_39 && c >= ORD_L_0_30) || (c >= ORD_L_A_61 && c <= ORD_L_F_66) || (c >= ORD_L_A_UC_41 && c <= ORD_L_F_UC_46));
    },

    parseLeadingDot: function(){
      if (this.pos+1 >= this.len) this.getMoreInput(REQUIRED);
      var c = this.inputCharAt_offset(this.pos+1);

      if (c >= ORD_L_0_30 && c <= ORD_L_9_39) return this.parseAfterDot(this.pos+2);

      ++this.pos;
      return PUNCTUATOR;
    },

    parseLeadingZero: function(){
      // a numeric that starts with zero is is either a decimal or hex
      // 0.1234  0.  0e12 0e-12 0e12+ 0.e12 0.1e23 0xdeadbeeb

      // trailing zero at eof can be valid, but must be checked for additional input first
      if (this.pos+1 >= this.len && !this.getMoreInput(OPTIONALLY)) {
        ++this.pos;
        return NUMBER;
      }

      var d = this.inputCharAt_offset(this.pos+1);
      if (d === ORD_L_X_78 || d === ORD_L_X_UC_58) { // x or X
        this.parseHexNumber();
      } else if (d === ORD_DOT_2E) {
        this.parseAfterDot(this.pos+2);
      } else if (d <= ORD_L_9_39 && d >= ORD_L_0_30) {
        this.throwSyntaxError('Invalid octal literal');
      } else {
        this.pos = this.parseExponent(d, this.pos+1);
      }

      return NUMBER;
    },
    parseHexNumber: function(){
      var pos = this.pos + 1;

      // (could use OR, eliminate casing branch)
      var guard = 100000; // #zp-build loopguard
      do {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        if (++pos >= this.len && !this.getMoreInput(OPTIONALLY)) break;
        var c = this.inputCharAt_offset(pos);
      } while ((c <= ORD_L_9_39 && c >= ORD_L_0_30) || (c >= ORD_L_A_61 && c <= ORD_L_F_66) || (c >= ORD_L_A_UC_41 && c <= ORD_L_F_UC_46));

      this.pos = pos;
      return NUMBER;
    },

    parseDecimalNumber: function(){
      // just encountered a 1-9 as the start of a token...

      var pos = this.pos;

      var guard = 100000; // #zp-build loopguard
      do {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        if (++pos >= this.len && !this.getMoreInput(OPTIONALLY)) break;
        var c = this.inputCharAt_offset(pos);
      } while (c >= ORD_L_0_30 && c <= ORD_L_9_39);

      if (c === ORD_DOT_2E) return this.parseAfterDot(pos+1);

      this.pos = this.parseExponent(c, pos);
      return NUMBER;
    },
    parseAfterDot: function(pos){
      if (pos < this.len || this.getMoreInput(OPTIONALLY)) {
        var guard = 100000; // #zp-build loopguard
        do {
          var c = this.inputCharAt_offset(pos);
          if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        } while (c >= ORD_L_0_30 && c <= ORD_L_9_39 && (++pos < this.len || this.getMoreInput(OPTIONALLY)));
      }

      pos = this.parseExponent(c, pos);

      this.pos = pos;

      return NUMBER;
    },
    parseExponent: function(c, pos){
      if (c === ORD_L_E_65 || c === ORD_L_E_UC_45) {
        if (++pos >= this.len) this.getMoreInput(REQUIRED);
        c = this.inputCharAt_offset(pos);
        // sign is optional (especially for plus)
        if (c === ORD_DASH_2D || c === ORD_PLUS_2B) {
          if (++pos >= this.len) this.getMoreInput(REQUIRED); // must have at least one char after +-
          c = this.inputCharAt_offset(pos);
        }

        // first digit is mandatory
        if (c >= ORD_L_0_30 && c <= ORD_L_9_39) {
          if (++pos >= this.len && !this.getMoreInput(OPTIONALLY)) return pos;
          c = this.inputCharAt_offset(pos);
        }
        else this.throwSyntaxError('Missing required digits after exponent');

        // rest is optional
        var guard = 100000; // #zp-build loopguard
        while (c >= ORD_L_0_30 && c <= ORD_L_9_39) {
          if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
          if (++pos >= this.len && !this.getMoreInput(OPTIONALLY)) return pos;
          c = this.inputCharAt_offset(pos);
        }
      }
      return pos;
    },

    parseRegex: function(){
      // /foo/
      // /foo[xyz]/
      // /foo(xyz)/
      // /foo{xyz}/
      // /foo(?:foo)/
      // /foo(!:foo)/
      // /foo(?!foo)bar/
      // /foo\dbar/
      this.pos++;
      this.regexBody();
      this.regexFlags();

      return REGEX;
    },
    regexBody: function(){
      // TOFIX: should try to have the regex parser only use pos, not this.pos
      var guard = 100000; // #zp-build loopguard
      while (true) {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard

        if (this.pos >= this.len && !this.getMoreInput(OPTIONALLY)) this.throwSyntaxError('Unterminated regular expression at eof');
        var c = this.inputCharAt_offset(this.pos++);

        if (c === ORD_BACKSLASH_5C) { // backslash
          if (this.pos >= this.len && !this.getMoreInput(OPTIONALLY)) this.throwSyntaxError('Unterminated regular expression escape at eof');
          var d = this.inputCharAt_offset(this.pos++);
          if (d === ORD_LF_0A || d === ORD_CR_0D || (d ^ ORD_PS_2028) <= 1 /*d === ORD_PS || d === ORD_LS*/) {
            this.throwSyntaxError('Newline can not be escaped in regular expression');
          }
        }
        else if (c === ORD_FWDSLASH_2F) return;
        else if (c === ORD_OPEN_SQUARE_5B) this.regexClass();
        else if (c === ORD_LF_0A || c === ORD_CR_0D || (c ^ ORD_PS_2028) <= 1 /*c === ORD_PS || c === ORD_LS*/) {
          this.throwSyntaxError('Newline can not be escaped in regular expression ['+c+']');
        }
      }
    },
    regexClass: function(){
      var pos = this.pos;

      var guard = 100000; // #zp-build loopguard
      while (true) {
        if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
        if (pos >= this.len && !this.getMoreInput(OPTIONALLY)) {
          this.throwSyntaxError('Unterminated regular expression');
        }

        var c = this.inputCharAt_offset(pos++);

        if (c === ORD_CLOSE_SQUARE_5D) {
          this.pos = pos;
          return;
        }

        if (c === ORD_BACKSLASH_5C) {
          // there's a historical dispute over whether backslashes in regex classes
          // add a slash or its next char. ES5 settled it to "it's an escape".
          if (this.options.regexNoClassEscape) {
            if (pos >= this.len) this.getMoreInput(REQUIRED);
            var d = this.inputCharAt_offset(pos++);
            if (d === ORD_LF_0A || d === ORD_CR_0D || (d ^ ORD_PS_2028) <= 1 /*d === ORD_PS || d === ORD_LS*/) {
              this.throwSyntaxError('Newline can not be escaped in regular expression');
            }
          }
        } else if (c === ORD_LF_0A || c === ORD_CR_0D || (c ^ ORD_PS_2028) <= 1) { // c === ORD_PS || c === ORD_LS
          this.throwSyntaxError('Illegal newline in regex char class');
        }
      }
    },
    regexFlags: function(){
      // http://es5.github.io/#x15.10.4.1
      // "If F contains any character other than "g", "i", or "m", or if it contains the same character more than once, then throw a SyntaxError exception."
      // flags may be unicode escaped

      if (this.options.skipRegexFlagCheck) {
        --this.pos; // parseIdentifierRest assumes the current char can be consumed, but that's not the case here, so we compensate
        this.pos = this.parseIdentifierRest();
        return;
      }

      // okay, we have to actually verify the flags now

      var pos = this.pos;

      var g = false;
      var m = false;
      var i = false;

      if (pos < this.len || this.getMoreInput(OPTIONALLY)) {
        var c = this.inputCharAt_offset(pos);
        var guard = 100000; // #zp-build loopguard
        while (true) {
          if (USE_LOOP_GUARDS) if (!--guard) throw 'loop security'; // #zp-build loopguard
          var backslash = false;

          // check backslash first so we can replace c with the canonical value of the escape
          if (c === ORD_BACKSLASH_5C) {
            // only valid here is `\u006` followed by a 7=g 9=i or d=m
            backslash = true;
            c = this.regexFlagUniEscape(pos + 1);
          }

          if (c === ORD_L_G_67) {
            if (g) this.throwSyntaxError('Illegal duplicate regex flag');
            g = true;
          } else if (c === ORD_L_I_69) {
            if (i) this.throwSyntaxError('Illegal duplicate regex flag');
            i = true;
          } else if (c === ORD_L_M_6D) {
            if (m) this.throwSyntaxError('Illegal duplicate regex flag');
            m = true;
          } else {
            if (backslash) this.throwSyntaxError('illegal flag? ['+c+']');
            break;
          }

          if (backslash) pos += 5;
          if (++pos >= this.len && !this.getMoreInput(OPTIONALLY)) break;
          c = this.inputCharAt_offset(pos);
        }
      }
      this.pos = pos;
    },
    regexFlagUniEscape: function(pos){
      if (pos+4 >= this.len) this.getMoreInput(REQUIRED, pos+5-this.len);
      if (this.inputCharAt_offset(pos) !== ORD_L_U_75 || this.inputCharAt_offset(pos+1) !== ORD_L_0_30 || this.inputCharAt_offset(pos+2) !== ORD_L_0_30 || this.inputCharAt_offset(pos+3) !== ORD_L_6_36) {
        return 0;
      }

      var c = this.inputCharAt_offset(pos+4);
      if (c === ORD_L_7_37) return ORD_L_G_67;
      if (c === ORD_L_9_39) return ORD_L_I_69;
      if (c === ORD_L_D_64) return ORD_L_M_6D;

      return 0;
    },
    parseIdentifier: function(){
      this.pos = this.parseIdentifierRest();
      return IDENTIFIER;
    },
    parseIdentifierRest: function(){
      // also used by regex flag parser!
      var start = this.lastOffset; // #zp-build drop line
      var pos = this.pos + 1;

      if (pos - start === 0) { // #zp-build drop line
        this.throwSyntaxError('Internal error; identifier scanner should already have validated first char'); // #zp-build drop line
      } // #zp-build drop line

      // note: statements in this loop are the second most executed statements
      var guard1 = 100000; // #zp-build loopguard
      while (true) {
        if (USE_LOOP_GUARDS) if (!--guard1) throw 'loop security'; // #zp-build loopguard

        // sequential lower case letters are very common, 5:2
        // combining lower and upper case letters here to reduce branching later https://twitter.com/mraleph/status/467277652110614528
        if (pos >= this.len && !this.getMoreInput(OPTIONALLY)) break;
        var c = this.inputCharAt_offset(pos);
        var b = c & 0xffdf;
        var guard2 = 100000; // #zp-build loopguard
        while (b >= ORD_L_A_UC_41 && b <= ORD_L_Z_UC_5A) {
          if (USE_LOOP_GUARDS) if (!--guard2) throw 'loop security'; // #zp-build loopguard

          if (++pos >= this.len && !this.getMoreInput(OPTIONALLY)) break;
          c = this.inputCharAt_offset(pos);
          b = c & 0xffdf;
        }

        var delta = this.parseOtherIdentifierParts(c, pos);
        if (!delta) break;
        pos += delta;
      }

      return pos;
    },
// TOFIX: general: put dev checks on every `pos>=len` that throw if pos>len since that's probably a bug
    parseOtherIdentifierParts: function(c, pos){
      // dont use ?: here; for build
      if (c >= ORD_L_0_30) { if (c <= ORD_L_9_39 || c === ORD_LODASH_5F) return 1; }
      else if (c === ORD_$_24) return 1;

      // \uxxxx
      if (c === ORD_BACKSLASH_5C) {
        // TOFIX: seems the atStart flag is ignored. make a test. (input is always passed on but was removed at the finger print of func)
        this.parseAndValidateUnicodeAsIdentifier(pos, false);
        return 6;
      }

      if (c > UNICODE_LIMIT_127) {
        if (uniRegex.test(String.fromCharCode(c))) {
          return 1;
        }
        // dont throw; could be PS/LS...
      }

      return 0;
    },

    parseAndValidateUnicodeAsIdentifier: function(pos, atStart){
      if (pos+1 >= this.len) this.getMoreInput(REQUIRED);
      if (this.inputCharAt_offset(pos + 1) === ORD_L_U_75 && this.parseUnicodeEscapeBody(pos + 2)) {

        // parseUnicodeEscapeBody will ensure enough input for this slice
        var u = parseInt(this.inputSlice_offset(pos+2, pos+6), 16);
        var b = u & 0xffdf;
        if (b >= ORD_L_A_UC_41 && b <= ORD_L_Z_UC_5A) {
          return true;
        }
        if (u >= ORD_L_0_30 && u <= ORD_L_9_39) {
          if (atStart) this.throwSyntaxError('Digit not allowed at start of identifier, not even escaped');
          return true;
        }
        if (u === ORD_LODASH_5F || u === ORD_$_24) {
          return true;
        }
        if (uniRegex.test(String.fromCharCode(u))) {
          return true;
        }

        this.throwSyntaxError('Encountered \\u escape ('+u+') but the char is not a valid identifier part');
      }

      this.pos = pos;
      this.throwSyntaxError('Unexpected backslash inside identifier');
    },

    getLastValue: function(){
//      return this.input.substring(this.lastOffset, this.lastStop);
      return this.inputSlice_offset(this.lastOffset, this.lastStop);
//      return this.input.substr(this.lastOffset, this.lastLen);

      // this seems slightly slower
//      var val = this.lastValue;
//      if (!val) {
//        val = this.lastValue = this.input.substring(this.lastOffset, this.lastStop);
//      }
//      return val;
    },

    // TOFIX: this is kind of the same as inputCharAt_offset...?
    getNum: function(offset){
      if (offset >= this.len) throw 'I dont think this should ever happen since isNum from parser assumes current token has been parsed. Does isnum ever check beyond current token?'; // #zp-build drop line
      return this.inputCharAt_offset(this.lastOffset + offset);
    },

    throwSyntaxError: function(message){
      if (this.options.neverThrow) {
        if (this.options.onToken) this.options.onToken.call(null, ERROR);
        if (this.options.saveTokens) this.tokens.push({type:ERROR}); // TOFIX improve
        return; // TOFIX: do we consume? either we do and we risk consuming tokens for no reason or we dont and we risk infinite loops.
      }
      var pos = (this.lastStop === this.pos) ? this.lastOffset : this.pos;
      var inp = this.input;
      throw message+'. A syntax error at pos='+pos+' Search for #|#: `'+inp.substring(pos-2000, pos)+'#|#'+inp.substring(pos, pos+2000)+'`';
    },

    inputCharAt_offset: function(pos){
      // proxy method to take care of subtracting the offset from the position
      // in the regular build the offset is always zero so we can optimize this call.
      // warning: this function is replaced for the regular build. dont do anything fancy in here!
      return this.input.charCodeAt(pos - this.offset);
    },

    inputSlice_offset: function(from, to){
      // proxy method to take care of subtracting the offset from the position
      // in the regular build the offset is always zero so we can optimize this call.
      // warning: this function is replaced for the regular build. dont do anything fancy in here!
      return this.input.slice(from - this.offset, to - this.offset);
    },
};

})(typeof exports === 'object' ? exports : window);
