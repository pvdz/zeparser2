var getStringBodyRegex = function(quote, testing){
    // unicode hex escape+any-char non-newline-char
    var parts = [
        '\\\\u[\\da-f]{4,}',
        '\\\\x[\\da-f]{2,}',
        '\\\\.',
        '[^\\n]'
    ];
    var body = parts.map(function(part){
        return '(?:'+part+')';
    }).join('|');

    var regex = '/^(?:'+body+')*'+quote+'/im'+(!testing?'g':'');
    regex = eval(regex);

    if (!testing) return regex;

    // rest is just for running tests...

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
