var getIdentifierRegex = function(testing){
    var chars = [
        // a letter or a digit
        // identifiers cannot start with a digit, this regex does NOT check for that
        '[\\w\\d$]', // \w includes underscores (_)
        // a full unicode escape (legal in identifiers)
        '(?:\\\\u(?:[\\da-f]){4})',
    ];

    var atom = chars.map(function(c){
        return '(?:'+c+')';
    }).join('|');

    var body = '(?:'+atom+')+';

    return new RegExp(body, 'ig');
};
