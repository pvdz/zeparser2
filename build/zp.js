(function(exports){
;
//######### uni.js #########

// http://qfox.nl/notes/155
// http://qfox.nl/notes/90

(function(exports){
  exports.uni = /[\u0030-\u0039\u0041-\u005a\u005f\u0061-\u007a\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u0487\u048a-\u0524\u0526\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0621-\u065e\u0660-\u0669\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07c0-\u07f5\u07fa\u0901-\u0939\u093c-\u094d\u0950-\u0954\u0958-\u0963\u0966-\u096f\u0971\u0972\u097b-\u097f\u0981-\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7\u09c8\u09cb-\u09ce\u09d7\u09dc\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a66-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5c\u0b5d\u0b5f-\u0b63\u0b66-\u0b6f\u0b71\u0b82\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c58\u0c59\u0c60-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0cde\u0ce0-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d60-\u0d63\u0d66-\u0d6f\u0d7a-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e50-\u0e59\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc\u0edd\u0f00\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f8b\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1049\u1050-\u1099\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc\u1100-\u1159\u115f-\u11a2\u11a8-\u11f9\u1200-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u1676\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772\u1773\u1780-\u17b3\u17b6-\u17d3\u17d7\u17dc\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1820-\u1877\u1880-\u18aa\u1900-\u191c\u1920-\u192b\u1930-\u193b\u1946-\u196d\u1970-\u1974\u1980-\u19a9\u19b0-\u19c9\u19d0-\u19d9\u1a00-\u1a1b\u1b00-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1baa\u1bae-\u1bb9\u1c00-\u1c37\u1c40-\u1c49\u1c4d-\u1c7d\u1d00-\u1de6\u1dfe-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffb\u203f\u2040\u2054\u2071\u207f\u2090-\u2094\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb\u2ced\u2cf2\u2d00-\u2d25\u2d30-\u2d65\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005-\u3007\u3021-\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u3099\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31b7\u31f0-\u31ff\u3400\u4db5\u4e00\u9fc3\ua000-\ua1af\ua60c\ua620-\ua629\ua640-\ua660\ua662-\ua66d\ua66f\ua67c\ua67d\ua67f-\ua697\ua717-\ua71f\ua722-\ua788\ua78b-\ua78d\ua790\ua792\ua7a0\ua7a2\ua7a4\ua7a6\ua7a8\ua7aa\ua802\ua806\ua80b\ua823-\ua827\ua880\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua900-\ua909\ua926-\ua92d\ua947-\ua953\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\ufb00-\ufb06\ufb13-\ufb17\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff70\uff9e\uff9f]/;
})(typeof exports === 'object' ? exports : window);


//######### end of uni.js #########


;
//######### tok.js #########

(function(exports){
  var uniRegex = exports.uni || require(__dirname+'/uni.js').uni;

  // indices match slots of the start-regexes (where applicable)
  // this order is determined by regex/parser rules so they are fixed
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
      // WHITE_SPACE LINETERMINATOR COMMENT_SINGLE COMMENT_MULTI

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
    this.tokens = [];

    this.input = (input||'');
    this.len = this.input.length;

    // v8 "appreciates" to be set all instance properties explicitly
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
      this.tokens = [];
      if (options.createBlackStream) this.black = [];
    }
  };

  // reverse lookup (only used for error messages..)

  Tok[1] = 'whitespace';
  Tok[2] = 'lineterminator';
  Tok[3] = 'comment_single';
  Tok[4] = 'comment_multi';
  Tok[10] = 'string';
  Tok[5] = 'string_single';
  Tok[6] = 'string_multi';
  Tok[7] = 'number';
  Tok[11] = 'numeric_dec';
  Tok[12] = 'numeric_hex';
  Tok[8] = 'regex';
  Tok[9] = 'punctuator';
  Tok[13] = 'identifier';
  Tok[14] = 'eof';
  Tok[15] = 'asi';
  Tok[16] = 'error';
  Tok[18] = 'white';

  Tok.WHITE_SPACE = 1;
  Tok.LINETERMINATOR = 2;
  Tok.COMMENT_SINGLE = 3;
  Tok.COMMENT_MULTI = 4;
  Tok.STRING = 10;
  Tok.STRING_SINGLE = 5;
  Tok.STRING_DOUBLE = 6;
  Tok.NUMBER = 7;
  Tok.NUMERIC_DEC = 11;
  Tok.NUMERIC_HEX = 12;
  Tok.REGEX = 8;
  Tok.PUNCTUATOR = 9;
  Tok.IDENTIFIER = 13;
  Tok.EOF = 14;
  Tok.ASI = 15;
  Tok.ERROR = 16;
  Tok.WHITE = 18; // WHITE_SPACE LINETERMINATOR COMMENT_SINGLE COMMENT_MULTI

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
      return this.lastType === 10 || this.lastType === 7 || this.lastType === 13 || this.lastType === 8 || false;
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
     * token isType(type). Next token is parsed
     * possibly expecting a division (so not
     * a regex).
     *
     * @param {number} type
     * @return {boolean}
     */
    nextPuncIfType: function(type){
      var equals = this.isType(type);
      if (equals) this.nextPunc();
      return equals;
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
        throw this.syntaxError(num);
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
      if (this.isType(13)) {
        this.next(nextIsExpr);
      } else {
        throw this.syntaxError(13);
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

      var pos = this.pos;
      var toStream = this.options.saveTokens;

      do {
        var type = this.nextWhiteToken(expressionStart);
        if (toStream) {
          var token = {type:type, value:this.getLastValue(), start:this.lastStart, stop:this.pos, white:this.tokens.length};
          this.tokens.push(token);
        }
      } while (type === 18);

      if (toStream && this.options.createBlackStream) {
        token.black = this.black.length;
        this.black.push(token);
      }

      this.lastType = type;
      return type;
    },
    nextWhiteToken: function(expressionStart){
      this.lastValue = '';

      // prepare charCodeAt cache...
      if (this.lastLen === 1) this.nextNum1 = this.nextNum2;
      else this.nextNum1 = -1;
      this.nextNum2 = -1;

      ++this.tokenCountAll;

      if (this.pos >= this.len) {
        if (this.lastType === 14) throw 'Tried to parse beyond EOF, that cannot be good.';
        var result = 14;
        this.lastLen = 0;
        this.lastStart = this.lastStop = this.len;
      } else {
        var start = this.lastStart = this.pos;
        var result = this.nextToken(expressionStart);
        var stop = this.lastStop = this.pos;
        this.lastLen = stop - start;
      }

      return result;
    },

    nextToken: function(expressionStart){
      var pos = this.pos;
      var input = this.input;
      var c = this.getLastNum(); // this.pos === this.lastStart

      var result = -1;

      // https://twitter.com/ariyahidayat/status/225447566815395840
      // Punctuator, Identifier, Keyword, String, Numeric, Boolean, Null, RegularExpression
      // so:
      // Whitespace, RegularExpression, Punctuator, Identifier, LineTerminator, String, Numeric
      if (this.whitespace(c)) result = 18;
      else if (this.lineTerminator(c, pos)) result = 18;
      else if (this.asciiIdentifier(c)) result = 13;
      // forward slash before generic punctuators!
      else if (c === 0x2f) { // / (forward slash)
        var n = this.getLastNum2(); // this.pos === this.lastStart+1
        if (n === 0x2f) result = this.commentSingle(pos, input); // 0x002f=/
        else if (n === 0x2a) result = this.commentMulti(pos, input); // 0x002f=*
        else if (expressionStart) result = this.regex();
        else result = this.punctuatorDiv(c,n);
      }
      else if (this.punctuator(c)) result = 9;
      else if (c === 0x27) result = this.stringSingle();
      else if (c === 0x22) result = this.stringDouble();
      else if (this.number(c,pos,input)) result = 7; // number after punctuator, check algorithm if that changes!
      else throw 'dont know what to parse now. '+this.syntaxError();

      return result;
    },

    punctuator: function(c){
      var len = 0;
  //    >>>=,
  //    === !== >>> <<= >>=
  //    <= >= == != ++ -- << >> && || += -= *= %= &= |= ^= /=
  //    { } ( ) [ ] . ; ,< > + - * % | & ^ ! ~ ? : = /

      if (c === 0x2e) { // .
        var d = this.getLastNum2();
        // must check for a number because number parser comes after this
        if (d < 0x0030 || d > 0x0039) len = 1;
      }
      else if (c === 0x3d) { // =
        if (this.getLastNum2() === 0x3d) {
          if (this.getLastNum3() === 0x3d) len = 3;
          else len = 2;
        }
        else len = 1;
      }
      //       (             )             ;             ,             {             }             :             [             ]             ?             ~
      else if (c === 0x28 || c === 0x29 || c === 0x3b || c === 0x2c || c === 0x7b || c === 0x7d || c === 0x3a || c === 0x5b || c === 0x5d || c === 0x3f || c === 0x7e) len = 1;
      else {
        var d = this.getLastNum2();

        if (c === 0x2b) { // +
          if (d === 0x3d || d === 0x2b) len = 2;
          else len = 1;
        }
        else if (c === 0x21) { // !
          if (d === 0x3d) {
            var e = this.getLastNum3();
            if (e === 0x3d) len = 3;
            else len = 2;
          }
          else len = 1;
        }
        else if (c === 0x26) { // &
          if (d === 0x3d || d === 0x26) len = 2;
          else len = 1;
        }
        else if (c === 0x7c) { // |
          if (d === 0x3d || d === 0x7c) len = 2;
          else len = 1;
        }
        else if (c === 0x2d) { // -
          if (d === 0x3d || d === 0x2d) len = 2;
          else len = 1;
        }
        else if (c === 0x3c) { // <
          if (d === 0x3d) len = 2;
          else if (d === 0x3c) {
            var e = this.getLastNum3();
            if (e === 0x3d) len = 3;
            else len = 2;
          }
          else {
            len = 1;
          }
        }
        else if (c === 0x2a) { // *
          if (d === 0x3d) len = 2;
          else len = 1;
        }
        else if (c === 0x3e) { // >
          if (d === 0x3d) len = 2;
          else if (d === 0x3e) {
            var e = this.getLastNum3();
            if (e === 0x3d) len = 3;
            else if (e === 0x3e) {
              var f = this.getLastNum4();
              if (f === 0x3d) len = 4;
              else  len = 3;
            }
            else {
              len = 2;
            }
          }
          else {
            len = 1;
          }
        }
        else if (c === 0x25) { // %
          if (d === 0x3d) len = 2;
          else len = 1;
        }
        else if (c === 0x5e) { // ^
          if (d === 0x3d) len = 2;
          else len = 1;
        }
        // else it wasnt a punctuator after all
      }

      if (len) {
        this.pos += len;

        return true;
      } else {
        return false;
      }
    },
    punctuatorDiv: function(c,d){
      // cant really be a //, /* or regex because they should have been checked before calling this function
      if (d === 0x3d) this.pos += 2; // /=
      else ++this.pos;
      return 9;
    },

    whitespace: function(c){
      if ((c <= 0x0020 || c >= 0x00A0) && (c === 0x0020 || c === 0x0009 || c === 0x000B || c === 0x000C || c === 0x00A0 || c === 0xFFFF)) {
        ++this.pos;
        return true;
      }
      return false;
    },
    lineTerminator: function(c, pos){
      if (c === 0x000D){
        this.lastNewline = true;
        // handle \r\n normalization here
        var d = this.getLastNum2();
        if (d === 0x000A) {
          this.pos = pos + 2;
        } else {
          this.pos = pos + 1;
        }
        return true;
      } else if (c === 0x000A || c === 0x2028 || c === 0x2029) {
        this.lastNewline = true;
        this.pos = pos + 1;
        return true;
      }
      return false;
    },
    commentSingle: function(pos, input){
      var len = input.length;
      ++pos;
      var c = -1;
      while (pos < len) {
        c = input.charCodeAt(++pos);
        if (c === 0x000D || c === 0x000A || c === 0x2028 || c === 0x2029) break;
      }
      this.pos = pos;

      return 18;
    },
    commentMulti: function(pos, input){
      var len = input.length;
      var hasNewline = false;
      var c=0,d = this.getLastNum3(); // at this point we are reading this.lastStart+2
      pos += 2;
      while (pos < len) {
        c = d;
        d = input.charCodeAt(++pos);

        if (c === 0x2a && d === 0x2f) break; // / *

        // only check one newline
        // TODO: check whether the extra check is worth the overhead for eliminating repetitive checks
        // (hint: if you generally check more characters here than you can skip, it's not worth it)
        if (hasNewline || c === 0x000D || c === 0x000A || c === 0x2028 || c === 0x2029) hasNewline = this.lastNewline = true;
      }
      this.pos = pos+1;

      return 18;
    },
    stringSingle: function(){
      var pos = this.pos + 1;
      var input = this.input;
      var len = input.length;

      while (pos < len) {
        var c = input.charCodeAt(pos++);
        if (c === 0x0027) { // ' (single quote)
            this.pos = pos;
            return 10;
        }
        if (c === 0x005c) pos = this.stringEscape(pos); // \ (backslash)
        if (c === 0x000A || c === 0x000D || c === 0x2028 || c === 0x2029) throw 'No newlines in strings!';
      }

      throw 'Unterminated string found at '+pos;
    },
    stringDouble: function(){
      var pos = this.pos + 1;
      var input = this.input;
      var len = input.length;

      while (pos < len) {
        var c = input.charCodeAt(pos++);

        if (c === 0x0022) { // " (double quote)
          this.pos = pos;
          return 10;
        }
        if (c === 0x005c) pos = this.stringEscape(pos); // \ (backslash)
        if (c === 0x000A || c === 0x000D || c === 0x2028 || c === 0x2029) throw 'No newlines in strings!';
      }

      throw 'Unterminated string found at '+pos;
    },
    stringEscape: function(pos){
      var input = this.input;
      var c = input.charCodeAt(pos);

      // unicode escapes
      if (c === 0x0075) { // u
        if (this.unicode(pos+1)) pos += 4;
        else throw 'Invalid unicode escape';
      // line continuation; skip windows newlines as if they're one char
      } else if (c === 0x000D) {
        // keep in mind, we are already skipping a char. no need to check
        // for other line terminators here. we are merely checking to see
        // whether we need to skip an additional character.
        if (input.charCodeAt(pos+1) === 0x000A) ++pos;
      // hex escapes
      } else if (c === 0x0078) { // x
        if (this.hexicode(input.charCodeAt(pos+1)) && this.hexicode(input.charCodeAt(pos+2))) pos += 2;
        else throw 'Invalid hex escape';
      }
      return pos+1;
    },
    unicode: function(pos){
      var input = this.input;

      return this.hexicode(input.charCodeAt(pos)) && this.hexicode(input.charCodeAt(pos+1)) && this.hexicode(input.charCodeAt(pos+2)) && this.hexicode(input.charCodeAt(pos+3));
    },
    hexicode: function(c){
      // 0-9, a-f, A-F
      return ((c <= 0x39 && c >= 0x30) || (c >= 0x61 && c <= 0x66) || (c >= 0x41 && c <= 0x46));
    },

    number: function(c, pos, input){
      // 1-9 just means decimal literal
      if (c >= 0x0031 && c <= 0x0039) this.decimalNumber(this.getLastNum2(), pos+1, input); // do this after punctuator... the -1 is kind of a hack in that
      // leading zero can mean decimal or hex literal
      else if (c === 0x0030) this.decOrHex(c, pos, input);
      // dot means decimal, without the leading digits
      else if (c === 0x2e) this.decimalFromDot(c, pos, input); // dot, start of the number (rare)
      // yeah, no number. move on.
      else return false;
      // we parsed a number.
      return true;
    },
    decOrHex: function(c, pos, input){
      // numeric is either a decimal or hex
      // 0.1234  .123  .0  0.  0e12 0e-12 0e12+ 0.e12 0.1e23 0xdeadbeeb

      var d = this.getLastNum2();
      if (d !== 0x0058 && d !== 0x0078) { // x or X
        // next can only be numbers or dots...
        this.decimalNumber(d, pos+1, input);
      } else {
        this.hexNumber(pos+2);
      }

      return 7;
    },
    decimalNumber: function(c, pos, input){
      // leading digits. assume c is preceeded by at least one digit (that might have been zero..., tofix in the future)
      while (c >= 0x30 && c <= 0x39) c = input.charCodeAt(++pos);
      // .123e+40 part
      return this.decimalFromDot(c, pos, input);
    },
    decimalFromDot: function(c, pos, input){
      if (c === 0x002e) { // dot
        c = input.charCodeAt(++pos);
        while (c >= 0x30 & c <= 0x39) c = input.charCodeAt(++pos);
      }

      if (c === 0x0045 || c === 0x0065) { // e or E
        c = input.charCodeAt(++pos);
        // sign is optional
        if (c === 0x002b || c === 0x002d) c = input.charCodeAt(++pos);

        // first digit is mandatory
        if (c >= 0x30 & c <= 0x39) c = input.charCodeAt(++pos);
        else throw 'Missing required digits after exponent. '+this.syntaxError();

        // rest is optional
        while (c >= 0x30 & c <= 0x39) c = input.charCodeAt(++pos);
      }

      this.pos = pos;

      return 7;
    },
    hexNumber: function(pos){
      var input = this.input;
      var len = input.length;
      // hex
      while (pos < len && this.hexicode(input.charCodeAt(pos))) ++pos;
      this.pos = pos;
    },

    regex: function(){
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
  //    this.pos++;
      this.regexFlags();

      return 8;
    },
    regexBody: function(){
      var input = this.input;
      var len = input.length;
      while (this.pos < len) {
        var c = input.charCodeAt(this.pos++);

        if (c === 0x005c) { // backslash
          var d = input.charCodeAt(this.pos++);
          if (d === 0x000D || d === 0x000A || d === 0x2028 || d === 0x2029) {
            throw new Error('Newline can not be escaped in regular expression at '+this.pos);
          }
        } else if (c === 0x0028) { // opening paren
          this.regexBody();
        } else if (c === 0x0029 || c === 0x002f) { // closing paren or forward slash
          return;
        } else if (c === 0x005b) { // opening square bracket
          this.regexClass();
        } else if (c === 0x000D || c === 0x000A || c === 0x2028 || c === 0x2029) { // newlines
          throw new Error('Newline can not be escaped in regular expression at '+this.pos);
        }
      }

      throw new Error('Unterminated regular expression at eof');
    },
    regexClass: function(){
      var input = this.input;
      var len = input.length;
      var pos = this.pos;
      while (pos < len) {
        var c = input.charCodeAt(pos++);

        if (c === 0x005d) { // ]
          this.pos = pos;
          return;
        }
        if (c === 0x000D || c === 0x000A || c === 0x2028 || c === 0x2029) {
          throw 'Illegal newline in regex char class at '+pos;
        }
        if (c === 0x005c) { // backslash
          // there's a historical dispute over whether backslashes in regex classes
          // add a slash or its next char. ES5 settled it to "it's an escape".
          if (this.options.regexNoClassEscape) {
            var d = input.charCodeAt(pos++);
            if (d === 0x000D || d === 0x000A || d === 0x2028 || d === 0x2029) {
              throw new Error('Newline can not be escaped in regular expression at '+pos);
            }
          }
        }
      }

      throw new Error('Unterminated regular expression at eof');
    },
    regexFlags: function(){
      // we cant use the actual identifier parser because that's assuming the identifier
      // starts at the beginning of this token, which is not the case for regular expressions.
      // so we use the remainder parser, which parses the second up to the rest of the identifier

      this.pos = this.asciiIdentifierRest(0);
    },
    asciiIdentifier: function(c){
      var toAdd = this.asciiIdentifierStart(c);
      if (toAdd === 0) return false;

      // 2nd char up till the end of the identifier
      this.pos = this.asciiIdentifierRest(toAdd);

      return true;
    },
    asciiIdentifierStart: function(c){
      // a-z A-Z $ _ (no number here!)
      if ((c >= 0x61 && c <= 0x7a) || (c >= 0x41 && c <= 0x5a) || c === 0x5f || c === 0x24) {
        return 1;
      // \uxxxx
      } else if (c === 0x5c) {
        var pos = this.pos;
        if (this.getLastNum2() === 0x75 && this.unicode(pos+2)) { // \
          return 6;
        } else {
          throw 'No backslash in identifier (xept for \\u). '+this.syntaxError();
        }
      // above ascii range? might be valid unicode char
      } else if (c > 127) {
        if (uniRegex.test(String.fromCharCode(c))) return 1;
      }
      // do nothing so we return 0
      return 0;
    },
    asciiIdentifierRest: function(toAdd){
      var input = this.input;
      var len = input.length;
      var pos = this.pos + toAdd;

      // also used by regex flag parser
      while (pos < len) {
        var c = input.charCodeAt(pos);

        // a-z A-Z 0-9 $ _
        if ((c >= 0x61 && c <= 0x7a) || (c >= 0x41 && c <= 0x5a) || (c >= 0x30 && c <= 0x39) || c === 0x5f || c === 0x24) {
          ++pos;
          // \uxxxx
        } else if (c === 0x5c && input.charCodeAt(pos+1) === 0x75 && this.unicode(pos+2)) {
          pos += 6;
        } else if (c > 127 && uniRegex.test(String.fromCharCode(c))) {
          pos += 1;
        } else {
          break;
        }
      }

      return pos;
    },

    getLastValue: function(){
      return this.lastValue || (this.lastValue = this.input.substring(this.lastStart, this.lastStop));

  //    // this seems slightly slower
  //    var val = this.lastValue;
  //    if (!val) {
  //      var input = this.input;
  //      val = this.lastValue = input.substring(this.lastStart, this.lastStop);
  //    }
  //    return val;
    },
    getLastNum: function(){
      var n = this.nextNum1;
      if (n === -1) return this.nextNum1 = this.input.charCodeAt(this.lastStart);
      return n;
    },
    getLastNum2: function(){
      var n = this.nextNum2;
      if (n === -1) return this.nextNum2 = this.input.charCodeAt(this.lastStart+1);
      return n;
    },
    getLastNum3: function(){
      return this.input.charCodeAt(this.lastStart+2);
    },
    getLastNum4: function(){
      return this.input.charCodeAt(this.lastStart+3);
    },

    debug: function(){
      return '`'+this.getLastValue()+'` @ '+this.pos+' ('+Tok[this.lastType]+')';
    },
    syntaxError: function(value){
      return 'A syntax error at pos='+this.pos+" expected "+(typeof value == 'number' ? 'type='+Tok[value] : 'value=`'+value+'`')+' is `'+this.getLastValue()+'` '+
          '('+Tok[this.lastType]+') #### `'+this.input.substring(this.pos-2000, this.pos)+'#|#'+this.input.substring(this.pos, this.pos+2000)+'`'
    },
  };

  // workaround for https://code.google.com/p/v8/issues/detail?id=2246
  var o = {};
  for (var k in proto) o[k] = proto[k];
  Tok.prototype = o;

})(typeof exports === 'object' ? exports : window);


