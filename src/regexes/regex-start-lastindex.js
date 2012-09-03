// this builds the regex that determines which token to parse next
// it should be applied to the entire input with a proper offset
// set to lastIndex (which makes the regex start there, because it
// has the global flag set).

var getLastindexStartRegex = function(){
    // note: punctuators should be parsed long to short. regex picks longest first, parser wants that too.
    var punc = [
        '>>>=',
        '===','!==','>>>','<<=','>>=',
        '<=','>=','==','!=','\\+\\+','--','<<','>>','\\&\\&','\\|\\|','\\+=','-=','\\*=','%=','\\&=','\\|=','\\^=','\\/=',
        '\\{','\\}','\\(','\\)','\\[','\\]','\\.',';',',','<','>','\\+','-','\\*','%','\\|','\\&','\\|','\\^','!','~','\\?',':','=','\\/'
    ];

    // everything is wrapped in (<start>)?
    var starts = [
        '[ \\t\\u000B\\u000C\\u00A0\\uFFFF]', // whitespace
        '[\\u000A\\u000D\\u2028\\u2029]', // lineterminators
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
    var s = '/' + starts.map(function(start){ return '('+start+')?'; }).join('') + '/';

    // this regex, when applied, returns either null (=error) or a match for exactly one of the starts
    return s;
};
