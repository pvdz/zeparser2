(function(exports){
  var uniRegex = exports.uni || require(__dirname+'/uni.js').uni;

  // punctuator occurrence stats: http://qfox.nl/weblog/301
  // token start stats: http://qfox.nl/weblog/302

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
  var WHITE = 18; // WHITE_SPACE LINETERMINATOR COMMENT_SINGLE COMMENT_MULTI

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
  var ORD_LF_0A = 0x0A;
  var ORD_CR_0D = 0x0D;
  var ORD_LS_2029 = 0x2029;
  var ORD_PS_2028 = 0x2028;
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
  var Tok = exports.Tok = function(input, options){
    this.options = options || {}; // should be same as in Par, if any

    this.input = (input||'');
    this.len = this.input.length;

    // v8 "appreciates" it when all instance properties are set explicitly
    this.pos = 0;

    this.lastStart = 0;
    this.lastStop = 0;
    this.lastLen = 0;
    this.lastType = -1;
    this.lastValue = '';
    this.lastNewline = -1;

    // charCodeAt will never return -1, so -1 means "uninitialized". allows us to keep this value a number, always
    this.nextNum1 = -1;
    this.nextNum2 = -1;

    this.tokenCountAll = 0;

    if (options.saveTokens) {
      // looks like double assignment but after build step, changes into `this['tokens'] = this_tok_tokens = [];`
      this['tokens'] = this.tokens = [];
      if (options.createBlackStream) this['black'] = this.black = [];
    }
  };

  // reverse lookup (only used for error messages..)

  Tok[WHITE_SPACE] = 'whitespace';
  Tok[LINETERMINATOR] = 'lineterminator';
  Tok[COMMENT_SINGLE] = 'comment_single';
  Tok[COMMENT_MULTI] = 'comment_multi';
  Tok[STRING] = 'string';
  Tok[STRING_SINGLE] = 'string_single';
  Tok[STRING_DOUBLE] = 'string_multi';
  Tok[NUMBER] = 'number';
  Tok[NUMERIC_DEC] = 'numeric_dec';
  Tok[NUMERIC_HEX] = 'numeric_hex';
  Tok[REGEX] = 'regex';
  Tok[PUNCTUATOR] = 'punctuator';
  Tok[IDENTIFIER] = 'identifier';
  Tok[EOF] = 'eof';
  Tok[ASI] = 'asi';
  Tok[ERROR] = 'error';
  Tok[WHITE] = 'white';

  Tok.WHITE_SPACE = WHITE_SPACE;
  Tok.LINETERMINATOR = LINETERMINATOR;
  Tok.COMMENT_SINGLE = COMMENT_SINGLE;
  Tok.COMMENT_MULTI = COMMENT_MULTI;
  Tok.STRING = STRING;
  Tok.STRING_SINGLE = STRING_SINGLE;
  Tok.STRING_DOUBLE = STRING_DOUBLE;
  Tok.NUMBER = NUMBER;
  Tok.NUMERIC_DEC = NUMERIC_DEC;
  Tok.NUMERIC_HEX = NUMERIC_HEX;
  Tok.REGEX = REGEX;
  Tok.PUNCTUATOR = PUNCTUATOR;
  Tok.IDENTIFIER = IDENTIFIER;
  Tok.EOF = EOF;
  Tok.ASI = ASI;
  Tok.ERROR = ERROR;
  Tok.WHITE = WHITE; // WHITE_SPACE LINETERMINATOR COMMENT_SINGLE COMMENT_MULTI

  var proto = {
    /** @property {string} input */
    input: '',
    /** @property {number} len */
    len: 0,
    /** @property {number} pos */
    pos: 0,

    /**
     * Shared with Par.
     * Only properties relevant to Tok are listed in this jsdoc.
     *
     * @property {Object} options
     * @property {boolean} [options.saveTokens=false] Put all found tokens in .tokens
     * @property {boolean} [options.createBlackStream=false] Requires saveTokens, put black tokens in .black
     * @property {boolean} [options.regexNoClassEscape=false] Don't interpret backslash in regex class as escape
     */
    options: null,

    // parser can look at these positions to see where in the input the last token was
    // this way the tokenizer can simply return number-constants-as-types.
    /** @property {number} lastStart Start pos of the last token */
    lastStart: 0,
    /** @property {number} lastStop End pos of the last token */
    lastStop: 0,
    /** @property {number} lastLen */
    lastLen: 0,
    /** @property {number} lastType Type of the last token */
    lastType: -1,
    /** @property {string} lastValue String value of the last token, or empty string if not yet fetched (see this.getLastValue()) */
    lastValue: '',
    /** @property {boolean} lastNewline Was the current token preceeded by a newline? For determining ASI. */
    lastNewline: false,

    // .charCodeAt(pos+n) cache
    nextNum1: -1,
    nextNum2: -1,

    /** @property {number} tokenCountAll Add one for any token, including EOF (Par relies on this) */
    tokenCountAll: 0,
    /** @property {Object[]} tokens List of (all) tokens, if saving them is enabled (this.options.saveTokens) */
    tokens: null,
    /** @property {Object[]} black List of only black tokens, if saving them is enabled (this.options.saveTokens) and createBlackStream is too */
    black: null,

    // some of these regular expressions are so complex that i had to
    // write scripts to construct them. the only way to keep my sanity

    /**
     * Check whether current token is of certain type
     *
     * @param {number} t
     * @return {boolean}
     */
    isType: function(t){
      return this.lastType === t;
    },
    /**
     * Check whether the current token is of string, number,
     * regex, or identifier type. These are the "value"
     * token types, short of arrays and objects.
     *
     * @return {boolean}
     */
    isValue: function(){
      return (
        (this.lastType !== PUNCTUATOR) && // fail fast
        (this.lastType === STRING || this.lastType === NUMBER || this.lastType === IDENTIFIER || this.lastType === REGEX)
      );
    },
    /**
     * Compare the first character of the current token
     * as a number (for speed).
     *
     * @param {number} n
     * @return {boolean}
     */
    isNum: function(n){
      return this.getLastNum() === n;
    },
    /**
     * Compare the entire input range of the current
     * token to the given value.
     *
     * @param {string} value
     * @return {boolean}
     */
    isString: function(value){
      return this.getLastValue() === value;
    },

    /**
     * Parse the next token if the current
     * token a "value". Next token is parsed
     * possibly expecting a division (so not
     * a regex).
     *
     * @return {boolean}
     */
    nextPuncIfValue: function(){
      var equals = this.isValue();
      if (equals) this.nextPunc();
      return equals;
    },
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
      var equals = this.isNum(num);
      if (equals) this.nextExpr();
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
      var equals = this.isString(str);
      if (equals) this.nextPunc();
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
      if (this.isNum(num)) {
        this.next(nextIsExpr);
      } else {
        throw 'Expected char=' + String.fromCharCode(num) + ' got=' + String.fromCharCode(this.getLastNum()) + '.' + this.syntaxError();
      }
    },
    /**
     * Parser requires the current token to be any identifier.
     * Parse the next token if that's the case. Throw a syntax
     * error otherwise.
     *
     * @param {boolean} nextIsExpr
     */
    mustBeIdentifier: function(nextIsExpr){
      if (this.isType(IDENTIFIER)) {
        this.next(nextIsExpr);
      } else {
        throw this.syntaxError(IDENTIFIER);
      }
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
      if (this.isString(str)) {
        this.next(nextIsExpr);
      } else {
        throw this.syntaxError(str);
      }
    },

    nextExpr: function(){
      return this.next(true);
    },
    nextPunc: function(){
      return this.next(false);
    },

    next: function(expressionStart){
      this.lastNewline = false;

      var toStream = this.options.saveTokens;

      do {
        var type = this.nextWhiteToken(expressionStart);
        if (toStream) {
          var token = {type:type, value:this.getLastValue(), start:this.lastStart, stop:this.pos, white:this.tokens.length};
          this.tokens.push(token);
        }
      } while (type === WHITE);

      if (toStream && this.options.createBlackStream) {
        token.black = this.black.length;
        this.black.push(token);
      }

      this.lastType = type;
      return type;
    },
    nextWhiteToken: function(expressionStart){
      // note: this is one of the most called functions of zeparser...
      this.lastValue = '';

      ++this.tokenCountAll;

      var start = this.lastStart = this.pos;
      if (start >= this.len) {
        this.nextNum1 = -1;
        return EOF;
      }

      // prepare charCodeAt cache...
      var nextChar;
      // `this.nextNum2` === -1` is more often true (83%) than `this.lastLen !== 1` (11%)
      if (this.nextNum2 === -1 || this.lastLen !== 1) {
        // this will happen ~ 93% of the time
        nextChar = this.nextNum1 = this.input.charCodeAt(start);
      } else {
        nextChar = this.nextNum1 = this.nextNum2;
      }
      this.nextNum2 = -1;

      // TOFIX: nextToken or nextTokenSwitch or ...?
      var result = this.nextTokenDeterminator(nextChar, expressionStart);
      this.lastLen = (this.lastStop = this.pos) - start;

      return result;
    },

    // current selector
    nextTokenDeterminator: function(c, expressionStart) {
      if (c === ORD_SPACE_20) return this.__plusOne(WHITE);

      var b = c & 0xffdf; // clear 0x20. note that input string must be in range of utf-16, so 0xffdf will suffice.
      if (b >= ORD_L_A_UC_41 && b <= ORD_L_Z_UC_5A) return this.__parseIdentifier();

      if (c < ORD_L_1_31) return this.nextTokenDeterminator_a(c, expressionStart);
      if (c > ORD_L_9_39) return this.nextTokenDeterminator_b(c, expressionStart);
      return this.__parseNumber();
    },
    nextTokenDeterminator_a: function(c, expressionStart) {
      switch (c) {
        case ORD_DOT_2E:
          return this.__parseDot();
        case ORD_CR_0D:
          return this.__parseCR();
        case ORD_LF_0A:
          return this.__newline();
        case ORD_OPEN_PAREN_28:
          return this.__plusOne(PUNCTUATOR);
        case ORD_CLOSE_PAREN_29:
          return this.__plusOne(PUNCTUATOR);
        case ORD_COMMA_2C:
          return this.__plusOne(PUNCTUATOR);
        case ORD_TAB_09:
          return this.__plusOne(WHITE);
        case ORD_DQUOTE_22:
          return this.__parseDoubleString();
        case ORD_PLUS_2B:
          return this.__parseSameOrCompound(c);
        case ORD_L_0_30:
          return this.__parseZero();
        case ORD_FWDSLASH_2F:
          return this.__parseFwdSlash(expressionStart);
        case ORD_EXCL_21:
          return this.__parseEqualSigns();
        case ORD_AND_26:
          return this.__parseSameOrCompound(c);
        case ORD_DASH_2D:
          return this.__parseSameOrCompound(c);
        case ORD_SQUOTE_27:
          return this.__parseSingleString();
        case ORD_STAR_2A:
          return this.__parseCompound();
        case ORD_$_24:
          return this.__parseIdentifier();
        case ORD_PERCENT_25:
          return this.__parseCompound();
        case ORD_FF_0C:
          return this.__plusOne(WHITE);
        case ORD_VTAB_0B:
          return this.__plusOne(WHITE);
        default:
          // cannot be unicode because it's < ORD_L_A and ORD_L_A_UC
          throw 'Unexpected character in token scanner... fixme! [' + c + ']' + this.syntaxError();
      }
    },
    nextTokenDeterminator_b: function(c, expressionStart) {
      switch (c) {
        case ORD_SEMI_3B:
          return this.__plusOne(PUNCTUATOR);
        case ORD_IS_3D:
          return this.__parseEqualSigns();
        case ORD_OPEN_CURLY_7B:
          return this.__plusOne(PUNCTUATOR);
        case ORD_CLOSE_CURLY_7D:
          return this.__plusOne(PUNCTUATOR);
        case ORD_OPEN_SQUARE_5B:
          return this.__plusOne(PUNCTUATOR);
        case ORD_CLOSE_SQUARE_5D:
          return this.__plusOne(PUNCTUATOR);
        case ORD_COLON_3A:
          return this.__plusOne(PUNCTUATOR);
        case ORD_LODASH_5F:
          return this.__parseIdentifier();
        case ORD_OR_7C:
          return this.__parseSameOrCompound(c);
        case ORD_QMARK_3F:
          return this.__plusOne(PUNCTUATOR);
        case ORD_LT_3C:
          return this.__parseLtgtPunctuator(c);
        case ORD_GT_3E:
          return this.__parseLtgtPunctuator(c);
        case ORD_XOR_5E:
          return this.__parseCompound();
        case ORD_TILDE_7E:
          return this.__parseCompound();
        case ORD_PS_2028:
          return this.__newline();
        case ORD_LS_2029:
          return this.__newline();
        case ORD_NBSP_A0:
          return this.__plusOne(WHITE);
        case ORD_BOM_FEFF:
          return this.__plusOne(WHITE);
        case ORD_BACKSLASH_5C:
          return this.__parseBackslash();
        default:
          if (c > UNICODE_LIMIT_127 && uniRegex.test(String.fromCharCode(c))) {
            // TOFIX: are unicode "digits" allowed as first char? do/should we guard against that here?
            return this.__parseIdentifier();
          }

          throw 'Unexpected character in token scanner... fixme! [' + c + ']' + this.syntaxError();
      }
    },

    __parseBackslash: function(){
      if (this.getLastNum2() === ORD_L_U_75 && this.unicode(this.pos+2)) {
        return this.__parseEscapedIdentifier();
      }
      throw 'Token scanner saw backslash where it did not expect one.'+this.syntaxError();
    },

    __plusOne: function(type){
      ++this.pos;
      return type;
    },

    __newline: function() {
      this.lastNewline = true;
      return this.__plusOne(WHITE);
    },

    __parseFwdSlash: function(expressionStart){
      var d = this.getLastNum2();
      if (d === ORD_FWDSLASH_2F) return this.__parseSingleComment();
      if (d === ORD_STAR_2A) return this.__parseMultiComment();
      if (expressionStart) return this.__parseRegex();
      return this.__parseDivPunctuator(d);
    },

    __parseCR: function(){

      // handle \r\n normalization here
      // (could rewrite into OR, eliminating a branch)
      var d = this.getLastNum2();
      if (d === ORD_LF_0A) {
        this.lastNewline = true;
        this.pos += 2;
      } else {
        return this.__newline();
      }

      return WHITE;
    },

    __parseSameOrCompound: function(c){
      var d = this.getLastNum2();
      this.pos += (d === ORD_IS_3D || d === c) ? 2 : 1;
//      this.pos += ((d === ORD_IS) | (d === c)) + 1; // ;)
      return PUNCTUATOR;
    },
    __parseEqualSigns: function(){
      var len = 1;
      if (this.getLastNum2() === ORD_IS_3D) {
        len = 2;
        if (this.getLastNum3() === ORD_IS_3D) len = 3;
      }
      this.pos += len;
      return PUNCTUATOR;
    },
    __parseLtgtPunctuator: function(c){
      var len = 1;
      var d = this.getLastNum2();
      if (d === ORD_IS_3D) len = 2;
      else if (d === c) {
        len = 2;
        var e = this.getLastNum3();
        if (e === ORD_IS_3D) len = 3;
        else if (e === c && c !== ORD_LT_3C) {
          len = 3;
          if (this.getLastNum4() === ORD_IS_3D) len = 4;
        }
      }
      this.pos += len;
      return PUNCTUATOR;
    },
    __parseCompound: function(){
      var len = 1;
      if (this.getLastNum2() === ORD_IS_3D) len = 2;
      this.pos += len;
      return PUNCTUATOR;
    },
    __parseDivPunctuator: function(d){
      // cant really be a //, /* or regex because they should have been checked before calling this function
      // could rewrite this to OR magic and eliminate a branch
      if (d === ORD_IS_3D) this.pos += 2;
      else ++this.pos;
      return PUNCTUATOR;
    },

    __parseSingleComment: function(){
      var pos = this.pos + 2;
      var input = this.input;
      var len = input.length;

      if (pos < len) {
        do var c = input.charCodeAt(pos);
        while (c !== ORD_LF_0A && c !== ORD_CR_0D && (c ^ ORD_PS_2028) > 1 /*c !== ORD_PS && c !== ORD_LS*/ && ++pos < len);
      }

      this.pos = pos;

      return WHITE;
    },
    __parseMultiComment: function(){
      var pos = this.pos + 2;
      var input = this.input;
      var len = input.length;

      var hasNewline = false;
      var c = 0;
      var d = this.getLastNum3();
      while (pos < len) {
        c = d;
        d = input.charCodeAt(++pos);

        if (c === ORD_STAR_2A && d === ORD_FWDSLASH_2F) break;

        // only check one newline
        // TODO: check whether the extra check is worth the overhead for eliminating repetitive checks
        // (hint: if you generally check more characters here than you can skip, it's not worth it)
        if (hasNewline || c === ORD_CR_0D || c === ORD_LF_0A || (c ^ ORD_PS_2028) <= 1 /*c === ORD_PS || c === ORD_LS*/) hasNewline = this.lastNewline = true;
      }
      this.pos = pos+1;

      return WHITE;
    },
    __parseSingleString: function(){
      return this.__parseString(ORD_SQUOTE_27, STRING);
    },
    __parseDoubleString: function(){
      return this.__parseString(ORD_DQUOTE_22, STRING);
    },
    __parseString: function(targetChar, returnType){
      var pos = this.pos + 1;
      var input = this.input;
      var len = input.length;

      // TODO: rewrite this while
      var c;
      while (c !== targetChar) {
        if (pos >= len) throw 'Unterminated string found at '+pos;
        c = input.charCodeAt(pos++);

        if (c === ORD_BACKSLASH_5C) pos = this.stringEscape(pos);
        else if ((c <= ORD_CR_0D && (c === ORD_LF_0A || c === ORD_CR_0D)) || (c ^ ORD_PS_2028) <= 1 /*c === ORD_PS || c === ORD_LS*/) throw 'No newlines in strings! '+this.syntaxError();
      }

      this.pos = pos;
      return returnType;
    },
    stringEscape: function(pos){
      var input = this.input;
      var c = input.charCodeAt(pos);

      // unicode escapes
      if (c === ORD_L_U_75) {
        if (this.unicode(pos+1)) pos += 4;
        else throw 'Invalid unicode escape.'+this.syntaxError();
      // line continuation; skip windows newlines as if they're one char
      } else if (c === ORD_CR_0D) {
        // keep in mind, we are already skipping a char. no need to check
        // for other line terminators here. we are merely checking to see
        // whether we need to skip an additional character for CRLF.
        if (input.charCodeAt(pos+1) === ORD_LF_0A) ++pos;
      // hex escapes
      } else if (c === ORD_L_X_78) {
        if (this.hexicode(input.charCodeAt(pos+1)) && this.hexicode(input.charCodeAt(pos+2))) pos += 2;
        else throw 'Invalid hex escape.'+this.syntaxError();
      }
      return pos+1;
    },
    unicode: function(pos){
      var input = this.input;

      return this.hexicode(input.charCodeAt(pos)) && this.hexicode(input.charCodeAt(pos+1)) && this.hexicode(input.charCodeAt(pos+2)) && this.hexicode(input.charCodeAt(pos+3));
    },
    hexicode: function(c){
      // 0-9, a-f, A-F
      return ((c <= ORD_L_9_39 && c >= ORD_L_0_30) || (c >= ORD_L_A_61 && c <= ORD_L_F_66) || (c >= ORD_L_A_UC_41 && c <= ORD_L_F_UC_46));
    },

    __parseDot: function(){
      var c = this.getLastNum2();

      if (c >= ORD_L_0_30 && c <= ORD_L_9_39) return this.__parseAfterDot(this.pos+2);

      ++this.pos;
      return PUNCTUATOR;
    },

    __parseZero: function(){
      // a numeric that starts with zero is is either a decimal or hex
      // 0.1234  0.  0e12 0e-12 0e12+ 0.e12 0.1e23 0xdeadbeeb

      var d = this.getLastNum2();
      if (d === ORD_L_X_78 || d === ORD_L_X_UC_58) { // x or X
        this.__parseHex();
      } else if (d === ORD_DOT_2E) {
        this.__parseAfterDot(this.pos+2);
      } else if (d <= ORD_L_9_39 && d >= ORD_L_0_30) {
        throw 'Invalid octal literal.'+this.syntaxError();
      } else {
        this.pos = this.__parseExponent(d, this.pos+1, this.input);
      }

      return NUMBER;
    },
    __parseHex: function(delta){
      var pos = this.pos + 1;
      var input = this.input;
      var len = input.length;

      // (could use OR, eliminate casing branch)
      do var c = input.charCodeAt(++pos);
      while ((c <= ORD_L_9_39 && c >= ORD_L_0_30) || (c >= ORD_L_A_61 && c <= ORD_L_F_66) || (c >= ORD_L_A_UC_41 && c <= ORD_L_F_UC_46));

      this.pos = pos;
      return NUMBER;
    },

    __parseNumber: function(){
      // just encountered a 1-9 as the start of a token...

      var pos = this.pos;
      var input = this.input;
      var len = input.length;

      do var c = input.charCodeAt(++pos);
      while (c >= ORD_L_0_30 && c <= ORD_L_9_39);

      if (c === ORD_DOT_2E) return this.__parseAfterDot(pos+1);

      this.pos = this.__parseExponent(c, pos, input);
      return NUMBER;
    },
    __parseAfterDot: function(pos){
      var input = this.input;
      var c = input.charCodeAt(pos);
      while (c >= ORD_L_0_30 && c <= ORD_L_9_39) c = input.charCodeAt(++pos);

      pos = this.__parseExponent(c, pos, input);

      this.pos = pos;

      return NUMBER;
    },
    __parseExponent: function(c, pos, input){
      if (c === ORD_L_E_65 || c === ORD_L_E_UC_45) {
        c = input.charCodeAt(++pos);
        // sign is optional (especially for plus)
        if (c === ORD_DASH_2D || c === ORD_PLUS_2B) c = input.charCodeAt(++pos);

        // first digit is mandatory
        if (c >= ORD_L_0_30 && c <= ORD_L_9_39) c = input.charCodeAt(++pos);
        else throw 'Missing required digits after exponent.'+this.syntaxError();

        // rest is optional
        while (c >= ORD_L_0_30 && c <= ORD_L_9_39) c = input.charCodeAt(++pos);
      }
      return pos;
    },

    __parseRegex: function(){
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
      var input = this.input;
      var len = input.length;
      // TOFIX: fix loop
      while (this.pos < len) {
        var c = input.charCodeAt(this.pos++);

        if (c === ORD_BACKSLASH_5C) { // backslash
          var d = input.charCodeAt(this.pos++);
          if (d === ORD_LF_0A || d === ORD_CR_0D || (d ^ ORD_PS_2028) <= 1 /*d === ORD_PS || d === ORD_LS*/) {
            throw 'Newline can not be escaped in regular expression.'+this.syntaxError();
          }
        }
        else if (c === ORD_OPEN_PAREN_28) this.regexBody();
        else if (c === ORD_CLOSE_PAREN_29 || c === ORD_FWDSLASH_2F) return;
        else if (c === ORD_OPEN_SQUARE_5B) this.regexClass();
        else if (c === ORD_LF_0A || c === ORD_CR_0D || (c ^ ORD_PS_2028) <= 1 /*c === ORD_PS || c === ORD_LS*/) {
          throw 'Newline can not be escaped in regular expression ['+c+'].'+this.syntaxError();
        }
      }

      throw 'Unterminated regular expression at eof.'+this.syntaxError();
    },
    regexClass: function(){
      var input = this.input;
      var len = input.length;
      var pos = this.pos;
      while (pos < len) {
        var c = input.charCodeAt(pos++);

        if (c === ORD_CLOSE_SQUARE_5D) {
          this.pos = pos;
          return;
        }
        if (c === ORD_LF_0A || c === ORD_CR_0D || (c ^ ORD_PS_2028) <= 1 /*c === ORD_PS || c === ORD_LS*/) {
          throw 'Illegal newline in regex char class.'+this.syntaxError();
        }
        if (c === ORD_BACKSLASH_5C) { // backslash
          // there's a historical dispute over whether backslashes in regex classes
          // add a slash or its next char. ES5 settled it to "it's an escape".
          if (this.options.regexNoClassEscape) {
            var d = input.charCodeAt(pos++);
            if (d === ORD_LF_0A || d === ORD_CR_0D || (d ^ ORD_PS_2028) <= 1 /*d === ORD_PS || d === ORD_LS*/) {
              throw 'Newline can not be escaped in regular expression.'+this.syntaxError();
            }
          }
        }
      }

      throw 'Unterminated regular expression at eof.'+this.syntaxError();
    },
    regexFlags: function(){
      // we cant use the actual identifier parser because that's assuming the identifier
      // starts at the beginning of this token, which is not the case for regular expressions.
      // so we use the remainder parser, which parses the second up to the rest of the identifier

      this.pos = this.__parseIdentifierRest(0);
    },
    __parseIdentifier: function(){
      // TOFIX: leading unicode chars might still not validate as identifiers
      this.pos = this.__parseIdentifierRest(1);
      return IDENTIFIER;
    },
    __parseEscapedIdentifier: function(){
      // only for the case where an identifier starts with \uxxxx
      this.pos = this.__parseIdentifierRest(6);
      return IDENTIFIER;
    },
    __parseIdentifierRest: function(delta){
      // also used by regex flag parser!

      var input = this.input;
      var len = input.length;
      var start = this.lastStart;
      var pos = this.pos + delta;

      if (pos - start === 0) {
        throw 'Internal error; identifier scanner should already have validated first char.'+this.tok.syntaxError();
      }

      while (pos < len) {
        switch (pos - start) {
          case 1:
            var c = this.getLastNum2();
            break;
          case 2:
            var c = this.getLastNum3();
            break;
          case 3:
            var c = this.getLastNum4();
            break;
          default:
            var c = input.charCodeAt(pos);
        }

        // a-z A-Z 0-9 $ _
        // TODO: character occurrence analysis
        if ((c >= ORD_L_A_61 && c <= ORD_L_Z_7A) || (c >= ORD_L_A_UC_41 && c <= ORD_L_Z_UC_5A) || (c >= ORD_L_0_30 && c <= ORD_L_9_39) || c === ORD_$_24 || c === ORD_LODASH_5F) {
          ++pos;
        // \uxxxx (TOFIX: validate resulting char?)
        } else if (c === ORD_BACKSLASH_5C && input.charCodeAt(pos+1) === ORD_L_U_75 && this.unicode(pos+2)) {
          pos += 6;
        } else if (c > UNICODE_LIMIT_127 && uniRegex.test(String.fromCharCode(c))) {
          pos += 1;
        } else {
          break;
        }
      }

      return pos;
    },

    getLastValue: function(){
      return this.lastValue || (this.lastValue = this.input.substring(this.lastStart, this.lastStop));

      // this seems slightly slower
//      var val = this.lastValue;
//      if (!val) {
//        var input = this.input;
//        val = this.lastValue = input.substring(this.lastStart, this.lastStop);
//      }
//      return val;
    },
    getLastNum: function(){
      // always cached in nextToken function
      return this.nextNum1;
    },
    getLastNum2: function(){
      // TOFIX: perf check, what happens if i pass on pos if i can? (prevent reading this.lastStart)
      var n = this.nextNum2;
      if (n === -1) return this.nextNum2 = this.input.charCodeAt(this.lastStart+1);
      return n;
    },
    getLastNum3: function(){
      // TOFIX: refactor this out. it's useless now
      return this.input.charCodeAt(this.lastStart+2);
    },
    getLastNum4: function(){
      // TOFIX: refactor this out. it's useless now
      return this.input.charCodeAt(this.lastStart+3);
    },

    getLastLen: function(){
      return this.lastLen;
    },
    getLastNewline: function(){
      return this.lastNewline;
    },

    syntaxError: function(value){
      return (
        ' A syntax error at pos='+this.pos+' '+
        (
          typeof value !== 'undefined' ?
            'expected '+(typeof value === 'number' ? 'type='+Tok[value] : 'value=`'+value+'`') +
            ' is '+(typeof value === 'number' ? Tok[this.lastType] : '`'+this.getLastValue()+'`') + ' '
            :
            ''
        ) +
        'Search for #|#: `'+this.input.substring(this.pos-2000, this.pos)+'#|#'+this.input.substring(this.pos, this.pos+2000)+'`'
      );
    },
  };

  (function chromeWorkaround(){
    // workaround for https://code.google.com/p/v8/issues/detail?id=2246
    var o = {};
    for (var k in proto) o[k] = proto[k];
    Tok.prototype = o;
  })();

})(typeof exports === 'object' ? exports : window);

