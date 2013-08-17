(function(exports){
;
//######### tok.js #########

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
  var WHITE = 18; // WHITE_SPACE, LINETERMINATOR COMMENT_SINGLE COMMENT_MULTI

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
    this.nextNum3 = -1;

    this.tokenCount = 0;
    this.tokens = [];
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

  Tok.prototype = {
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
     * @property {boolean} [options.regexNoClassEscape] Don't interpret backslash in regex class as escape
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
    nextNum3: -1,

    /** @property {number} tokenCount Simple counter, includes whitespace, excludes EOF */
    tokenCount: 0,
    /** @property {number tokenCountAll Add one for any token, including EOF (Par relies on this) */
    tokenCountAll: 0,
    /** @property {Object} tokens List of (all) tokens, if saving them is enabled */
    tokens: null,

    // some of these regular expressions are so complex that i had to
    // write scripts to construct them. the only way to keep my sanity

    /** @property {RegExp} rexNewlines Replace windows' CRLF with a single LF, as well as the weird newlines. this fixes positional stuff. */
    rexNewlines: /[\u000A\u000d\u2028\u2029]/g, // used by comment parsers if in regex mode
    /** @property {RegExp} rexNewlineSearchInMultilineComment After having found the * / (indexOf), apply this to quickly test for a newline in the comment */
    rexNewlineSearchInMultilineComment:/[\u000A\u000D\u2028\u2029]|\*\//g, // used by m-comment parser if in regex mode

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

      if (pos >= this.len) {
        if (this.lastType === EOF) throw 'Tried to parse beyond EOF, that cannot be good.';
        this.lastType = EOF;
        this.lastStart = this.lastStop = this.lastLen = pos;
        ++this.tokenCountAll;
        return EOF;
      }

      do {
        var type = this.nextWhiteToken(expressionStart);
  //      this.tokens.push({type:type, value:this.getLastValue(), start:this.lastStart, stop:this.pos});

  //      console.log('token:', type, Tok[type], '`'+this.input.substring(this.lastStart, this.pos).replace(/\n/g,'\u23CE')+'`', 'start:',this.lastStart, 'len:',this.lastStop-this.lastStart);
      } while (type === WHITE);

      this.lastType = type;
      return type;
    },
    nextWhiteToken: function(expressionStart){
      this.lastValue = '';
      var lastLen = this.lastLen;
      var start = this.lastStart = this.pos;
      if (this.pos >= this.len) return EOF;

      // prepare charCodeAt cache...
      if (lastLen === 1) {
        this.nextNum1 = this.nextNum2;
        this.nextNum2 = this.nextNum3;
      } else if (lastLen === 2) {
        this.nextNum1 = this.nextNum3;
        this.nextNum2 = -1;
      } else if (lastLen === 3) {
        this.nextNum1 = -1;
        this.nextNum2 = -1;
      } else {
        this.nextNum1 = -1;
        this.nextNum2 = -1;
      }
      this.nextNum3 = -1;

      ++this.tokenCount;
      ++this.tokenCountAll;

      var result = this.nextToken(expressionStart);

      var stop = this.lastStop = this.pos;
      this.lastLen = stop - start;

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

      //  (             )             ;             ,             {             }             :             [             ]             ?             ~
      if (c === 0x28 || c === 0x29 || c === 0x3b || c === 0x2c || c === 0x7b || c === 0x7d || c === 0x3a || c === 0x5b || c === 0x5d || c === 0x3f || c === 0x7e) len = 1;
      else {
        var d = this.getLastNum2();

        if (c === 0x2e) { // .
          // must check for a number because number parser comes after this
          if (d < 0x0030 || d > 0x0039) len = 1;
        }
        else if (c === 0x3d) { // =
          if (d === 0x3d) {
            var e = this.getLastNum3();
            if (e === 0x3d) len = 3;
            else  len = 2;
          }
          else len = 1;
        }
        else if (c === 0x2b) { // +
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
      if (c === 0x0020 || c === 0x0009 || c === 0x000B || c === 0x000C || c === 0x00A0 || c === 0xFFFF) {
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

  //    var rex = this.rexNewlines;
  //    rex.lastIndex = this.pos;
  //    rex.test(this.input);
  //
  //    // if not found, lastIndex will be 0. in this case, that means "eof".
  //    var pos = rex.lastIndex;
  //    if (pos === 0) this.pos = this.len;
  //    else this.pos = pos - 1;

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

      /*
      var end = this.input.indexOf('*\/',this.pos+2)+2;
      if (end == 1) throw new Error('Unable to find end of multiline comment started on pos '+this.pos);

      // search for newline (important for ASI)
      var nls = this.rexNewlineSearchInMultilineComment;
      nls.lastIndex = this.pos+2;
      // not dead code. we're checking the nls regex for its lastIndex property
      // if it matches end, there was no newline (it will match * /), if it didnt
      // match end, it will match a newline earlier
      nls.test(this.input);
      if (nls.lastIndex !== end) this.lastNewline = true;
      this.pos = end;
      */

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
      var n = this.nextNum3;
      if (n === -1) return this.nextNum3 = this.input.charCodeAt(this.lastStart+2);
      return n;
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

})(typeof exports === 'object' ? exports : window);


//######### end of tok.js #########


;
//######### par.js #########

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
  var ISLABEL = 8;

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
     * @property {boolean} [options.functionMode=false] In function mode, `return` is allowed in global space
//     * @property {boolean} [options.scriptMode=false] (TODO, #12)
     * @property {boolean} [options.regexNoClassEscape=false] Don't interpret backslash in regex class as escape
     * @property {boolean} [options.strictForInCheck=false] Reject the lhs for a `for` if it's technically bad (not superseded by strict assignment option)
     * @property {boolean} [options.strictAssignmentCheck=false] Reject the lhs for assignments if it can't be correct at runtime (does not supersede for-in option)
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
        else if (tok.getLastNum() !== 0x69 || tok.getLastNum2() !== 0x6e || tok.lastLen !== 2) throw 'Expected `in` or `;` here... '+tok.syntaxError();
        else if (state && this.options.strictForInCheck) throw 'Encountered illegal for-in lhs. '+tok.syntaxError();
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
      tok.nextExpr(); // `in` validated by `parseFor`
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
      if (this.parseExpressionForLabel(inFunction, inLoop, inSwitch, labelSet)) {
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
      var state = this.parsePrimaryOrLabel(labelName);
      if (state & ISLABEL) {

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
        return false;
      }

      this.parseAssignments(state & NONASSIGNEE > 0);
      this.parseNonAssignments();

      // tofix: make constant for boolean
      return true;
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
      var nonAssignee = this.parseExpression();
      while (this.tok.nextExprIfNum(0x2c)) { // ,
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
      var nonAssignee = this.parsePrimary(false);
      // if there was no assignment, state will be the same.
      nonAssignee = this.parseAssignments(nonAssignee);

      // any binary operator is illegal as assignee and illegal as for-in lhs
      if (this.parseNonAssignments()) nonAssignee = true;

      return nonAssignee;
    },
    parseAssignments: function(nonAssignee){
      // assignment ops are allowed until the first non-assignment binary op
      var nonForIn = NOPARSE;
      while (this.isAssignmentOperator()) {
        if (nonAssignee && this.options.strictAssignmentCheck) throw 'LHS is invalid assignee';
        // any assignment means not a for-in per definition
        this.tok.nextExpr();
        nonAssignee = this.parsePrimary(true);
        nonForIn = NONFORIN; // always
      }

      return (nonAssignee ? NONASSIGNEE : NOPARSE) | nonForIn;
    },
    parseNonAssignments: function(){
      var parsed = false;
      // keep parsing non-assignment binary/ternary ops
      while (true) {
        if (this.isBinaryOperator()) {
          this.tok.nextExpr();
          this.parsePrimary(true);
        }
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
            this.tok.nextExpr();
            this.parsePrimary(true);
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
     * @return {boolean}
     */
    parsePrimary: function(optional){
      // parses parts of an expression without any binary operators
      var nonAssignee = false;
      var parsedUnary = this.parseUnary(); // no unary can be valid in the lhs of an assignment

      var tok = this.tok;
      if (tok.isType(IDENTIFIER)) {
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
        nonAssignee = this.parsePrimaryValue(optional);
      }

      var suffixNonAssignable = this.parsePrimarySuffixes();
      if (suffixNonAssignable === ASSIGNEE) nonAssignee = true;
      else if (suffixNonAssignable === NONASSIGNEE) nonAssignee = true;
      else if (suffixNonAssignable === NOPARSE && parsedUnary) nonAssignee = true;

      return nonAssignee;
    },
    parsePrimaryOrLabel: function(labelName){
      // note: this function is only executed for statements that start
      //       with an identifier . the function keyword will already
      //       have been filtered out by the main statement start
      //       parsing method. So we dont have to check for the function
      //       keyword here; it cant occur.
      var tok = this.tok;

      var state = NOPARSE;

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
            return ISLABEL;
          }
        }
        if (hasPrefix || this.isValueKeyword(labelName)) state = NONASSIGNEE;
      } else {
        // TODO: make constants?
        if (this.parsePrimaryValue(true) || hasPrefix) state = NONASSIGNEE;
      }

      var suffixState = this.parsePrimarySuffixes();
      if (suffixState & ASSIGNEE) state = NOPARSE;
      else if (suffixState & NONASSIGNEE) state = NONASSIGNEE;

      return state;
    },
    parsePrimaryValue: function(required){
      // at this point in the expression parser we will
      // have ruled out anything else. the next token(s) must
      // be some kind of expression value...

      var nonAssignee = false;
      var tok = this.tok;
      if (tok.nextPuncIfValue()) {
        nonAssignee = true;
      } else {
        if (tok.nextExprIfNum(0x28)) nonAssignee = this.parseGroup(); // (
        else if (tok.nextExprIfNum(0x7b)) this.parseObject(); // {
        else if (tok.nextExprIfNum(0x5b)) this.parseArray(); // [
        else if (required) throw 'Unable to parse required primary value';
      }

      return nonAssignee;
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
          // postfix unary operator lhs cannot have trailing property/call because it must be a LeftHandSideExpression
          nonAssignee = NONASSIGNEE; // cannot assign to foo++
          repeat = false;
        } else if (tok.isNum(0x2d) && tok.nextPuncIfString('--')) {
          // postfix unary operator lhs cannot have trailing property/call because it must be a LeftHandSideExpression
          nonAssignee = NONASSIGNEE; // cannot assign to foo--
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
      var nonAssignee = this.parseExpressions(); // required. nonassignable if multiple, or if the single expression is nonassignable
      this.tok.mustBeNum(0x29, false); // 29=)  cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      return nonAssignee;
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


//######### end of par.js #########

})(this);
