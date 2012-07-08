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