//######### end of tok.js #########


;
//######### par.js #########

// If you see magic numbers and bools all over the place, it means this
// file has been post-processed by a build script. If you want to read
// this file, see https://github.com/qfox/zeparser2
(function(exports){
  var Tok = exports.Tok || require(__dirname+'/tok.js').Tok;

  // indices match slots of the start-regexes (where applicable)
  // this order is determined by regex/parser rules so they are fixed
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
      // WHITE_SPACE, LINETERMINATOR COMMENT_SINGLE COMMENT_MULTI

  // extra assignment and for-in checks
     
      // invalid lhs for assignments
      // comma, assignment, non-assignee
     
  var NEITHER = 1 | 2;
     

  // boolean constants
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     

     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     

     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     

  var Par = exports.Par = function(input, options){
    this.options = options = options || {};

    if (!options.saveTokens) options.saveTokens = false;
    if (!options.createBlackStream) options.createBlackStream = false;
    if (!options.functionMode) options.functionMode = false;
    if (!options.regexNoClassEscape) options.regexNoClassEscape = false;
    if (!options.strictForInCheck) options.strictForInCheck = false;
    if (!options.strictAssignmentCheck) options.strictAssignmentCheck = false;

    this.tok = new Tok(input, this.options);
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
//     * @property {boolean} [options.scriptMode=false] (TODO, #12)
     * @property {boolean} [options.regexNoClassEscape=false] Don't interpret backslash in regex class as escape
     * @property {boolean} [options.strictForInCheck=false] Reject the lhs for a `for` if it's technically bad (not superseded by strict assignment option)
     * @property {boolean} [options.strictAssignmentCheck=false] Reject the lhs for assignments if it can't be correct at runtime (does not supersede for-in option)
     */
    options: null,

    run: function(){
      var tok = this.tok;
      // prepare
      tok.nextExpr();
      // go!
      this.parseStatements(false, false, false, []);
      if (tok.pos != tok.len) throw 'Did not complete parsing... '+tok.syntaxError();

      return this;
    },

    parseStatements: function(inFunction, inLoop, inSwitch, labelSet){
      var tok = this.tok;
      // note: statements are optional, this function might not parse anything
      while (!tok.isType(14) && this.parseStatement(inFunction, inLoop, inSwitch, labelSet, true));
    },
    parseStatement: function(inFunction, inLoop, inSwitch, labelSet, optional){
      var tok = this.tok;
      if (tok.isType(13)) {
        // dont "just" return true. case and default still return false
        return this.parseIdentifierStatement(inFunction, inLoop, inSwitch, labelSet);
      }

      var c = tok.getLastNum();

      if (c === 0x7b) {
        tok.nextExpr();
        this.parseBlock(true, inFunction, inLoop, inSwitch, labelSet);
        return true;
      }

      if (c === 0x28 || c === 0x5b || c === 0x7e || c === 0x2b || c === 0x2d || c === 0x21) {
        this.parseExpressionStatement();
        return true;
      }

      if (c === 0x3b) { // empty statement
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

      // The current token is an identifier. Either its value will be
      // checked in this function (parseIdentifierStatement) or in the
      // parseExpressionOrLabel function. So we can just get it now.
      var value = tok.getLastValue();

      // track whether this token was parsed. if not, do parseExpressionOrLabel at the end
      var startCount = tok.tokenCountAll;

      var len = tok.lastLen;

      // TODO: could add identifier check to conditionally call parseExpressionOrLabel vs parseExpression

      // yes, this check makes a *huge* difference
      if (len >= 2 && len <= 8) {
        // bcdfirstvw, not in that order.
        var c = tok.getLastNum();

        if (c === 0x74) {
          if (value === 'try') this.parseTry(inFunction, inLoop, inSwitch, labelSet);
          else if (value === 'throw') this.parseThrow();
        }
        else if (c === 0x69 && len === 2 && tok.getLastNum2() === 0x66) this.parseIf(inFunction, inLoop, inSwitch, labelSet);
        else if (c === 0x76 && value === 'var') this.parseVar();
        else if (c === 0x72 && value === 'return') this.parseReturn(inFunction, inLoop, inSwitch);
        else if (c === 0x66) {
          if (value === 'function') this.parseFunction(true);
          else if (value === 'for') this.parseFor(inFunction, inLoop, inSwitch, labelSet);
        }
        else if (c === 0x63) {
          if (value === 'continue') this.parseContinue(inFunction, inLoop, inSwitch, labelSet);
          else if (value === 'case') return false; // case is handled elsewhere
        }
        else if (c === 0x62 && value === 'break') this.parseBreak(inFunction, inLoop, inSwitch, labelSet);
        else if (c === 0x64) {
          if (value === 'default') return false; // default is handled elsewhere
          else if (len === 2 && tok.getLastNum2() === 0x6f) this.parseDo(inFunction, inLoop, inSwitch, labelSet);
          else if (value === 'debugger') this.parseDebugger();
        }
        else if (c === 0x73 && value === 'switch') this.parseSwitch(inFunction, inLoop, inSwitch, labelSet);
        else if (c === 0x77) {
          if (value === 'while') this.parseWhile(inFunction, inLoop, inSwitch, labelSet);
          else if (value === 'with') this.parseWith(inFunction, inLoop, inSwitch, labelSet);
        }
      }

      // this function _must_ parse _something_, if we parsed nothing, it's an expression statement or labeled statement
      if (tok.tokenCountAll === startCount) this.parseExpressionOrLabel(value, inFunction, inLoop, inSwitch, labelSet);

      return true;
    },
    parseStatementHeader: function(){
      var tok = this.tok;
      tok.mustBeNum(0x28, true);
      this.parseExpressions();
      tok.mustBeNum(0x29, true);
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
        if (tok.isNum(0x3d) && tok.lastLen === 1) {
          tok.nextExpr();
          this.parseExpression();
        }
      } while(tok.nextExprIfNum(0x2c));
      this.parseSemi();
    },
    parseVarPartNoIn: function(){
      var state = 0;
      var tok = this.tok;

      do {
        if (this.isReservedIdentifier(false)) throw 'var name is reserved';
        tok.mustBeIdentifier(true);

        if (tok.isNum(0x3d) && tok.lastLen === 1) {
          tok.nextExpr();
          this.parseExpressionNoIn();
        }
      } while(tok.nextExprIfNum(0x2c) && (state = 2));

      return state;
    },
    parseIf: function(inFunction, inLoop, inSwitch, labelSet){
      // if (<exprs>) <stmt>
      // if (<exprs>) <stmt> else <stmt>

      this.tok.nextPunc();
      this.parseStatementHeader();
      this.parseStatement(inFunction, inLoop, inSwitch, labelSet, false);

      this.parseElse(inFunction, inLoop, inSwitch, labelSet);
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
      tok.mustBeNum(0x28, true);
      this.parseExpressions();
      tok.mustBeNum(0x29, false); //no regex following because it's either semi or newline without asi if a forward slash follows it
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

      var state = 0;

      var tok = this.tok;
      tok.nextPunc(); // for
      tok.mustBeNum(0x28, true);

      if (tok.nextExprIfNum(0x3b)) this.parseForEachHeader(); // empty first expression in for-each
      else {

        if (tok.isNum(0x76) && tok.nextPuncIfString('var')) state = this.parseVarPartNoIn();
        // expression_s_ because it might be regular for-loop...
        // (though if it isn't, it can't have more than one expr)
        else state = this.parseExpressionsNoIn();

        if (tok.nextExprIfNum(0x3b)) this.parseForEachHeader();
        else if (tok.getLastNum() !== 0x69 || tok.getLastNum2() !== 0x6e || tok.lastLen !== 2) throw 'Expected `in` or `;` here... '+tok.syntaxError();
        else if (state && this.options.strictForInCheck) throw 'Encountered illegal for-in lhs. '+tok.syntaxError();
        else this.parseForInHeader();
      }

      tok.mustBeNum(0x29, true);
      this.parseStatement(inFunction, true, inSwitch, labelSet, false);
    },
    parseForEachHeader: function(){
      // <expr> ; <expr> ) <stmt>

      this.parseOptionalExpressions();
      this.tok.mustBeNum(0x3b, true);
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

      if (!inLoop) throw 'Can only continue in a loop. '+tok.syntaxError();

      tok.nextPunc(); // token after continue cannot be a regex, either way.

      if (!tok.lastNewline && tok.isType(13)) {
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

      if (tok.lastNewline || !tok.isType(13)) { // no label after break?
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
        tok.nextExpr(); // label (already validated)
      } else {
        throw 'Label ['+label+'] not found in label set. '+tok.syntaxError();
      }
    },
    parseReturn: function(inFunction, inLoop, inSwitch){
      // return ;
      // return <exprs> ;
      // newline right after keyword = asi

      var tok = this.tok;

      if (!inFunction && !this.options.functionMode) throw 'Can only return in a function '+tok.syntaxError('break');

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
      if (tok.lastNewline) {
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
      tok.mustBeNum(0x7b, true);
      this.parseSwitchBody(inFunction, inLoop, true, labelSet);
      tok.mustBeNum(0x7d, true);
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
      var tok = this.tok;
      while (tok.nextPuncIfString('case')) {
        this.parseCase(inFunction, inLoop, inSwitch, labelSet);
      }
    },
    parseCase: function(inFunction, inLoop, inSwitch, labelSet){
      // case <value> : <stmts-no-case-default>
      this.parseExpressions();
      this.tok.mustBeNum(0x3a, true);
      this.parseStatements(inFunction, inLoop, inSwitch, labelSet);
    },
    parseDefault: function(inFunction, inLoop, inSwitch, labelSet){
      // default <value> : <stmts-no-case-default>
      this.tok.mustBeNum(0x3a, true);
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
        tok.mustBeNum(0x28, false);

        // catch var
        if (tok.isType(13)) {
          if (this.isReservedIdentifier(false)) throw 'Catch scope var name is reserved';
          tok.nextPunc();
        } else {
          throw 'Missing catch scope variable';
        }

        tok.mustBeNum(0x29, false);
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
      if (tok.isType(13)) { // name
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
      tok.mustBeNum(0x28, false);
      this.parseParameters(paramCount);
      tok.mustBeNum(0x29, false);
      this.parseCompleteBlock(forFunctionDeclaration, true, false, false, []);
    },
    parseParameters: function(paramCount){
      // [<idntf> [, <idntf>]]
      var tok = this.tok;
      if (tok.isType(13)) {
        if (paramCount === 0) throw 'Getters have no parameters';
        if (this.isReservedIdentifier(false)) throw 'Function param name is reserved';
        tok.nextExpr();
        // there are only two valid next tokens; either a comma or a closing paren
        while (tok.nextExprIfNum(0x2c)) {
          if (paramCount === 1) throw 'Setters have exactly one param';

          // param name
          if (tok.isType(13)) {
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
    // TODO: rename `notForFunctionExpression` to indicate `firstTokenAfterFunctionCanBeRegex / Div` instead, flush through all callers
    parseBlock: function(notForFunctionExpression, inFunction, inLoop, inSwitch, labelSet){
      this.parseStatements(inFunction, inLoop, inSwitch, labelSet);
      // note: this parsing method is also used for functions. the only case where
      // the closing curly can be followed by a division rather than a regex lit
      // is with a function expression. that's why we needed to make it a parameter
      this.tok.mustBeNum(0x7d, notForFunctionExpression);
    },
    parseCompleteBlock: function(notForFunctionExpression, inFunction, inLoop, inSwitch, labelSet){
      this.tok.mustBeNum(0x7b, true);
      this.parseBlock(notForFunctionExpression, inFunction, inLoop, inSwitch, labelSet);
    },
    parseSemi: function(){
      if (this.tok.nextExprIfNum(0x3b)) return 9;
      if (this.parseAsi()) return 15;
      throw 'Unable to parse semi, unable to apply ASI. '+this.tok.syntaxError();
    },
    parseAsi: function(){
      // asi at EOF, if next token is } or if there is a newline between prev and next (black) token
      // asi prevented if asi would be empty statement, no asi in for-header, no asi if next token is regex

      var tok = this.tok;
      if (tok.isNum(0x7d) || (tok.lastNewline && !tok.isType(8)) || tok.isType(14)) {
        return this.addAsi();
      }
      return false;
    },
    addAsi: function(){
      ++this.tok.tokenCountAll;
      return 15;
    },

    parseExpressionStatement: function(){
      this.parseExpressions();
      this.parseSemi();
    },
    parseExpressionOrLabel: function(labelName, inFunction, inLoop, inSwitch, labelSet){
      // this method is only called at the start of
      // a statement that starts with an identifier.

      // ugly but mandatory label check
      // if this is a label, the parsePrimary parser
      // will have bailed when seeing the colon.
      var state = this.parsePrimaryOrLabel(labelName);
      if (state & 8) {

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

      } else {

        this.parseAssignments(state & 1 > 0);
        this.parseNonAssignments();

        if (this.tok.nextExprIfNum(0x2c)) this.parseExpressions();
        this.parseSemi();
      }
    },
    parseOptionalExpressions: function(){
      var tok = this.tok;
      var tokCount = tok.tokenCountAll;
      this.parseExpressionOptional();
      if (tokCount !== tok.tokenCountAll) {
        while (tok.nextExprIfNum(0x2c)) {
          this.parseExpression();
        }
      }
    },
    parseExpressions: function(){
      var nonAssignee = this.parseExpression();
      var tok = this.tok;
      while (tok.nextExprIfNum(0x2c)) {
        this.parseExpression();
        // not sure, but if the expression was not an assignment, it's probably irrelevant
        // except in the case of a group, in which case it becomes an invalid assignee, so:
        nonAssignee = true;
      }
      return nonAssignee;
    },
    parseExpression: function(){
      var tok = this.tok;
      var tokCount = tok.tokenCountAll;

      var nonAssignee = this.parseExpressionOptional();

      // either tokenizer pos moved, or we reached the end (we hadnt reached the end before)
      if (tokCount === tok.tokenCountAll) throw 'Expected to parse an expression, did not find any';

      return nonAssignee;
    },
    parseExpressionOptional: function(){
      var nonAssignee = this.parsePrimary(true);
      // if there was no assignment, state will be the same.
      nonAssignee = this.parseAssignments(nonAssignee) !== 0;

      // any binary operator is illegal as assignee and illegal as for-in lhs
      if (this.parseNonAssignments()) nonAssignee = true;

      return nonAssignee;
    },
    parseAssignments: function(nonAssignee){
      // assignment ops are allowed until the first non-assignment binary op
      var nonForIn = 0;
      var tok = this.tok;
      while (this.isAssignmentOperator()) {
        if (nonAssignee && this.options.strictAssignmentCheck) throw 'LHS is invalid assignee';
        // any assignment means not a for-in per definition
        tok.nextExpr();
        nonAssignee = this.parsePrimary(false);
        nonForIn = 2; // always
      }

      return (nonAssignee ? 1 : 0) | nonForIn;
    },
    parseNonAssignments: function(){
      var parsed = false;
      var tok = this.tok;
      // keep parsing non-assignment binary/ternary ops
      while (true) {
        if (this.isBinaryOperator()) {
          tok.nextExpr();
          this.parsePrimary(false);
        }
        else if (tok.isNum(0x3f)) this.parseTernary();
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
      tok.mustBeNum(0x3a, true);
      this.parseExpression();
    },
    parseTernaryNoIn: function(){
      var tok = this.tok;
      tok.nextExpr();
      this.parseExpression();
      tok.mustBeNum(0x3a, true);
      this.parseExpressionNoIn();
    },
    parseExpressionsNoIn: function(){
      var tok = this.tok;

      var state = this.parseExpressionNoIn();
      while (tok.nextExprIfNum(0x2c)) {
        // lhs of for-in cant be multiple expressions
        state = this.parseExpressionNoIn() | 2;
      }

      return state;
    },
    parseExpressionNoIn: function(){
      var nonAssignee = this.parsePrimary(false);

      var state = this.parseAssignments(nonAssignee);

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
            tok.nextExpr();
            // (seems this should be a required part...)
            this.parsePrimary(false);
            state = NEITHER;
          }
        } else if (tok.isNum(0x3f)) {
          this.parseTernaryNoIn();
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
     * @return {boolean}
     */
    parsePrimary: function(optional){
      // parses parts of an expression without any binary operators
      var nonAssignee = false;
      var parsedUnary = this.parseUnary(); // no unary can be valid in the lhs of an assignment

      var tok = this.tok;
      if (tok.isType(13)) {
        var identifier = tok.getLastValue();
        if (tok.isNum(0x66) && identifier === 'function') {
          this.parseFunction(false);
          nonAssignee = true;
        } else {
          if (this.isReservedIdentifier(true)) throw 'Reserved identifier found in expression';
          tok.nextPunc();
          // any non-keyword identifier can be assigned to
          if (!nonAssignee && this.isValueKeyword(identifier)) nonAssignee = true;
        }
      } else {
        nonAssignee = this.parsePrimaryValue(optional && !parsedUnary);
      }

      var suffixNonAssignee = this.parsePrimarySuffixes();
      if (suffixNonAssignee === 4) nonAssignee = true;
      else if (suffixNonAssignee === 1) nonAssignee = true;
      else if (suffixNonAssignee === 0 && parsedUnary) nonAssignee = true;

      return nonAssignee;
    },
    parsePrimaryOrLabel: function(labelName){
      // note: this function is only executed for statements that start
      //       with an identifier . the function keyword will already
      //       have been filtered out by the main statement start
      //       parsing method. So we dont have to check for the function
      //       keyword here; it cant occur.
      var tok = this.tok;

      var state = 0;

      // if we parse any unary, we wont have to check for label
      var hasPrefix = this.parseUnary();

      // simple shortcut: this function is only called if (at
      // the time of calling) the next token was an identifier.
      // if parseUnary returns true, we wont know what the type
      // of the next token is. otherwise it must still be identifier!
      if (!hasPrefix || tok.isType(13)) {
        // in fact... we dont have to check for any of the statement
        // identifiers (break, return, if) because parseIdentifierStatement
        // will already have ensured a different code path in that case!
        // TOFIX: check how often this is called and whether it's worth investigating...
        if (this.isReservedIdentifier(true)) throw 'Reserved identifier found in expression. '+tok.syntaxError();

        tok.nextPunc();

        // now's the time... you just ticked off an identifier, check the current token for being a colon!
        // (quick check first: if there was a unary operator, this cant be a label)
        if (!hasPrefix) {
          if (tok.nextExprIfNum(0x3a)) return 8;
        }
        if (hasPrefix || this.isValueKeyword(labelName)) state = 1;
      } else {
        if (this.parsePrimaryValue(false) || hasPrefix) state = 1;
      }

      var suffixState = this.parsePrimarySuffixes();
      if (suffixState & 4) state = 0;
      else if (suffixState & 1) state = 1;

      return state;
    },
    parsePrimaryValue: function(optional){
      // at this point in the expression parser we will
      // have ruled out anything else. the next token(s) must
      // be some kind of expression value...

      var nonAssignee = false;
      var tok = this.tok;
      if (tok.nextPuncIfValue()) {
        nonAssignee = true;
      } else {
        if (tok.nextExprIfNum(0x28)) nonAssignee = this.parseGroup();
        else if (tok.nextExprIfNum(0x7b)) this.parseObject();
        else if (tok.nextExprIfNum(0x5b)) this.parseArray();
        else if (!optional) throw 'Unable to parse required primary value';
      }

      return nonAssignee;
    },
    parseUnary: function(){
      var parsed = false;
      var tok = this.tok;
      while (!tok.isType(14) && this.testUnary()) {
        tok.nextExpr();
        parsed = true;
      }
      return parsed; // return bool to determine possibility of label
    },
    testUnary: function(){
      // this method works under the assumption that the current token is
      // part of the set of valid tokens for js. So we don't have to check
      // for string lengths unless we need to disambiguate optional chars

      var tok = this.tok;
      var c = tok.getLastNum();

      if (c === 0x74) return tok.getLastValue() === 'typeof';
      else if (c === 0x6e) return tok.getLastValue() === 'new';
      else if (c === 0x64) return tok.getLastValue() === 'delete';
      else if (c === 0x21) return true;
      else if (c === 0x76) return tok.getLastValue() === 'void';
      else if (c === 0x2d) return (tok.lastLen === 1 || (tok.getLastNum2() === 0x2d));
      else if (c === 0x2b) return (tok.lastLen === 1 || (tok.getLastNum2() === 0x2b));
      else if (c === 0x7e) return true;

      return false;
    },
    parsePrimarySuffixes: function(){
      // --
      // ++
      // .<idntf>
      // [<exprs>]
      // (<exprs>)

      var nonAssignee = 0;

      // TODO: the order of these checks doesn't appear to be optimal (numbers first?)
      var tok = this.tok;
      var repeat = true;
      while (repeat) {
        var c = tok.getLastNum();
        // need tokenizer to check for a punctuator because it could never be a regex (foo.bar, we're at the dot between)
        if (c === 0x2e) {
          if (!tok.isType(9)) throw 'Number (?) after identifier?';
          tok.next(false);
          tok.mustBeIdentifier(false); // cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          nonAssignee = 4; // property name can be assigned to (for-in lhs)
        } else if (c === 0x28) {
          tok.nextExpr();
          this.parseOptionalExpressions();
          tok.mustBeNum(0x29, false); // ) cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          nonAssignee = 1; // call cannot be assigned to (for-in lhs) (ok, there's an IE case, but let's ignore that...)
        } else if (c === 0x5b) {
          tok.nextExpr();
          this.parseExpressions(); // required
          tok.mustBeNum(0x5d, false); // ] cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          nonAssignee = 4; // dynamic property can be assigned to (for-in lhs), expressions for-in state are ignored
        } else if (c === 0x2b && tok.getLastNum2() === 0x2b) {
          tok.nextPunc();
          // postfix unary operator lhs cannot have trailing property/call because it must be a LeftHandSideExpression
          nonAssignee = 1; // cannot assign to foo++
          repeat = false;
        } else if (c === 0x2d &&  tok.getLastNum2() === 0x2d) {
          tok.nextPunc();
          // postfix unary operator lhs cannot have trailing property/call because it must be a LeftHandSideExpression
          nonAssignee = 1; // cannot assign to foo--
          repeat = false;
        } else {
          repeat = false;
        }
      }
      return nonAssignee;
    },
    isAssignmentOperator: function(){
      // includes any "compound" operators

      // this method works under the assumption that the current token is
      // part of the set of valid tokens for js. So we don't have to check
      // for string lengths unless we need to disambiguate optional chars

      var tok = this.tok;
      var len = tok.lastLen;

      if (len === 1) return tok.getLastNum() === 0x3d;

      else if (len === 2) {
        if (tok.getLastNum2() !== 0x3d) return false;
        var c = tok.getLastNum();
        return (
          c === 0x2b ||
          c === 0x2d ||
          c === 0x2a ||
          c === 0x7c ||
          c === 0x26 ||
          c === 0x25 ||
          c === 0x5e ||
          c === 0x2f
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
      if (c === 0x29 || c === 0x3b || c === 0x2c) return false;

      // quite frequent (more than any other single if below it) are } (8%)
      // and ] (7%). Maybe I'll remove this in the future. The overhead may
      // not be worth the gains. Hard to tell... :)
      else if (c === 0x5d || c === 0x7d) return false;

      // if len is more than 1, it's either a compound assignment (+=) or a unary op (++)
      else if (c === 0x2b) return (tok.lastLen === 1);

      // === !==
      else if (c === 0x3d || c === 0x21) return (tok.getLastNum2() === 0x3d && (tok.lastLen === 2 || tok.getLastNum3() === 0x3d));

      // & &&
      else if (c === 0x26) return (tok.lastLen === 1 || tok.getLastNum2() === 0x26);

      // | ||
      else if (c === 0x7c) return (tok.lastLen === 1 || tok.getLastNum2() === 0x7c);

      else if (c === 0x3c) {
        if (tok.lastLen === 1) return true;
        var d = tok.getLastNum2();
        // the len check prevents <<= (which is an assignment)
        return ((d === 0x3c && tok.lastLen === 2) || d === 0x3d); // << <=
      }

      // if len is more than 1, it's a compound assignment (*=)
      else if (c === 0x2a) return (tok.lastLen === 1);

      else if (c === 0x3e) {
        var len = tok.lastLen;
        if (len === 1) return true;
        var d = tok.getLastNum2();
        // the len checks prevent >>= and >>>= (which are assignments)
        return (d === 0x3d || (len === 2 && d === 0x3e) || (len === 3 && tok.getLastNum3() === 0x3e)); // >= >> >>>
      }

      // if len is more than 1, it's a compound assignment (%=, ^=, /=, -=)
      else if (c === 0x25 || c === 0x5e || c === 0x2f || c === 0x2d) return (tok.lastLen === 1);

      // if not punctuator, it could still be `in` or `instanceof`...
      else if (c === 0x69) return ((tok.lastLen === 2 && tok.getLastNum2() === 0x6e) || (tok.lastLen === 10 && tok.getLastValue() === 'instanceof'));

      // not a (non-assignment) binary operator
      return false;
    },

    parseGroup: function(){
      // the expressions are required. nonassignable if:
      // - wraps multiple expressions
      // - if the single expression is nonassignable
      // - if it wraps an assignment
      var nonAssignee = this.parseExpressions();
      // groups cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      this.tok.mustBeNum(0x29, false);

      return nonAssignee;
    },
    parseArray: function(){
      var tok = this.tok;
      do {
        this.parseExpressionOptional(); // just one because they are all optional (and arent in expressions)
      } while (tok.nextExprIfNum(0x2c)); // elision

      // array lits cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      tok.mustBeNum(0x5d, false);
    },
    parseObject: function(){
      var tok = this.tok;
      do {
        // object literal keys can be most values, but not regex literal.
        // since that's an error, it's unlikely you'll ever see that triggered.
        if (tok.isValue() && !tok.isType(8)) this.parsePair();
      } while (tok.nextExprIfNum(0x2c)); // elision

      // obj lits cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      tok.mustBeNum(0x7d, false);
    },
    parsePair: function(){
      var tok = this.tok;
      if (tok.isNum(0x67) && tok.nextPuncIfString('get')) {
        if (tok.isType(13)) {
          if (this.isReservedIdentifier(false)) throw 'Getter name is reserved';
          tok.nextPunc();

          this.parseFunctionRemainder(0, true);
        }
        else this.parseDataPart();
      } else if (tok.isNum(0x73) && tok.nextPuncIfString('set')) {
        if (tok.isType(13)) {
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
      this.tok.mustBeNum(0x3a, true);
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

  // workaround for https://code.google.com/p/v8/issues/detail?id=2246
  var o = {};
  for (var k in proto) o[k] = proto[k];
  Par.prototype = o;

})(typeof exports === 'object' ? exports : window);


//######### end of par.js #########

})(typeof exports === "undefined" ? window : exports);
