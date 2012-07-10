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
 // ## Start of file: par-solo.js
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

var lookup = [,
    'whitespace',
    'lineterminator',
    'comment_single',
    'comment_multi',
    'string_single',
    'string_multi',
    'number',
    'regex',
    'punctuator',
    'string',
    'numeric_dec',
    'numeric_hex',
    'identifier',
    'eof',
    'asi',
    'error',
    'value'
];

exports.ParSolo = function(input, options){

    options = options || {};

    var tokenCount = 0;
    var tokens = [];

    var pos = 0;

    // replace windows' CRLF with a single LF, as well as the weird newlines. this fixes positional stuff.
    var normalizeNewlines = /(?:\u000D\u000A)|[\u000d\u2028\u2029]/g;
    // some are so complex that we build them to keep our own sanity
    // get start from next four bytes (substringing)
    var startSubstring = getSubstringStartRegex();
    // get the remainder of a string literal, after the opening quote
    var stringBodySingle = getStringBodyRegex('\'');
    var stringBodyDouble = getStringBodyRegex('"');
    // full number parser, both decimal and hex
    var numbers = getNumberRegex();
    // full identifier, except for non-ascii ranged characters...
    var rexIdentifier = /(?:[\w\d$]|(?:\\u(?:[\da-f]){4}))+/ig; // note: \w also includes underscore
    var regexH = /[\da-f]/i;


    // normalized input means all the newlines have been normalized to just '\n'
    // this makes searching strings and comments for newlines much faster/simpler
    // and it makes the position being reported properly. it does mean that, due
    // to the desync of original input and normalized input for windows style
    // line terminators (two characters; cr+lf), the tokenizer cannot properly
    // maintain the original type of newline...
    var normalizedInput = (input||'').replace(normalizeNewlines, '\n');

    // parser can look at these positions to see where in the input the last token was
    // this way the tokenizer can simply return number-constants-as-types.
    var lastStart = null;
    var lastStop = null;
    var lastType = null;
    var lastValue = null;
    var lastNewline = null;


    function is(v){
        if (typeof v == 'number') {
            if (v === VALUE) return lastType === STRING || lastType === NUMBER || lastType === REGEX || lastType === IDENTIFIER;
            return lastType == v;
        }
        return getLastValue() == v;
    }

    function nextIf(value){
        var equals = is(value);
        if (equals) next();
        return equals;
    }

    function nextExprIf(value){
        var equals = is(value);
        if (equals) next(true);
        return equals;
    }

    function mustBe(value, nextIsExpr){
        if (is(value)) {
            if (nextIsExpr) nextExpr();
            else next();
        } else {
            throw 'A syntax error at pos='+pos+" expected "+(typeof value == 'number' ? 'type='+lookup[value] : 'value=`'+value+'`')+' is `'+getLastValue()+'` ('+lookup[lastType]+') #### `'+normalizedInput.substring(pos-2000, pos+2000)+'`';
        }
    }

    function nextExpr(){
        return next(true);
    }

    function next(expressionStart){
        lastValue = null;
        lastNewline = false;

        if (pos >= normalizedInput.length) {
            lastType = EOF;
            lastStart = lastStop = pos;
            return EOF;
        }

        do {
            lastStart = pos;
            var type = nextWhiteToken(expressionStart);
            lastStop = pos;

            //tokens.push({type:type, /*value:getLastValue(),*/ start:lastStart, stop:pos});

//            console.log('token:', type, Tok[type], '`'+normalizedInput.substring(lastStart, pos).replace(/\n/g,'\u23CE')+'`');
        } while (type === true);

        return lastType = type;
    }

    function nextWhiteToken(expressionStart){
        lastValue = null;
        if (pos >= normalizedInput.length) return EOF;

        var nextStart = normalizedInput.substring(pos,pos+4);
        var part = startSubstring.exec(nextStart);

        ++tokenCount;

        if (part[WHITE_SPACE]) return whitespace();
        if (part[LINETERMINATOR]) return lineTerminator();
        if (part[COMMENT_SINGLE]) return commentSingle();
        if (part[COMMENT_MULTI]) return commentMulti();
        if (part[STRING_SINGLE]) return stringSingle();
        if (part[STRING_DOUBLE]) return stringDouble();
        if (part[NUMBER]) return number();
        if (expressionStart && part[REGEX]) return regex();
        // in case this is not an expression start, regex is a punctuator (division operator)
        if (part[PUNCTUATOR] || part[REGEX]) return punctuator(part[REGEX] || part[PUNCTUATOR]);

        return identifierOrBust();
    }

    function whitespace(){
        ++pos;
        return true;
    }

    function lineTerminator(){
        lastNewline = true;
        pos++;
//        var input = normalizedInput;
//        if (input[pos] == '\r' && input[pos+1] == '\n') ++pos;
        return true;
    }

    function commentSingle(){
        pos = normalizedInput.indexOf('\n', pos);
        if (pos == -1) pos = normalizedInput.length;
        return true;
    }

    function commentMulti(){
        var end = normalizedInput.indexOf('*/',pos+2)+2;
        if (end == -1) throw new Error('Unable to find end of multiline comment started on pos '+pos);
        pos = end;
        return true;
    }

    function stringSingle(){
        return string(stringBodySingle);
    }

    function stringDouble(){
        return string(stringBodyDouble);
    }

    function string(regex){
        regex.lastIndex = pos; // start from here...
        var matches = regex.test(normalizedInput);

        if (!matches) throw new Error('String not terminated or contained invalid escape, started at '+pos);

        // i just wanna know where it ended...
        pos = regex.lastIndex;

        // since the leading quote is part of the match, we know that the match
        // started at pos, no need to check for that. (otherwise we would have had to check)

        // actual type doesnt matter for now...
        return STRING;
    }

    function number(){
        // numeric is either a decimal or hex
        // 0.1234  .123  .0  0.  0e12 0e-12 0e12+ 0.e12 0.1e23 0xdeadbeeb
        var regex = numbers;

        regex.lastIndex = pos;
        var matches = regex.test(normalizedInput);

        if (!matches) throw new Error('Invalid number parsed, starting at '+pos);

        // we dont have to check whether the first character is part of the match because we already know
        // that it is a zero and therefor has to be part of the match.

        pos = regex.lastIndex;

        return NUMBER;
    }

    function regex(){
        // /foo/
        // /foo[xyz]/
        // /foo(xyz)/
        // /foo{xyz}/
        // /foo(?:foo)/
        // /foo(!:foo)/
        // /foo(?!foo)bar/
        // /foo\dbar/

        pos++;
        regexBody();
        regexFlags();

        return REGEX;
    }

    function regexBody(){
        var input = normalizedInput;
        while (pos < input.length) {
            switch (input.charAt(pos++)) {
                case '\n':
                    throw new Error('Newline not allowed in regular expression at '+(pos-1));
                case '\\':
                    if (input.charAt(pos++) == '\n') throw new Error('Newline can not be escaped in regular expression at '+(pos-1));
                    break;
                case '(':
                    regexBody();
                    break;
                case ')':
                    return;
                case '[':
                    regexClass();
                    break;
                case '/':
                    return;
//                default:
//                    console.log("ignored", input[pos-1]);
            }
        }

        throw new Error('Unterminated regular expression at eof');
    }

    function regexClass(){
        var input = normalizedInput;
        do {
            switch (input.charAt(pos++)) {
                case '\n': throw new Error('Newline can not be escaped in regular expression at '+(pos-1));
                case '\\':
                    if (input.charAt(pos) == '\n') throw new Error('Newline can not be escaped in regular expression at '+pos);
                    ++pos;
                    break;
                case ']':
                    return;
            }
        } while (pos <= input.length);

        throw new Error('Unterminated regular expression at eof');
    }

    function regexFlags(){
        var input = normalizedInput;
        var rex = rexIdentifier;
        while (pos < input.length) {
            var c = input.charAt(pos);
            rex.lastIndex = 0;
            if (rex.test(c)) ++pos;
            else if (c == '\\') {
                // it can be a unicode escape...
                // manually excavating this edge case
                var posx = pos+1;
                if (input.charAt(posx) == 'u' && regexH.test(input.charAt(posx+1)) && regexH.test(input.charAt(posx+2)) && regexH.test(input.charAt(posx+3)) && regexH.test(input.charAt(posx+4))) {
                    pos += 6;
                } else {
                    return;
                }
            }
            else return;
        }
    }

    function punctuator(str){
        pos += str.length;

        return PUNCTUATOR;
    }

    function identifierOrBust(){
        var result = identifier();
        if (result === false) throw 'Expecting identifier here at pos '+pos;
        return result;
    }

    function identifier(){
        var regex = rexIdentifier;

        regex.lastIndex = pos;
        regex.test(normalizedInput);
        var end = regex.lastIndex;
        if (!end) return false;

        // regex might have skipped some characters at first, make sure the first character is part of the match
        regex.lastIndex = 0;
        if (!regex.test(normalizedInput.charAt(pos))) {
            // also have to check for unicode escape as start...
            if (normalizedInput.charAt(pos) != '\\' || !regex.test(normalizedInput.substring(pos,6))) {
                return false;
            }
        }

        pos = end;

        return IDENTIFIER;
    }

    function getLastValue(){
        return lastValue || (lastValue = normalizedInput.substring(lastStart, lastStop));
    }

    function debug(){
        return '`'+getLastValue()+'` @ '+pos+' ('+lookup[lastType]+')';
    }



// ##########################
// ######### parser #########
// ##########################

    function run(){
        // prepare
        nextExpr();

        // go!
        parseStatements();
    }

    function parseStatements(){
        var protect = 100000;
        while (--protect && !is(EOF) && parseStatement());
        if (!protect) throw 'loop protection triggered '+debug();
    }

    function parseStatement(){
        if (is(IDENTIFIER)) {
            switch (getLastValue()) {
                case 'var': parseVar(); break;
                case 'if': parseIf(); break;
                case 'do': parseDo(); break;
                case 'while': parseWhile(); break;
                case 'for': parseFor(); break;
                case 'continue': parseContinue(); break;
                case 'break': parseBreak(); break;
                case 'return': parseReturn(); break;
                case 'throw': parseThrow(); break;
                case 'switch': parseSwitch(); break;
                case 'try': parseTry(); break;
                case 'debugger': parseDebugger(); break;
                case 'with': parseWith(); break;
                case 'function': parseFunction(); break;
                default:
                    if (
                        is('case') ||
                        is('default')
                    ) {
                        // case and default are handled elsewhere
                        return false;
                    }

                    parseExpressionOrLabel();
                    break;
            }

            return true;
        }

        if (
            is(VALUE) ||
            is('(') ||
            is('[') ||
            is('++') ||
            is('--') ||
            is('+') ||
            is('-') ||
            is('~') ||
            is('!')
        ) {
            return parseExpressionStatement();
        }

        if (nextExprIf('{')) return parseBlock();
        if (nextExprIf(';')) return true; // empty statement
        if (is(EOF)) return false;
    }

    function parseStatementHeader(){
        mustBe('(', true);
        parseExpressions();
        mustBe(')', true);
    }

    function parseVar(){
        // var <vars>
        // - foo
        // - foo=bar
        // - ,foo=bar

        next();
        do {
            mustBe(IDENTIFIER, true);
            if (nextExprIf('=')) {
                parseExpression();
            }
        } while(nextIf(','));
        parseSemi();

        return true;
    }

    function parseVarPartNoIn(){
        next();
        do {
            mustBe(IDENTIFIER,true);
            if (nextExprIf('=')) {
                parseExpressionNoIn();
            }
        } while(nextIf(','));
    }

    function parseIf(){
        // if (<exprs>) <stmt>
        // if (<exprs>) <stmt> else <stmt>

        next();
        parseStatementHeader();
        parseStatement();

        parseElse();

        return true;
    }

    function parseElse(){
        // else <stmt>;

        if (nextIf('else')) {
            parseStatement();
        }
    }

    function parseDo(){
        // do <stmt> while ( <exprs> ) ;

        nextExpr();
        parseStatement();
        mustBe('while');
        mustBe('(');
        parseExpressions();
        mustBe(')');
        parseSemi();
    }

    function parseWhile(){
        // while ( <exprs> ) <stmt>

        next();
        parseStatementHeader();
        parseStatement();
    }

    function parseFor(){
        // for ( <expr-no-in-=> in <exprs> ) <stmt>
        // for ( var <idntf> in <exprs> ) <stmt>
        // for ( var <idntf> = <exprs> in <exprs> ) <stmt>
        // for ( <expr-no-in> ; <expr> ; <expr> ) <stmt>

        // need to excavate this... investigate specific edge cases for `for-in`

        next();
        mustBe('(');

        var parsedAssignment = false;
        if (is('var')) parseVarPartNoIn();
        else parsedAssignment = parseExpressionsNoIn();

        if (nextIf(';')) parseForEach();
        else {
            if (parsedAssignment) {
                // TOFIX: this is a syntax error...
                console.warn("Syntax error, illegal assignment in for-in", debug());
            }
            parseForIn();
        }
    }

    function parseForEach(){
        // <expr> ; <expr> ) <stmt>

        parseExpressions();
        mustBe(';');
        parseExpressions();
        mustBe(')');
        parseStatement();
    }

    function parseForIn(){
        // in <exprs> ) <stmt>

        mustBe('in');
        parseExpressions();
        mustBe(')');
        parseStatement();
    }

    function parseContinue(){
        // continue ;
        // continue <idntf> ;
        // newline right after keyword = asi

        next();
        if (lastNewline) addAsi();
        else {
            nextIf(IDENTIFIER);
            parseSemi();
        }
    }

    function parseBreak(){
        // break ;
        // break <idntf> ;
        // newline right after keyword = asi

        next();
        if (lastNewline) addAsi();
        else {
            nextIf(IDENTIFIER);
            parseSemi();
        }
    }

    function parseReturn(){
        // return ;
        // return <exprs> ;
        // newline right after keyword = asi

        nextExpr();
        if (lastNewline) addAsi();
        else {
            parseExpressions();
            parseSemi();
        }
    }

    function parseThrow(){
        // throw <exprs> ;

        nextExpr();
        if (lastNewline) addAsi();
        else {
            parseExpressions();
            parseSemi();
        }
    }

    function parseSwitch(){
        // switch ( <exprs> ) { <switchbody> }

        next();
        parseStatementHeader();
        mustBe('{', true);
        parseSwitchBody();
        mustBe('}');
    }

    function parseSwitchBody(){
        // [<cases>] [<default>] [<cases>]

        // default can go anywhere...
        parseCases();
        if (nextIf('default')) {
            parseDefault();
            parseCases();
        }
    }

    function parseCases(){
        while (nextIf('case',true)) {
            parseCase();
        }
    }

    function parseCase(){
        // case <value> : <stmts-no-case-default>
        parseExpressions();
        mustBe(':',true);
        parseStatements();
    }

    function parseDefault(){
        // default <value> : <stmts-no-case-default>
        mustBe(':',true);
        parseStatements();
    }

    function parseTry(){
        // try { <stmts> } catch ( <idntf> ) { <stmts> }
        // try { <stmts> } finally { <stmts> }
        // try { <stmts> } catch ( <idntf> ) { <stmts> } finally { <stmts> }

        next();
        parseCompleteBlock();

        var one = parseCatch();
        var two = parseFinally();

        if (!one && !two) throw 'Try must have at least a catch or finally block or both: '+debug();
    }

    function parseCatch(){
        // catch ( <idntf> ) { <stmts> }

        if (nextIf('catch')) {
            mustBe('(');
            mustBe(IDENTIFIER);
            mustBe(')');
            parseCompleteBlock();

            return true;
        }
    }

    function parseFinally(){
        // finally { <stmts> }

        if (nextIf('finally')) {
            parseCompleteBlock();

            return true;
        }
    }

    function parseDebugger(){
        // debugger ;

        next();
        parseSemi();
    }

    function parseWith(){
        // with ( <exprs> ) <stmts>

        next();
        parseStatementHeader();
        parseStatement();
    }

    function parseFunction(hasName){
        // function [<idntf>] ( [<param>[,<param>..] ) { <stmts> }

        next(); // 'function'
        nextIf(IDENTIFIER); // name
        parseFunctionRemainder();
    }

    function parseNamedFunction(hasName){
        // function [<idntf>] ( [<param>[,<param>..] ) { <stmts> }

        next(); // 'function'
        mustBe(IDENTIFIER); // name
        parseFunctionRemainder();
    }

    function parseFunctionRemainder(){
        mustBe('(');
        parseParameters();
        mustBe(')');
        parseCompleteBlock();
    }

    function parseParameters(){
        // [<idntf> [, <idntf>]]

        if (nextIf(IDENTIFIER)) {
            while (nextIf(',')) {
                mustBe(IDENTIFIER);
            }
        }
    }

    function parseBlock(){
        parseStatements();
        mustBe('}', true);
        return true;
    }

    function parseCompleteBlock(){
        mustBe('{', true);
        parseBlock();
    }

    function parseSemi(){
        if (nextIf(';')) return PUNCTUATOR;
        if (parseAsi()) return ASI;
        throw 'Unable to parse semi, unable to apply ASI: '+debug()+' #### '+
            normalizedInput.substring(lastStart-2000, lastStart)+
            '###'+
            normalizedInput.substring(lastStart, lastStart+2000);
    }

    function parseAsi(){
        if (is(EOF) || is('}') || lastNewline) {
            return addAsi();
        }
        return false;

        // need to fix the newline-in-comment-or-string one...
    }

    function addAsi(){
//        console.log("Aplying ASI");
        ++tokenCount;
        return ASI;
    }

    function parseExpressionStatement(){
        parseExpressions();
        parseSemi();

        return true;
    }

    function parseExpressionOrLabel(){
        var found = parseExpressionForLabel();
        if (!found) {
            if (nextExprIf(',')) parseExpressions();
            parseSemi();
        }
    }

    function parseExpressionForLabel(){
        // dont check for label if you can already see it'll fail
        var checkLabel = is(IDENTIFIER);

        parsePrimary(checkLabel);

        // ugly but mandatory label check
        // if this is a label, the primary parser
        // will have bailed when seeing the colon.
        if (checkLabel && nextIf(':')) {
            parseStatement();
            return true;
        }

        // assignment ops are allowed until the first non-assignment binary op
        while (parseAssignmentOperator()) {
            parsePrimaryAfter();
        }

        // keep parsing non-assignment binary/ternary ops
        while (parseBinaryOperator()) {
            if (is('?')) parseTernary();
            else parsePrimaryAfter();
        }
    }

    function parseExpressions(){
        do {
            parseExpression();
        } while (nextExprIf(','));
    }

    function parseExpression(){
        parsePrimary();

        // assignment ops are allowed until the first non-assignment binary op
        while (parseAssignmentOperator()) {
            parsePrimaryAfter();
        }

        // keep parsing non-assignment binary/ternary ops
        while (parseBinaryOperator()) {
            if (is('?')) parseTernary();
            else parsePrimaryAfter();
        }
    }

    function parseTernary(){
        nextExpr();
        parseExpression();
        mustBe(':',true);
        parseExpression();
    }

    function parsePrimaryAfter(){
        nextExpr();
        parsePrimary();
    }

    function parseExpressionsNoIn(){
        do {
            parseExpressionNoIn();
        } while (nextExprIf(','));
    }

    function parseExpressionNoIn(){
        var parsedAssignment = false; // not allowed in for-in
        parsePrimary();

        // assignment ops are allowed until the first non-assignment binary op
        while (parseAssignmentOperator() && !is('in')) {
            nextExpr();
            parsePrimary();
            parsedAssignment = true; // wruh-oh
        }

        // keep parsing non-assignment binary ops
        while (parseBinaryOperator() && !is('in')) {
            if (is('?')) parseTernary();
            else parsePrimaryAfter();
        }

        return parsedAssignment;
    }

    function parsePrimary(checkLabel){
        // parses parts of an expression without any binary operators

        parseUnary();

        if (is('function')) {
            parseFunction();
        } else if (!nextIf(VALUE)) {
            if (nextExprIf('[')) parseArray();
            else if (nextIf('{')) parseObject();
            else if (nextExprIf('(')) parseGroup();
        } else if (checkLabel) {
            // now's the time... you just ticked off an identifier, check the current token for being a colon!
            if (is(':')) return;
        }

        parsePrimarySuffixes();
    }

    function parseUnary(){
        // start with unary
        var rex = /^(?:delete|void|typeof|new|\+\+?|--?|~|!)$/;
        if (rex.test(getLastValue())) {
            do {
                nextExpr();
            } while (!is(EOF) && rex.test(getLastValue()));
        }
    }

    function parsePrimarySuffixes(){
        // --
        // ++
        // .<idntf>
        // [<exprs>]
        // (<exprs>)

        while (true) {
            if (nextIf('.')) {
                mustBe(IDENTIFIER);
            }
            else if (nextExprIf('(')) {
                parseExpressions();
                mustBe(')');
            }
            else if (nextExprIf('[')) {
                parseExpressions();
                mustBe(']');
            }
            else if (nextIf('--')) break; // ends primary expressions
            else if (nextIf('++')) break; // ends primary expressions
            else break;
        }
    }

    function parseAssignmentOperator(){
        // includes any "compound" operator

        var val = getLastValue();
        return (/^(?:[+*%&|^\/-]|<<|>>>?)?=$/.test(val));
    }

    function parseBinaryOperator(){
        // non-assignment binary operator
        var val = getLastValue();
        return (/^(?:[+*%|^&?\/-]|[=!]==?|<=|>=|<<?|>>?>?|&&|instanceof|in|\|\|)$/.test(val));
    }

    function parseGroup(){
        parseExpressions();
        mustBe(')');
    }

    function parseArray(){
        do {
            parseExpressions();
        } while (nextExprIf(',')); // elision

        mustBe(']');
    }

    function parseObject(){
        do {
            if (is(VALUE)) parsePair();
        } while (nextExprIf(',')); // elision
        mustBe('}');
    }

    function parsePair(){
        if (nextIf('get')) {
            if (is(IDENTIFIER)) parseFunction();
            else parseDataPart();
        } else if (nextIf('set')) {
            if (is(IDENTIFIER)) parseFunction();
            else parseDataPart();
        } else {
            parseData();
        }
    }

    function parseData(){
        next();
        parseDataPart();
    }

    function parseDataPart(){
        mustBe(':',true);
        parseExpression();
    }

    return {
        run:run,
        getTokenCount: function(){ return tokenCount; },
    };
};


})(typeof window == 'undefined' ? module.exports : window);
