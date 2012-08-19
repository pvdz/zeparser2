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
var VALUE = 17; // STRING NUMBER REGEX IDENTIFIER
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
var Tok = function(input){
  this.tokens = [];

  this.input = (input||'');
  this.len = this.input.length;

  // v8 "appreciates" to be set all instance properties explicitly
  this.pos = 0;

  this.lastStart = 0;
  this.lastStop = 0;
  this.lastType = -1;
  this.lastValue = null;
  this.lastNum = -1; // -1 means uninitialized (since charCodeAt can never return this, it's safe to go for -1)
  this.lastNextNum = -1;
  this.lastNewline = -1;

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
Tok[VALUE] = 'value';
Tok[WHITE] = 'white';

Tok.prototype = {
  /** @property {string} input */
  input: null,
  /** @property {number} len */
  len: 0,
  /** @property {number} pos */
  pos: 0,

  // parser can look at these positions to see where in the input the last token was
  // this way the tokenizer can simply return number-constants-as-types.
  /** @property {number} lastStart Start pos of the last token */
  lastStart: 0,
  /** @property {number} lastStop End pos of the last token */
  lastStop: 0,
  /** @property {number} lastType Type of the last token */
  lastType: null,
  /** @property {string|null} lastValue String value of the last token, or null if not yet fetched (see this.getLastValue()) */
  lastValue: null,
  /** @property {number} lastNum Cached value of this.input.charCodeAt(this.lastStart), or -1 if not yet fetched */
  lastNum: -1,
  /** @property {number} lastNextNum When the previous parsing already had to query the ord of the first character for the next token, it will store that here */
  lastNextNum: -1,
  /** @property {boolean} lastNewline Was the current token preceeded by a newline? For determining ASI. */
  lastNewline: false,

  /** @property {number} tokenCount Simple counter, includes whitespace */
  tokenCount: 0,
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
    return this.lastType === STRING || this.lastType === NUMBER || this.lastType === REGEX || this.lastType === IDENTIFIER;
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
   * token is(value). Next token is parsed
   * possibly expecting a regex (so not a
   * division).
   *
   * @param {number|string} value
   * @return {boolean}
   */
  nextPuncIfNum: function(num){
    var equals = this.isNum(num);
    if (equals) this.nextPunc();
    return equals;
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
   * @param {number} type
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
   * Parser requires the current token to be of
   * a certain type. Parse the next token if that's
   * the case. Throw a syntax error otherwise.
   *
   * @param {number} type
   * @param {boolean} nextIsExpr=false
   */
  mustBeType: function(type, nextIsExpr){
    if (this.isType(type)) {
      this.next(nextIsExpr);
    } else {
      throw this.syntaxError(type);
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
      this.lastType = EOF;
      this.lastStart = this.lastStop = pos;
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
    this.lastValue = null;
    this.lastNum = -1;
    this.lastStart = this.pos;
    if (this.pos >= this.len) return EOF;

    // if the previous token parsing already discovered the
    // ord of the first character for this token, it will
    // have saved that in this.lastNextNum, so let's copy
    // that to lastNum now.
    var lastNextNum = this.lastNextNum;
    if (lastNextNum !== -1) {
      this.lastNum = lastNextNum;
      this.lastNextNum = -1;
    }

    ++this.tokenCount;

    var result = this.nextToken(expressionStart);

    this.lastStop = this.pos;

    return result;
  },

  nextToken: function(expressionStart){
    var pos = this.pos;
    var input = this.input;
    var c = input.charCodeAt(pos);

    var result = -1;

    // https://twitter.com/ariyahidayat/status/225447566815395840
    // Punctuator, Identifier, Keyword, String, Numeric, Boolean, Null, RegularExpression
    // so:
    // Whitespace, RegularExpression, Punctuator, Identifier, LineTerminator, String, Numeric
    if (this.whitespace(c)) result = WHITE;
    else if (this.lineTerminator(c, pos, input)) result = WHITE;
    // forward slash before generic punctuators!
    else if (c === 0x2f) { // / (forward slash)
      var n = input.charCodeAt(pos+1);
      if (n === 0x2f) result = this.commentSingle(pos, input); // 0x002f=/
      else if (n === 0x2a) result = this.commentMulti(pos, input); // 0x002f=*
      else if (expressionStart) result = this.regex();
      else result = this.punctuatorDiv(c,n);
    }
    else if (this.punctuator(c)) result = PUNCTUATOR;
    else if (this.asciiIdentifier(c)) result = IDENTIFIER; // if ((c >= 0x61 && c <= 0x7a) || (c >= 0x41 && c <= 0x5a) || c === 0x24 || c === 0x5f) return ;
    else if (c === 0x27) result = this.stringSingle();
    else if (c === 0x22) result = this.stringDouble();
    else if (this.number(c,pos,input)) result = NUMBER; // number after punctuator, check algorithm if that changes!
    else throw 'dont know what to parse now. '+this.syntaxError();

    return result;
  },

  punctuator: function(c){
    var input = this.input;
    var pos = this.pos;
    var len = 0;

//    >>>=,
//    === !== >>> <<= >>=
//    <= >= == != ++ -- << >> && || += -= *= %= &= |= ^= /=
//    { } ( ) [ ] . ; ,< > + - * % | & ^ ! ~ ? : = /

    //  (             )             {             }             [             ]             ;             ,             ?             :
    if (c === 0x28 || c === 0x29 || c === 0x7b || c === 0x7d || c === 0x5b || c === 0x5d || c === 0x3b || c === 0x2c || c === 0x3f || c === 0x3a) len = 1;
    else {
      var d = input.charCodeAt(pos+1);

      if (c === 0x2e) {
        // must check for a number because number parser comes after this
        if (d < 0x0030 || d > 0x0039) len = 1;
      }
      else if (c === 0x3d) {
        if (d === 0x3d) {
          if (input.charCodeAt(pos+2) === 0x3d) len = 3;
          else len = 2;
        }
        else len = 1;
      }

      else if (c === 0x3c) {
        if (d === 0x3d) len = 2;
        else if (d === 0x3c) {
          if (input.charCodeAt(pos+2) === 0x3d) len = 3;
          else len = 2;
        }
        else len = 1;
      }
      else if (c === 0x3e) {
        if (d === 0x3d) len = 2;
        else if (d === 0x3e) {
          var e = input.charCodeAt(pos+2);
          if (e === 0x3d) len = 3;
          else if (e === 0x3e) {
            if (input.charCodeAt(pos+3) === 0x3d) len = 4;
            else len = 3;
          }
          else len = 2;
        }
        else len = 1;
      }

      else if (c === 0x2b) {
        if (d === 0x3d || d === 0x2b) len = 2;
        else len = 1;
      }
      else if (c === 0x2d) {
        if (d === 0x3d || d === 0x2d) len = 2;
        else len = 1;
      }
      else if (c === 0x2a) {
        if (d === 0x3d) len = 2;
        else len = 1;
      }
      else if (c === 0x25) {
        if (d === 0x3d) len = 2;
        else len = 1;
      }
      else if (c === 0x7c) {
        if (d === 0x3d || d === 0x7c) len = 2;
        else len = 1;
      }
      else if (c === 0x26) {
        if (d === 0x3d || d === 0x26) len = 2;
        else len = 1;
      }
      else if (c === 0x5e) {
        if (d === 0x3d) len = 2;
        else len = 1;
      }
      else if (c === 0x21) {
        if (d === 0x3d) {
          if (input.charCodeAt(pos+2) === 0x3d) len = 3;
          else len = 2;
        }
        else len = 1;
      }
      else if (c === 0x7e) {
        if (d === 0x3d) len = 2;
        else len = 1;
      }
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
    else {
      ++this.pos;
      this.lastNextNum = d;
    }
    return PUNCTUATOR;
  },
  punctuatorTok: function(c){
    var input = this.input;
    var pos = this.pos;

//    >>>=,
//    === !== >>> <<= >>=
//    <= >= == != ++ -- << >> && || += -= *= %= &= |= ^= /=
//    { } ( ) [ ] . ; ,< > + - * % | & ^ ! ~ ? : = /

    if (c === 0x28) return this.puncToken(1, '(');
    else if (c === 0x29) return this.puncToken(1, ')');
    else if (c === 0x7b) return this.puncToken(1, '{');
    else if (c === 0x7d) return this.puncToken(1, '}');
    else if (c === 0x5b) return this.puncToken(1, '[');
    else if (c === 0x5d) return this.puncToken(1, ']');
    else if (c === 0x3b) return this.puncToken(1, ';');
    else if (c === 0x2c) return this.puncToken(1, ',');
    else if (c === 0x3f) return this.puncToken(1, '?');
    else if (c === 0x3a) return this.puncToken(1, ':');
    else {
      var d = input.charCodeAt(pos+1);

      if (c === 0x2e) {
        if (d >= 0x0030 && d <= 0x0039) return false;
        return this.puncToken(1, '.');
      }
      else if (c === 0x3d) {
        if (d === 0x3d) {
          if (input.charCodeAt(pos+2) === 0x3d) return this.puncToken(3, '===');
          return this.puncToken(2, '==');
        }
        return this.puncToken(1, '=');
      }

      else if (c === 0x3c) {
        if (d === 0x3d) return this.puncToken(2, '<=');
        if (d === 0x3c) {
          if (input.charCodeAt(pos+2) === 0x3d) return this.puncToken(3, '<<=');
          return this.puncToken(2, '<<');
        }
        return this.puncToken(1, '<');
      }
      else if (c === 0x3e) {
        if (d === 0x3d) return this.puncToken(2, '>=');
        if (d === 0x3e) {
          var e = input.charCodeAt(pos+2);
          if (e === 0x3d) return this.puncToken(3, '>>=');
          if (e === 0x3e) {
            if (input.charCodeAt(pos+3) === 0x3d) return this.puncToken(4, '>>>=');
            return this.puncToken(3, '>>>');
          }
          return this.puncToken(2, '>>');
        }
        return this.puncToken(1, '>');
      }

      else if (c === 0x2b) {
        if (d === 0x3d) return this.puncToken(2, '+=');
        if (d === 0x2b) return this.puncToken(2, '++');
        return this.puncToken(1, '+');
      }
      else if (c === 0x2d) {
        if (d === 0x3d) return this.puncToken(2, '-=');
        if (d === 0x2d) return this.puncToken(2, '--');
        return this.puncToken(1, '-');
      }
      else if (c === 0x2a) {
        if (d === 0x3d) return this.puncToken(2, '*=');
        return this.puncToken(1, '*');
      }
      else if (c === 0x25) {
        if (d === 0x3d) return this.puncToken(2, '%=');
        return this.puncToken(1, '%');
      }
      else if (c === 0x7c) {
        if (d === 0x3d) return this.puncToken(2, '+=');
        if (d === 0x7c) return this.puncToken(2, '+=');
        return this.puncToken(1, '|');
      }
      else if (c === 0x26) {
        if (d === 0x3d) return this.puncToken(2, '&=');
        if (d === 0x26) return this.puncToken(2, '&&');
        return this.puncToken(1, '&');
      }
      else if (c === 0x5e) {
        if (d === 0x3d) return this.puncToken(2, '^=');
        return this.puncToken(1, '^');
      }
      else if (c === 0x21) {
        if (d === 0x3d) {
          if (input.charCodeAt(pos+2) === 0x3d) return this.puncToken(3, '!==');
          return this.puncToken(2, '!=');
        }
        return this.puncToken(1, '~');
      }
      else if (c === 0x7e) {
        if (d === 0x3d) return this.puncToken(2, '~=');
        return this.puncToken(1, '~');
      }
      else if (c === 0x2f) {
        // cant really be a //, /* or regex because they should have been checked before calling this function
        if (d === 0x3d) return this.puncToken(2, '/=');
        return this.puncToken(1, '/');
      }
    }

    return false;
  },
  puncToken: function(len, value){
    this.pos += len;
    return PUNCTUATOR;
//    return value;
  },

  whitespace: function(c){
    if (c === 0x0009 || c === 0x000B || c === 0x000C || c === 0x0020 || c === 0x00A0 || c === 0xFFFF) {
      ++this.pos;
      return true;
    }
    return false;
  },
  lineTerminator: function(c, pos, input){
    if (c === 0x000A || c === 0x2028 || c === 0x2029) {
      this.lastNewline = true;
      this.pos = pos + 1;
      return WHITE;
    } else if (c === 0x000D){
      this.lastNewline = true;
      // handle \r\n normalization here
      var d = input.charCodeAt(pos+1);
      if (d === 0x000A) {
        this.pos = pos+2;
      } else {
        this.lastNextNum = d;
        this.pos = pos + 1;
      }
      return WHITE;
    }
    return false;
  },
  commentSingle: function(pos, input){
    var len = input.length;
    ++pos;
    while (pos < len) {
      var c = input.charCodeAt(++pos);
      if (c === 0x000A || c === 0x000D || c === 0x2028 || c === 0x2029) break;
    }
    // cache the newline (or eof, whatever)
    this.lastNextNum = c;
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
    var c,d = input.charCodeAt(pos+=2);
    while (pos < len) {
      c = d;
      d = input.charCodeAt(++pos);

      if (c === 0x2a && d === 0x2f) break;

      // only check one newline
      // TODO: check whether the extra check is worth the overhead for eliminating repetitive checks
      // (hint: if you generally check more characters here than you can skip, it's not worth it)
      if (hasNewline || c === 0x000A || c === 0x000D || c === 0x2028 || c === 0x2029) hasNewline = this.lastNewline = true;
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
    // hex escapes
    } else if (c === 0x0078) {
      if (this.hexicode(input.charCodeAt(pos+1)) && this.hexicode(input.charCodeAt(pos+2))) pos += 2;
      else throw 'Invalid hex escape';
    // skip windows newlines as if they're one char
    } else if (c === 0x000D) {
      if (input.charCodeAt(pos+1) === 0x000A) ++pos;
    }
    return pos+1;
  },
  unicode: function(pos){
    var input = this.input;

    return this.hexicode(input.charCodeAt(pos)) && this.hexicode(input.charCodeAt(pos+1)) && this.hexicode(input.charCodeAt(pos+2)) && this.hexicode(input.charCodeAt(pos+3));
  },
  hexicode: function(c){
    // 0-9, a-f, A-F
    return ((c >= 0x30 && c <= 0x39) || (c >= 0x61 && c <= 0x66) || (c >= 0x41 && c <= 0x46));
  },

  number: function(c, pos, input){
    // leading zero can mean decimal or hex literal
    if (c === 0x0030) this.decOrHex(c, pos, input);
    // 1-9 just means decimal literal
    else if (c >= 0x0031 && c <= 0x0039) this.decimalNumber(input.charCodeAt(pos+1), pos+1, input); // do this after punctuator... the -1 is kind of a hack in that
    // dot means decimal, without the leading digits
    else if (c === 0x2e) this.decimalFromDot(c, pos, input); // dot, start of the number
    // yeah, no number. move on.
    else return false;
    // we parsed a number.
    return true;
  },
  decOrHex: function(c, pos, input){
    // numeric is either a decimal or hex
    // 0.1234  .123  .0  0.  0e12 0e-12 0e12+ 0.e12 0.1e23 0xdeadbeeb

    var d = input.charCodeAt(pos+1);
    if (d === 0x0058 || d === 0x0078) { // x or X
      this.hexNumber(pos+2);
    } else {
      // next can only be numbers or dots...
      this.decimalNumber(d, pos+1, input);
    }

    return NUMBER;
  },
  decimalNumber: function(c, pos, input){
    // leading digits. assume c is preceeded by at least one digit (that might have been zero..., tofix in the future)
    while (c >= 0x30 & c <= 0x39) c = input.charCodeAt(++pos);
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

    // c will be the first character of the next token. store it
    // to save us a duplicate call to charCodeAt
    this.lastNextNum = c;

    this.pos = pos;

    return NUMBER;
  },
  decimalSub: function(c, pos, input){
    while (c >= 0x30 & c <= 0x39) c = input.charCodeAt(++pos);
    return pos;
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
        var d = input.charCodeAt(pos++);
        if (d === 0x000D || d === 0x000A || d === 0x2028 || d === 0x2029) {
          throw new Error('Newline can not be escaped in regular expression at '+pos);
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

//    this.asciiIdentifier();
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
    if ((c >= 0x61 && c <= 0x7a) || (c >= 0x41 && c <= 0x5a) || c === 0x24 || c === 0x5f) {
      return 1;
      // \uxxxx
    } else if (c === 0x5c) {
      var pos = this.pos;
      if (this.input.charCodeAt(pos+1) === 0x75 && this.unicode(pos+2)) {
        return 6;
      } else {
        throw 'No backslash in identifier (xept for \\u). '+this.syntaxError();
      }
    } else {
      // tofix: non-ascii identifiers
      // do nothing so we return 0
      return 0;
    }
  },
  asciiIdentifierRest: function(toAdd){
    var input = this.input;
    var len = input.length;
    var pos = this.pos + toAdd;

    // also used by regex flag parser
    while (pos < len) {
      var c = input.charCodeAt(pos);

      // a-z A-Z 0-9 $ _
      if ((c >= 0x61 && c <= 0x7a) || (c >= 0x41 && c <= 0x5a) || (c >= 0x30 && c <= 0x39) || c === 0x24 || c === 0x5f) {
        ++pos;
        // \uxxxx
      } else if (c === 0x5c && input.charCodeAt(pos+1) === 0x75 && this.unicode(pos+2)) {
        pos += 6;
      } else {
        this.lastNextNum = c;
        // tofix: non-ascii identifiers
        break;
      }
    }

    return pos;
  },

  getLastValue: function(){
    return this.lastValue || (this.lastValue = this.input.substring(this.lastStart, this.lastStop));
  },
  getLastNum: function(){
    if (this.lastNum === -1) return this.lastNum = this.input.charCodeAt(this.lastStart);
    return this.lastNum;
  },

  debug: function(){
    return '`'+this.getLastValue()+'` @ '+this.pos+' ('+Tok[this.lastType]+')';
  },
  syntaxError: function(value){
    return 'A syntax error at pos='+this.pos+" expected "+(typeof value == 'number' ? 'type='+Tok[value] : 'value=`'+value+'`')+' is `'+this.getLastValue()+'` '+
        '('+Tok[this.lastType]+') #### `'+this.input.substring(this.pos-2000, this.pos)+'#|#'+this.input.substring(this.pos, this.pos+2000)+'`'
  },
};
