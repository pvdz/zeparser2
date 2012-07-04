
var good = [
    // whitespace
    ' ',
    '\t',
    '\u000B',
    '\u000c',
    '\u00a0',
    '\uffff',
    // line terminators
    '\u000a',
    '\u000d',
    '\u000a\u000d',
    '\u2028',
    '\u2029',
    // comments
    '//',
    '/*',
    // strings
    '\'',
    '"',
    // numbers
    '.5',
    '0',
    // punctuators
    '/',
    '>>>=',
    '===','!==','>>>','<<=','>>=',
    '<=','>=','==','!=','++','--','<<','>>','&&','||','+=','-=','*=','%=','&=','|=','^=','/=',
    '','\',',')','[',']','.',';',',','<','>','+','-','*','%','|','&','|','','!','~','?',':','=','/',
    '\\udead', // identifier that starts with unicode escape
    'f',
    '$',
    '_'
];
var bad = [
    '`', // backtick
    '\u000d\u000a', // reversed windows newline
    '/ /',
    '/ *',
    '<<<=',
];

var regex = getLastindexStartRegex(true);
