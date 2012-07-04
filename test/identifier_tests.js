var regex = /[\w\d\$]+/;


var good = [
    'foo',
    '$foo',
    '$',
    '_foo',
    '_',
    'foo_',
    'foo$',
    'foo$bar',
    'foo_bar',
    'foo$_bar',
    'f15$',
];
var bad = [

];

good.forEach(function(s){
    if (regex.test(s)) console.log('okay: '+s);
    else console.warn('fail: '+s);
})
