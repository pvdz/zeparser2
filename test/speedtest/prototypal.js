(function(exports){

;// #################################
 // ## Start of file: substringStartRegex.js
 // #################################

// this builds the regex that determines which token to parse next
// it should be applied to the next four bytes of the input (four
// bytes because of the longest punctuator).


var getSubstringStartRegex = function(testing){
    // note: punctuators should be parsed long to short. regex picks longest first, parser wants that too.
    var punc = [
        '>>>=',
        '===','!==','>>>','<<=','>>=',
        '<=','>=','==','!=','\\+\\+','--','<<','>>','\\&\\&','\\|\\|','\\+=','-=','\\*=','%=','\\&=','\\|=','\\^=','\\/=',
        '\\{','\\}','\\(','\\)','\\[','\\]','\\.',';',',','<','>','\\+','-','\\*','%','\\|','\\&','\\|','\\^','!','~','\\?',':','=','\\/'
    ];


    // everything is wrapped in (<start>)?
    var starts = [
        '[\\u0009\\u000B\\u000C\\u0020\\u00A0\\uFFFF]', // whitespace: http://es5.github.com/#WhiteSpace
        '[\\u000A\\u000D\\u2028\\u2029]', // lineterminators: http://es5.github.com/#LineTerminator
        '\\/\\/', // single comment
        '\\/\\*', // multi comment
        '\'', // single string
        '"', // double string
        '\\.?[0-9]', // numbers
        '\\/=?', // regex
        punc.join('|')
    ];

    // basic structure: /^(token)?(token)?(token)?.../
    // match need to start left but might not match entire input part
    var s = '^' + starts.map(function(start){ return '('+start+')?'; }).join('') + (testing?'$':'');

    return new RegExp(s);
};


;// #################################
 // ## Start of file: stringBodyRegex.js
 // #################################

var getStringBodyRegex = function(quote, testing){
    // unicode hex escape+any-char non-newline-char
    var parts = [
        '\\\\u[\\da-f]{4}', // unicode escape, \u1234
        '\\\\x[\\da-f]{2}', // hex escape, \x12
        '\\\\[^xu]', // single char escape, but dont allow u or x here
        '[^\\n\\\\'+quote+']' // anything but a newline,backslash or target quote (we want to fail malformed \x and \u)
    ];
    var body = parts.map(function(part){
        return '(?:'+part+')';
    }).join('|');

    var regex = quote+'(?:'+body+')*'+quote;
    return new RegExp(regex, 'img');

    if (!testing) return regex;

    // rest is just for running tests...

    // slightly different regex for testing (i want it to match exactly the whole test case)
    var regex = '^(?:'+body+')*'+quote+'$';
    regex = new RegExp(regex, 'im');

    var good = [
        'foo',
        'foo\\s',
        '\\sfoo',
        'foo\\sbar',
        'foo\\\\n',
        '\\\\nfoo',
        'foo\\\\nbar',
        'foo\\\n',
        '\\\nfoo',
        'foo\\\nbar',
        'foo\\u1234',
        '\\u0badfoo',
        'foo\\udeadbar',
        'foo\\x15',
        '\xabfoo',
        'foo\x10bar'
    ];
    var bad = [
        'foo',
        '\n',
        'foo\n',
        '\nfoo',
        '\\u123h'+quote,
        '\\u123'+quote,
    ];

    console.log("the goods:");
    good.forEach(function(str){
        if (regex.test(str+'"')) console.log('okay: '+str+'"');
        else console.warn('fail: '+str+'"');
    });
    console.log("the bads:");
    bad.forEach(function(str){
        if (regex.test(str)) console.warn('fail: '+str);
        else console.log('okay: '+str);
    });
};


;// #################################
 // ## Start of file: numberRegex.js
 // #################################

function getNumberRegex(testing){

    var wrap = function(s){ return '(?:'+s+')'; };

    var hex = '0x[\\da-f]+';
    var integer = '\\d';
    var dot = '\\.';

    // e is a suffix, can be followed by positive or negative sign,
    // which must be followed by one or more digits, even zeroes
    var exp = 'e[-+]?\\d+';

    // body = hex | ((( 0 | [1-9]int* )( . int* )? | .int+)(exp)?)
    var body = wrap(
        wrap(hex)+
        '|'+
        wrap(
            wrap( // either digits[.[digits]] or .digits
                wrap( // integer with optional fraction
                    wrap( // if the first digit is zero, no more will follow
                        '0'+
                        '|'+
                        '[1-9]'+integer+'*'
                    )+
                    wrap( // optional dot with optional fraction (if fraction, dot is required)
                        dot+integer+'*'
                    )+'?'
                )+
                '|'+
                wrap( // leading dot with required fraction part
                    dot+
                    integer+'+'
                )
            )+
            wrap(exp)+'?'
        )
    );

    if (!testing) return new RegExp(body, 'gi');

    // test cases...

    var regex = new RegExp('^'+body+'$', 'i');


    var good = [
        '25',
        '0',
        '0.1234',
        '.1234',
        '.00',
        '.0',
        '0.',
        '500.',
        '1e2',
        '1e15',
        '1e05',
        '1e41321',
        '1e-0',
        '1e+0',
        '0.e15',
        '0.e-15',
        '0.e+15',
        '.0e15',
        '.0e+15',
        '.0e-15',
        '.0e-0',
        '0.15e+125',
        '0x15',
        '0x0',
        '0xdeadbeefcace',
        '0X500dead',
    ];
    var bad = [
        '00',
        '00.',
        '00.0',
        '.e',
        '.e5',
        '.e+15',
        '15e+',
        '15e-',
        '.15e+',
        '.15e-',
        '00xfeed',
        '00Xfeed',
    ];

    console.log("the goods:");
    good.forEach(function(str){
        if (regex.test(str)) console.log('okay: '+str);
        else console.warn('fail: '+str);
    });
    console.log("the bads:");
    bad.forEach(function(str){
        if (regex.test(str)) console.warn('fail: '+str);
        else console.log('okay: '+str);
    });
};


;// #################################
 // ## Start of file: tok.js
 // #################################

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

    this.tokens = [];

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
    tokens: null,

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
            this.lastStop = this.pos;

            //this.tokens.push({type:type, /*value:this.getLastValue(),*/ start:this.lastStart, stop:this.pos});

//            console.log('token:', type, Tok[type], '`'+this.normalizedInput.substring(this.lastStart, this.pos).replace(/\n/g,'\u23CE')+'`');
        } while (type === true);

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
            switch (input.charAt(this.pos++)) {
                case '\n':
                    throw new Error('Newline not allowed in regular expression at '+(this.pos-1));
                case '\\':
                    if (input.charAt(this.pos++) == '\n') throw new Error('Newline can not be escaped in regular expression at '+(this.pos-1));
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
            switch (input.charAt(this.pos++)) {
                case '\n': throw new Error('Newline can not be escaped in regular expression at '+(this.pos-1));
                case '\\':
                    if (input.charAt(this.pos) == '\n') throw new Error('Newline can not be escaped in regular expression at '+this.pos);
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
            var c = input.charAt(this.pos);
            rex.lastIndex = 0;
            if (rex.test(c)) ++this.pos;
            else if (c == '\\') {
                // it can be a unicode escape...
                // manually excavating this edge case
                var pos = this.pos+1;
                var hex = this.rex.hex;
                if (input.charAt(pos) == 'u' && hex.test(input.charAt(pos+1)) && hex.test(input.charAt(pos+2)) && hex.test(input.charAt(pos+3)) && hex.test(input.charAt(pos+4))) {
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
        if (!regex.test(this.normalizedInput.charAt(this.pos))) {
            // also have to check for unicode escape as start...
            if (this.normalizedInput.charAt(this.pos) != '\\' || !regex.test(this.normalizedInput.substring(this.pos,6))) {
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


;// #################################
 // ## Start of file: par.js
 // #################################

exports.Par = function(input){
    this.tok = new Tok(input);
};

exports.Par.prototype = {
    run: function(){
        // prepare
        this.tok.nextExpr();

        // go!
        this.parseStatements();
    },

    parseStatements: function(){
        var protect = 100000;
        while (--protect && !this.tok.is(EOF) && this.parseStatement());
        if (!protect) throw 'loop protection triggered '+this.tok.debug();
    },
    parseStatement: function(){
        if (this.tok.is(IDENTIFIER)) {
            switch (this.tok.getLastValue()) {
                case 'var': this.parseVar(); break;
                case 'if': this.parseIf(); break;
                case 'do': this.parseDo(); break;
                case 'while': this.parseWhile(); break;
                case 'for': this.parseFor(); break;
                case 'continue': this.parseContinue(); break;
                case 'break': this.parseBreak(); break;
                case 'return': this.parseReturn(); break;
                case 'throw': this.parseThrow(); break;
                case 'switch': this.parseSwitch(); break;
                case 'try': this.parseTry(); break;
                case 'debugger': this.parseDebugger(); break;
                case 'with': this.parseWith(); break;
                case 'function': this.parseFunction(); break;
                default:
                    if (
                        this.tok.is('case') ||
                        this.tok.is('default')
                    ) {
                        // case and default are handled elsewhere
                        return false;
                    }

                    this.parseExpressionOrLabel();
                    break;
            }

            return true;
        }

        if (
            this.tok.is(VALUE) ||
            this.tok.is('(') ||
            this.tok.is('[') ||
            this.tok.is('++') ||
            this.tok.is('--') ||
            this.tok.is('+') ||
            this.tok.is('-') ||
            this.tok.is('~') ||
            this.tok.is('!')
        ) {
            return this.parseExpressionStatement();
        }

        if (this.tok.nextExprIf('{')) return this.parseBlock();
        if (this.tok.nextExprIf(';')) return true; // empty statement
        if (this.tok.is(EOF)) return false;
    },
    parseStatementHeader: function(){
        this.tok.mustBe('(', true);
        this.parseExpressions();
        this.tok.mustBe(')', true);
    },

    parseVar: function(){
        // var <vars>
        // - foo
        // - foo=bar
        // - ,foo=bar

        this.tok.next();
        do {
            this.tok.mustBe(IDENTIFIER, true);
            if (this.tok.nextExprIf('=')) {
                this.parseExpression();
            }
        } while(this.tok.nextIf(','));
        this.parseSemi();

        return true;
    },
    parseVarPartNoIn: function(){
        this.tok.next();
        do {
            this.tok.mustBe(IDENTIFIER,true);
            if (this.tok.nextExprIf('=')) {
                this.parseExpressionNoIn();
            }
        } while(this.tok.nextIf(','));
    },
    parseIf: function(){
        // if (<exprs>) <stmt>
        // if (<exprs>) <stmt> else <stmt>

        this.tok.next();
        this.parseStatementHeader();
        this.parseStatement();

        this.parseElse();

        return true;
    },
    parseElse: function(){
        // else <stmt>;

        if (this.tok.nextIf('else')) {
            this.parseStatement();
        }
    },
    parseDo: function(){
        // do <stmt> while ( <exprs> ) ;

        this.tok.nextExpr();
        this.parseStatement();
        this.tok.mustBe('while');
        this.tok.mustBe('(');
        this.parseExpressions();
        this.tok.mustBe(')');
        this.parseSemi();
    },
    parseWhile: function(){
        // while ( <exprs> ) <stmt>

        this.tok.next();
        this.parseStatementHeader();
        this.parseStatement();
    },
    parseFor: function(){
        // for ( <expr-no-in-=> in <exprs> ) <stmt>
        // for ( var <idntf> in <exprs> ) <stmt>
        // for ( var <idntf> = <exprs> in <exprs> ) <stmt>
        // for ( <expr-no-in> ; <expr> ; <expr> ) <stmt>

        // need to excavate this... investigate specific edge cases for `for-in`

        this.tok.next();
        this.tok.mustBe('(');

        var parsedAssignment = false;
        if (this.tok.is('var')) this.parseVarPartNoIn();
        else parsedAssignment = this.parseExpressionsNoIn();

        if (this.tok.nextIf(';')) this.parseForEach();
        else {
            if (parsedAssignment) {
                // TOFIX: this is a syntax error...
                console.warn("Syntax error, illegal assignment in for-in", this.tok.debug());
            }
            this.parseForIn();
        }
    },
    parseForEach: function(){
        // <expr> ; <expr> ) <stmt>

        this.parseExpressions();
        this.tok.mustBe(';');
        this.parseExpressions();
        this.tok.mustBe(')');
        this.parseStatement();
    },
    parseForIn: function(){
        // in <exprs> ) <stmt>

        this.tok.mustBe('in');
        this.parseExpressions();
        this.tok.mustBe(')');
        this.parseStatement();
    },
    parseContinue: function(){
        // continue ;
        // continue <idntf> ;
        // newline right after keyword = asi

        this.tok.next();
        if (this.tok.lastNewline) this.addAsi();
        else {
            this.tok.nextIf(IDENTIFIER);
            this.parseSemi();
        }
    },
    parseBreak: function(){
        // break ;
        // break <idntf> ;
        // newline right after keyword = asi

        this.tok.next();
        if (this.tok.lastNewline) this.addAsi();
        else {
            this.tok.nextIf(IDENTIFIER);
            this.parseSemi();
        }
    },
    parseReturn: function(){
        // return ;
        // return <exprs> ;
        // newline right after keyword = asi

        this.tok.nextExpr();
        if (this.tok.lastNewline) this.addAsi();
        else {
            this.parseExpressions();
            this.parseSemi();
        }
    },
    parseThrow: function(){
        // throw <exprs> ;

        this.tok.nextExpr();
        if (this.tok.lastNewline) this.addAsi();
        else {
            this.parseExpressions();
            this.parseSemi();
        }
    },
    parseSwitch: function(){
        // switch ( <exprs> ) { <switchbody> }

        this.tok.next();
        this.parseStatementHeader();
        this.tok.mustBe('{', true);
        this.parseSwitchBody();
        this.tok.mustBe('}');
    },
    parseSwitchBody: function(){
        // [<cases>] [<default>] [<cases>]

        // default can go anywhere...
        this.parseCases();
        if (this.tok.nextIf('default')) {
            this.parseDefault();
            this.parseCases();
        }
    },
    parseCases: function(){
        while (this.tok.nextIf('case',true)) {
            this.parseCase();
        }
    },
    parseCase: function(){
        // case <value> : <stmts-no-case-default>
        this.parseExpressions();
        this.tok.mustBe(':',true);
        this.parseStatements();
    },
    parseDefault: function(){
        // default <value> : <stmts-no-case-default>
        this.tok.mustBe(':',true);
        this.parseStatements();
    },
    parseTry: function(){
        // try { <stmts> } catch ( <idntf> ) { <stmts> }
        // try { <stmts> } finally { <stmts> }
        // try { <stmts> } catch ( <idntf> ) { <stmts> } finally { <stmts> }

        this.tok.next();
        this.parseCompleteBlock();

        var one = this.parseCatch();
        var two = this.parseFinally();

        if (!one && !two) throw 'Try must have at least a catch or finally block or both: '+this.tok.debug();
    },
    parseCatch: function(){
        // catch ( <idntf> ) { <stmts> }

        if (this.tok.nextIf('catch')) {
            this.tok.mustBe('(');
            this.tok.mustBe(IDENTIFIER);
            this.tok.mustBe(')');
            this.parseCompleteBlock();

            return true;
        }
    },
    parseFinally: function(){
        // finally { <stmts> }

        if (this.tok.nextIf('finally')) {
            this.parseCompleteBlock();

            return true;
        }
    },
    parseDebugger: function(){
        // debugger ;

        this.tok.next();
        this.parseSemi();
    },
    parseWith: function(){
        // with ( <exprs> ) <stmts>

        this.tok.next();
        this.parseStatementHeader();
        this.parseStatement();
    },
    parseFunction: function(hasName){
        // function [<idntf>] ( [<param>[,<param>..] ) { <stmts> }

        this.tok.next(); // 'function'
        this.tok.nextIf(IDENTIFIER); // name
        this.parseFunctionRemainder();
    },
    parseNamedFunction: function(hasName){
        // function [<idntf>] ( [<param>[,<param>..] ) { <stmts> }

        this.tok.next(); // 'function'
        this.tok.mustBe(IDENTIFIER); // name
        this.parseFunctionRemainder();
    },
    parseFunctionRemainder: function(){
        this.tok.mustBe('(');
        this.parseParameters();
        this.tok.mustBe(')');
        this.parseCompleteBlock();
    },
    parseParameters: function(){
        // [<idntf> [, <idntf>]]

        if (this.tok.nextIf(IDENTIFIER)) {
            while (this.tok.nextIf(',')) {
                this.tok.mustBe(IDENTIFIER);
            }
        }
    },
    parseBlock: function(){
        this.parseStatements();
        this.tok.mustBe('}', true);
        return true;
    },
    parseCompleteBlock: function(){
        this.tok.mustBe('{', true);
        this.parseBlock();
    },
    parseSemi: function(){
        if (this.tok.nextIf(';')) return PUNCTUATOR;
        if (this.parseAsi()) return ASI;
        throw 'Unable to parse semi, unable to apply ASI: '+this.tok.debug()+' #### '+
            this.tok.normalizedInput.substring(this.tok.lastStart-2000, this.tok.lastStart)+
            '###'+
            this.tok.normalizedInput.substring(this.tok.lastStart, this.tok.lastStart+2000);
    },
    parseAsi: function(){
        if (this.tok.is(EOF) || this.tok.is('}') || this.tok.lastNewline) {
            return this.addAsi();
        }
        return false;

        // need to fix the newline-in-comment-or-string one...
    },
    addAsi: function(){
//        console.log("Aplying ASI");
        ++this.tok.tokenCount;
        return ASI;
    },
    parseExpressionStatement: function(){
        this.parseExpressions();
        this.parseSemi();

        return true;
    },

    parseExpressionOrLabel: function(){
        var found = this.parseExpressionForLabel();
        if (!found) {
            if (this.tok.nextExprIf(',')) this.parseExpressions();
            this.parseSemi();
        }
    },

    parseExpressionForLabel: function(){
        // dont check for label if you can already see it'll fail
        var checkLabel = this.tok.is(IDENTIFIER);

        this.parsePrimary(checkLabel);

        // ugly but mandatory label check
        // if this is a label, the primary parser
        // will have bailed when seeing the colon.
        if (checkLabel && this.tok.nextIf(':')) {
            this.parseStatement();
            return true;
        }

        // assignment ops are allowed until the first non-assignment binary op
        while (this.parseAssignmentOperator()) {
            this.parsePrimaryAfter();
        }

        // keep parsing non-assignment binary/ternary ops
        while (this.parseBinaryOperator()) {
            if (this.tok.is('?')) this.parseTernary();
            else this.parsePrimaryAfter();
        }
    },

    parseExpressions: function(){
        do {
            this.parseExpression();
        } while (this.tok.nextExprIf(','));
    },
    parseExpression: function(){
        this.parsePrimary();

        // assignment ops are allowed until the first non-assignment binary op
        while (this.parseAssignmentOperator()) {
            this.parsePrimaryAfter();
        }

        // keep parsing non-assignment binary/ternary ops
        while (this.parseBinaryOperator()) {
            if (this.tok.is('?')) this.parseTernary();
            else this.parsePrimaryAfter();
        }
    },
    parseTernary: function(){
        this.tok.nextExpr();
        this.parseExpression();
        this.tok.mustBe(':',true);
        this.parseExpression();
    },
    parsePrimaryAfter: function(){
        this.tok.nextExpr();
        this.parsePrimary();
    },
    parseExpressionsNoIn: function(){
        do {
            this.parseExpressionNoIn();
        } while (this.tok.nextExprIf(','));
    },
    parseExpressionNoIn: function(){
        var parsedAssignment = false; // not allowed in for-in
        this.parsePrimary();

        // assignment ops are allowed until the first non-assignment binary op
        while (this.parseAssignmentOperator() && !this.tok.is('in')) {
            this.tok.nextExpr();
            this.parsePrimary();
            parsedAssignment = true; // wruh-oh
        }

        // keep parsing non-assignment binary ops
        while (this.parseBinaryOperator() && !this.tok.is('in')) {
            if (this.tok.is('?')) this.parseTernary();
            else this.parsePrimaryAfter();
        }

        return parsedAssignment;
    },
    parsePrimary: function(checkLabel){
        // parses parts of an expression without any binary operators

        this.parseUnary();

        if (this.tok.is('function')) {
            this.parseFunction();
        } else if (!this.tok.nextIf(VALUE)) {
            if (this.tok.nextExprIf('[')) this.parseArray();
            else if (this.tok.nextIf('{')) this.parseObject();
            else if (this.tok.nextExprIf('(')) this.parseGroup();
        } else if (checkLabel) {
            // now's the time... you just ticked off an identifier, check the current token for being a colon!
            if (this.tok.is(':')) return;
        }

        this.parsePrimarySuffixes();
    },
    parseUnary: function(){
        // start with unary
        var rex = /^(?:delete|void|typeof|new|\+\+?|--?|~|!)$/;
        if (rex.test(this.tok.getLastValue())) {
            do {
                this.tok.nextExpr();
            } while (!this.tok.is(EOF) && rex.test(this.tok.getLastValue()));
        }
    },
    parsePrimarySuffixes: function(){
        // --
        // ++
        // .<idntf>
        // [<exprs>]
        // (<exprs>)

        while (true) {
            if (this.tok.nextIf('.')) {
                this.tok.mustBe(IDENTIFIER);
            }
            else if (this.tok.nextExprIf('(')) {
                this.parseExpressions();
                this.tok.mustBe(')');
            }
            else if (this.tok.nextExprIf('[')) {
                this.parseExpressions();
                this.tok.mustBe(']');
            }
            else if (this.tok.nextIf('--')) break; // ends primary expressions
            else if (this.tok.nextIf('++')) break; // ends primary expressions
            else break;
        }
    },
    parseAssignmentOperator: function(){
        // includes any "compound" operator

        var val = this.tok.getLastValue();
        return (/^(?:[+*%&|^\/-]|<<|>>>?)?=$/.test(val));
    },
    parseBinaryOperator: function(){
        // non-assignment binary operator
        var val = this.tok.getLastValue();
        return (/^(?:[+*%|^&?\/-]|[=!]==?|<=|>=|<<?|>>?>?|&&|instanceof|in|\|\|)$/.test(val));
    },

    parseGroup: function(){
        this.parseExpressions();
        this.tok.mustBe(')');
    },
    parseArray: function(){
        do {
            this.parseExpressions();
        } while (this.tok.nextExprIf(',')); // elision

        this.tok.mustBe(']');
    },
    parseObject: function(){
        do {
            if (this.tok.is(VALUE)) this.parsePair();
        } while (this.tok.nextExprIf(',')); // elision
        this.tok.mustBe('}');
    },
    parsePair: function(){
        if (this.tok.nextIf('get')) {
            if (this.tok.is(IDENTIFIER)) this.parseFunction();
            else this.parseDataPart();
        } else if (this.tok.nextIf('set')) {
            if (this.tok.is(IDENTIFIER)) this.parseFunction();
            else this.parseDataPart();
        } else {
            this.parseData();
        }
    },
    parseData: function(){
        this.tok.next();
        this.parseDataPart();
    },
    parseDataPart: function(){
        this.tok.mustBe(':',true);
        this.parseExpression();
    },
};


})(typeof window == 'undefined' ? module.exports : window);
