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

var Tok = function(input, options){
  options = options || {};

  this.tokens = [];

  this.input = (input||'');

  // v8 "appreciates" to be set all instance properties explicitly
  this.pos = 0;

  this.lastStart = 0;
  this.lastStop = 0;
  this.lastType = null;
  this.lastValue = null;
  this.lastNum = null;
  this.lastNewline = -1;

  this.tokenCount = 0;
};

// reverse lookup
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

Tok.prototype = {
  input: null,
  pos: 0,

  // parser can look at these positions to see where in the input the last token was
  // this way the tokenizer can simply return number-constants-as-types.
  lastStart: 0,
  lastStop: 0,
  lastType: null,
  lastValue: null,
  lastNewline: null,

  tokenCount: 0,
  tokens: null,

  // some of these regular expressions are so complex that i had to
  // write scripts to construct them. the only way to keep my sanity

  // replace windows' CRLF with a single LF, as well as the weird newlines. this fixes positional stuff.
  rexNewlines: /[\u000A\u000d\u2028\u2029]/g, // used by comment parsers if in regex mode
  // full number parser, both decimal and hex
//  rexNumbers: getNumberRegex(),
  // after having found the */ (indexOf), apply this to quickly test for a newline in the comment
  rexNewlineSearchInMultilineComment:/[\u000A\u000D\u2028\u2029]|\*\//g, // used by m-comment parser if in regex mode

  is: function(v){
    if (typeof v == 'number') {
      if (v === VALUE) return this.lastType === STRING || this.lastType === NUMBER || this.lastType === REGEX || this.lastType === IDENTIFIER;
      return this.lastType == v;
    }
    return this.getLastValue() == v;
  },
  isType: function(t){
    return this.lastType === t;
  },
  isValue: function(){
    return this.lastType === STRING || this.lastType === NUMBER || this.lastType === REGEX || this.lastType === IDENTIFIER;
  },
  isNum: function(n){
    return this.getLastNum() === n;
  },

  nextIf: function(value){
    var equals = this.is(value);
    if (equals) this.next();
    return equals;
  },
  nextIfNum: function(num){
    var equals = this.isNum(num);
    if (equals) this.next();
    return equals;
  },
  nextIfType: function(type){
    var equals = this.isType(type);
    if (equals) this.next();
    return equals;
  },
  nextIfValue: function(){
    var equals = this.isValue();
    if (equals) this.next();
    return equals;
  },

  nextExprIfNum: function(num){
    var equals = this.isNum(num);
    if (equals) this.next(true);
    return equals;
  },

  mustBe: function(value, nextIsExpr){
    if (this.is(value)) {
      this.next(nextIsExpr);
    } else {
      throw this.syntaxError(value);
    }
  },
  mustBeNum: function(num, nextIsExpr){
    if (this.isNum(num)) {
      this.next(nextIsExpr);
    } else {
      throw this.syntaxError(num);
    }
  },
  mustBeType: function(type, nextIsExpr){
    if (this.isType(type)) {
      this.next(nextIsExpr);
    } else {
      throw this.syntaxError(type);
    }
  },

  nextExpr: function(){
    return this.next(true);
  },

  next: function(expressionStart){
    this.lastValue = null;
    this.lastNum = null;
    this.lastNewline = false;

    if (this.pos >= this.input.length) {
      this.lastType = EOF;
      this.lastStart = this.lastStop = this.pos;
      return EOF;
    }

    do {
      this.lastStart = this.pos;
      var type = this.nextWhiteToken(expressionStart);
      this.lastStop = this.pos;
//      this.tokens.push({type:type, value:this.getLastValue(), start:this.lastStart, stop:this.pos});

//      console.log('token:', type, Tok[type], '`'+this.input.substring(this.lastStart, this.pos).replace(/\n/g,'\u23CE')+'`', 'start:',this.lastStart, 'len:',this.lastStop-this.lastStart);
    } while (type === true);

    this.lastType = type;
    return type;
  },
  nextWhiteToken: function(expressionStart){
    this.lastValue = null;
    this.lastNum = null;
    if (this.pos >= this.input.length) return EOF;

    ++this.tokenCount;

    return this.nextToken(expressionStart);
  },

  nextToken: function(expressionStart){
    if (this.pos >= this.input.length) return EOF;

    var c = this.input.charCodeAt(this.pos);
    // https://twitter.com/ariyahidayat/status/225447566815395840
    // Punctuator, Identifier, Keyword, String, Numeric, Boolean, Null, RegularExpression
    // so:
    // Whitespace, RegularExpression, Punctuator, Identifier, LineTerminator, String, Numeric

    if (c === 0x0009 || c === 0x000B || c === 0x000C || c === 0x0020 || c === 0x00A0 || c === 0xFFFF) return this.whitespace();
    if (c === 0x000A || c === 0x000D || c === 0x2028 || c === 0x2029) return this.lineTerminator(c);
    // forward slash before generic punctuators!
    if (c === 0x002f) { // / (forward slash)
      var n = this.input.charCodeAt(this.pos+1);
      if (n === 0x002f) return this.commentSingle(); // 0x002f=/
      if (n === 0x002a) return this.commentMulti(); // 0x002f=*
      if (expressionStart) return this.regex();
    }
    if (this.punctuator(c)) return PUNCTUATOR;
    if ((c >= 0x61 && c <= 0x7a) || (c >= 0x41 && c <= 0x5a) || c === 0x24 || c === 0x5f) return this.asciiIdentifier();
    if (c === 0x0027) return this.stringSingle();
    if (c === 0x0022) return this.stringDouble();
    if ((c >= 0x0030 && c <= 0x0039) || c === 0x2e) return this.number(); // do this after punctuator...

    // tofix: non-ascii identifiers...

    // only thing left it might be is an identifier
    return this.identifierOrBust();
  },

  punctuator: function(c){
    var input = this.input;
    var pos = this.pos;

//    >>>=,
//    === !== >>> <<= >>=
//    <= >= == != ++ -- << >> && || += -= *= %= &= |= ^= /=
//    { } ( ) [ ] . ; ,< > + - * % | & ^ ! ~ ? : = /

    if (c === 0x28) return this.puncToken(1, '(');
    if (c === 0x29) return this.puncToken(1, ')');
    if (c === 0x7b) return this.puncToken(1, '{');
    if (c === 0x7d) return this.puncToken(1, '}');
    if (c === 0x5b) return this.puncToken(1, '[');
    if (c === 0x5d) return this.puncToken(1, ']');
    if (c === 0x3b) return this.puncToken(1, ';');
    if (c === 0x2c) return this.puncToken(1, ',');
    if (c === 0x3f) return this.puncToken(1, '?');
    if (c === 0x3a) return this.puncToken(1, ':');

    var d = input.charCodeAt(pos+1);

    if (c === 0x2e) {
      if (d >= 0x0030 && d <= 0x0039) return false;
      return this.puncToken(1, '.');
    }

    if (c === 0x3d) {
      if (d === 0x3d) {
        if (input.charCodeAt(pos+2) === 0x3d) return this.puncToken(3, '===');
        return this.puncToken(2, '==');
      }
      return this.puncToken(1, '=');
    }
    if (c === 0x3c) {
      if (d === 0x3d) return this.puncToken(2, '<=');
      if (d === 0x3c) {
        if (input.charCodeAt(pos+2) === 0x3d) return this.puncToken(3, '<<=');
        return this.puncToken(2, '<<');
      }
      return this.puncToken(1, '<');
    }

    if (c === 0x3e) {
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

    if (c === 0x2b) {
      if (d === 0x3d) return this.puncToken(2, '+=');
      if (d === 0x2b) return this.puncToken(2, '++');
      return this.puncToken(1, '+');
    }
    if (c === 0x2d) {
      if (d === 0x3d) return this.puncToken(2, '-=');
      if (d === 0x2d) return this.puncToken(2, '--');
      return this.puncToken(1, '-');
    }
    if (c === 0x2a) {
      if (d === 0x3d) return this.puncToken(2, '*=');
      return this.puncToken(1, '*');
    }
    if (c === 0x25) {
      if (d === 0x3d) return this.puncToken(2, '%=');
      return this.puncToken(1, '%');
    }
    if (c === 0x7c) {
      if (d === 0x3d) return this.puncToken(2, '+=');
      if (d === 0x7c) return this.puncToken(2, '+=');
      return this.puncToken(1, '|');
    }
    if (c === 0x26) {
      if (d === 0x3d) return this.puncToken(2, '&=');
      if (d === 0x26) return this.puncToken(2, '&&');
      return this.puncToken(1, '&');
    }
    if (c === 0x5e) {
      if (d === 0x3d) return this.puncToken(2, '^=');
      return this.puncToken(1, '^');
    }
    if (c === 0x21) {
      if (d === 0x3d) {
        if (input.charCodeAt(pos+2) === 0x3d) return this.puncToken(3, '!==');
        return this.puncToken(2, '!=');
      }
      return this.puncToken(1, '~');
    }
    if (c === 0x7e) {
      if (d === 0x3d) return this.puncToken(2, '~=');
      return this.puncToken(1, '~');
    }
    if (c === 0x2f) {
      // cant really be a //, /* or regex because they should have been checked before calling this function
      if (d === 0x3d) return this.puncToken(2, '/=');
      return this.puncToken(1, '/');
    }

    return false;
  },
  puncToken: function(len, value){
    this.pos += len;
    return PUNCTUATOR;
//    return value;
  },

  whitespace: function(){
    ++this.pos;
    return true;
  },
  lineTerminator: function(c){
    this.lastNewline = true;
    ++this.pos;
    if (c === 0x000D && this.input.charCodeAt(this.pos) === 0x000A) ++this.pos;
    return true;
  },
  commentSingle: function(){
//    var input = this.input;
//    var len = input.length;
//    var pos = this.pos;
//    var c = input.charCodeAt(pos);
//    while (pos < len && c !== 0x000A && c !== 0x000D && c !== 0x2028 && c !== 0x2029) {
//      var c = input.charCodeAt(++pos);
//    }
//
//    this.pos = pos;
//
//    return true;

    var rex = this.rexNewlines;
    rex.lastIndex = this.pos;
    rex.test(this.input);
    this.pos = rex.lastIndex-1;
    if (this.pos == -1) this.pos = this.input.length;
    return true;
  },
  commentMulti: function(){
    // two ways: regex or character loop. dunno which is faster.

//    var input = this.input;
//    var len = input.length;
//    var pos = this.pos+2;
//    var nonl = true;
//    while (pos < len) {
//      var c = input.charCodeAt(pos++);
//      if (c === 0x2a && input.charCodeAt(pos) === 0x2f) break;
//      else if (nonl && c === 0x000A || c === 0x000D || c === 0x2028 || c === 0x2029) nonl = false;
//    }
//
//    if (pos >= len) throw 'unterminated line comment at '+pos;
//    this.pos = pos+1;
//    if (!nonl) this.lastNewline = true;
//
//    return true;

    var end = this.input.indexOf('*/',this.pos+2)+2;
    if (end == 1) throw new Error('Unable to find end of multiline comment started on pos '+this.pos);

    // search for newline (important for ASI)
    var nls = this.rexNewlineSearchInMultilineComment;
    nls.lastIndex = this.pos+2;
    nls.test(this.input);
    if (nls.lastIndex != end) this.lastNewline = true;

    this.pos = end;
    return true;
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
      if (this.hexicode(this.input.charCodeAt(pos+1)) && this.hexicode(this.input.charCodeAt(pos+2))) pos += 2;
      else throw 'Invalid hex escape';
    // skip windows newlines as if they're one char
    } else if (c === 0x000D) {
      if (input.charCodeAt(pos+1) === 0x000A) ++pos;
    }
    return pos+1;
  },
  unicode: function(pos){
    var input = this.input;

    return this.hexicode(this.input.charCodeAt(pos)) && this.hexicode(this.input.charCodeAt(pos+1)) && this.hexicode(this.input.charCodeAt(pos+2)) && this.hexicode(this.input.charCodeAt(pos+3));
  },
  hexicode: function(c){
    // 0-9, a-f, A-F
    return ((c >= 0x30 && c <= 0x39) || (c >= 0x61 && c <= 0x66) || (c >= 0x41 && c <= 0x46));
  },

  number: function(){
    // numeric is either a decimal or hex
    // 0.1234  .123  .0  0.  0e12 0e-12 0e12+ 0.e12 0.1e23 0xdeadbeeb

    var input = this.input;
    var pos = this.pos;

    var c = input.charCodeAt(pos);
    var d = input.charCodeAt(pos+1);

    if (c === 0x0030 && (d === 0x0058 || d === 0x0078)) { // x or X
      this.hexNumber(pos+2);
    } else {
      this.decimalNumber(c, pos);
    }

    return NUMBER;



//    var regex = this.rexNumbers;
//
//    regex.lastIndex = this.pos;
//    var matches = regex.test(this.input);
//
//    if (!matches) throw new Error('Invalid number parsed, starting at '+this.pos);
//
//    // we dont have to check whether the first character is part of the match because we already know
//    // that it is a zero and therefor has to be part of the match.
//
//    this.pos = regex.lastIndex;
//
//    return NUMBER;
  },
  decimalNumber: function(c, pos){
    var input = this.input;

    if (c !== 0x002e) { // if not dot?
      pos = this.decimalSub(pos+1); // +1 => skip the first, you already know it's a number
      c = input.charCodeAt(pos);
    }

    if (c === 0x002e) { // dot
      pos = this.decimalSub(pos+1); // +1 => skip the dot
      c = input.charCodeAt(pos);
    }

    if (c === 0x0045 || c === 0x0065) { // e or E
      c = input.charCodeAt(++pos);
      if (c === 0x002b || c === 0x002d) ++pos; // + or -, optional
      pos = this.decimalSub(pos);
    }

    this.pos = pos;
  },
  decimalSub: function(pos){
    var input = this.input;
    var c = input.charCodeAt(pos);
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
    this.regexFlags();

    return REGEX;
  },
  regexBody: function(){
    var input = this.input;
    var len = input.length;
    var pos = this.pos;
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
    while (this.pos < len) {
      var c = input.charCodeAt(this.pos++);

      if (c === 0x005d) return; // ]
      if (c === 0x000D || c === 0x000A || c === 0x2028 || c === 0x2029) {
        throw 'Illegal newline in regex char class at '+this.pos;
      }
      if (c === 0x005c) { // backslash
        var d = input.charCodeAt(this.pos++);
        if (d === 0x000D || d === 0x000A || d === 0x2028 || d === 0x2029) {
          throw new Error('Newline can not be escaped in regular expression at '+this.pos);
        }
      }
    }

    throw new Error('Unterminated regular expression at eof');
  },
  regexFlags: function(){
    --this.pos;
    this.asciiIdentifier();
  },
  identifierOrBust: function(){
    var result = this.asciiIdentifier();
    if (result === false) throw 'Expecting identifier here at pos '+this.pos;
    return result;
  },
  asciiIdentifier: function(){
    var input = this.input;
    var len = input.length;
    var pos = this.pos;
    while (pos < len) {
      var c = input.charCodeAt(++pos);
      // a-z A-Z 0-9 $ _
      if (!((c >= 0x61 && c <= 0x7a) || (c >= 0x41 && c <= 0x5a) || (c >= 0x30 && c <= 0x39) || c === 0x24 || c === 0x5f)) {
        // \uxxxx
        if (c === 0x5c && input.charCodeAt(pos+1) === 0x75 && this.unicode(pos+2)) {
          pos += 5;
        } else {
          // tofix: non-ascii identifiers
          break;
        }
      }
    }
    if (this.pos === pos) return false;
    this.pos = pos;
    return IDENTIFIER;
  },

  getLastValue: function(){
    return this.lastValue || (this.lastValue = this.input.substring(this.lastStart, this.lastStop));
  },
  getLastNum: function(){
    if (this.lastNum === null) return this.lastNum = this.input.charCodeAt(this.lastStart);
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
