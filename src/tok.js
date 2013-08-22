(function(exports){
  var uniRegex = exports.uni || require(__dirname+'/uni.js').uni;

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
      return this.lastType === STRING || this.lastType === NUMBER || this.lastType === IDENTIFIER || this.lastType === REGEX || false;
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

      var pos = this.pos;
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
      this.lastValue = '';

      // prepare charCodeAt cache...
      if (this.lastLen === 1) this.nextNum1 = this.nextNum2;
      else this.nextNum1 = -1;
      this.nextNum2 = -1;

      ++this.tokenCountAll;

      if (this.pos >= this.len) {
        if (this.lastType === EOF) throw 'Tried to parse beyond EOF, that cannot be good.';
        var result = EOF;
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
      if (this.whitespace(c)) result = WHITE;
      else if (this.lineTerminator(c, pos)) result = WHITE;
      else if (this.asciiIdentifier(c)) result = IDENTIFIER;
      // forward slash before generic punctuators!
      else if (c === 0x2f) { // / (forward slash)
        var n = this.getLastNum2(); // this.pos === this.lastStart+1
        if (n === 0x2f) result = this.commentSingle(pos, input); // 0x002f=/
        else if (n === 0x2a) result = this.commentMulti(pos, input); // 0x002f=*
        else if (expressionStart) result = this.regex();
        else result = this.punctuatorDiv(c,n);
      }
      else if (this.punctuator(c)) result = PUNCTUATOR;
      else if (c === 0x27) result = this.stringSingle();
      else if (c === 0x22) result = this.stringDouble();
      else if (this.number(c,pos,input)) result = NUMBER; // number after punctuator, check algorithm if that changes!
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
      return PUNCTUATOR;
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

      return WHITE;
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

      return WHITE;
    },
    stringSingle: function(){
      var pos = this.pos + 1;
      var input = this.input;
      var len = input.length;

      while (pos < len) {
        var c = input.charCodeAt(pos++);
        if (c === 0x0027) { // ' (single quote)
            this.pos = pos;
            return STRING;
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
          return STRING;
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

      return NUMBER;
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

      return NUMBER;
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

      return REGEX;
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
