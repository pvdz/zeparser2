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
        '?:(\\/)[^=]', // regex
        punc.join('|')
    ];

    // basic structure: /^(token)?(token)?(token)?.../
    // match need to start left but might not match entire input part
    var s = '/^' + starts.map(function(start){ return '('+start+')?'; }).join('') + (testing?'$':'') + '/';
    var regex = eval(s);

    return regex;
};
