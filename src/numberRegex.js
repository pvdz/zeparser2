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
    var regex = '/'+body+'/gi';
    regex = eval(regex);

    if (!testing) return regex;

    // test cases...

    var regex = '/^'+body+'$/i';


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
