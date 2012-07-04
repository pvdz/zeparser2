// indices match slots of the start-regexes (where applicable)
// this order is determined by regex/parser rules so they are fixed
var WHITE_SPACE = 1;
var LINETERMINATOR = 2;
var COMMENT_SINGLE = 3;
var COMMENT_MULTI = 4;
var STRING = 10;
var STRING_SINGLE = 5;
var STRING_DOUBLE = 6;
var NUMBER = 11;
var NUMERIC_HEX = 7;
var NUMERIC_DEC = 12;
var REGEX = 8;
var PUNCTUATOR = 9;
var IDENTIFIER = 13;
var EOF = 14;
var ASI = 15;
var ERROR = 16;

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
        identifier: /[\w\d$]+/g, // note: \w also includes underscore
    },

    nextBlackToken: function(expressionStart){
        if (this.pos >= this.normalizedInput.length) return EOF;

        this.lastStart = this.pos;
        var type = null;
        while ((type = this.nextWhiteToken()) === true) this.lastStart = this.pos;
        this.lastStop = this.pos;
        return type;
    },
    nextWhiteToken: function(expressionStart){
        if (this.pos >= this.normalizedInput.length) return {type:EOF};

        var nextStart = this.normalizedInput.substring(this.pos,this.pos+4);
        var part = this.rex.startSubstring.exec(nextStart);

        if (part[WHITE_SPACE]) return this.whitespace();
        if (part[LINETERMINATOR]) return this.lineTerminator();
        if (part[COMMENT_SINGLE]) return this.commentSingle();
        if (part[COMMENT_MULTI]) return this.commentMulti();
        if (part[STRING_SINGLE]) return this.stringSingle();
        if (part[STRING_DOUBLE]) return this.stringDouble();
        if (part[NUMERIC_DEC]) return this.numeric();
        if (expressionStart && part[REGEX]) return this.regex();
        // in case this is not an expression start, regex is a punctuator (division operator)
        if (part[PUNCTUATOR] || part[REGEX]) return this.punctuator(part[PUNCTUATOR] || part[REGEX]);

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
        var pos = this.pos+1;
        regex.lastIndex = pos; // start from here...
        var matches = regex.test(this.normalizedInput);

        if (!matches) throw new Error('String not terminated or contained invalid escape, started at '+pos);

        // i just wanna know where it ended...
        this.pos = regex.lastIndex;

        // now check whether the first char was part of the match
        regex.lastIndex = 0;
        regex.test(this.normalizedInput[pos])

        // actual type doesnt matter for now...
        return STRING;
    },
    numeric: function(){
        // numeric is either a decimal or hex
        // 0.1234  .123  .0  0.  0e12 0e-12 0e12+ 0.e12 0.1e23 0xdeadbeeb

        var regex = this.rex.numbers;
        regex.lastIndex = this.pos;
        var matches = regex.test(this.normalizedInput);

        if (!matches) throw new Error('Invalid number parsed, starting at '+this.pos);

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

        var pos = this.pos;
        this.regexBody();
        if (this.normalizedInput[this.pos++] != '/') throw new Error('Regular expression not closed properly, started at '+pos);
        this.regexFlags();

        return REGEX;
    },
    regexBody: function(){
        var input = this.normalizedInput;
        while (this.pos < input.length) {
            switch (input[this.pos++]) {
                case '\n':
                    throw new Error('Newline not allowed in regular expression at '+(this.pos-1));
                case '/':
                    ++this.pos;
                    if (c == '\n') throw new Error('Newline can not be escaped in regular expression at '+(this.pos-1));
                    break;
                case '(':
                    this.regexBody();
                case ')':
                    return;
                case '[':
                    this.regexClass();
                    break;
                case '/':
                    return;
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
                    ++this.pos;
                    if (c == '\n') throw new Error('Newline can not be escaped in regular expression at '+(this.pos-1));
                    break;
                case ']':
                    return;
            }
        } while (this.pos <= input.length);

        throw new Error('Unterminated regular expression at eof');
    },
    regexFlags: function(){
        var input = this.normalizedInput;
        while (this.pos < input.length) {
            switch (input[this.pos++]) {
                case 'g':
                case 'i':
                case 'm':
                case 'y':
                default:
                    return;
            }
        }

        throw 'Unterminated regular expression at eof';
    },
    punctuator: function(str){
        this.pos += str.length;

        return PUNCTUATOR;
    },
    identifierOrBust: function(){
        var regex = this.rex.identifier;
        regex.lastIndex = this.pos;
        regex.test(this.normalizedInput);
        var end = regex.lastIndex;
        if (!end) throw 'Was expecting an identifier at '+this.pos;

        // regex might have skipped some characters at first, make sure the first character is part of the match
        regex.lastIndex = 0;
        if (!regex.test(this.normalizedInput[this.pos])) throw 'Was expecting an identifier at '+this.pos;

        this.pos = end;

        return IDENTIFIER;
    },

};