/*
 // unused
 nextTokenIfElse: function(c, expressionStart, pos) {
 // 58% of tokens is caught here
 // http://qfox.nl/weblog/301

 if (c < ORD_DOT_2E) {
 if (c === ORD_SPACE_20) return this.__plusOne(WHITE);
 if (c < ORD_OPEN_PAREN_28) {
 if (c === ORD_CR_0D) return this.__parseCR();
 if (c === ORD_TAB_09) return this.__plusOne(WHITE);
 if (c === ORD_DQUOTE_22) return this.__parseDoubleString();
 if (c === ORD_EXCL_21) return this.__parseEqualSigns();
 if (c === ORD_AND_26) return this.__parseSameOrCompound(c);
 if (c === ORD_SQUOTE_27) return this.__parseSingleString();
 if (c === ORD_$_24) return this.__parseIdentifier();
 if (c === ORD_PERCENT_25) return this.__parseCompound();
 if (c === ORD_LF_0A) return this.__newline();
 if (c === ORD_VTAB_0B) return this.__plusOne(WHITE);
 if (c === ORD_FF_0C) return this.__plusOne(WHITE);
 } else if (c <= ORD_CLOSE_PAREN_29) {
 return this.__plusOne(PUNCTUATOR);
 } else {
 if (c === ORD_COMMA_2C) return this.__plusOne(PUNCTUATOR);
 if (c === ORD_STAR_2A) return this.__parseCompound();
 // + -
 return this.__parseSameOrCompound(c);
 }
 } else {
 if (c < ORD_L_A_61) {
 if (c <= ORD_L_9_39) {
 if (c === ORD_DOT_2E) return this.__parseDot();
 if (c >= ORD_L_1_31) return this.__parseNumber();
 if (c === ORD_L_0_30) return this.__parseZero();
 if (c === ORD_FWDSLASH_2F) return this.__parseFwdSlash(expressionStart);
 } else if (c <= ORD_SEMI_3B) {
 // : or ;
 return this.__plusOne(PUNCTUATOR);
 } else {
 if (c < ORD_L_A_UC_41) {
 if (c === ORD_IS_3D) return this.__parseEqualSigns();
 if (c === ORD_QMARK_3F) return this.__plusOne(PUNCTUATOR);
 if (c <= ORD_GT_3E) return this.__parseLtgtPunctuator(c);
 } else if (c <= ORD_L_Z_UC_5A) {
 return this.__parseIdentifier();
 } else {
 if (c === ORD_CLOSE_SQUARE_5D) return this.__plusOne(PUNCTUATOR);
 if (c === ORD_OPEN_SQUARE_5B) return this.__plusOne(PUNCTUATOR);
 if (c === ORD_LODASH_5F) return this.__parseIdentifier();
 if (c === ORD_XOR_5E) return this.__parseCompound();
 if (c === ORD_BACKSLASH_5C) return this.__parseBackslash();
 }
 }
 } else if (c <= ORD_L_Z_7A) {
 return this.__parseIdentifier();
 } else {

 // TOFIX: check:
 // { = 123, |=124, }=125, ~=126. 124^1=125, 125^1=124. so if c^1<125 then c={ or c=} (because c>Zz=123)
 // ORD_CURLY_OPEN ORD_CURLY_CLOSE
 //          if (((c ^ 1) <= 124)) return this.__plusOne(PUNCTUATOR);

 if (c === ORD_OPEN_CURLY_7B) return this.__plusOne(PUNCTUATOR);
 if (c === ORD_CLOSE_CURLY_7D) return this.__plusOne(PUNCTUATOR);
 if (c === ORD_OR_7C) return this.__parseSameOrCompound(c);

 // TOFIX: check:          if ((c ^ ORD_PS) <= 1) return this.__newline(); // -> c === ORD_PS || c === ORD_LS
 if (c === ORD_LS_2029) return this.__newline();
 if (c === ORD_PS_2028) return this.__newline();
 if (c === ORD_NBSP_A0) return this.__plusOne(WHITE);
 if (c === ORD_BOM_FEFF) return this.__plusOne(WHITE);
 if (c === ORD_TILDE_7E) return this.__parseCompound();
 }
 }


 // TOFIX: still have to validate this first char as a valid ident start
 // throw 'fixme ['+c+']';
 // return this.__parseIdentifier();
 throw 'Unexpected input [' + c + ']';
 },
 // unused
 nextTokenSwitch: function(c, expressionStart) {
 switch (c) {
 case ORD_SPACE_20:
 return this.__plusOne(WHITE);
 case ORD_DOT_2E:
 return this.__parseDot();
 case ORD_CR_0D:
 return this.__parseCR();
 case ORD_LF_0A:
 return this.__newline();
 case ORD_OPEN_PAREN_28:
 return this.__plusOne(PUNCTUATOR);
 case ORD_CLOSE_PAREN_29:
 return this.__plusOne(PUNCTUATOR);
 case ORD_SEMI_3B:
 return this.__plusOne(PUNCTUATOR);
 case ORD_COMMA_2C:
 return this.__plusOne(PUNCTUATOR);
 case ORD_IS_3D:
 return this.__parseEqualSigns();
 case ORD_L_T_74:
 return this.__parseIdentifier();
 case ORD_OPEN_CURLY_7B:
 return this.__plusOne(PUNCTUATOR);
 case ORD_CLOSE_CURLY_7D:
 return this.__plusOne(PUNCTUATOR);
 case ORD_TAB_09:
 return this.__plusOne(WHITE);
 case ORD_L_I_69:
 return this.__parseIdentifier();
 case ORD_L_F_66:
 return this.__parseIdentifier();
 case ORD_L_A_61:
 return this.__parseIdentifier();
 case ORD_L_C_63:
 return this.__parseIdentifier();
 case ORD_DQUOTE_22:
 return this.__parseDoubleString();
 case ORD_L_R_72:
 return this.__parseIdentifier();
 case ORD_L_V_76:
 return this.__parseIdentifier();
 case ORD_OPEN_SQUARE_5B:
 return this.__plusOne(PUNCTUATOR);
 case ORD_CLOSE_SQUARE_5D:
 return this.__plusOne(PUNCTUATOR);
 case ORD_COLON_3A:
 return this.__plusOne(PUNCTUATOR);
 case ORD_L_B_62:
 return this.__parseIdentifier();
 case ORD_L_E_65:
 return this.__parseIdentifier();
 case ORD_L_S_73:
 return this.__parseIdentifier();
 case ORD_L_N_6E:
 return this.__parseIdentifier();
 case ORD_L_P_70:
 return this.__parseIdentifier();
 case ORD_L_D_64:
 return this.__parseIdentifier();
 case ORD_LODASH_5F:
 return this.__parseIdentifier();
 case ORD_L_M_6D:
 return this.__parseIdentifier();
 case ORD_L_G_67:
 return this.__parseIdentifier();
 case ORD_PLUS_2B:
 return this.__parseSameOrCompound(c);
 case ORD_L_0_30:
 return this.__parseZero();
 case ORD_L_L_6C:
 return this.__parseIdentifier();
 case ORD_L_O_6F:
 return this.__parseIdentifier();
 case ORD_L_1_31:
 return this.__parseNumber();
 case ORD_FWDSLASH_2F:
 return this.__parseFwdSlash(expressionStart);
 case ORD_L_H_68:
 return this.__parseIdentifier();
 case ORD_EXCL_21:
 return this.__parseEqualSigns();
 case ORD_L_U_75:
 return this.__parseIdentifier();
 case ORD_L_Z_UC_5A:
 return this.__parseIdentifier();
 case ORD_L_E_UC_45:
 return this.__parseIdentifier();
 case ORD_AND_26:
 return this.__parseSameOrCompound(c);
 case ORD_L_W_77:
 return this.__parseIdentifier();
 case ORD_L_D_UC_44:
 return this.__parseIdentifier();
 case ORD_OR_7C:
 return this.__parseSameOrCompound(c);
 case ORD_DASH_2D:
 return this.__parseSameOrCompound(c);
 case ORD_L_X_78:
 return this.__parseIdentifier();
 case ORD_SQUOTE_27:
 return this.__parseSingleString();
 case ORD_L_A_UC_41:
 return this.__parseIdentifier();
 case ORD_L_Y_79:
 return this.__parseIdentifier();
 case ORD_STAR_2A:
 return this.__parseCompound();
 case ORD_L_T_UC_54:
 return this.__parseIdentifier();
 case ORD_L_F_UC_46:
 return this.__parseIdentifier();
 case ORD_L_K_6B:
 return this.__parseIdentifier();
 case ORD_L_C_UC_43:
 return this.__parseIdentifier();
 case ORD_L_J_6A:
 return this.__parseIdentifier();
 case ORD_L_S_UC_53:
 return this.__parseIdentifier();
 case ORD_L_M_UC_4D:
 return this.__parseIdentifier();
 case ORD_L_P_UC_50:
 return this.__parseIdentifier();
 case ORD_QMARK_3F:
 return this.__plusOne(PUNCTUATOR);
 case ORD_LT_3C:
 return this.__parseLtgtPunctuator(c);
 case ORD_L_2_33:
 return this.__parseNumber();
 case ORD_L_G_UC_47:
 return this.__parseIdentifier();
 case ORD_$_24:
 return this.__parseIdentifier();
 case ORD_L_B_UC_42:
 return this.__parseIdentifier();
 case ORD_L_H_UC_48:
 return this.__parseIdentifier();
 case ORD_L_I_UC_49:
 return this.__parseIdentifier();
 case ORD_L_O_UC_4F:
 return this.__parseIdentifier();
 case ORD_L_Q_71:
 return this.__parseIdentifier();
 case ORD_L_R_UC_52:
 return this.__parseIdentifier();
 case ORD_L_Z_7A:
 return this.__parseIdentifier();
 case ORD_GT_3E:
 return this.__parseLtgtPunctuator(c);
 case ORD_L_3_34:
 return this.__parseNumber();
 case ORD_L_N_UC_4E:
 return this.__parseIdentifier();
 case ORD_L_L_UC_4C:
 return this.__parseIdentifier();
 case ORD_L_Y_UC_59:
 return this.__parseIdentifier();
 case ORD_L_J_UC_4A:
 return this.__parseIdentifier();
 case ORD_L_K_UC_4B:
 return this.__parseIdentifier();
 case ORD_L_X_UC_58:
 return this.__parseIdentifier();
 case ORD_L_Q_UC_51:
 return this.__parseIdentifier();
 case ORD_L_U_UC_55:
 return this.__parseIdentifier();
 case ORD_L_V_UC_56:
 return this.__parseIdentifier();
 case ORD_L_W_UC_57:
 return this.__parseIdentifier();
 case ORD_L_4_34:
 return this.__parseNumber();
 case ORD_L_5_35:
 return this.__parseNumber();
 case ORD_L_6_36:
 return this.__parseNumber();
 case ORD_L_7_37:
 return this.__parseNumber();
 case ORD_L_8_38:
 return this.__parseNumber();
 case ORD_L_9_39:
 return this.__parseNumber();
 case ORD_PERCENT_25:
 return this.__parseCompound();
 case ORD_XOR_5E:
 return this.__parseCompound();
 case ORD_TILDE_7E:
 return this.__parseCompound();
 case ORD_PS_2028:
 return this.__newline();
 case ORD_LS_2029:
 return this.__newline();
 case ORD_FF_0C:
 return this.__plusOne(WHITE);
 case ORD_VTAB_0B:
 return this.__plusOne(WHITE);
 case ORD_NBSP_A0:
 return this.__plusOne(WHITE);
 case ORD_BOM_FEFF:
 return this.__plusOne(WHITE);
 case ORD_BACKSLASH_5C:
 return this.__parseBackslash();
 default:
 throw 'Unexpected character in token scanner... fixme! [' + c + ']' + this.syntaxError();
 }
 // TOFIX: still have to validate this first char as a valid ident start
 // return this.__parseIdentifier();
 },
 */
