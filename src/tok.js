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

    this.originalInput = input;
    // normalized input means all the newlines have been normalized to just '\n'
    // this makes searching strings and comments for newlines much faster/simpler
    // and it makes the position being reported properly. it does mean that, due
    // to the desync of original input and normalized input for windows style
    // line terminators (two characters; cr+lf), the tokenizer cannot properly
    // maintain the original type of newline...
    this.normalizedInput = (input||'').replace(this.rex.normalizeNewlines, '\n');
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
    originalInput: null,
    normalizedInput: null,
    pos: 0,

    errorStack: null,

    whites: [],
    blacks: [],

    // parser can look at these positions to see where in the input the last token was
    // this way the tokenizer can simply return number-constants-as-types.
    lastStart: 0,
    lastStop: 0,
    lastType: null,
    lastValue: null,
    lastNewline: null,

    tokenCount: 0,

    // some of these regular expressions are so complex that i had to
    // write scripts to construct them. the only way to keep my sanity
    rex: {
        // replace windows' CRLF with a single LF, as well as the weird newlines. this fixes positional stuff.
        normalizeNewlines: /(?:\u000D\u000A)|[\u000d\u2028\u2029]/g,
        // some are so complex that we build them to keep our own sanity
        // get start from next four bytes (substringing)
        startSubstring: getSubstringStartRegex(),
        // get start from entire input (lastIndex)
//        tokenalt:  getLastindexStartRegex(),
        // get the remainder of a string literal, after the opening quote
        stringBodySingle: getStringBodyRegex('\''),
        stringBodyDouble: getStringBodyRegex('"'),
        // full number parser, both decimal and hex
        numbers: getNumberRegex(),
        // full identifier, except for non-ascii ranged characters...
        identifier: /(?:[\w\d$]|(?:\\u(?:[\da-f]){4}))+/ig, // note: \w also includes underscore

        hex: /[\da-f]/i,
    },

    is: function(v){
        if (typeof v == 'number') {
            if (v === VALUE) return this.lastType === STRING || this.lastType === NUMBER || this.lastType === REGEX || this.lastType === IDENTIFIER;
            return this.lastType == v;
        }
        return this.getLastValue() == v;
    },
    nextIf: function(value){
        var equals = this.is(value);
        if (equals) this.next();
        return equals;
    },
    nextExprIf: function(value){
        var equals = this.is(value);
        if (equals) this.next(true);
        return equals;
    },
    mustBe: function(value, nextIsExpr){
        if (this.is(value)) {
            if (nextIsExpr) this.nextExpr();
            else this.next();
        } else {
            throw 'A syntax error at pos='+this.pos+" expected "+(typeof value == 'number' ? 'type='+Tok[value] : 'value=`'+value+'`')+' is `'+this.getLastValue()+'` ('+Tok[this.lastType]+') #### `'+this.normalizedInput.substring(this.pos-2000, this.pos+2000)+'`';
        }
    },

    nextExpr: function(){
        return this.next(true);
    },


    next: function(expressionStart){
        this.lastValue = null;
        this.lastNewline = false;

        if (this.pos >= this.normalizedInput.length) {
            this.lastType = EOF;
            this.lastStart = this.lastStop = this.pos;
            return EOF;
        }

        do {
            this.lastStart = this.pos;
            var type = this.nextWhiteToken(expressionStart);
//            console.log('token:', type, Tok[type], '`'+this.normalizedInput.substring(this.lastStart, this.pos).replace(/\n/g,'\u23CE')+'`');
        } while (type === true);

        this.lastStop = this.pos;
        this.lastType = type;
        return type;
    },
    nextWhiteToken: function(expressionStart){
        this.lastValue = null;
        if (this.pos >= this.normalizedInput.length) return EOF;

        var nextStart = this.normalizedInput.substring(this.pos,this.pos+4);
        var part = this.rex.startSubstring.exec(nextStart);

        ++this.tokenCount;

        if (part[WHITE_SPACE]) return this.whitespace();
        if (part[LINETERMINATOR]) {
            this.lastNewline = true;
            return this.lineTerminator();
        }
        if (part[COMMENT_SINGLE]) return this.commentSingle();
        if (part[COMMENT_MULTI]) return this.commentMulti();
        if (part[STRING_SINGLE]) return this.stringSingle();
        if (part[STRING_DOUBLE]) return this.stringDouble();
        if (part[NUMBER]) return this.number();
        if (expressionStart && part[REGEX]) return this.regex();
        // in case this is not an expression start, regex is a punctuator (division operator)
        if (part[PUNCTUATOR] || part[REGEX]) return this.punctuator(part[REGEX] || part[PUNCTUATOR]);

        return this.identifierOrBust();
    },

    whitespace: function(){
        ++this.pos;
        return true;
    },
    lineTerminator: function(){
        var pos = this.pos++;
//        var input = this.normalizedInput;
//        if (input[pos] == '\r' && input[pos+1] == '\n') ++this.pos;
        return true;
    },
    commentSingle: function(){
        this.pos = this.normalizedInput.indexOf('\n', this.pos);
        if (this.pos == -1) this.pos = this.normalizedInput.length;
        return true;
    },
    commentMulti: function(){
        var end = this.normalizedInput.indexOf('*/',this.pos+2)+2;
        if (end == -1) throw new Error('Unable to find end of multiline comment started on pos '+this.pos);
        this.pos = end;
        return true;
    },
    stringSingle: function(){
        return this.string(this.rex.stringBodySingle);
    },
    stringDouble: function(){
        return this.string(this.rex.stringBodyDouble);
    },
    string: function(regex){
        regex.lastIndex = this.pos; // start from here...
        var matches = regex.test(this.normalizedInput);

        if (!matches) throw new Error('String not terminated or contained invalid escape, started at '+this.pos);

        // i just wanna know where it ended...
        this.pos = regex.lastIndex;

        // since the leading quote is part of the match, we know that the match
        // started at pos, no need to check for that. (otherwise we would have had to check)

        // actual type doesnt matter for now...
        return STRING;
    },
    number: function(){
        // numeric is either a decimal or hex
        // 0.1234  .123  .0  0.  0e12 0e-12 0e12+ 0.e12 0.1e23 0xdeadbeeb
        var regex = this.rex.numbers;

        regex.lastIndex = this.pos;
        var matches = regex.test(this.normalizedInput);

        if (!matches) throw new Error('Invalid number parsed, starting at '+this.pos);

        // we dont have to check whether the first character is part of the match because we already know
        // that it is a zero and therefor has to be part of the match.

        this.pos = regex.lastIndex;

        return NUMBER;
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

        var pos = this.pos++;
        this.regexBody();
        this.regexFlags();

        return REGEX;
    },
    regexBody: function(){
        var input = this.normalizedInput;
        while (this.pos < input.length) {
            switch (input[this.pos++]) {
                case '\n':
                    throw new Error('Newline not allowed in regular expression at '+(this.pos-1));
                case '\\':
                    if (input[this.pos++] == '\n') throw new Error('Newline can not be escaped in regular expression at '+(this.pos-1));
                    break;
                case '(':
                    this.regexBody();
                    break;
                case ')':
                    return;
                case '[':
                    this.regexClass();
                    break;
                case '/':
                    return;
//                default:
//                    console.log("ignored", input[this.pos-1]);
            }
        }

        throw new Error('Unterminated regular expression at eof');
    },
    regexClass: function(){
        var input = this.normalizedInput;
        do {
            switch (input[this.pos++]) {
                case '\n': throw new Error('Newline can not be escaped in regular expression at '+(this.pos-1));
                case '\\':
                    if (input[this.pos] == '\n') throw new Error('Newline can not be escaped in regular expression at '+this.pos);
                    ++this.pos;
                    break;
                case ']':
                    return;
            }
        } while (this.pos <= input.length);

        throw new Error('Unterminated regular expression at eof');
    },
    regexFlags: function(){
        var input = this.normalizedInput;
        var rex = this.rex.identifier;
        while (this.pos < input.length) {
            var c = input[this.pos];
            rex.lastIndex = 0;
            if (rex.test(c)) ++this.pos;
            else if (c == '\\') {
                // it can be a unicode escape...
                // manually excavating this edge case
                var pos = this.pos+1;
                var hex = this.rex.hex;
                if (input[pos] == 'u' && hex.test(input[pos+1]) && hex.test(input[pos+2]) && hex.test(input[pos+3]) && hex.test(input[pos+4])) {
                    this.pos += 6;
                } else {
                    return;
                }
            }
            else return;
        }
    },
    punctuator: function(str){
        this.pos += str.length;

        return PUNCTUATOR;
    },
    identifierOrBust: function(){
        var result = this.identifier();
        if (result === false) throw 'Expecting identifier here at pos '+this.pos;
        return result;
    },
    identifier: function(){
        var regex = this.rex.identifier;

        regex.lastIndex = this.pos;
        regex.test(this.normalizedInput);
        var end = regex.lastIndex;
        if (!end) return false;

        // regex might have skipped some characters at first, make sure the first character is part of the match
        regex.lastIndex = 0;
        if (!regex.test(this.normalizedInput[this.pos])) {
            // also have to check for unicode escape as start...
            if (this.normalizedInput[this.pos] != '\\' || !regex.test(this.normalizedInput.substring(this.pos,6))) {
                return false;
            }
        }

        this.pos = end;

        return IDENTIFIER;
    },

    getLastValue: function(){
        return this.lastValue || (this.lastValue = this.normalizedInput.substring(this.lastStart, this.lastStop));
    },

    debug: function(){
        return '`'+this.getLastValue()+'` @ '+this.pos+' ('+Tok[this.lastType]+')';
    },
};
