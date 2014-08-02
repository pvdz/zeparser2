(function(exports){
//######### uni.js #########
// http://qfox.nl/notes/155
// http://qfox.nl/notes/90
var frozen = false, uniRegex = exports.uni = /[\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u0487\u048a-\u0524\u0526\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0621-\u065e\u0660-\u0669\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07c0-\u07f5\u07fa\u0901-\u0939\u093c-\u094d\u0950-\u0954\u0958-\u0963\u0966-\u096f\u0971\u0972\u097b-\u097f\u0981-\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7\u09c8\u09cb-\u09ce\u09d7\u09dc\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a66-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5c\u0b5d\u0b5f-\u0b63\u0b66-\u0b6f\u0b71\u0b82\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c58\u0c59\u0c60-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0cde\u0ce0-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d60-\u0d63\u0d66-\u0d6f\u0d7a-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e50-\u0e59\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc\u0edd\u0f00\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f8b\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1049\u1050-\u1099\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc\u1100-\u1159\u115f-\u11a2\u11a8-\u11f9\u1200-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u1676\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772\u1773\u1780-\u17b3\u17b6-\u17d3\u17d7\u17dc\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1820-\u1877\u1880-\u18aa\u1900-\u191c\u1920-\u192b\u1930-\u193b\u1946-\u196d\u1970-\u1974\u1980-\u19a9\u19b0-\u19c9\u19d0-\u19d9\u1a00-\u1a1b\u1b00-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1baa\u1bae-\u1bb9\u1c00-\u1c37\u1c40-\u1c49\u1c4d-\u1c7d\u1d00-\u1de6\u1dfe-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffb\u203f\u2040\u2054\u2071\u207f\u2090-\u2094\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb\u2ced\u2cf2\u2d00-\u2d25\u2d30-\u2d65\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005-\u3007\u3021-\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u3099\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31b7\u31f0-\u31ff\u3400\u4db5\u4e00\u9fc3\ua000-\ua1af\ua60c\ua620-\ua629\ua640-\ua660\ua662-\ua66d\ua66f\ua67c\ua67d\ua67f-\ua697\ua717-\ua71f\ua722-\ua788\ua78b-\ua78d\ua790\ua792\ua7a0\ua7a2\ua7a4\ua7a6\ua7a8\ua7aa\ua802\ua806\ua80b\ua823-\ua827\ua880\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua900-\ua909\ua926-\ua92d\ua947-\ua953\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\ufb00-\ufb06\ufb13-\ufb17\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff70\uff9e\uff9f]/;
//######### end of uni.js #########
//######### tok.js #########
var this_tok_input =  '';
  var this_tok_len =  0;
  var this_tok_pos =  0;
  var this_tok_offset =  0;
  var this_tok_reachedEof =  false;
  var this_tok_options =  null;
  var this_tok_lastOffset =  0;
  var this_tok_lastStop =  0;
  var this_tok_lastLen =  0;
  var this_tok_lastType =  0;
  var this_tok_lastNewline =  false;
  var this_tok_firstTokenChar =  0;
  var this_tok_tokenCountAll =  0;
  var this_tok_tokenCountBlack =  0;
  var this_tok_tokens =  null;
  var this_tok_black =  null;
  function this_tok_getMoreInput(eofAllowed, extraLen){
var step = 1;
var v0;
var f0;
var had, A;
return function inside_this_tok_getMoreInput(thawValue){
  while (true) {
    switch (step) {
      case 1:
had = false;
      if (extraLen) { step = 3; continue; }
step = 2;
case 2:
 extraLen = 1;
step = 3;
case 3:
if (this_tok_reachedEof) { step = 6; continue; }
step = 5;
case 5:
// trunc the input, eliminating the consumed part
        if (!(this_tok_lastOffset > this_tok_offset)) { step = 9; continue; }
step = 8;
case 8:
this_tok_input = this_tok_input.slice(this_tok_lastOffset - this_tok_offset);
          this_tok_offset = this_tok_lastOffset;
case 9:
case 11:
step = 13;
return (frozen = true), (undefined);
case 13:
had = thawValue;
          if (!had) { step = 15; continue; }
step = 14;
case 14:
// note: this is why you cant cache this.input
            this_tok_input += had;
            extraLen -= had.length;
step = 15;
case 15:
   A = had !== false ;
if (!A) { step = 18; continue; }
step = 17;
case 17:
 A =  extraLen > 0; 
step = 18;
case 18:
if (A) { step = 11; continue; }
step = 12;
case 12:
// note: this is why you cant cache this.len
        this_tok_len = this_tok_offset + this_tok_input.length;
step = 6;
case 6:
if (had !== false) { step = 21; continue; }
step = 20;
case 20:
// if there was no more input, next time skip the freeze part
        this_tok_reachedEof = true;
        if (eofAllowed) { step = 24; continue; }
case 23:
 step = 26; case 26:
v0 = (f0 = f0 || this_tok_throwSyntaxError('Unexpected EOF'))(thawValue);
if (frozen) return v0;
else f0 = null;
case 27:
step = 24;
case 24:
return false;
step = 21;
case 21:
return true;
return;
      }
    }
  };
}
  function this_tok_updateInput(input){
var step = 1;
return function inside_this_tok_updateInput(thawValue){
  while (true) {
    switch (step) {
      case 1:
this_tok_input += input;
      this_tok_len += input.length;
return;
      }
    }
  };
}
  function this_tok_waitForInput(){
var step = 1;
return function inside_this_tok_waitForInput(thawValue){
  while (true) {
    switch (step) {
      case 1:
// noop
      return false;
return;
      }
    }
  };
}
  function this_tok_nextExprIfNum(num){
var step = 1;
var v0;
var f0;
var equals;
return function inside_this_tok_nextExprIfNum(thawValue){
  while (true) {
    switch (step) {
      case 1:
equals = this_tok_firstTokenChar === num;
      if (!equals) { step = 3; continue; }
case 2:
 step = 5; case 5:
v0 = (f0 = f0 || this_tok_next(true))(thawValue);
if (frozen) return v0;
else f0 = null;
case 6:
step = 3;
case 3:
return equals;
return;
      }
    }
  };
}
  function this_tok_nextPuncIfString(str){
var step = 1;
var v1, v0;
var f1, f0;
var equals;
return function inside_this_tok_nextPuncIfString(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2;
case 2:
v0 = (f0 = f0 || this_tok_getLastValue())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 equals = v0 === str;
      if (!equals) { step = 5; continue; }
case 4:
 step = 7; case 7:
v1 = (f1 = f1 || this_tok_next(false))(thawValue);
if (frozen) return v1;
else f1 = null;
case 8:
step = 5;
case 5:
return equals;
return;
      }
    }
  };
}
  function this_tok_nextExprIfString(str){
var step = 1;
var v1, v0;
var f1, f0;
var equals;
return function inside_this_tok_nextExprIfString(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2;
case 2:
v0 = (f0 = f0 || this_tok_getLastValue())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 equals = v0 === str;
      if (!equals) { step = 5; continue; }
case 4:
 step = 7; case 7:
v1 = (f1 = f1 || this_tok_next(true))(thawValue);
if (frozen) return v1;
else f1 = null;
case 8:
step = 5;
case 5:
return equals;
return;
      }
    }
  };
}
  function this_tok_mustBeNum(num, nextIsExpr){
var step = 1;
var v1, v0;
var f1, f0;
return function inside_this_tok_mustBeNum(thawValue){
  while (true) {
    switch (step) {
      case 1:
if (this_tok_firstTokenChar !== num) { step = 3; continue; }
case 2:
step = 5;
case 5:
v0 = (f0 = f0 || this_tok_next(nextIsExpr))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
return v0;
case 3:
step = 7; case 7:
v1 = (f1 = f1 || this_tok_throwSyntaxError('Expected char=' + String.fromCharCode(num) + ' ('+num+') got=' + String.fromCharCode(this_tok_firstTokenChar)+' ('+this_tok_firstTokenChar+')'))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
return;
      }
    }
  };
}
  function this_tok_mustBeIdentifier(nextIsExpr){
var step = 1;
var v1, v0;
var f1, f0;
return function inside_this_tok_mustBeIdentifier(thawValue){
  while (true) {
    switch (step) {
      case 1:
if (this_tok_lastType !== 13) { step = 3; continue; }
case 2:
step = 5;
case 5:
v0 = (f0 = f0 || this_tok_next(nextIsExpr))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
return v0;
case 3:
step = 7; case 7:
v1 = (f1 = f1 || this_tok_throwSyntaxError('Expecting current type to be IDENTIFIER but is '+typeToString[this_tok_lastType]+' ('+this_tok_lastType+')'))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
return;
      }
    }
  };
}
  function this_tok_mustBeString(str, nextIsExpr){
var step = 1;
var v3, v2, v1, v0;
var f3, f2, f1, f0;
return function inside_this_tok_mustBeString(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2;
case 2:
v0 = (f0 = f0 || this_tok_getLastValue())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
if (v0 !== str) { step = 5; continue; }
case 4:
step = 7;
case 7:
v1 = (f1 = f1 || this_tok_next(nextIsExpr))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
return v1;
case 5:
step = 11;
case 11:
v3 = (f3 = f3 || this_tok_getLastValue())(thawValue);
if (frozen) return v3;
else f3 = null;
case 12:
step = 9; case 9:
v2 = (f2 = f2 || this_tok_throwSyntaxError('Expecting current value to be ['+str+'] is ['+v3+']'))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 10;
case 10:
return;
      }
    }
  };
}
  function this_tok_next(expressionStart){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
var options, saveTokens, onToken, tokens, type, token;
return function inside_this_tok_next(thawValue){
  while (true) {
    switch (step) {
      case 1:
this_tok_lastNewline = false;
options = this_tok_options;
       saveTokens = options.saveTokens;
       onToken = options.onToken;
       tokens = this_tok_tokens;
case 2:
step = 4;
case 4:
v0 = (f0 = f0 || this_tok_nextAnyToken(expressionStart))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 5;
case 5:
 type = v0;
        if (!saveTokens) { step = 7; continue; }
case 6:
step = 9;
case 9:
v1 = (f1 = f1 || this_tok_getLastValue())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 10;
case 10:
 token = {type:type, value:v1, start:this_tok_lastOffset, stop:this_tok_pos, white:this_tok_tokenCountAll};
          tokens.push(token);
step = 7;
case 7:
if (!onToken) { step = 12; continue; }
case 11:
step = 14;
case 14:
v2 = (f2 = f2 || this_tok_getLastValue())(thawValue);
if (frozen) return v2;
else f2 = null;
step = 15;
case 15:
onToken(type, v2, this_tok_lastOffset, this_tok_pos, this_tok_tokenCountAll);
step = 12;
case 12:
++this_tok_tokenCountAll;
       if (type === 18) { step = 2; continue; }
step = 3;
case 3:
if (!saveTokens) { step = 17; continue; }
step = 16;
case 16:
token.black = this_tok_tokenCountBlack++;
        if (!(options.createBlackStream)) { step = 20; continue; }
step = 19;
case 19:
this_tok_black.push(token);
case 20:
step = 17;
case 17:
this_tok_lastType = type;
      return type;
return;
      }
    }
  };
}
  function this_tok_nextWhiteAfterNumber(){
var step = 1;
var v1, v0;
var f1, f0;
var count, type, A;
return function inside_this_tok_nextWhiteAfterNumber(thawValue){
  while (true) {
    switch (step) {
      case 1:
count = this_tok_tokenCountAll;
step = 2;
case 2:
v0 = (f0 = f0 || this_tok_next(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 type = v0;
        A = type === 13 ;
if (A) { step = 5; continue; }
step = 4;
case 4:
 A =  type === 7; 
step = 5;
case 5:
  A = (A) ;
if (!A) { step = 8; continue; }
step = 7;
case 7:
 A =  this_tok_tokenCountAll === count+1; 
step = 8;
case 8:
if (!A) { step = 11; continue; }
case 10:
step = 13; case 13:
v1 = (f1 = f1 || this_tok_throwSyntaxError('Must be at least one whitespace token between numbers and identifiers or other numbers'))(thawValue);
if (frozen) return v1;
else f1 = null;
case 14:
step = 11;
case 11:
return type;
return;
      }
    }
  };
}
  function this_tok_nextAnyToken(expressionStart){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
var fullStart, A, nextChar, type;
return function inside_this_tok_nextAnyToken(thawValue){
  while (true) {
    switch (step) {
      case 1:
// note: this is one of the most called functions of zeparser...
// note: the offset might change in the newline+space optim trick, so dont re-use it
       fullStart = this_tok_lastOffset = this_tok_pos;
A = fullStart >= this_tok_len ;
if (!A) { step = 3; continue; }
case 2:
step = 5;
case 5:
v0 = (f0 = f0 || this_tok_getMoreInput(true))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
A =  !v0; 
step = 3;
case 3:
if (!A) { step = 8; continue; }
step = 7;
case 7:
this_tok_firstTokenChar = 0;
        return 14;
case 8:
step = 10;
case 10:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(fullStart))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 11;
case 11:
 nextChar = this_tok_firstTokenChar = v1 | 0;
step = 12;
case 12:
v2 = (f2 = f2 || this_tok_nextTokenDeterminator(nextChar, expressionStart))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 13;
case 13:
 type = v2;
      this_tok_lastLen = (this_tok_lastStop = this_tok_pos) - this_tok_lastOffset;
return type;
return;
      }
    }
  };
}
  function this_tok_nextTokenDeterminator(c, expressionStart) {
var step = 1;
var v3, v2, v1, v0;
var f3, f2, f1, f0;
var b, A;
return function inside_this_tok_nextTokenDeterminator(thawValue){
  while (true) {
    switch (step) {
      case 1:
if (!(c < 0x31)) { step = 3; continue; }
case 2:
step = 5;
case 5:
v0 = (f0 = f0 || this_tok_nextTokenDeterminator_a(c, expressionStart))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
return v0;
step = 3;
case 3:
 b = c & 0xffdf; // clear 0x20. note that input string must be in range of utf-16, so 0xffdf will suffice.
        A = b >= 0x41 ;
if (!A) { step = 8; continue; }
step = 7;
case 7:
 A =  b <= 0x5a; 
step = 8;
case 8:
if (!A) { step = 11; continue; }
case 10:
step = 13;
case 13:
v1 = (f1 = f1 || this_tok_parseIdentifier())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 14;
case 14:
return v1;
step = 11;
case 11:
if (!(c > 0x39)) { step = 16; continue; }
case 15:
step = 18;
case 18:
v2 = (f2 = f2 || this_tok_nextTokenDeterminator_b(c))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 19;
case 19:
return v2;
case 16:
step = 20;
case 20:
v3 = (f3 = f3 || this_tok_parseDecimalNumber())(thawValue);
if (frozen) return v3;
else f3 = null;
step = 21;
case 21:
return v3;
return;
      }
    }
  };
}
  function this_tok_nextTokenDeterminator_a(c, expressionStart) {
var step = 1;
var v14, v13, v12, v11, v10, v9, v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f14, f13, f12, f11, f10, f9, f8, f7, f6, f5, f4, f3, f2, f1, f0;
var switchValue, matched, fellThrough;
return function inside_this_tok_nextTokenDeterminator_a(thawValue){
  while (true) {
    switch (step) {
      case 1:
fellThrough = false;
matched = false;
switchValue =  (c) 
        ;
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x20)))))) { step = 2; continue; }
 // note: many spaces are caught by immediate newline checks (see parseCR and parseVerifiedNewline)
          return ++this_tok_pos,(18);
        ;
fellThrough = true;
step = 2;
case 2:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x2e)))))) { step = 3; continue; }
step = 4;
case 4:
v0 = (f0 = f0 || this_tok_parseLeadingDot())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 5;
case 5:
return v0;
        ;
fellThrough = true;
step = 3;
case 3:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x28)))))) { step = 6; continue; }
return ++this_tok_pos,(9);
        ;
fellThrough = true;
step = 6;
case 6:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x29)))))) { step = 7; continue; }
return ++this_tok_pos,(9);
        ;
fellThrough = true;
step = 7;
case 7:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x0D)))))) { step = 8; continue; }
step = 9;
case 9:
v1 = (f1 = f1 || this_tok_parseCR())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 10;
case 10:
return v1;
        ;
fellThrough = true;
step = 8;
case 8:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x0A)))))) { step = 11; continue; }
step = 12;
case 12:
v2 = (f2 = f2 || this_tok_parseVerifiedNewline(this_tok_pos, 0))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 13;
case 13:
return v2;
        ;
fellThrough = true;
step = 11;
case 11:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x2c)))))) { step = 14; continue; }
return ++this_tok_pos,(9);
        ;
fellThrough = true;
step = 14;
case 14:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x09)))))) { step = 15; continue; }
return ++this_tok_pos,(18);
        ;
fellThrough = true;
step = 15;
case 15:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x22)))))) { step = 16; continue; }
step = 17;
case 17:
v3 = (f3 = f3 || this_tok_parseDoubleString())(thawValue);
if (frozen) return v3;
else f3 = null;
step = 18;
case 18:
return v3;
        ;
fellThrough = true;
step = 16;
case 16:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x2b)))))) { step = 19; continue; }
step = 20;
case 20:
v4 = (f4 = f4 || this_tok_parseSameOrCompound(c))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 21;
case 21:
return v4;
        ;
fellThrough = true;
step = 19;
case 19:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x30)))))) { step = 22; continue; }
step = 23;
case 23:
v5 = (f5 = f5 || this_tok_parseLeadingZero())(thawValue);
if (frozen) return v5;
else f5 = null;
step = 24;
case 24:
return v5;
        ;
fellThrough = true;
step = 22;
case 22:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x2f)))))) { step = 25; continue; }
step = 26;
case 26:
v6 = (f6 = f6 || this_tok_parseFwdSlash(expressionStart))(thawValue);
if (frozen) return v6;
else f6 = null;
step = 27;
case 27:
return v6;
        ;
fellThrough = true;
step = 25;
case 25:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x21)))))) { step = 28; continue; }
step = 29;
case 29:
v7 = (f7 = f7 || this_tok_parseEqualSigns())(thawValue);
if (frozen) return v7;
else f7 = null;
step = 30;
case 30:
return v7;
        ;
fellThrough = true;
step = 28;
case 28:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x26)))))) { step = 31; continue; }
step = 32;
case 32:
v8 = (f8 = f8 || this_tok_parseSameOrCompound(c))(thawValue);
if (frozen) return v8;
else f8 = null;
step = 33;
case 33:
return v8;
        ;
fellThrough = true;
step = 31;
case 31:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x2d)))))) { step = 34; continue; }
step = 35;
case 35:
v9 = (f9 = f9 || this_tok_parseSameOrCompound(c))(thawValue);
if (frozen) return v9;
else f9 = null;
step = 36;
case 36:
return v9;
        ;
fellThrough = true;
step = 34;
case 34:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x27)))))) { step = 37; continue; }
step = 38;
case 38:
v10 = (f10 = f10 || this_tok_parseSingleString())(thawValue);
if (frozen) return v10;
else f10 = null;
step = 39;
case 39:
return v10;
        ;
fellThrough = true;
step = 37;
case 37:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x2a)))))) { step = 40; continue; }
step = 41;
case 41:
v11 = (f11 = f11 || this_tok_parseCompoundAssignment())(thawValue);
if (frozen) return v11;
else f11 = null;
step = 42;
case 42:
return v11;
        ;
fellThrough = true;
step = 40;
case 40:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x24)))))) { step = 43; continue; }
step = 44;
case 44:
v12 = (f12 = f12 || this_tok_parseIdentifier())(thawValue);
if (frozen) return v12;
else f12 = null;
step = 45;
case 45:
return v12;
        ;
fellThrough = true;
step = 43;
case 43:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x25)))))) { step = 46; continue; }
step = 47;
case 47:
v13 = (f13 = f13 || this_tok_parseCompoundAssignment())(thawValue);
if (frozen) return v13;
else f13 = null;
step = 48;
case 48:
return v13;
        ;
fellThrough = true;
step = 46;
case 46:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x0C)))))) { step = 49; continue; }
return ++this_tok_pos,(18);
        ;
fellThrough = true;
step = 49;
case 49:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x0B)))))) { step = 50; continue; }
return ++this_tok_pos,(18);
step = 50;
case 50:
if (!fellThrough && matched) { step = 51; continue; }
// cannot be unicode because it's < ORD_L_A and ORD_L_A_UC
          step = 52; case 52:
v14 = (f14 = f14 || this_tok_throwSyntaxError('Unexpected character in token scanner... fixme! [' + c + ']'))(thawValue);
if (frozen) return v14;
else f14 = null;
case 53:
step = 1;
case 1:
return;
      }
    }
  };
}
  function this_tok_nextTokenDeterminator_b(c) {
var step = 1;
var v10, v9, v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f10, f9, f8, f7, f6, f5, f4, f3, f2, f1, f0;
var switchValue, matched, fellThrough;
return function inside_this_tok_nextTokenDeterminator_b(thawValue){
  while (true) {
    switch (step) {
      case 1:
fellThrough = false;
matched = false;
switchValue =  (c) 
        ;
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x3b)))))) { step = 2; continue; }
return ++this_tok_pos,(9);
        ;
fellThrough = true;
step = 2;
case 2:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x3d)))))) { step = 3; continue; }
step = 4;
case 4:
v0 = (f0 = f0 || this_tok_parseEqualSigns())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 5;
case 5:
return v0;
        ;
fellThrough = true;
step = 3;
case 3:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x7b)))))) { step = 6; continue; }
return ++this_tok_pos,(9);
        ;
fellThrough = true;
step = 6;
case 6:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x7d)))))) { step = 7; continue; }
return ++this_tok_pos,(9);
        ;
fellThrough = true;
step = 7;
case 7:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x5b)))))) { step = 8; continue; }
return ++this_tok_pos,(9);
        ;
fellThrough = true;
step = 8;
case 8:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x5d)))))) { step = 9; continue; }
return ++this_tok_pos,(9);
        ;
fellThrough = true;
step = 9;
case 9:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x3a)))))) { step = 10; continue; }
return ++this_tok_pos,(9);
        ;
fellThrough = true;
step = 10;
case 10:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x5f)))))) { step = 11; continue; }
step = 12;
case 12:
v1 = (f1 = f1 || this_tok_parseIdentifier())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 13;
case 13:
return v1;
        ;
fellThrough = true;
step = 11;
case 11:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x7c)))))) { step = 14; continue; }
step = 15;
case 15:
v2 = (f2 = f2 || this_tok_parseSameOrCompound(c))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 16;
case 16:
return v2;
        ;
fellThrough = true;
step = 14;
case 14:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x3f)))))) { step = 17; continue; }
return ++this_tok_pos,(9);
        ;
fellThrough = true;
step = 17;
case 17:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x3c)))))) { step = 18; continue; }
step = 19;
case 19:
v3 = (f3 = f3 || this_tok_parseLtgtPunctuator(c))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 20;
case 20:
return v3;
        ;
fellThrough = true;
step = 18;
case 18:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x3e)))))) { step = 21; continue; }
step = 22;
case 22:
v4 = (f4 = f4 || this_tok_parseLtgtPunctuator(c))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 23;
case 23:
return v4;
        ;
fellThrough = true;
step = 21;
case 21:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x5e)))))) { step = 24; continue; }
step = 25;
case 25:
v5 = (f5 = f5 || this_tok_parseCompoundAssignment())(thawValue);
if (frozen) return v5;
else f5 = null;
step = 26;
case 26:
return v5;
        ;
fellThrough = true;
step = 24;
case 24:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x7e)))))) { step = 27; continue; }
step = 28;
case 28:
v6 = (f6 = f6 || this_tok_parseCompoundAssignment())(thawValue);
if (frozen) return v6;
else f6 = null;
step = 29;
case 29:
return v6;
        ;
fellThrough = true;
step = 27;
case 27:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x2028)))))) { step = 30; continue; }
step = 31;
case 31:
v7 = (f7 = f7 || this_tok_parseVerifiedNewline(this_tok_pos, 0))(thawValue);
if (frozen) return v7;
else f7 = null;
step = 32;
case 32:
return v7;
        ;
fellThrough = true;
step = 30;
case 30:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x2029)))))) { step = 33; continue; }
step = 34;
case 34:
v8 = (f8 = f8 || this_tok_parseVerifiedNewline(this_tok_pos, 0))(thawValue);
if (frozen) return v8;
else f8 = null;
step = 35;
case 35:
return v8;
        ;
fellThrough = true;
step = 33;
case 33:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x5c)))))) { step = 36; continue; }
step = 37;
case 37:
v9 = (f9 = f9 || this_tok_parseBackslash())(thawValue);
if (frozen) return v9;
else f9 = null;
step = 38;
case 38:
return v9;
step = 36;
case 36:
if (!fellThrough && matched) { step = 39; continue; }
step = 40;
case 40:
v10 = (f10 = f10 || this_tok_parseOtherUnicode(c))(thawValue);
if (frozen) return v10;
else f10 = null;
step = 41;
case 41:
return v10;
step = 1;
case 1:
return;
      }
    }
  };
}
  function this_tok_parseOtherUnicode(c){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
return function inside_this_tok_parseOtherUnicode(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2;
case 2:
v0 = (f0 = f0 || this_tok_isExoticWhitespace(c))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
if (!v0) { step = 5; continue; }
step = 4;
case 4:
 return ++this_tok_pos,(18);
step = 5;
case 5:
if (!(uniRegex.test(String.fromCharCode(c)))) { step = 8; continue; }
case 7:
step = 10;
case 10:
v1 = (f1 = f1 || this_tok_parseIdentifier())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 11;
case 11:
return v1;
case 8:
step = 12; case 12:
v2 = (f2 = f2 || this_tok_throwSyntaxError('Unexpected character in token scanner... fixme! [' + c + ']'))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 13;
case 13:
return;
      }
    }
  };
}
  function this_tok_isExoticWhitespace(c){
var step = 1;
var switchValue, matched, fellThrough;
return function inside_this_tok_isExoticWhitespace(thawValue){
  while (true) {
    switch (step) {
      case 1:
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp
      // http://en.wikipedia.org/wiki/Whitespace_character
      // note that this is nearly the last line of defense and virtually never executed.
fellThrough = false;
matched = false;
switchValue =  (c) 
        ;
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0xA0)))))) { step = 2; continue; }
;
fellThrough = true;
step = 2;
case 2:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0xFEFF)))))) { step = 3; continue; }
;
fellThrough = true;
step = 3;
case 3:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x0085)))))) { step = 4; continue; }
 // NEL
        ;
fellThrough = true;
step = 4;
case 4:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x1680)))))) { step = 5; continue; }
;
fellThrough = true;
step = 5;
case 5:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x180e)))))) { step = 6; continue; }
 // not uni whitespace but accepted, regardless
        ;
fellThrough = true;
step = 6;
case 6:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x2000)))))) { step = 7; continue; }
;
fellThrough = true;
step = 7;
case 7:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x2001)))))) { step = 8; continue; }
;
fellThrough = true;
step = 8;
case 8:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x2002)))))) { step = 9; continue; }
;
fellThrough = true;
step = 9;
case 9:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x2003)))))) { step = 10; continue; }
;
fellThrough = true;
step = 10;
case 10:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x2004)))))) { step = 11; continue; }
;
fellThrough = true;
step = 11;
case 11:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x2005)))))) { step = 12; continue; }
;
fellThrough = true;
step = 12;
case 12:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x2006)))))) { step = 13; continue; }
;
fellThrough = true;
step = 13;
case 13:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x2007)))))) { step = 14; continue; }
;
fellThrough = true;
step = 14;
case 14:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x2008)))))) { step = 15; continue; }
;
fellThrough = true;
step = 15;
case 15:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x2009)))))) { step = 16; continue; }
;
fellThrough = true;
step = 16;
case 16:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x200a)))))) { step = 17; continue; }
//        case ORD_ZWS: // not accepted AFAICS
        ;
fellThrough = true;
step = 17;
case 17:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x202f)))))) { step = 18; continue; }
;
fellThrough = true;
step = 18;
case 18:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x205f)))))) { step = 19; continue; }
;
fellThrough = true;
step = 19;
case 19:
if (!(fellThrough || (!matched && (matched = (switchValue === ( 0x3000)))))) { step = 20; continue; }
return true;
case 20:
step = 1;
case 1:
return false;
return;
      }
    }
  };
}
  function this_tok_parseBackslash(){
var step = 1;
var v1, v0;
var f1, f0;
return function inside_this_tok_parseBackslash(thawValue){
  while (true) {
    switch (step) {
      case 1:
// this is currently causing the top test to fail
      step = 2; case 2:
v0 = (f0 = f0 || this_tok_parseAndValidateUnicodeAsIdentifier(this_tok_pos, true))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 // TOFIX: replace bool with constant, figure out why dropping input here only doesnt affect tests (missing test)
      this_tok_pos += 6;
// parseIdentifierRest assumes the first char still needs to be consumed, if we dont rewind the next char is consumed unchecked
      --this_tok_pos;
step = 4;
case 4:
v1 = (f1 = f1 || this_tok_parseIdentifierRest())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 5;
case 5:
this_tok_pos = v1;
      return 13;
return;
      }
    }
  };
}
  function this_tok_parseFwdSlash(expressionStart){
var step = 1;
var v5, v4, v3, v2, v1, v0;
var f5, f4, f3, f2, f1, f0;
var d;
return function inside_this_tok_parseFwdSlash(thawValue){
  while (true) {
    switch (step) {
      case 1:
if (!(this_tok_pos+1 >= this_tok_len)) { step = 3; continue; }
case 2:
 step = 5; case 5:
v0 = (f0 = f0 || this_tok_getMoreInput(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
case 3:
step = 7;
case 7:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(this_tok_pos+1))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
 d = v1;
      if (d !== 0x2f) { step = 10; continue; }
case 9:
step = 12;
case 12:
v2 = (f2 = f2 || this_tok_parseSingleComment())(thawValue);
if (frozen) return v2;
else f2 = null;
step = 13;
case 13:
return v2;
step = 10;
case 10:
if (d !== 0x2a) { step = 15; continue; }
case 14:
step = 17;
case 17:
v3 = (f3 = f3 || this_tok_parseMultiComment())(thawValue);
if (frozen) return v3;
else f3 = null;
step = 18;
case 18:
return v3;
step = 15;
case 15:
if (!expressionStart) { step = 20; continue; }
case 19:
step = 22;
case 22:
v4 = (f4 = f4 || this_tok_parseRegex())(thawValue);
if (frozen) return v4;
else f4 = null;
step = 23;
case 23:
return v4;
case 20:
step = 24;
case 24:
v5 = (f5 = f5 || this_tok_parseDivPunctuator(d))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 25;
case 25:
return v5;
return;
      }
    }
  };
}
  function this_tok_parseCR(){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
var pos, A, crlf;
return function inside_this_tok_parseCR(thawValue){
  while (true) {
    switch (step) {
      case 1:
// next char confirmed to be CR. check the next char for LF to
      // consume it for the CRLF case. this is completely optional.
pos = this_tok_pos;
      if (!(pos+1 >= this_tok_len)) { step = 3; continue; }
case 2:
 step = 5; case 5:
v0 = (f0 = f0 || this_tok_getMoreInput(true))(thawValue);
if (frozen) return v0;
else f0 = null;
case 6:
step = 3;
case 3:
  A = pos+1 < this_tok_len ;
if (!A) { step = 8; continue; }
case 7:
step = 10;
case 10:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(pos+1))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 11;
case 11:
A =  v1; 
step = 8;
case 8:
 crlf = (A) === 0x0A ? 1 : 0;
step = 12;
case 12:
v2 = (f2 = f2 || this_tok_parseVerifiedNewline(pos + crlf, crlf))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 13;
case 13:
return v2;
return;
      }
    }
  };
}
  function this_tok_parseVerifiedNewline(pos, extraForCrlf){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
var tokens, saveTokens, onToken, count, c, A, s, v;
return function inside_this_tok_parseVerifiedNewline(thawValue){
  while (true) {
    switch (step) {
      case 1:
// mark for ASI
      this_tok_lastNewline = true;
tokens = this_tok_tokens;
       saveTokens = this_tok_options.saveTokens;
       onToken = this_tok_options.onToken;
       count = this_tok_tokenCountAll;
// in JS source it's common to find spaces or tabs after newlines
      // due to indentation. we optimize here by eliminating the scanner
      // overhead by directly checking for spaces and tabs first.
      // note: first loop consumes the verified newline.
// only check for EOF, get new input elsewhere, no need to stream here
step = 2;
case 2:
if (!(!(++pos < this_tok_len))) { step = 5; continue; }
case 4:
 step = 3;
continue; 
case 5:
step = 7;
case 7:
v0 = (f0 = f0 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 8;
case 8:
 c = v0;
A = c !== 0x20 ;
if (!A) { step = 10; continue; }
step = 9;
case 9:
 A =  c !== 0x09; 
step = 10;
case 10:
if (!A) { step = 13; continue; }
case 12:
 step = 3;
continue;
case 13:
if (!saveTokens) { step = 16; continue; }
step = 15;
case 15:
// we just checked another token, stash the _previous_ one.
           s = pos-(1+extraForCrlf);
step = 18;
case 18:
v1 = (f1 = f1 || this_tok_inputSlice_offset(s, pos))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 19;
case 19:
 v = v1;
          tokens.push({type:18, value:v, start:s, stop:pos, white:count});
step = 16;
case 16:
if (!onToken) { step = 21; continue; }
step = 20;
case 20:
s = pos-(1+extraForCrlf);
step = 23;
case 23:
v2 = (f2 = f2 || this_tok_inputSlice_offset(s, pos))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 24;
case 24:
 v = v2;
          onToken(18, v, s, pos, count);
step = 21;
case 21:
extraForCrlf = 0; // only first iteration char is newline
        ++count;
step = 2;
continue
case 3:
this_tok_tokenCountAll = count;
      this_tok_lastOffset = pos-(1+extraForCrlf);
      this_tok_pos = pos;
return 18;
return;
      }
    }
  };
}
  function this_tok_parseSameOrCompound(c){
var step = 1;
var v1, v0;
var f1, f0;
var pos, d, A;
return function inside_this_tok_parseSameOrCompound(thawValue){
  while (true) {
    switch (step) {
      case 1:
// |&-+
pos = this_tok_pos+1;
      if (!(pos >= this_tok_len)) { step = 3; continue; }
case 2:
 step = 5; case 5:
v0 = (f0 = f0 || this_tok_getMoreInput(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
case 3:
step = 7;
case 7:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
 d = v1;
      // pick one, any one :) (this func runs too infrequent to make a significant difference)
//      this.pos += (d === c || d === ORD_IS_3D) ? 2 : 1;
//      this.pos += 1 + (!(d - c && d - ORD_IS_3D) |0);
//      this.pos += (d === c || d === ORD_IS_3D) ? 2 : 1;
//      this.pos += 1 + ((!(c-d))|0) + ((!(d-ORD_IS_3D))|0);
//      this.pos += 1 + (d === c | d === ORD_IS_3D);
//      this.pos += 1 + !(d-c && d-ORD_IS_3D);
A = d === c ;
if (A) { step = 10; continue; }
step = 9;
case 9:
 A =  d === 0x3d; 
step = 10;
case 10:
this_tok_pos = pos + ((A) ? 1 : 0);
return 9;
return;
      }
    }
  };
}
  function this_tok_parseEqualSigns(){
var step = 1;
var v3, v2, v1, v0;
var f3, f2, f1, f0;
var len, offset;
return function inside_this_tok_parseEqualSigns(thawValue){
  while (true) {
    switch (step) {
      case 1:
len = 1;
       offset = this_tok_lastOffset;
      if (!(offset+1 >= this_tok_len)) { step = 3; continue; }
case 2:
 step = 5; case 5:
v0 = (f0 = f0 || this_tok_getMoreInput(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
case 3:
step = 7;
case 7:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(offset+1))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
if (v1 !== 0x3d) { step = 10; continue; }
step = 9;
case 9:
if (!(offset+2 >= this_tok_len)) { step = 13; continue; }
case 12:
 step = 15; case 15:
v2 = (f2 = f2 || this_tok_getMoreInput(false))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 16;
case 16:
case 13:
step = 17;
case 17:
v3 = (f3 = f3 || this_tok_inputCharAt_offset(offset+2))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 18;
case 18:
if (v3 !== 0x3d) { step = 20; continue; }
step = 19;
case 19:
 len = 3;
step = 21;
continue;
case 20:
 len = 2;
case 21:
step = 10;
case 10:
this_tok_pos += len;
      return 9;
return;
      }
    }
  };
}
  function this_tok_parseLtgtPunctuator(c){
var step = 1;
var v5, v4, v3, v2, v1, v0;
var f5, f4, f3, f2, f1, f0;
var len, offset, d, e, A;
return function inside_this_tok_parseLtgtPunctuator(thawValue){
  while (true) {
    switch (step) {
      case 1:
len = 1;
       offset = this_tok_lastOffset;
      if (!(offset+1 >= this_tok_len)) { step = 3; continue; }
case 2:
 step = 5; case 5:
v0 = (f0 = f0 || this_tok_getMoreInput(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
case 3:
step = 7;
case 7:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(offset+1))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
 d = v1;
      if (d !== 0x3d) { step = 10; continue; }
step = 9;
case 9:
 len = 2;
step = 11;
continue;
case 10:
 if (d !== c) { step = 13; continue; }
step = 12;
case 12:
len = 2;
        if (!(offset+2 >= this_tok_len)) { step = 16; continue; }
case 15:
 step = 18; case 18:
v2 = (f2 = f2 || this_tok_getMoreInput(false))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 19;
case 19:
case 16:
step = 20;
case 20:
v3 = (f3 = f3 || this_tok_inputCharAt_offset(offset+2))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 21;
case 21:
 e = v3;
        if (e !== 0x3d) { step = 23; continue; }
step = 22;
case 22:
 len = 3;
step = 24;
continue;
case 23:
   A = e === c ;
if (!A) { step = 26; continue; }
step = 25;
case 25:
 A =  c !== 0x3c; 
step = 26;
case 26:
if (!A) { step = 29; continue; }
step = 28;
case 28:
len = 3;
          if (!(offset+3 >= this_tok_len)) { step = 32; continue; }
case 31:
 step = 34; case 34:
v4 = (f4 = f4 || this_tok_getMoreInput(false))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 35;
case 35:
case 32:
step = 36;
case 36:
v5 = (f5 = f5 || this_tok_inputCharAt_offset(offset+3))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 37;
case 37:
if (v5 !== 0x3d) { step = 39; continue; }
step = 38;
case 38:
 len = 4;
case 39:
step = 29;
case 29:
case 24:
case 11:
step = 13;
case 13:
this_tok_pos += len;
      return 9;
return;
      }
    }
  };
}
  function this_tok_parseCompoundAssignment(){
var step = 1;
var v1, v0;
var f1, f0;
var len;
return function inside_this_tok_parseCompoundAssignment(thawValue){
  while (true) {
    switch (step) {
      case 1:
len = 1;
      if (!(this_tok_pos+1 >= this_tok_len)) { step = 3; continue; }
case 2:
 step = 5; case 5:
v0 = (f0 = f0 || this_tok_getMoreInput(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
case 3:
step = 7;
case 7:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(this_tok_pos+1))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
if (v1 !== 0x3d) { step = 10; continue; }
step = 9;
case 9:
 len = 2;
step = 10;
case 10:
this_tok_pos += len;
      return 9;
return;
      }
    }
  };
}
  function this_tok_parseDivPunctuator(d){
var step = 1;
return function inside_this_tok_parseDivPunctuator(thawValue){
  while (true) {
    switch (step) {
      case 1:
// cant really be a //, /* or regex because they should have been checked before calling this function
      // could rewrite this to OR magic and eliminate a branch
      if (d !== 0x3d) { step = 3; continue; }
step = 2;
case 2:
 this_tok_pos += 2;
step = 4;
continue;
case 3:
 ++this_tok_pos;
step = 4;
case 4:
return 9;
return;
      }
    }
  };
}
  function this_tok_parseSingleComment(){
var step = 1;
var v1, v0;
var f1, f0;
var pos, A, c;
return function inside_this_tok_parseSingleComment(thawValue){
  while (true) {
    switch (step) {
      case 1:
pos = this_tok_pos + 1;
// note: although we _know_ a newline will happen next; explicitly checking for it is slower than not.
step = 2;
case 2:
A = ++pos >= this_tok_len ;
if (!A) { step = 5; continue; }
case 4:
step = 7;
case 7:
v0 = (f0 = f0 || this_tok_getMoreInput(true))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 8;
case 8:
A =  !v0; 
step = 5;
case 5:
if (!A) { step = 10; continue; }
case 9:
 step = 3;
continue;
case 10:
step = 12;
case 12:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 13;
case 13:
 c = v1;
          A = !c ;
if (A) { step = 15; continue; }
step = 14;
case 14:
 A =  c === 0x0D ;  
step = 15;
case 15:
if (A) { step = 18; continue; }
step = 17;
case 17:
 A =  c === 0x0A ;  
step = 18;
case 18:
if (A) { step = 21; continue; }
step = 20;
case 20:
 A =  (c ^ 0x2028) <= 1; 
step = 21;
case 21:
if (!A) { step = 24; continue; }
case 23:
 step = 3;
continue; // c !== ORD_PS && c !== ORD_LS
step = 24;
case 24:
 if (true) { step = 2; continue; }
step = 3;
case 3:
this_tok_pos = pos;
return 18;
/* // reverted: this is slightly slower
      var start = this.pos;
      var pos = start + 1; // +2 but the second char is start of loop
      var input = this.input; // note: cannot cache input here
      var len = input.length;
var foundCr = false;
      var notEof;
while (notEof = (++pos < len)) {
        var c = input.charCodeAt(pos);
        if (c === ORD_CR_0D) { foundCr  = true; break; }
        if (c === ORD_LF_0A || (c ^ ORD_PS_2028) <= 1) break; // c !== ORD_PS && c !== ORD_LS
      }
this.pos = pos;
      if (!notEof) return WHITE; // not EOF because we DID already parse two forward slashes
// we _know_ there'll be a next newline token, so consume the comment now and continue with newline parser
      ++this.tokenCountAll;
      if (this.options.saveTokens) {
        // we just checked another token, stash the previous one. it gets a bit ugly now :/
        this.tokens.push({type:WHITE, value:input.slice(start, pos), start:start, stop:pos, white:this.tokens.length});
      }
this.lastOffset = pos;
if (foundCr) return this.parseCR();
      return this.parseVerifiedNewline(this.pos, 0);
*/
return;
      }
    }
  };
}
  function this_tok_parseMultiComment(){
var step = 1;
var v4, v3, v2, v1, v0;
var f4, f3, f2, f1, f0;
var pos, noNewline, c, d, A;
return function inside_this_tok_parseMultiComment(thawValue){
  while (true) {
    switch (step) {
      case 1:
pos = this_tok_pos + 2;
noNewline = true;
       c = 0;
      if (!(pos >= this_tok_len)) { step = 3; continue; }
case 2:
 step = 5; case 5:
v0 = (f0 = f0 || this_tok_getMoreInput(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
case 3:
step = 7;
case 7:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
 d = v1;
step = 9;
case 9:
if (d) { step = 12; continue; }
case 11:
 step = 10;
continue;
case 12:
c = d;
        if (!(++pos >= this_tok_len)) { step = 15; continue; }
case 14:
 step = 17; case 17:
v2 = (f2 = f2 || this_tok_getMoreInput(false))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 18;
case 18:
case 15:
step = 19;
case 19:
v3 = (f3 = f3 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 20;
case 20:
d = v3;
A = c === 0x2a ;
if (!A) { step = 22; continue; }
step = 21;
case 21:
 A =  d === 0x2f; 
step = 22;
case 22:
if (!A) { step = 25; continue; }
step = 24;
case 24:
this_tok_pos = pos+1;
          // yes I hate the double negation, but it saves doing ! above
          if (noNewline) { step = 28; continue; }
step = 27;
case 27:
 this_tok_lastNewline = true;
step = 28;
case 28:
return 18;
step = 25;
case 25:
if (!noNewline) { step = 31; continue; }
step = 30;
case 30:
   A = c === 0x0D ;
if (A) { step = 34; continue; }
step = 33;
case 33:
 A =  c === 0x0A ;  
step = 34;
case 34:
if (A) { step = 37; continue; }
step = 36;
case 36:
 A =  (c ^ 0x2028) <= 1; 
step = 37;
case 37:
noNewline = !(A); // c === ORD_PS || c === ORD_LS
case 31:
step = 9;
continue
case 10:
step = 39; case 39:
v4 = (f4 = f4 || this_tok_throwSyntaxError('Unterminated multi line comment found'))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 40;
case 40:
return;
      }
    }
  };
}
  function this_tok_parseSingleString(){
var step = 1;
var v0;
var f0;
return function inside_this_tok_parseSingleString(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2;
case 2:
v0 = (f0 = f0 || this_tok_parseString(0x27))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
return v0;
return;
      }
    }
  };
}
  function this_tok_parseDoubleString(){
var step = 1;
var v0;
var f0;
return function inside_this_tok_parseDoubleString(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2;
case 2:
v0 = (f0 = f0 || this_tok_parseString(0x22))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
return v0;
return;
      }
    }
  };
}
  function this_tok_parseString(targetChar){
var step = 1;
var v4, v3, v2, v1, v0;
var f4, f3, f2, f1, f0;
var pos, c, A;
return function inside_this_tok_parseString(thawValue){
  while (true) {
    switch (step) {
      case 1:
pos = this_tok_pos + 1;
step = 2;
case 2:
if (!(pos >= this_tok_len)) { step = 5; continue; }
case 4:
 step = 7; case 7:
v0 = (f0 = f0 || this_tok_getMoreInput(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 8;
case 8:
case 5:
step = 9;
case 9:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(pos++))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 10;
case 10:
 c = v1;
if (c !== targetChar) { step = 12; continue; }
step = 11;
case 11:
this_tok_pos = pos;
          return 10;
// &8: all newlines and backslash have their 4th bit set (prevents additional checks for 63%)
step = 12;
case 12:
if (!((c & 8) === 8)) { step = 15; continue; }
step = 14;
case 14:
if (c !== 0x5c) { step = 18; continue; }
case 17:
step = 20;
case 20:
v2 = (f2 = f2 || this_tok_parseStringEscape(pos))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 21;
case 21:
pos = v2;
            // c&83<3: it's a filter :) all newlines have their 5th bit set and 7th bit unset.
            // none of them have first AND second bit set. this filters about 95%
            // ftr: c&80 filters 84%, c&3<3 filters 75%. together they filter 95% :)
step = 19;
continue;
case 18:
   A = (c & 83) < 3 ;
if (!A) { step = 23; continue; }
step = 22;
case 22:
   A = c === 0x0A ;
if (A) { step = 26; continue; }
step = 25;
case 25:
 A =  c === 0x0D ;  
step = 26;
case 26:
if (A) { step = 29; continue; }
step = 28;
case 28:
 A =  c === 0x2028 ;  
step = 29;
case 29:
if (A) { step = 32; continue; }
step = 31;
case 31:
 A =  c === 0x2029; 
step = 32;
case 32:
A =  (A); 
step = 23;
case 23:
if (!A) { step = 35; continue; }
case 34:
step = 37; case 37:
v3 = (f3 = f3 || this_tok_throwSyntaxError('No newlines in strings!'))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 38;
case 38:
case 35:
case 19:
step = 15;
case 15:
 if (c) { step = 2; continue; }
case 3:
step = 39; case 39:
v4 = (f4 = f4 || this_tok_throwSyntaxError('Unterminated string found'))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 40;
case 40:
return;
      }
    }
  };
}
  function this_tok_parseStringEscape(pos){
var step = 1;
var v11, v10, v9, v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f11, f10, f9, f8, f7, f6, f5, f4, f3, f2, f1, f0;
var c, a, b, A;
return function inside_this_tok_parseStringEscape(thawValue){
  while (true) {
    switch (step) {
      case 1:
if (!(pos >= this_tok_len)) { step = 3; continue; }
case 2:
 step = 5; case 5:
v0 = (f0 = f0 || this_tok_getMoreInput(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
case 3:
step = 7;
case 7:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
 c = v1;
// unicode escapes
      if (c !== 0x75) { step = 10; continue; }
case 9:
step = 12;
case 12:
v2 = (f2 = f2 || this_tok_parseUnicodeEscapeBody(pos+1))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 13;
case 13:
if (!v2) { step = 15; continue; }
step = 14;
case 14:
 pos += 4;
step = 16;
continue;
case 15:
 step = 17; case 17:
v3 = (f3 = f3 || this_tok_throwSyntaxError('Invalid unicode escape'))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 18;
case 18:
// line continuation; skip windows newlines as if they're one char
case 16:
step = 11;
continue;
case 10:
 if (c !== 0x0D) { step = 20; continue; }
step = 19;
case 19:
// keep in mind, we are already skipping a char. no need to check
        // for other line terminators here. we are merely checking to see
        // whether we need to skip an additional character for CRLF.
        if (!(pos+1 >= this_tok_len)) { step = 23; continue; }
case 22:
 step = 25; case 25:
v4 = (f4 = f4 || this_tok_getMoreInput(false))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 26;
case 26:
case 23:
step = 27;
case 27:
v5 = (f5 = f5 || this_tok_inputCharAt_offset(pos+1))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 28;
case 28:
if (v5 !== 0x0A) { step = 30; continue; }
step = 29;
case 29:
 ++pos;
      // hex escapes
case 30:
step = 21;
continue;
case 20:
 if (c !== 0x78) { step = 33; continue; }
step = 32;
case 32:
if (!(pos+2 >= this_tok_len)) { step = 36; continue; }
case 35:
 step = 38; case 38:
v6 = (f6 = f6 || this_tok_getMoreInput(false, pos+3-this_tok_len))(thawValue);
if (frozen) return v6;
else f6 = null;
step = 39;
case 39:
case 36:
step = 40;
case 40:
v7 = (f7 = f7 || this_tok_inputCharAt_offset(pos+1))(thawValue);
if (frozen) return v7;
else f7 = null;
step = 41;
case 41:
 a = v7;
step = 42;
case 42:
v8 = (f8 = f8 || this_tok_inputCharAt_offset(pos+2))(thawValue);
if (frozen) return v8;
else f8 = null;
step = 43;
case 43:
 b = v8;
step = 44;
case 44:
v9 = (f9 = f9 || this_tok_parseHexDigit(a))(thawValue);
if (frozen) return v9;
else f9 = null;
step = 45;
case 45:
 A = v9 ;
if (!A) { step = 47; continue; }
case 46:
step = 49;
case 49:
v10 = (f10 = f10 || this_tok_parseHexDigit(b))(thawValue);
if (frozen) return v10;
else f10 = null;
step = 50;
case 50:
A =  v10; 
step = 47;
case 47:
if (!A) { step = 52; continue; }
step = 51;
case 51:
 pos += 2;
step = 53;
continue;
case 52:
 step = 54; case 54:
v11 = (f11 = f11 || this_tok_throwSyntaxError('Invalid hex escape'))(thawValue);
if (frozen) return v11;
else f11 = null;
step = 55;
case 55:
case 53:
step = 11;
case 11:
case 21:
step = 33;
case 33:
return pos+1;
return;
      }
    }
  };
}
  function this_tok_parseUnicodeEscapeBody(pos){
var step = 1;
var v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f8, f7, f6, f5, f4, f3, f2, f1, f0;
var a, b, c, d, A;
return function inside_this_tok_parseUnicodeEscapeBody(thawValue){
  while (true) {
    switch (step) {
      case 1:
if (!(pos+3 >= this_tok_len)) { step = 3; continue; }
case 2:
 step = 5; case 5:
v0 = (f0 = f0 || this_tok_getMoreInput(false, pos+4-this_tok_len))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
case 3:
step = 7;
case 7:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
 a = v1;
step = 9;
case 9:
v2 = (f2 = f2 || this_tok_inputCharAt_offset(pos+1))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 10;
case 10:
 b = v2;
step = 11;
case 11:
v3 = (f3 = f3 || this_tok_inputCharAt_offset(pos+2))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 12;
case 12:
 c = v3;
step = 13;
case 13:
v4 = (f4 = f4 || this_tok_inputCharAt_offset(pos+3))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 14;
case 14:
 d = v4;
step = 15;
case 15:
v5 = (f5 = f5 || this_tok_parseHexDigit(a))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 16;
case 16:
 A = v5 ;
if (!A) { step = 18; continue; }
case 17:
step = 20;
case 20:
v6 = (f6 = f6 || this_tok_parseHexDigit(b))(thawValue);
if (frozen) return v6;
else f6 = null;
step = 21;
case 21:
A =  v6 ;  
step = 18;
case 18:
if (!A) { step = 23; continue; }
case 22:
step = 25;
case 25:
v7 = (f7 = f7 || this_tok_parseHexDigit(c))(thawValue);
if (frozen) return v7;
else f7 = null;
step = 26;
case 26:
A =  v7 ;  
step = 23;
case 23:
if (!A) { step = 28; continue; }
case 27:
step = 30;
case 30:
v8 = (f8 = f8 || this_tok_parseHexDigit(d))(thawValue);
if (frozen) return v8;
else f8 = null;
step = 31;
case 31:
A =  v8; 
step = 28;
case 28:
return A;
return;
      }
    }
  };
}
  function this_tok_parseHexDigit(c){
var step = 1;
var A;
return function inside_this_tok_parseHexDigit(thawValue){
  while (true) {
    switch (step) {
      case 1:
// 0-9, a-f, A-F
        A = c <= 0x39 ;
if (!A) { step = 3; continue; }
step = 2;
case 2:
 A =  c >= 0x30; 
step = 3;
case 3:
  A = (A) ;
if (A) { step = 6; continue; }
step = 5;
case 5:
   A = c >= 0x61 ;
if (!A) { step = 9; continue; }
step = 8;
case 8:
 A =  c <= 0x66; 
step = 9;
case 9:
A =  (A) ;  
step = 6;
case 6:
if (A) { step = 12; continue; }
step = 11;
case 11:
   A = c >= 0x41 ;
if (!A) { step = 15; continue; }
step = 14;
case 14:
 A =  c <= 0x46; 
step = 15;
case 15:
A =  (A); 
step = 12;
case 12:
return (A);
return;
      }
    }
  };
}
  function this_tok_parseLeadingDot(){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
var c, A;
return function inside_this_tok_parseLeadingDot(thawValue){
  while (true) {
    switch (step) {
      case 1:
if (!(this_tok_pos+1 >= this_tok_len)) { step = 3; continue; }
case 2:
 step = 5; case 5:
v0 = (f0 = f0 || this_tok_getMoreInput(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
case 3:
step = 7;
case 7:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(this_tok_pos+1))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
 c = v1;
A = c >= 0x30 ;
if (!A) { step = 10; continue; }
step = 9;
case 9:
 A =  c <= 0x39; 
step = 10;
case 10:
if (!A) { step = 13; continue; }
case 12:
step = 15;
case 15:
v2 = (f2 = f2 || this_tok_parseAfterDot(this_tok_pos+2))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 16;
case 16:
return v2;
step = 13;
case 13:
++this_tok_pos;
      return 9;
return;
      }
    }
  };
}
  function this_tok_parseLeadingZero(){
var step = 1;
var v5, v4, v3, v2, v1, v0;
var f5, f4, f3, f2, f1, f0;
var A, d;
return function inside_this_tok_parseLeadingZero(thawValue){
  while (true) {
    switch (step) {
      case 1:
// a numeric that starts with zero is is either a decimal or hex
      // 0.1234  0.  0e12 0e-12 0e12+ 0.e12 0.1e23 0xdeadbeeb
// trailing zero at eof can be valid, but must be checked for additional input first
        A = this_tok_pos+1 >= this_tok_len ;
if (!A) { step = 3; continue; }
case 2:
step = 5;
case 5:
v0 = (f0 = f0 || this_tok_getMoreInput(true))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
A =  !v0; 
step = 3;
case 3:
if (!A) { step = 8; continue; }
step = 7;
case 7:
++this_tok_pos;
        return 7;
case 8:
step = 10;
case 10:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(this_tok_pos+1))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 11;
case 11:
 d = v1;
        A = d === 0x78 ;
if (A) { step = 13; continue; }
step = 12;
case 12:
 A =  d === 0x58; 
step = 13;
case 13:
if (!A) { step = 16; continue; }
step = 15;
case 15:
  // x or X
        step = 18; case 18:
v2 = (f2 = f2 || this_tok_parseHexNumber())(thawValue);
if (frozen) return v2;
else f2 = null;
case 19:
step = 17;
continue;
case 16:
 if (d !== 0x2e) { step = 21; continue; }
case 20:
step = 23; case 23:
v3 = (f3 = f3 || this_tok_parseAfterDot(this_tok_pos+2))(thawValue);
if (frozen) return v3;
else f3 = null;
case 24:
step = 22;
continue;
case 21:
   A = d <= 0x39 ;
if (!A) { step = 26; continue; }
step = 25;
case 25:
 A =  d >= 0x30; 
step = 26;
case 26:
if (!A) { step = 29; continue; }
case 28:
step = 31; case 31:
v4 = (f4 = f4 || this_tok_throwSyntaxError('Invalid octal literal'))(thawValue);
if (frozen) return v4;
else f4 = null;
case 32:
step = 30;
continue;
case 29:
step = 33;
case 33:
v5 = (f5 = f5 || this_tok_parseExponent(d, this_tok_pos+1))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 34;
case 34:
this_tok_pos = v5;
case 30:
case 17:
step = 22;
case 22:
return 7;
return;
      }
    }
  };
}
  function this_tok_parseHexNumber(){
var step = 1;
var v1, v0;
var f1, f0;
var pos, A, c;
return function inside_this_tok_parseHexNumber(thawValue){
  while (true) {
    switch (step) {
      case 1:
pos = this_tok_pos + 1;
// (could use OR, eliminate casing branch)
step = 2;
case 2:
A = ++pos >= this_tok_len ;
if (!A) { step = 5; continue; }
case 4:
step = 7;
case 7:
v0 = (f0 = f0 || this_tok_getMoreInput(true))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 8;
case 8:
A =  !v0; 
step = 5;
case 5:
if (!A) { step = 10; continue; }
case 9:
 step = 3;
continue;
case 10:
step = 12;
case 12:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 13;
case 13:
 c = v1;
         A = c <= 0x39 ;
if (!A) { step = 15; continue; }
step = 14;
case 14:
 A =  c >= 0x30; 
step = 15;
case 15:
  A = (A) ;
if (A) { step = 18; continue; }
step = 17;
case 17:
   A = c >= 0x61 ;
if (!A) { step = 21; continue; }
step = 20;
case 20:
 A =  c <= 0x66; 
step = 21;
case 21:
A =  (A) ;  
step = 18;
case 18:
if (A) { step = 24; continue; }
step = 23;
case 23:
   A = c >= 0x41 ;
if (!A) { step = 27; continue; }
step = 26;
case 26:
 A =  c <= 0x46; 
step = 27;
case 27:
A =  (A); 
step = 24;
case 24:
if (A) { step = 2; continue; }
step = 3;
case 3:
this_tok_pos = pos;
      return 7;
return;
      }
    }
  };
}
  function this_tok_parseDecimalNumber(){
var step = 1;
var v3, v2, v1, v0;
var f3, f2, f1, f0;
var pos, A, c;
return function inside_this_tok_parseDecimalNumber(thawValue){
  while (true) {
    switch (step) {
      case 1:
// just encountered a 1-9 as the start of a token...
pos = this_tok_pos;
step = 2;
case 2:
A = ++pos >= this_tok_len ;
if (!A) { step = 5; continue; }
case 4:
step = 7;
case 7:
v0 = (f0 = f0 || this_tok_getMoreInput(true))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 8;
case 8:
A =  !v0; 
step = 5;
case 5:
if (!A) { step = 10; continue; }
case 9:
 step = 3;
continue;
case 10:
step = 12;
case 12:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 13;
case 13:
 c = v1;
         A = c >= 0x30 ;
if (!A) { step = 15; continue; }
step = 14;
case 14:
 A =  c <= 0x39; 
step = 15;
case 15:
if (A) { step = 2; continue; }
step = 3;
case 3:
if (c !== 0x2e) { step = 18; continue; }
case 17:
step = 20;
case 20:
v2 = (f2 = f2 || this_tok_parseAfterDot(pos+1))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 21;
case 21:
return v2;
case 18:
step = 22;
case 22:
v3 = (f3 = f3 || this_tok_parseExponent(c, pos))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 23;
case 23:
this_tok_pos = v3;
      return 7;
return;
      }
    }
  };
}
  function this_tok_parseAfterDot(pos){
var step = 1;
var v3, v2, v1, v0;
var f3, f2, f1, f0;
var A, c;
return function inside_this_tok_parseAfterDot(thawValue){
  while (true) {
    switch (step) {
      case 1:
A = pos < this_tok_len ;
if (A) { step = 3; continue; }
case 2:
step = 5;
case 5:
v0 = (f0 = f0 || this_tok_getMoreInput(true))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
A =  v0; 
step = 3;
case 3:
if (!A) { step = 8; continue; }
case 7:
case 10:
step = 12;
case 12:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 13;
case 13:
 c = v1;
A = c >= 0x30 ;
if (!A) { step = 15; continue; }
step = 14;
case 14:
 A =  c <= 0x39 ;  
step = 15;
case 15:
if (!A) { step = 18; continue; }
step = 17;
case 17:
   A = ++pos < this_tok_len ;
if (A) { step = 21; continue; }
case 20:
step = 23;
case 23:
v2 = (f2 = f2 || this_tok_getMoreInput(true))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 24;
case 24:
A =  v2; 
step = 21;
case 21:
A =  (A); 
step = 18;
case 18:
if (A) { step = 10; continue; }
case 11:
case 8:
step = 25;
case 25:
v3 = (f3 = f3 || this_tok_parseExponent(c, pos))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 26;
case 26:
pos = v3;
this_tok_pos = pos;
return 7;
return;
      }
    }
  };
}
  function this_tok_parseExponent(c, pos){
var step = 1;
var v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f8, f7, f6, f5, f4, f3, f2, f1, f0;
var A;
return function inside_this_tok_parseExponent(thawValue){
  while (true) {
    switch (step) {
      case 1:
A = c === 0x65 ;
if (A) { step = 3; continue; }
step = 2;
case 2:
 A =  c === 0x45; 
step = 3;
case 3:
if (!A) { step = 6; continue; }
step = 5;
case 5:
if (!(++pos >= this_tok_len)) { step = 9; continue; }
case 8:
 step = 11; case 11:
v0 = (f0 = f0 || this_tok_getMoreInput(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 12;
case 12:
case 9:
step = 13;
case 13:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 14;
case 14:
c = v1;
        // sign is optional (especially for plus)
          A = c === 0x2d ;
if (A) { step = 16; continue; }
step = 15;
case 15:
 A =  c === 0x2b; 
step = 16;
case 16:
if (!A) { step = 19; continue; }
step = 18;
case 18:
if (!(++pos >= this_tok_len)) { step = 22; continue; }
case 21:
 step = 24; case 24:
v2 = (f2 = f2 || this_tok_getMoreInput(false))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 25;
case 25:
 // must have at least one char after +-
case 22:
step = 26;
case 26:
v3 = (f3 = f3 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 27;
case 27:
c = v3;
// first digit is mandatory
step = 19;
case 19:
  A = c >= 0x30 ;
if (!A) { step = 29; continue; }
step = 28;
case 28:
 A =  c <= 0x39; 
step = 29;
case 29:
if (!A) { step = 32; continue; }
step = 31;
case 31:
A = ++pos >= this_tok_len ;
if (!A) { step = 35; continue; }
case 34:
step = 37;
case 37:
v4 = (f4 = f4 || this_tok_getMoreInput(true))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 38;
case 38:
A =  !v4; 
step = 35;
case 35:
if (!A) { step = 40; continue; }
step = 39;
case 39:
 return pos;
case 40:
step = 42;
case 42:
v5 = (f5 = f5 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 43;
case 43:
c = v5;
step = 33;
continue;
case 32:
 step = 44; case 44:
v6 = (f6 = f6 || this_tok_throwSyntaxError('Missing required digits after exponent'))(thawValue);
if (frozen) return v6;
else f6 = null;
step = 45;
case 45:
// rest is optional
case 33:
step = 46;
case 46:
  A = c >= 0x30 ;
if (!A) { step = 49; continue; }
step = 48;
case 48:
 A =  c <= 0x39; 
step = 49;
case 49:
if (A) { step = 52; continue; }
case 51:
 step = 47;
continue;
case 52:
A = ++pos >= this_tok_len ;
if (!A) { step = 55; continue; }
case 54:
step = 57;
case 57:
v7 = (f7 = f7 || this_tok_getMoreInput(true))(thawValue);
if (frozen) return v7;
else f7 = null;
step = 58;
case 58:
A =  !v7; 
step = 55;
case 55:
if (!A) { step = 60; continue; }
step = 59;
case 59:
 return pos;
case 60:
step = 62;
case 62:
v8 = (f8 = f8 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v8;
else f8 = null;
step = 63;
case 63:
c = v8;
step = 46;
continue
case 47:
step = 6;
case 6:
return pos;
return;
      }
    }
  };
}
  function this_tok_parseRegex(){
var step = 1;
var v1, v0;
var f1, f0;
return function inside_this_tok_parseRegex(thawValue){
  while (true) {
    switch (step) {
      case 1:
// /foo/
      // /foo[xyz]/
      // /foo(xyz)/
      // /foo{xyz}/
      // /foo(?:foo)/
      // /foo(!:foo)/
      // /foo(?!foo)bar/
      // /foo\dbar/
      this_tok_pos++;
      step = 2; case 2:
v0 = (f0 = f0 || this_tok_regexBody())(thawValue);
if (frozen) return v0;
else f0 = null;
case 3:
step = 4; case 4:
v1 = (f1 = f1 || this_tok_regexFlags())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 5;
case 5:
return 8;
return;
      }
    }
  };
}
  function this_tok_regexBody(){
var step = 1;
var v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f8, f7, f6, f5, f4, f3, f2, f1, f0;
var A, c, d;
return function inside_this_tok_regexBody(thawValue){
  while (true) {
    switch (step) {
      case 1:
// TOFIX: should try to have the regex parser only use pos, not this.pos
step = 2;
case 2:
A = this_tok_pos >= this_tok_len ;
if (!A) { step = 5; continue; }
case 4:
step = 7;
case 7:
v0 = (f0 = f0 || this_tok_getMoreInput(true))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 8;
case 8:
A =  !v0; 
step = 5;
case 5:
if (!A) { step = 10; continue; }
case 9:
 step = 12; case 12:
v1 = (f1 = f1 || this_tok_throwSyntaxError('Unterminated regular expression at eof'))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 13;
case 13:
case 10:
step = 14;
case 14:
v2 = (f2 = f2 || this_tok_inputCharAt_offset(this_tok_pos++))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 15;
case 15:
 c = v2;
if (c !== 0x5c) { step = 17; continue; }
step = 16;
case 16:
  // backslash
            A = this_tok_pos >= this_tok_len ;
if (!A) { step = 20; continue; }
case 19:
step = 22;
case 22:
v3 = (f3 = f3 || this_tok_getMoreInput(true))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 23;
case 23:
A =  !v3; 
step = 20;
case 20:
if (!A) { step = 25; continue; }
case 24:
 step = 27; case 27:
v4 = (f4 = f4 || this_tok_throwSyntaxError('Unterminated regular expression escape at eof'))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 28;
case 28:
case 25:
step = 29;
case 29:
v5 = (f5 = f5 || this_tok_inputCharAt_offset(this_tok_pos++))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 30;
case 30:
 d = v5;
            A = d === 0x0A ;
if (A) { step = 32; continue; }
step = 31;
case 31:
 A =  d === 0x0D ;  
step = 32;
case 32:
if (A) { step = 35; continue; }
step = 34;
case 34:
 A =  (d ^ 0x2028) <= 1 /*d === ORD_PS || d === ORD_LS*/; 
step = 35;
case 35:
if (!A) { step = 38; continue; }
case 37:
step = 40; case 40:
v6 = (f6 = f6 || this_tok_throwSyntaxError('Newline can not be escaped in regular expression'))(thawValue);
if (frozen) return v6;
else f6 = null;
step = 41;
case 41:
case 38:
step = 18;
continue;
case 17:
 if (c !== 0x2f) { step = 43; continue; }
step = 42;
case 42:
 return;
step = 44;
continue;
case 43:
 if (c !== 0x5b) { step = 46; continue; }
case 45:
 step = 48; case 48:
v7 = (f7 = f7 || this_tok_regexClass())(thawValue);
if (frozen) return v7;
else f7 = null;
case 49:
step = 47;
continue;
case 46:
   A = c === 0x0A ;
if (A) { step = 51; continue; }
step = 50;
case 50:
 A =  c === 0x0D ;  
step = 51;
case 51:
if (A) { step = 54; continue; }
step = 53;
case 53:
 A =  (c ^ 0x2028) <= 1 /*c === ORD_PS || c === ORD_LS*/; 
step = 54;
case 54:
if (!A) { step = 57; continue; }
case 56:
step = 59; case 59:
v8 = (f8 = f8 || this_tok_throwSyntaxError('Newline can not be escaped in regular expression ['+c+']'))(thawValue);
if (frozen) return v8;
else f8 = null;
step = 60;
case 60:
case 57:
step = 18;
case 18:
case 44:
case 47:
step = 2;
continue
case 3:
return;
      }
    }
  };
}
  function this_tok_regexClass(){
var step = 1;
var v6, v5, v4, v3, v2, v1, v0;
var f6, f5, f4, f3, f2, f1, f0;
var pos, A, c, d;
return function inside_this_tok_regexClass(thawValue){
  while (true) {
    switch (step) {
      case 1:
pos = this_tok_pos;
step = 2;
case 2:
A = pos >= this_tok_len ;
if (!A) { step = 5; continue; }
case 4:
step = 7;
case 7:
v0 = (f0 = f0 || this_tok_getMoreInput(true))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 8;
case 8:
A =  !v0; 
step = 5;
case 5:
if (!A) { step = 10; continue; }
case 9:
step = 12; case 12:
v1 = (f1 = f1 || this_tok_throwSyntaxError('Unterminated regular expression'))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 13;
case 13:
case 10:
step = 14;
case 14:
v2 = (f2 = f2 || this_tok_inputCharAt_offset(pos++))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 15;
case 15:
 c = v2;
if (c !== 0x5d) { step = 17; continue; }
step = 16;
case 16:
this_tok_pos = pos;
          return;
step = 17;
case 17:
if (c !== 0x5c) { step = 20; continue; }
step = 19;
case 19:
// there's a historical dispute over whether backslashes in regex classes
          // add a slash or its next char. ES5 settled it to "it's an escape".
          if (!(this_tok_options.regexNoClassEscape)) { step = 23; continue; }
step = 22;
case 22:
if (!(pos >= this_tok_len)) { step = 26; continue; }
case 25:
 step = 28; case 28:
v3 = (f3 = f3 || this_tok_getMoreInput(false))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 29;
case 29:
case 26:
step = 30;
case 30:
v4 = (f4 = f4 || this_tok_inputCharAt_offset(pos++))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 31;
case 31:
 d = v4;
              A = d === 0x0A ;
if (A) { step = 33; continue; }
step = 32;
case 32:
 A =  d === 0x0D ;  
step = 33;
case 33:
if (A) { step = 36; continue; }
step = 35;
case 35:
 A =  (d ^ 0x2028) <= 1 /*d === ORD_PS || d === ORD_LS*/; 
step = 36;
case 36:
if (!A) { step = 39; continue; }
case 38:
step = 41; case 41:
v5 = (f5 = f5 || this_tok_throwSyntaxError('Newline can not be escaped in regular expression'))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 42;
case 42:
case 39:
case 23:
step = 21;
continue;
case 20:
   A = c === 0x0A ;
if (A) { step = 44; continue; }
step = 43;
case 43:
 A =  c === 0x0D ;  
step = 44;
case 44:
if (A) { step = 47; continue; }
step = 46;
case 46:
 A =  (c ^ 0x2028) <= 1; 
step = 47;
case 47:
if (!A) { step = 50; continue; }
step = 49;
case 49:
  // c === ORD_PS || c === ORD_LS
          step = 52; case 52:
v6 = (f6 = f6 || this_tok_throwSyntaxError('Illegal newline in regex char class'))(thawValue);
if (frozen) return v6;
else f6 = null;
step = 53;
case 53:
case 50:
case 21:
step = 2;
continue
case 3:
return;
      }
    }
  };
}
  function this_tok_regexFlags(){
var step = 1;
var v9, v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f9, f8, f7, f6, f5, f4, f3, f2, f1, f0;
var pos, g, m, i, A, c, backslash;
return function inside_this_tok_regexFlags(thawValue){
  while (true) {
    switch (step) {
      case 1:
// http://es5.github.io/#x15.10.4.1
      // "If F contains any character other than "g", "i", or "m", or if it contains the same character more than once, then throw a SyntaxError exception."
      // flags may be unicode escaped
if (!(this_tok_options.skipRegexFlagCheck)) { step = 3; continue; }
step = 2;
case 2:
--this_tok_pos; // parseIdentifierRest assumes the current char can be consumed, but that's not the case here, so we compensate
step = 5;
case 5:
v0 = (f0 = f0 || this_tok_parseIdentifierRest())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
this_tok_pos = v0;
        return;
// okay, we have to actually verify the flags now
step = 3;
case 3:
 pos = this_tok_pos;
g = false;
       m = false;
       i = false;
A = pos < this_tok_len ;
if (A) { step = 8; continue; }
case 7:
step = 10;
case 10:
v1 = (f1 = f1 || this_tok_getMoreInput(true))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 11;
case 11:
A =  v1; 
step = 8;
case 8:
if (!A) { step = 13; continue; }
case 12:
step = 15;
case 15:
v2 = (f2 = f2 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 16;
case 16:
 c = v2;
step = 17;
case 17:
backslash = false;
// check backslash first so we can replace c with the canonical value of the escape
          if (c !== 0x5c) { step = 20; continue; }
step = 19;
case 19:
// only valid here is `\u006` followed by a 7=g 9=i or d=m
            backslash = true;
step = 22;
case 22:
v3 = (f3 = f3 || this_tok_regexFlagUniEscape(pos + 1))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 23;
case 23:
c = v3;
step = 20;
case 20:
if (c !== 0x67) { step = 25; continue; }
step = 24;
case 24:
if (!g) { step = 28; continue; }
case 27:
 step = 30; case 30:
v4 = (f4 = f4 || this_tok_throwSyntaxError('Illegal duplicate regex flag'))(thawValue);
if (frozen) return v4;
else f4 = null;
case 31:
step = 28;
case 28:
g = true;
step = 26;
continue;
case 25:
 if (c !== 0x69) { step = 33; continue; }
step = 32;
case 32:
if (!i) { step = 36; continue; }
case 35:
 step = 38; case 38:
v5 = (f5 = f5 || this_tok_throwSyntaxError('Illegal duplicate regex flag'))(thawValue);
if (frozen) return v5;
else f5 = null;
case 39:
step = 36;
case 36:
i = true;
step = 34;
continue;
case 33:
 if (c !== 0x6D) { step = 41; continue; }
step = 40;
case 40:
if (!m) { step = 44; continue; }
case 43:
 step = 46; case 46:
v6 = (f6 = f6 || this_tok_throwSyntaxError('Illegal duplicate regex flag'))(thawValue);
if (frozen) return v6;
else f6 = null;
case 47:
step = 44;
case 44:
m = true;
step = 42;
continue;
case 41:
if (!backslash) { step = 49; continue; }
case 48:
 step = 51; case 51:
v7 = (f7 = f7 || this_tok_throwSyntaxError('illegal flag? ['+c+']'))(thawValue);
if (frozen) return v7;
else f7 = null;
step = 52;
case 52:
case 49:
step = 18;
continue;
case 26:
case 34:
step = 42;
case 42:
if (!backslash) { step = 54; continue; }
step = 53;
case 53:
 pos += 5;
step = 54;
case 54:
  A = ++pos >= this_tok_len ;
if (!A) { step = 57; continue; }
case 56:
step = 59;
case 59:
v8 = (f8 = f8 || this_tok_getMoreInput(true))(thawValue);
if (frozen) return v8;
else f8 = null;
step = 60;
case 60:
A =  !v8; 
step = 57;
case 57:
if (!A) { step = 62; continue; }
case 61:
 step = 18;
continue;
case 62:
step = 64;
case 64:
v9 = (f9 = f9 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v9;
else f9 = null;
step = 65;
case 65:
c = v9;
step = 17;
continue
case 18:
step = 13;
case 13:
this_tok_pos = pos;
return;
      }
    }
  };
}
  function this_tok_regexFlagUniEscape(pos){
var step = 1;
var v5, v4, v3, v2, v1, v0;
var f5, f4, f3, f2, f1, f0;
var A, c;
return function inside_this_tok_regexFlagUniEscape(thawValue){
  while (true) {
    switch (step) {
      case 1:
if (!(pos+4 >= this_tok_len)) { step = 3; continue; }
case 2:
 step = 5; case 5:
v0 = (f0 = f0 || this_tok_getMoreInput(false, pos+5-this_tok_len))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
case 3:
step = 7;
case 7:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
 A = v1 !== 0x75 ;
if (A) { step = 10; continue; }
case 9:
step = 12;
case 12:
v2 = (f2 = f2 || this_tok_inputCharAt_offset(pos+1))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 13;
case 13:
A =  v2 !== 0x30 ;  
step = 10;
case 10:
if (A) { step = 15; continue; }
case 14:
step = 17;
case 17:
v3 = (f3 = f3 || this_tok_inputCharAt_offset(pos+2))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 18;
case 18:
A =  v3 !== 0x30 ;  
step = 15;
case 15:
if (A) { step = 20; continue; }
case 19:
step = 22;
case 22:
v4 = (f4 = f4 || this_tok_inputCharAt_offset(pos+3))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 23;
case 23:
A =  v4 !== 0x36; 
step = 20;
case 20:
if (!A) { step = 25; continue; }
step = 24;
case 24:
return 0;
case 25:
step = 27;
case 27:
v5 = (f5 = f5 || this_tok_inputCharAt_offset(pos+4))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 28;
case 28:
 c = v5;
      if (c !== 0x37) { step = 30; continue; }
step = 29;
case 29:
 return 0x67;
step = 30;
case 30:
if (c !== 0x39) { step = 33; continue; }
step = 32;
case 32:
 return 0x69;
step = 33;
case 33:
if (c !== 0x64) { step = 36; continue; }
step = 35;
case 35:
 return 0x6D;
step = 36;
case 36:
return 0;
return;
      }
    }
  };
}
  function this_tok_parseIdentifier(){
var step = 1;
var v0;
var f0;
return function inside_this_tok_parseIdentifier(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2;
case 2:
v0 = (f0 = f0 || this_tok_parseIdentifierRest())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
this_tok_pos = v0;
      return 13;
return;
      }
    }
  };
}
  function this_tok_parseIdentifierRest(){
var step = 1;
var v4, v3, v2, v1, v0;
var f4, f3, f2, f1, f0;
var pos, A, c, b, delta;
return function inside_this_tok_parseIdentifierRest(thawValue){
  while (true) {
    switch (step) {
      case 1:
// also used by regex flag parser!
pos = this_tok_pos + 1;
// note: statements in this loop are the second most executed statements
step = 2;
case 2:
// sequential lower case letters are very common, 5:2
        // combining lower and upper case letters here to reduce branching later https://twitter.com/mraleph/status/467277652110614528
          A = pos >= this_tok_len ;
if (!A) { step = 5; continue; }
case 4:
step = 7;
case 7:
v0 = (f0 = f0 || this_tok_getMoreInput(true))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 8;
case 8:
A =  !v0; 
step = 5;
case 5:
if (!A) { step = 10; continue; }
case 9:
 step = 3;
continue;
case 10:
step = 12;
case 12:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 13;
case 13:
 c = v1;
         b = c & 0xffdf;
step = 14;
case 14:
  A = b >= 0x41 ;
if (!A) { step = 17; continue; }
step = 16;
case 16:
 A =  b <= 0x5a; 
step = 17;
case 17:
if (A) { step = 20; continue; }
case 19:
 step = 15;
continue;
case 20:
A = ++pos >= this_tok_len ;
if (!A) { step = 23; continue; }
case 22:
step = 25;
case 25:
v2 = (f2 = f2 || this_tok_getMoreInput(true))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 26;
case 26:
A =  !v2; 
step = 23;
case 23:
if (!A) { step = 28; continue; }
case 27:
 step = 15;
continue;
case 28:
step = 30;
case 30:
v3 = (f3 = f3 || this_tok_inputCharAt_offset(pos))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 31;
case 31:
c = v3;
          b = c & 0xffdf;
step = 14;
continue
case 15:
step = 32;
case 32:
v4 = (f4 = f4 || this_tok_parseOtherIdentifierParts(c, pos))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 33;
case 33:
 delta = v4;
        if (delta) { step = 35; continue; }
case 34:
 step = 3;
continue;
case 35:
pos += delta;
step = 2;
continue
case 3:
return pos;
return;
      }
    }
  };
}
  function this_tok_parseOtherIdentifierParts(c, pos){
var step = 1;
var v0;
var f0;
var A;
return function inside_this_tok_parseOtherIdentifierParts(thawValue){
  while (true) {
    switch (step) {
      case 1:
// dont use ?: here; for build
      if (!(c >= 0x30)) { step = 3; continue; }
step = 2;
case 2:
    A = c <= 0x39 ;
if (A) { step = 6; continue; }
step = 5;
case 5:
 A =  c === 0x5f; 
step = 6;
case 6:
if (!A) { step = 9; continue; }
step = 8;
case 8:
 return 1; 
case 9:
step = 4;
continue;
case 3:
 if (c !== 0x24) { step = 12; continue; }
step = 11;
case 11:
 return 1;
// \uxxxx
case 4:
step = 12;
case 12:
if (c !== 0x5c) { step = 15; continue; }
step = 14;
case 14:
// TOFIX: seems the atStart flag is ignored. make a test. (input is always passed on but was removed at the finger print of func)
        step = 17; case 17:
v0 = (f0 = f0 || this_tok_parseAndValidateUnicodeAsIdentifier(pos, false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 18;
case 18:
return 6;
step = 15;
case 15:
if (!(c > 127)) { step = 20; continue; }
step = 19;
case 19:
if (!(uniRegex.test(String.fromCharCode(c)))) { step = 23; continue; }
step = 22;
case 22:
return 1;
// dont throw; could be PS/LS...
case 23:
step = 20;
case 20:
return 0;
return;
      }
    }
  };
}
  function this_tok_parseAndValidateUnicodeAsIdentifier(pos, atStart){
var step = 1;
var v6, v5, v4, v3, v2, v1, v0;
var f6, f5, f4, f3, f2, f1, f0;
var A, u, b;
return function inside_this_tok_parseAndValidateUnicodeAsIdentifier(thawValue){
  while (true) {
    switch (step) {
      case 1:
if (!(pos+1 >= this_tok_len)) { step = 3; continue; }
case 2:
 step = 5; case 5:
v0 = (f0 = f0 || this_tok_getMoreInput(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
case 3:
step = 7;
case 7:
v1 = (f1 = f1 || this_tok_inputCharAt_offset(pos + 1))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
 A = v1 === 0x75 ;
if (!A) { step = 10; continue; }
case 9:
step = 12;
case 12:
v2 = (f2 = f2 || this_tok_parseUnicodeEscapeBody(pos + 2))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 13;
case 13:
A =  v2; 
step = 10;
case 10:
if (!A) { step = 15; continue; }
step = 14;
case 14:
// parseUnicodeEscapeBody will ensure enough input for this slice
step = 17;
case 17:
v3 = (f3 = f3 || this_tok_inputSlice_offset(pos+2, pos+6))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 18;
case 18:
 u = parseInt(v3, 16);
         b = u & 0xffdf;
          A = b >= 0x41 ;
if (!A) { step = 20; continue; }
step = 19;
case 19:
 A =  b <= 0x5a; 
step = 20;
case 20:
if (!A) { step = 23; continue; }
step = 22;
case 22:
return true;
step = 23;
case 23:
  A = u >= 0x30 ;
if (!A) { step = 26; continue; }
step = 25;
case 25:
 A =  u <= 0x39; 
step = 26;
case 26:
if (!A) { step = 29; continue; }
step = 28;
case 28:
if (!atStart) { step = 32; continue; }
case 31:
 step = 34; case 34:
v4 = (f4 = f4 || this_tok_throwSyntaxError('Digit not allowed at start of identifier, not even escaped'))(thawValue);
if (frozen) return v4;
else f4 = null;
case 35:
step = 32;
case 32:
return true;
step = 29;
case 29:
  A = u === 0x5f ;
if (A) { step = 37; continue; }
step = 36;
case 36:
 A =  u === 0x24; 
step = 37;
case 37:
if (!A) { step = 40; continue; }
step = 39;
case 39:
return true;
step = 40;
case 40:
if (!(uniRegex.test(String.fromCharCode(u)))) { step = 43; continue; }
step = 42;
case 42:
return true;
case 43:
step = 45; case 45:
v5 = (f5 = f5 || this_tok_throwSyntaxError('Encountered \\u escape ('+u+') but the char is not a valid identifier part'))(thawValue);
if (frozen) return v5;
else f5 = null;
case 46:
step = 15;
case 15:
this_tok_pos = pos;
      step = 47; case 47:
v6 = (f6 = f6 || this_tok_throwSyntaxError('Unexpected backslash inside identifier'))(thawValue);
if (frozen) return v6;
else f6 = null;
step = 48;
case 48:
return;
      }
    }
  };
}
  function this_tok_getLastValue(){
var step = 1;
var v0;
var f0;
return function inside_this_tok_getLastValue(thawValue){
  while (true) {
    switch (step) {
      case 1:
//      return this.input.substring(this.lastOffset, this.lastStop);
step = 2;
case 2:
v0 = (f0 = f0 || this_tok_inputSlice_offset(this_tok_lastOffset, this_tok_lastStop))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
return v0;
//      return this.input.substr(this.lastOffset, this.lastLen);
// this seems slightly slower
//      var val = this.lastValue;
//      if (!val) {
//        val = this.lastValue = this.input.substring(this.lastOffset, this.lastStop);
//      }
//      return val;
return;
      }
    }
  };
}
  function this_tok_getNum(offset){
var step = 1;
var v0;
var f0;
return function inside_this_tok_getNum(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2;
case 2:
v0 = (f0 = f0 || this_tok_inputCharAt_offset(this_tok_lastOffset + offset))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
return v0;
return;
      }
    }
  };
}
  function this_tok_throwSyntaxError(message){
var step = 1;
var pos, inp;
return function inside_this_tok_throwSyntaxError(thawValue){
  while (true) {
    switch (step) {
      case 1:
if (!(this_tok_options.neverThrow)) { step = 3; continue; }
step = 2;
case 2:
if (!(this_tok_options.onToken)) { step = 6; continue; }
step = 5;
case 5:
 this_tok_options.onToken.call(null, 16);
step = 6;
case 6:
if (!(this_tok_options.saveTokens)) { step = 9; continue; }
step = 8;
case 8:
 this_tok_tokens.push({type:16}); // TOFIX improve
step = 9;
case 9:
return; // TOFIX: do we consume? either we do and we risk consuming tokens for no reason or we dont and we risk infinite loops.
step = 3;
case 3:
 pos = (this_tok_lastStop === this_tok_pos) ? this_tok_lastOffset : this_tok_pos;
       inp = this_tok_input;
      throw message+'. A syntax error at pos='+pos+' Search for #|#: `'+inp.substring(pos-2000, pos)+'#|#'+inp.substring(pos, pos+2000)+'`';
return;
      }
    }
  };
}
  function this_tok_inputCharAt_offset(pos){
var step = 1;
return function inside_this_tok_inputCharAt_offset(thawValue){
  while (true) {
    switch (step) {
      case 1:
// proxy method to take care of subtracting the offset from the position
      // in the regular build the offset is always zero so we can optimize this call.
      // warning: this function is replaced for the regular build. dont do anything fancy in here!
      return this_tok_input.charCodeAt(pos - this_tok_offset);
return;
      }
    }
  };
}
  function this_tok_inputSlice_offset(from, to){
var step = 1;
return function inside_this_tok_inputSlice_offset(thawValue){
  while (true) {
    switch (step) {
      case 1:
// proxy method to take care of subtracting the offset from the position
      // in the regular build the offset is always zero so we can optimize this call.
      // warning: this function is replaced for the regular build. dont do anything fancy in here!
      return this_tok_input.slice(from - this_tok_offset, to - this_tok_offset);
return;
      }
    }
  };
}
// punctuator occurrence stats: http://qfox.nl/weblog/301
  // token start stats: http://qfox.nl/weblog/302
// TOFIX: should `/x/y()` and `new /x/y()` be allowed? firefox used to do this, legacy syntax?
  // TOFIX: ASI messes up white index? difference in token index and white index...
// indices match slots of the start-regexes (where applicable)
  // this order is determined by regex/parser rules so they are fixed
// WHITE_SPACE LINETERMINATOR COMMENT_SINGLE COMMENT_MULTI
// reverse lookup (only used for error messages..)
  var typeToString = {};
  typeToString[10] = 'string';
  typeToString[7] = 'number';
  typeToString[8] = 'regex';
  typeToString[9] = 'punctuator';
  typeToString[13] = 'identifier';
  typeToString[14] = 'eof';
  typeToString[15] = 'asi';
  typeToString[16] = 'error';
  typeToString[18] = 'white space';
// note: making REQUIRED `true` wont change the test outcome, but does allow the parser
  // to parse beyond input (and bail on the bad cases anyways, with random errors).
// \n
      // \r
/**
   * Tokenizer for JS. After initializing the constructor
   * you can fetch the next tokens by calling this_tok_next()
   * if the next token could be a division, or this_tok_nextExpr()
   * if the next token could be a regular expression.
   * Obviously you'll need a parser (or magic) to determine this.
   *
   * @constructor
   * @param {string} input
   */
  var Tok = exports.Tok = function(input, opt){
    var options = this_tok_options = {
      saveToken: false,
      createBlackStream: false,
      regexNoClassEscape: false,
      neverThrow: false,
      onToken: null,
      allowCallAssignment: false,
      skipRegexFlagCheck: false,
    };
if (opt.saveTokens) options.saveTokens = true;
    if (opt.createBlackStream) options.createBlackStream = true;
    if (opt.regexNoClassEscape) options.regexNoClassEscape = true;
    if (opt.neverThrow) options.neverThrow = true; // warning: not yet battle hardened yet
    if (opt.onToken) options.onToken = opt.onToken;
    if (opt.skipRegexFlagCheck) options.skipRegexFlagCheck = opt.skipRegexFlagCheck;
{{{{ var A = input; }} if (!A) {{A = ''; }}}this_tok_input = (A);
    }this_tok_len = this_tok_input.length;
// v8 "appreciates" it when all instance properties are set explicitly
    this_tok_pos = 0;
    this_tok_offset = 0;
    this_tok_reachedEof = false;
this_tok_lastOffset = 0;
    this_tok_lastStop = 0;
    this_tok_lastLen = 0;
    this_tok_lastType = 0;
    this_tok_lastNewline = false;
// 0 means uninitialized. if we ever parse a nul it probably results in a syntax error so the overhead is okay for that case.
    this_tok_firstTokenChar = 0;
this_tok_tokenCountAll = 0;
    this_tok_tokenCountBlack = 0;
if (options.saveTokens) {
      this_tok_tokens = [];
      if (options.createBlackStream) this_tok_black = [];
    }
// for testing the builds
    this['_getTrickedTokenCount'] = function(){ return this_tok_tokenCountAll; };
    this['_isFrozen'] = function(){ return frozen; };
    this['_thaw'] = function(){ frozen = false; };
    this['_nextToken'] = this_tok_nextAnyToken;
  };
// note: this causes deopt in chrome by this bug: https://code.google.com/p/v8/issues/detail?id=2246
  ;
//######### end of tok.js #########
//######### par.js #########
// If you see magic numbers and bools all over the place, it means this
// file has been post-processed by a build script. If you want to read
// this file, see https://github.com/qfox/zeparser2
// TOFIX: generate huge benchmark files and derive specific coding styles from them;
// - tabs vs spaces,
// - newline (cr/lf/crlf),
// - minified vs normal,
// - unicode identifiers/jquery/underscore heavy/uppercase,
// - if/else vs &&||,
// - labels usage (build script),
// TOFIX: `(c|1) === ORD_LS_2029` or `(c ^ ORD_PS_2028) <= 1` or `c === ORD_PS || c === ORD_LS`?
var this_par_options =  null;
  var this_par_tok =  null;
  function this_par_run(){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
var A;
return function inside_this_par_run(thawValue){
frozen = false;
  while (true) {
    switch (step) {
      case 1:
// prepare
      step = 2; case 2:
v0 = (f0 = f0 || this_tok_next(true))(thawValue);
if (frozen) {
          return v0;
        }
else f0 = null;
step = 3;
case 3:
// go!
      step = 4; case 4:
v1 = (f1 = f1 || this_par_parseStatements(false, '', false, ''))(thawValue);
if (frozen) {
          return v1;
        }
else f1 = null;
step = 5;
case 5:
A = this_tok_pos !== this_tok_len ;
if (A) { step = 7; continue; }
step = 6;
case 6:
 A =  this_tok_lastType !== 14; 
step = 7;
case 7:
if (!A) { step = 10; continue; }
case 9:
 step = 12; case 12:
v2 = (f2 = f2 || this_tok_throwSyntaxError('Did not complete parsing..'))(thawValue);
if (frozen) {
          return v2;
        }
else f2 = null;
case 13:
step = 10;
case 10:
if (!(this['frozenObject'])) { step = 15; continue; }
step = 14;
case 14:
 this['frozenObject'].frozen = false;
step = 15;
case 15:
return {
        par: this,
        tok: this_par_tok,
        options: this_par_options,
        whites: this_tok_tokens,
        blacks: this_tok_black,
        tokenCountWhite: this_tok_tokenCountAll,
        tokenCountBlack: this_tok_tokenCountBlack,
      };
return;
      }
    }
  };
}
  function this_par_parseStatements(inFunction, inLoop, inSwitch, labelSet){
var step = 1;
var v0;
var f0;
return function inside_this_par_parseStatements(thawValue){
  while (true) {
    switch (step) {
      case 1:
// note: statements are optional, this function might not parse anything
case 2:
step = 4;
case 4:
v0 = (f0 = f0 || this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, true, ''))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 5;
case 5:
if (v0) { step = 7; continue; }
case 6:
 step = 3;
continue;
case 7:
step = 2;
continue
case 3:
return;
      }
    }
  };
}
  function this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, optional, freshLabels){
var step = 1;
var v1, v0;
var f1, f0;
return function inside_this_par_parseStatement(thawValue){
  while (true) {
    switch (step) {
      case 1:
if (this_tok_lastType !== 13) { step = 3; continue; }
case 2:
step = 5; case 5:
v0 = (f0 = f0 || this_par_parseIdentifierStatement(inFunction, inLoop, inSwitch, labelSet, freshLabels))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
return true;
// can be false for close curly and eof
case 3:
step = 7;
case 7:
v1 = (f1 = f1 || this_par_parseNonIdentifierStatement(inFunction, inLoop, inSwitch, labelSet, optional))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
return v1;
return;
      }
    }
  };
}
  function this_par_parseNonIdentifierStatement(inFunction, inLoop, inSwitch, labelSet, optional) {
var step = 1;
var v3, v2, v1, v0;
var f3, f2, f1, f0;
var c;
return function inside_this_par_parseNonIdentifierStatement(thawValue){
  while (true) {
    switch (step) {
      case 1:
c = this_tok_firstTokenChar;
if (c !== 0x7d) { step = 3; continue; }
step = 2;
case 2:
  // 65.6%
        if (optional) { step = 6; continue; }
case 5:
 step = 8; case 8:
v0 = (f0 = f0 || this_tok_throwSyntaxError('Expected more input..'))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 9;
case 9:
 // {if(x)}
step = 6;
case 6:
return false;
step = 3;
case 3:
if (c !== 0x7b) { step = 11; continue; }
step = 10;
case 10:
  // 33.2%
        step = 13; case 13:
v1 = (f1 = f1 || this_tok_next(true))(thawValue);
if (frozen) return v1;
else f1 = null;
case 14:
step = 15; case 15:
v2 = (f2 = f2 || this_par_parseBlock(true, inFunction, inLoop, inSwitch, labelSet))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 16;
case 16:
return true;
case 11:
step = 17;
case 17:
v3 = (f3 = f3 || this_par_parseNonIdentifierStatementNonCurly(c, optional))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 18;
case 18:
return v3;
return;
      }
    }
  };
}
  function this_par_parseNonIdentifierStatementNonCurly(c, optional){
var step = 1;
var v9, v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f9, f8, f7, f6, f5, f4, f3, f2, f1, f0;
var A, type;
return function inside_this_par_parseNonIdentifierStatementNonCurly(thawValue){
  while (true) {
    switch (step) {
      case 1:
// relative to this function: punc=96%, string=4%, number=1%, rest 0%
if (c !== 0x28) { step = 3; continue; }
step = 2;
case 2:
  // 56%
        step = 5; case 5:
v0 = (f0 = f0 || this_par_parseExpressionStatement())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
return true;
step = 3;
case 3:
if (c !== 0x3b) { step = 8; continue; }
step = 7;
case 7:
  // 26% empty statement
        // this shouldnt occur very often, but they still do.
        step = 10; case 10:
v1 = (f1 = f1 || this_tok_next(true))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 11;
case 11:
return true;
step = 8;
case 8:
  A = c === 0x2b ;
if (A) { step = 13; continue; }
step = 12;
case 12:
 A =  c === 0x2d; 
step = 13;
case 13:
if (!A) { step = 16; continue; }
step = 15;
case 15:
  // 5% 3%
step = 18;
case 18:
v2 = (f2 = f2 || this_tok_getNum(1))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 19;
case 19:
 A = v2 === c ;
if (A) { step = 21; continue; }
step = 20;
case 20:
 A =  this_tok_lastLen === 1; 
step = 21;
case 21:
if (!A) { step = 24; continue; }
case 23:
step = 26; case 26:
v3 = (f3 = f3 || this_par_parseExpressionStatement())(thawValue);
if (frozen) return v3;
else f3 = null;
step = 27;
case 27:
return true;
case 24:
step = 28; case 28:
v4 = (f4 = f4 || this_tok_throwSyntaxError('Statement cannot start with binary op'))(thawValue);
if (frozen) return v4;
else f4 = null;
case 29:
step = 16;
case 16:
 type = this_tok_lastType;
// rare
        A = type === 10 ;
if (A) { step = 31; continue; }
step = 30;
case 30:
 A =  c === 0x5b; 
step = 31;
case 31:
if (!A) { step = 34; continue; }
step = 33;
case 33:
  // 4% 2%
        step = 36; case 36:
v5 = (f5 = f5 || this_par_parseExpressionStatement())(thawValue);
if (frozen) return v5;
else f5 = null;
step = 37;
case 37:
return true;
// almost never
step = 34;
case 34:
if (c !== 0x21) { step = 39; continue; }
step = 38;
case 38:
  // 2%
        if (this_tok_lastLen !== 1) { step = 42; continue; }
case 41:
step = 44; case 44:
v6 = (f6 = f6 || this_par_parseExpressionStatement())(thawValue);
if (frozen) return v6;
else f6 = null;
step = 45;
case 45:
return true;
case 42:
step = 46; case 46:
v7 = (f7 = f7 || this_tok_throwSyntaxError('Statement cannot start with binary op'))(thawValue);
if (frozen) return v7;
else f7 = null;
step = 47;
case 47:
// now you're just running tests
step = 39;
case 39:
  A = type === 7 ;
if (A) { step = 49; continue; }
step = 48;
case 48:
 A =  c === 0x7e ;  
step = 49;
case 49:
if (A) { step = 52; continue; }
step = 51;
case 51:
 A =  type === 8; 
step = 52;
case 52:
if (!A) { step = 55; continue; }
step = 54;
case 54:
  // 1% 0% 0%
        step = 57; case 57:
v8 = (f8 = f8 || this_par_parseExpressionStatement())(thawValue);
if (frozen) return v8;
else f8 = null;
step = 58;
case 58:
return true;
// note: need this check because EOF is always valid at the end of the
      // program and, I think, will always trigger once, of course.
step = 55;
case 55:
if (optional) { step = 60; continue; }
case 59:
 step = 62; case 62:
v9 = (f9 = f9 || this_tok_throwSyntaxError('Expected more input..'))(thawValue);
if (frozen) return v9;
else f9 = null;
step = 63;
case 63:
// EOF (I dont think there's any other valid reason?)
step = 60;
case 60:
return false;
return;
      }
    }
  };
}
  function this_par_parseIdentifierStatement(inFunction, inLoop, inSwitch, labelSet, freshLabels){
var step = 1;
var v17, v16, v15, v14, v13, v12, v11, v10, v9, v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f17, f16, f15, f14, f13, f12, f11, f10, f9, f8, f7, f6, f5, f4, f3, f2, f1, f0;
var value, len, c;
return function inside_this_par_parseIdentifierStatement(thawValue){
  while (true) {
    switch (step) {
      case 1:
// The current token is an identifier. Either its value will be
      // checked in this function (parseIdentifierStatement) or in the
      // parseExpressionOrLabel function. So we can just get it now.
step = 2;
case 2:
v0 = (f0 = f0 || this_tok_getLastValue())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 value = v0;
len = this_tok_lastLen;
// yes, this check makes a *huge* difference
      if (!(len >= 2)) { step = 5; continue; }
step = 4;
case 4:
// bcdfirstvw, not in that order.
         c = this_tok_firstTokenChar;
if (c !== 0x74) { step = 8; continue; }
step = 7;
case 7:
if (!(len !== 4)) { step = 11; continue; }
step = 10;
case 10:
  // often `this`, only 7% (abs) passes here
            if (!(value === 'try')) { step = 14; continue; }
case 13:
step = 16;
case 16:
v1 = (f1 = f1 || this_par_parseTry(inFunction, inLoop, inSwitch, labelSet))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 17;
case 17:
return v1;
step = 14;
case 14:
if (!(value === 'throw')) { step = 19; continue; }
case 18:
step = 21;
case 21:
v2 = (f2 = f2 || this_par_parseThrow())(thawValue);
if (frozen) return v2;
else f2 = null;
step = 22;
case 22:
return v2;
case 19:
case 11:
step = 9;
continue;
case 8:
 if (c !== 0x69) { step = 24; continue; }
step = 23;
case 23:
if (!(value === 'if')) { step = 27; continue; }
case 26:
step = 29;
case 29:
v3 = (f3 = f3 || this_par_parseIf(inFunction, inLoop, inSwitch, labelSet))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 30;
case 30:
return v3;
case 27:
step = 25;
continue;
case 24:
 if (c !== 0x76) { step = 32; continue; }
step = 31;
case 31:
if (!(value === 'var')) { step = 35; continue; }
case 34:
step = 37;
case 37:
v4 = (f4 = f4 || this_par_parseVar())(thawValue);
if (frozen) return v4;
else f4 = null;
step = 38;
case 38:
return v4;
case 35:
step = 33;
continue;
case 32:
 if (c !== 0x72) { step = 40; continue; }
step = 39;
case 39:
if (!(value === 'return')) { step = 43; continue; }
case 42:
step = 45;
case 45:
v5 = (f5 = f5 || this_par_parseReturn(inFunction))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 46;
case 46:
return v5;
case 43:
step = 41;
continue;
case 40:
 if (c !== 0x66) { step = 48; continue; }
step = 47;
case 47:
if (!(value === 'for')) { step = 51; continue; }
case 50:
step = 53;
case 53:
v6 = (f6 = f6 || this_par_parseFor(inFunction, inSwitch, labelSet, inLoop+freshLabels))(thawValue);
if (frozen) return v6;
else f6 = null;
step = 54;
case 54:
return v6;
step = 51;
case 51:
if (!(value === 'function')) { step = 56; continue; }
case 55:
step = 58;
case 58:
v7 = (f7 = f7 || this_par_parseFunction(true))(thawValue);
if (frozen) return v7;
else f7 = null;
step = 59;
case 59:
return v7;
case 56:
step = 49;
continue;
case 48:
 if (c !== 0x63) { step = 61; continue; }
step = 60;
case 60:
if (!(value === 'case')) { step = 64; continue; }
case 63:
step = 66;
case 66:
v8 = (f8 = f8 || this_par_parseCase(inSwitch))(thawValue);
if (frozen) return v8;
else f8 = null;
step = 67;
case 67:
return v8;
step = 64;
case 64:
if (!(value === 'continue')) { step = 69; continue; }
case 68:
step = 71;
case 71:
v9 = (f9 = f9 || this_par_parseContinue(inLoop, labelSet))(thawValue);
if (frozen) return v9;
else f9 = null;
step = 72;
case 72:
return v9;
case 69:
step = 62;
continue;
case 61:
 if (c !== 0x62) { step = 74; continue; }
step = 73;
case 73:
if (!(value === 'break')) { step = 77; continue; }
case 76:
step = 79;
case 79:
v10 = (f10 = f10 || this_par_parseBreak(inLoop, inSwitch, labelSet))(thawValue);
if (frozen) return v10;
else f10 = null;
step = 80;
case 80:
return v10;
case 77:
step = 75;
continue;
case 74:
 if (c !== 0x64) { step = 82; continue; }
step = 81;
case 81:
if (!(value === 'default')) { step = 85; continue; }
case 84:
step = 87;
case 87:
v11 = (f11 = f11 || this_par_parseDefault(inSwitch))(thawValue);
if (frozen) return v11;
else f11 = null;
step = 88;
case 88:
return v11;
step = 85;
case 85:
if (!(value === 'do')) { step = 90; continue; }
case 89:
step = 92;
case 92:
v12 = (f12 = f12 || this_par_parseDo(inFunction, inSwitch, labelSet, inLoop+freshLabels))(thawValue);
if (frozen) return v12;
else f12 = null;
step = 93;
case 93:
return v12;
step = 90;
case 90:
if (!(value === 'debugger')) { step = 95; continue; }
case 94:
step = 97;
case 97:
v13 = (f13 = f13 || this_par_parseDebugger())(thawValue);
if (frozen) return v13;
else f13 = null;
step = 98;
case 98:
return v13;
case 95:
step = 83;
continue;
case 82:
 if (c !== 0x73) { step = 100; continue; }
step = 99;
case 99:
if (!(value === 'switch')) { step = 103; continue; }
case 102:
step = 105;
case 105:
v14 = (f14 = f14 || this_par_parseSwitch(inFunction, inLoop, labelSet))(thawValue);
if (frozen) return v14;
else f14 = null;
step = 106;
case 106:
return v14;
case 103:
step = 101;
continue;
case 100:
 if (c !== 0x77) { step = 108; continue; }
step = 107;
case 107:
if (!(value === 'while')) { step = 111; continue; }
case 110:
step = 113;
case 113:
v15 = (f15 = f15 || this_par_parseWhile(inFunction, inSwitch, labelSet, inLoop+freshLabels))(thawValue);
if (frozen) return v15;
else f15 = null;
step = 114;
case 114:
return v15;
step = 111;
case 111:
if (!(value === 'with')) { step = 116; continue; }
case 115:
step = 118;
case 118:
v16 = (f16 = f16 || this_par_parseWith(inFunction, inLoop, inSwitch, labelSet))(thawValue);
if (frozen) return v16;
else f16 = null;
step = 119;
case 119:
return v16;
case 116:
step = 9;
case 9:
case 25:
step = 33;
case 33:
case 41:
step = 49;
case 49:
case 62:
step = 75;
case 75:
case 83:
case 101:
step = 108;
case 108:
// this function _must_ parse _something_, if we parsed nothing, it's an expression statement or labeled statement
case 5:
step = 120; case 120:
v17 = (f17 = f17 || this_par_parseExpressionOrLabel(value, inFunction, inLoop, inSwitch, labelSet, freshLabels))(thawValue);
if (frozen) return v17;
else f17 = null;
step = 121;
case 121:
return;
      }
    }
  };
}
  function this_par_parseStatementHeader(){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
return function inside_this_par_parseStatementHeader(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2; case 2:
v0 = (f0 = f0 || this_tok_mustBeNum(0x28, true))(thawValue);
if (frozen) return v0;
else f0 = null;
case 3:
step = 4; case 4:
v1 = (f1 = f1 || this_par_parseExpressions())(thawValue);
if (frozen) return v1;
else f1 = null;
case 5:
step = 6; case 6:
v2 = (f2 = f2 || this_tok_mustBeNum(0x29, true))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 7;
case 7:
return;
      }
    }
  };
}
  function this_par_parseVar(){
var step = 1;
var v7, v6, v5, v4, v3, v2, v1, v0;
var f7, f6, f5, f4, f3, f2, f1, f0;
var A;
return function inside_this_par_parseVar(thawValue){
  while (true) {
    switch (step) {
      case 1:
// var <vars>
      // - foo
      // - foo=bar
      // - ,foo=bar
step = 2; case 2:
v0 = (f0 = f0 || this_tok_next(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
case 4:
step = 6;
case 6:
v1 = (f1 = f1 || this_par_isReservedIdentifier(false))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 7;
case 7:
if (!v1) { step = 9; continue; }
case 8:
 step = 11; case 11:
v2 = (f2 = f2 || this_tok_throwSyntaxError('Var name is reserved'))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 12;
case 12:
case 9:
step = 13; case 13:
v3 = (f3 = f3 || this_tok_mustBeIdentifier(true))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 14;
case 14:
A = this_tok_firstTokenChar === 0x3d ;
if (!A) { step = 16; continue; }
step = 15;
case 15:
 A =  this_tok_lastLen === 1; 
step = 16;
case 16:
if (!A) { step = 19; continue; }
case 18:
step = 21; case 21:
v4 = (f4 = f4 || this_tok_next(true))(thawValue);
if (frozen) return v4;
else f4 = null;
case 22:
step = 23; case 23:
v5 = (f5 = f5 || this_par_parseExpression())(thawValue);
if (frozen) return v5;
else f5 = null;
step = 24;
case 24:
case 19:
step = 25;
case 25:
v6 = (f6 = f6 || this_tok_nextExprIfNum(0x2c))(thawValue);
if (frozen) return v6;
else f6 = null;
step = 26;
case 26:
if(v6) { step = 4; continue; }
case 5:
step = 27; case 27:
v7 = (f7 = f7 || this_par_parseSemi())(thawValue);
if (frozen) return v7;
else f7 = null;
step = 28;
case 28:
return;
      }
    }
  };
}
  function this_par_parseVarPartNoIn(){
var step = 1;
var v6, v5, v4, v3, v2, v1, v0;
var f6, f5, f4, f3, f2, f1, f0;
var vars, A;
return function inside_this_par_parseVarPartNoIn(thawValue){
  while (true) {
    switch (step) {
      case 1:
vars = 0;
case 2:
step = 4;
case 4:
v0 = (f0 = f0 || this_par_isReservedIdentifier(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 5;
case 5:
if (!v0) { step = 7; continue; }
case 6:
step = 11;
case 11:
v2 = (f2 = f2 || this_tok_getLastValue())(thawValue);
if (frozen) return v2;
else f2 = null;
case 12:
step = 9; case 9:
v1 = (f1 = f1 || this_tok_throwSyntaxError('Var name ['+v2+'] is reserved'))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 10;
case 10:
case 7:
step = 13; case 13:
v3 = (f3 = f3 || this_tok_mustBeIdentifier(true))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 14;
case 14:
++vars;
A = this_tok_firstTokenChar === 0x3d ;
if (!A) { step = 16; continue; }
step = 15;
case 15:
 A =  this_tok_lastLen === 1; 
step = 16;
case 16:
if (!A) { step = 19; continue; }
case 18:
step = 21; case 21:
v4 = (f4 = f4 || this_tok_next(true))(thawValue);
if (frozen) return v4;
else f4 = null;
case 22:
step = 23; case 23:
v5 = (f5 = f5 || this_par_parseExpressionNoIn())(thawValue);
if (frozen) return v5;
else f5 = null;
step = 24;
case 24:
case 19:
step = 25;
case 25:
v6 = (f6 = f6 || this_tok_nextExprIfNum(0x2c))(thawValue);
if (frozen) return v6;
else f6 = null;
step = 26;
case 26:
if(v6) { step = 2; continue; }
step = 3;
case 3:
return vars === 1;
return;
      }
    }
  };
}
  function this_par_parseIf(inFunction, inLoop, inSwitch, labelSet){
var step = 1;
var v5, v4, v3, v2, v1, v0;
var f5, f4, f3, f2, f1, f0;
return function inside_this_par_parseIf(thawValue){
  while (true) {
    switch (step) {
      case 1:
// if (<exprs>) <stmt>
      // if (<exprs>) <stmt> else <stmt>
step = 2; case 2:
v0 = (f0 = f0 || this_tok_next(false))(thawValue);
if (frozen) return v0;
else f0 = null;
case 3:
step = 4; case 4:
v1 = (f1 = f1 || this_par_parseStatementHeader())(thawValue);
if (frozen) return v1;
else f1 = null;
case 5:
step = 6; case 6:
v2 = (f2 = f2 || this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, false, ''))(thawValue);
if (frozen) return v2;
else f2 = null;
case 7:
step = 8;
case 8:
v3 = (f3 = f3 || this_tok_getLastValue())(thawValue);
if (frozen) return v3;
else f3 = null;
step = 9;
case 9:
if (!(v3 === 'else')) { step = 11; continue; }
case 10:
step = 13; case 13:
v4 = (f4 = f4 || this_tok_next(true))(thawValue);
if (frozen) return v4;
else f4 = null;
case 14:
step = 15; case 15:
v5 = (f5 = f5 || this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, false, ''))(thawValue);
if (frozen) return v5;
else f5 = null;
case 16:
step = 11;
case 11:
return;
      }
    }
  };
}
  function this_par_parseDo(inFunction, inSwitch, labelSet, inLoop){
var step = 1;
var v6, v5, v4, v3, v2, v1, v0;
var f6, f5, f4, f3, f2, f1, f0;
var B, A;
return function inside_this_par_parseDo(thawValue){
  while (true) {
    switch (step) {
      case 1:
// do <stmt> while ( <exprs> ) ;
step = 2; case 2:
v0 = (f0 = f0 || this_tok_next(true))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 // do
        B =  inLoop ;
if (B) { step = 5; continue; }
step = 4;
case 4:
 B =  ' '; 
case 5:
step = 7; case 7:
v1 = (f1 = f1 || this_par_parseStatement(inFunction,B, inSwitch, labelSet, false, ''))(thawValue);
if (frozen) return v1;
else f1 = null;
case 8:
step = 9; case 9:
v2 = (f2 = f2 || this_tok_mustBeString('while', false))(thawValue);
if (frozen) return v2;
else f2 = null;
case 10:
step = 11; case 11:
v3 = (f3 = f3 || this_tok_mustBeNum(0x28, true))(thawValue);
if (frozen) return v3;
else f3 = null;
case 12:
step = 13; case 13:
v4 = (f4 = f4 || this_par_parseExpressions())(thawValue);
if (frozen) return v4;
else f4 = null;
case 14:
step = 15; case 15:
v5 = (f5 = f5 || this_tok_mustBeNum(0x29, true))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 16;
case 16:
// spec requires the semi but browsers made it optional
        A = this_par_options.requireDoWhileSemi ;
if (A) { step = 18; continue; }
step = 17;
case 17:
 A =  this_tok_firstTokenChar === 0x3b; 
step = 18;
case 18:
if (!A) { step = 21; continue; }
case 20:
step = 23; case 23:
v6 = (f6 = f6 || this_par_parseSemi())(thawValue);
if (frozen) return v6;
else f6 = null;
case 24:
step = 21;
case 21:
return;
      }
    }
  };
}
  function this_par_parseWhile(inFunction, inSwitch, labelSet, inLoop){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
var B;
return function inside_this_par_parseWhile(thawValue){
  while (true) {
    switch (step) {
      case 1:
// while ( <exprs> ) <stmt>
step = 2; case 2:
v0 = (f0 = f0 || this_tok_next(false))(thawValue);
if (frozen) return v0;
else f0 = null;
case 3:
step = 4; case 4:
v1 = (f1 = f1 || this_par_parseStatementHeader())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 5;
case 5:
B =  inLoop ;
if (B) { step = 7; continue; }
step = 6;
case 6:
 B =  ' '; 
case 7:
step = 9; case 9:
v2 = (f2 = f2 || this_par_parseStatement(inFunction,B, inSwitch, labelSet, false, ''))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 10;
case 10:
return;
      }
    }
  };
}
  function this_par_parseFor(inFunction, inSwitch, labelSet, inLoop){
var step = 1;
var v14, v13, v12, v11, v10, v9, v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f14, f13, f12, f11, f10, f9, f8, f7, f6, f5, f4, f3, f2, f1, f0;
var validForInLhs, A, B;
return function inside_this_par_parseFor(thawValue){
  while (true) {
    switch (step) {
      case 1:
// for ( <expr-no-in-=> in <exprs> ) <stmt>
      // for ( var <idntf> in <exprs> ) <stmt>
      // for ( var <idntf> = <expr-no-in> in <exprs> ) <stmt>
      // for ( <expr-no-in> ; <expr> ; <expr> ) <stmt>
step = 2; case 2:
v0 = (f0 = f0 || this_tok_next(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 // for
      step = 4; case 4:
v1 = (f1 = f1 || this_tok_mustBeNum(0x28, true))(thawValue);
if (frozen) return v1;
else f1 = null;
case 5:
step = 6;
case 6:
v2 = (f2 = f2 || this_tok_nextExprIfNum(0x3b))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 7;
case 7:
if (!v2) { step = 9; continue; }
case 8:
 step = 11; case 11:
v3 = (f3 = f3 || this_par_parseForEachHeader())(thawValue);
if (frozen) return v3;
else f3 = null;
step = 12;
case 12:
 // empty first expression in for-each
step = 10;
continue;
case 9:
validForInLhs;
A = this_tok_firstTokenChar === 0x76 ;
if (!A) { step = 14; continue; }
case 13:
step = 16;
case 16:
v4 = (f4 = f4 || this_tok_nextPuncIfString('var'))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 17;
case 17:
A =  v4; 
step = 14;
case 14:
if (!A) { step = 19; continue; }
case 18:
step = 21;
case 21:
v5 = (f5 = f5 || this_par_parseVarPartNoIn())(thawValue);
if (frozen) return v5;
else f5 = null;
step = 22;
case 22:
validForInLhs = v5;
        // expression_s_ because it might be regular for-loop...
        // (though if it isn't, it can't have more than one expr)
step = 20;
continue;
case 19:
step = 23;
case 23:
v6 = (f6 = f6 || this_par_parseExpressionsNoIn())(thawValue);
if (frozen) return v6;
else f6 = null;
step = 24;
case 24:
validForInLhs = v6;
case 20:
step = 25;
case 25:
v7 = (f7 = f7 || this_tok_nextExprIfNum(0x3b))(thawValue);
if (frozen) return v7;
else f7 = null;
step = 26;
case 26:
if (!v7) { step = 28; continue; }
case 27:
 step = 30; case 30:
v8 = (f8 = f8 || this_par_parseForEachHeader())(thawValue);
if (frozen) return v8;
else f8 = null;
case 31:
step = 29;
continue;
case 28:
   A = this_tok_firstTokenChar !== 0x69 ;
if (A) { step = 33; continue; }
case 32:
step = 35;
case 35:
v9 = (f9 = f9 || this_tok_getNum(1))(thawValue);
if (frozen) return v9;
else f9 = null;
step = 36;
case 36:
A =  v9 !== 0x6e ;  
step = 33;
case 33:
if (A) { step = 38; continue; }
step = 37;
case 37:
 A =  this_tok_lastLen !== 2; 
step = 38;
case 38:
if (!A) { step = 41; continue; }
case 40:
 step = 43; case 43:
v10 = (f10 = f10 || this_tok_throwSyntaxError('Expected `in` or `;` here..'))(thawValue);
if (frozen) return v10;
else f10 = null;
case 44:
step = 42;
continue;
case 41:
   A = !validForInLhs ;
if (!A) { step = 46; continue; }
step = 45;
case 45:
 A =  this_par_options.strictForInCheck; 
step = 46;
case 46:
if (!A) { step = 49; continue; }
case 48:
 step = 51; case 51:
v11 = (f11 = f11 || this_tok_throwSyntaxError('Encountered illegal for-in lhs'))(thawValue);
if (frozen) return v11;
else f11 = null;
case 52:
step = 50;
continue;
case 49:
 step = 53; case 53:
v12 = (f12 = f12 || this_par_parseForInHeader())(thawValue);
if (frozen) return v12;
else f12 = null;
step = 54;
case 54:
case 50:
step = 42;
case 42:
case 29:
case 10:
step = 55; case 55:
v13 = (f13 = f13 || this_tok_mustBeNum(0x29, true))(thawValue);
if (frozen) return v13;
else f13 = null;
step = 56;
case 56:
B =  inLoop ;
if (B) { step = 58; continue; }
step = 57;
case 57:
 B =  ' '; 
case 58:
step = 60; case 60:
v14 = (f14 = f14 || this_par_parseStatement(inFunction,B, inSwitch, labelSet, false, ''))(thawValue);
if (frozen) return v14;
else f14 = null;
step = 61;
case 61:
return;
      }
    }
  };
}
  function this_par_parseForEachHeader(){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
return function inside_this_par_parseForEachHeader(thawValue){
  while (true) {
    switch (step) {
      case 1:
// <expr> ; <expr> ) <stmt>
step = 2; case 2:
v0 = (f0 = f0 || this_par_parseOptionalExpressions())(thawValue);
if (frozen) return v0;
else f0 = null;
case 3:
step = 4; case 4:
v1 = (f1 = f1 || this_tok_mustBeNum(0x3b, true))(thawValue);
if (frozen) return v1;
else f1 = null;
case 5:
step = 6; case 6:
v2 = (f2 = f2 || this_par_parseOptionalExpressions())(thawValue);
if (frozen) return v2;
else f2 = null;
step = 7;
case 7:
return;
      }
    }
  };
}
  function this_par_parseForInHeader(){
var step = 1;
var v1, v0;
var f1, f0;
return function inside_this_par_parseForInHeader(thawValue){
  while (true) {
    switch (step) {
      case 1:
// in <exprs> ) <stmt>
step = 2; case 2:
v0 = (f0 = f0 || this_tok_next(true))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 // `in` validated by `parseFor`
      step = 4; case 4:
v1 = (f1 = f1 || this_par_parseExpressions())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 5;
case 5:
return;
      }
    }
  };
}
  function this_par_parseContinue(inLoop, labelSet){
var step = 1;
var v6, v5, v4, v3, v2, v1, v0;
var f6, f5, f4, f3, f2, f1, f0;
var type, A, label;
return function inside_this_par_parseContinue(thawValue){
  while (true) {
    switch (step) {
      case 1:
// continue ;
      // continue <idntf> ;
      // newline right after keyword = asi
if (inLoop) { step = 3; continue; }
case 2:
 step = 5; case 5:
v0 = (f0 = f0 || this_tok_throwSyntaxError('Can only continue in a loop'))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
case 3:
step = 7;
case 7:
v1 = (f1 = f1 || this_tok_next(false))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
 type = v1; // token after continue cannot be a regex, either way.
A = type === 13 ;
if (!A) { step = 10; continue; }
step = 9;
case 9:
 A =  !this_tok_lastNewline; 
step = 10;
case 10:
if (!A) { step = 13; continue; }
case 12:
step = 15;
case 15:
v2 = (f2 = f2 || this_tok_getLastValue())(thawValue);
if (frozen) return v2;
else f2 = null;
step = 16;
case 16:
 label = v2;
          A = !labelSet ;
if (A) { step = 18; continue; }
step = 17;
case 17:
 A =  labelSet.indexOf(' '+label+' ') < 0; 
step = 18;
case 18:
if (!A) { step = 21; continue; }
case 20:
step = 23; case 23:
v3 = (f3 = f3 || this_tok_throwSyntaxError('Label ['+label+'] not found in label set ['+labelSet+']'))(thawValue);
if (frozen) return v3;
else f3 = null;
case 24:
step = 21;
case 21:
  A = !inLoop ;
if (A) { step = 26; continue; }
step = 25;
case 25:
 A =  inLoop.indexOf(' '+label+' ') < 0; 
step = 26;
case 26:
if (!A) { step = 29; continue; }
case 28:
step = 31; case 31:
v4 = (f4 = f4 || this_tok_throwSyntaxError('Label ['+label+'] is not a valid label for this loop'))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 32;
case 32:
case 29:
step = 33; case 33:
v5 = (f5 = f5 || this_tok_next(true))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 34;
case 34:
 // label (already validated)
// continue without a label. note that this doesnt "allow" non-identifiers since it'll require a semi/asi next.
case 13:
step = 35; case 35:
v6 = (f6 = f6 || this_par_parseSemi())(thawValue);
if (frozen) return v6;
else f6 = null;
step = 36;
case 36:
return;
      }
    }
  };
}
  function this_par_parseBreak(inLoop, inSwitch, labelSet){
var step = 1;
var v5, v4, v3, v2, v1, v0;
var f5, f4, f3, f2, f1, f0;
var type, A, label;
return function inside_this_par_parseBreak(thawValue){
  while (true) {
    switch (step) {
      case 1:
// break ;
      // break <idntf> ;
      // break \n <idntf> ;
      // newline right after keyword = asi
step = 2;
case 2:
v0 = (f0 = f0 || this_tok_next(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 type = v0; // token after break cannot be a regex, either way.
A = type !== 13 ;
if (A) { step = 5; continue; }
step = 4;
case 4:
 A =  this_tok_lastNewline; 
step = 5;
case 5:
if (!A) { step = 8; continue; }
step = 7;
case 7:
// break without a label. note that this doesnt "allow" non-identifiers since it'll require a semi/asi next.
          A = !inLoop ;
if (!A) { step = 11; continue; }
step = 10;
case 10:
 A =  !inSwitch; 
step = 11;
case 11:
if (!A) { step = 14; continue; }
step = 13;
case 13:
// break without label
          step = 16; case 16:
v1 = (f1 = f1 || this_tok_throwSyntaxError('Break without value only in loops or switches'))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 17;
case 17:
case 14:
step = 9;
continue;
case 8:
step = 18;
case 18:
v2 = (f2 = f2 || this_tok_getLastValue())(thawValue);
if (frozen) return v2;
else f2 = null;
step = 19;
case 19:
 label = v2;
          A = !labelSet ;
if (A) { step = 21; continue; }
step = 20;
case 20:
 A =  labelSet.indexOf(' '+label+' ') < 0; 
step = 21;
case 21:
if (!A) { step = 24; continue; }
case 23:
step = 26; case 26:
v3 = (f3 = f3 || this_tok_throwSyntaxError('Label ['+label+'] not found in label set ['+labelSet+']'))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 27;
case 27:
case 24:
step = 28; case 28:
v4 = (f4 = f4 || this_tok_next(true))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 29;
case 29:
 // label (already validated)
case 9:
step = 30; case 30:
v5 = (f5 = f5 || this_par_parseSemi())(thawValue);
if (frozen) return v5;
else f5 = null;
step = 31;
case 31:
return;
      }
    }
  };
}
  function this_par_parseReturn(inFunction){
var step = 1;
var v3, v2, v1, v0;
var f3, f2, f1, f0;
var A;
return function inside_this_par_parseReturn(thawValue){
  while (true) {
    switch (step) {
      case 1:
// return ;
      // return <exprs> ;
      // newline right after keyword = asi
A = !inFunction ;
if (!A) { step = 3; continue; }
step = 2;
case 2:
 A =  !this_par_options.functionMode; 
step = 3;
case 3:
if (!A) { step = 6; continue; }
case 5:
 step = 8; case 8:
v0 = (f0 = f0 || this_tok_throwSyntaxError('Can only return in a function'))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 9;
case 9:
case 6:
step = 10; case 10:
v1 = (f1 = f1 || this_tok_next(true))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 11;
case 11:
if (this_tok_lastNewline) { step = 13; continue; }
case 12:
 step = 15; case 15:
v2 = (f2 = f2 || this_par_parseOptionalExpressions())(thawValue);
if (frozen) return v2;
else f2 = null;
step = 16;
case 16:
case 13:
step = 17; case 17:
v3 = (f3 = f3 || this_par_parseSemi())(thawValue);
if (frozen) return v3;
else f3 = null;
step = 18;
case 18:
return;
      }
    }
  };
}
  function this_par_parseThrow(){
var step = 1;
var v3, v2, v1, v0;
var f3, f2, f1, f0;
return function inside_this_par_parseThrow(thawValue){
  while (true) {
    switch (step) {
      case 1:
// throw <exprs> ;
step = 2; case 2:
v0 = (f0 = f0 || this_tok_next(true))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
if (!this_tok_lastNewline) { step = 5; continue; }
case 4:
 step = 7; case 7:
v1 = (f1 = f1 || this_tok_throwSyntaxError('No newline allowed directly after a throw, ever'))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
case 5:
step = 9; case 9:
v2 = (f2 = f2 || this_par_parseExpressions())(thawValue);
if (frozen) return v2;
else f2 = null;
case 10:
step = 11; case 11:
v3 = (f3 = f3 || this_par_parseSemi())(thawValue);
if (frozen) return v3;
else f3 = null;
step = 12;
case 12:
return;
      }
    }
  };
}
  function this_par_parseSwitch(inFunction, inLoop, labelSet){
var step = 1;
var v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f8, f7, f6, f5, f4, f3, f2, f1, f0;
var value, defaults, A;
return function inside_this_par_parseSwitch(thawValue){
  while (true) {
    switch (step) {
      case 1:
// switch ( <exprs> ) { <switchbody> }
step = 2; case 2:
v0 = (f0 = f0 || this_tok_next(false))(thawValue);
if (frozen) return v0;
else f0 = null;
case 3:
step = 4; case 4:
v1 = (f1 = f1 || this_par_parseStatementHeader())(thawValue);
if (frozen) return v1;
else f1 = null;
case 5:
step = 6; case 6:
v2 = (f2 = f2 || this_tok_mustBeNum(0x7b, true))(thawValue);
if (frozen) return v2;
else f2 = null;
case 7:
step = 8;
case 8:
v3 = (f3 = f3 || this_tok_getLastValue())(thawValue);
if (frozen) return v3;
else f3 = null;
step = 9;
case 9:
 value = v3;
       defaults = 0;
      if (!(value === 'default')) { step = 11; continue; }
step = 10;
case 10:
 ++defaults;
step = 11;
case 11:
  A = value !== 'case' ;
if (!A) { step = 14; continue; }
step = 13;
case 13:
 A =  !defaults ;  
step = 14;
case 14:
if (!A) { step = 17; continue; }
step = 16;
case 16:
 A =  value !== '}'; 
step = 17;
case 17:
if (!A) { step = 20; continue; }
case 19:
 step = 22; case 22:
v4 = (f4 = f4 || this_tok_throwSyntaxError('Switch body must begin with case or default or be empty'))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 23;
case 23:
case 20:
case 24:
step = 26;
case 26:
v5 = (f5 = f5 || this_par_parseStatement(inFunction, inLoop, true, labelSet, true, ''))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 27;
case 27:
if (v5) { step = 29; continue; }
case 28:
 step = 25;
continue;
case 29:
// switches are quite infrequent so this overhead is okay, compared ot the alternatives
step = 31;
case 31:
v6 = (f6 = f6 || this_tok_getLastValue())(thawValue);
if (frozen) return v6;
else f6 = null;
step = 32;
case 32:
 A = v6 === 'default' ;
if (!A) { step = 34; continue; }
step = 33;
case 33:
 A =  ++defaults > 1; 
step = 34;
case 34:
if (!A) { step = 37; continue; }
case 36:
 step = 39; case 39:
v7 = (f7 = f7 || this_tok_throwSyntaxError('Only one default allowed per switch'))(thawValue);
if (frozen) return v7;
else f7 = null;
step = 40;
case 40:
case 37:
step = 24;
continue
case 25:
step = 41; case 41:
v8 = (f8 = f8 || this_tok_mustBeNum(0x7d, true))(thawValue);
if (frozen) return v8;
else f8 = null;
step = 42;
case 42:
return;
      }
    }
  };
}
  function this_par_parseCase(inSwitch){
var step = 1;
var v3, v2, v1, v0;
var f3, f2, f1, f0;
return function inside_this_par_parseCase(thawValue){
  while (true) {
    switch (step) {
      case 1:
if (inSwitch) { step = 3; continue; }
case 2:
 step = 5; case 5:
v0 = (f0 = f0 || this_tok_throwSyntaxError('Can only use case in a switch'))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
case 3:
step = 7; case 7:
v1 = (f1 = f1 || this_tok_next(true))(thawValue);
if (frozen) return v1;
else f1 = null;
case 8:
step = 9; case 9:
v2 = (f2 = f2 || this_par_parseExpressions())(thawValue);
if (frozen) return v2;
else f2 = null;
case 10:
step = 11; case 11:
v3 = (f3 = f3 || this_tok_mustBeNum(0x3a, false))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 12;
case 12:
return;
      }
    }
  };
}
  function this_par_parseDefault(inSwitch){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
return function inside_this_par_parseDefault(thawValue){
  while (true) {
    switch (step) {
      case 1:
if (inSwitch) { step = 3; continue; }
case 2:
 step = 5; case 5:
v0 = (f0 = f0 || this_tok_throwSyntaxError('Can only use default in a switch'))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
 // cant really hit this right now because label checks supersede it
case 3:
step = 7; case 7:
v1 = (f1 = f1 || this_tok_next(true))(thawValue);
if (frozen) return v1;
else f1 = null;
case 8:
step = 9; case 9:
v2 = (f2 = f2 || this_tok_mustBeNum(0x3a, false))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 10;
case 10:
return;
      }
    }
  };
}
  function this_par_parseTry(inFunction, inLoop, inSwitch, labelSet){
var step = 1;
var v4, v3, v2, v1, v0;
var f4, f3, f2, f1, f0;
var count;
return function inside_this_par_parseTry(thawValue){
  while (true) {
    switch (step) {
      case 1:
// try { <stmts> } catch ( <idntf> ) { <stmts> }
      // try { <stmts> } finally { <stmts> }
      // try { <stmts> } catch ( <idntf> ) { <stmts> } finally { <stmts> }
step = 2; case 2:
v0 = (f0 = f0 || this_tok_next(false))(thawValue);
if (frozen) return v0;
else f0 = null;
case 3:
step = 4; case 4:
v1 = (f1 = f1 || this_par_parseCompleteBlock(true, inFunction, inLoop, inSwitch, labelSet))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 5;
case 5:
count = this_tok_tokenCountAll;
      step = 6; case 6:
v2 = (f2 = f2 || this_par_parseCatch(inFunction, inLoop, inSwitch, labelSet))(thawValue);
if (frozen) return v2;
else f2 = null;
case 7:
step = 8; case 8:
v3 = (f3 = f3 || this_par_parseFinally(inFunction, inLoop, inSwitch, labelSet))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 9;
case 9:
if (count !== this_tok_tokenCountAll) { step = 11; continue; }
case 10:
 step = 13; case 13:
v4 = (f4 = f4 || this_tok_throwSyntaxError('Try must have at least a catch or finally block or both'))(thawValue);
if (frozen) return v4;
else f4 = null;
case 14:
step = 11;
case 11:
return;
      }
    }
  };
}
  function this_par_parseCatch(inFunction, inLoop, inSwitch, labelSet){
var step = 1;
var v7, v6, v5, v4, v3, v2, v1, v0;
var f7, f6, f5, f4, f3, f2, f1, f0;
var type;
return function inside_this_par_parseCatch(thawValue){
  while (true) {
    switch (step) {
      case 1:
// catch ( <idntf> ) { <stmts> }
step = 2;
case 2:
v0 = (f0 = f0 || this_tok_nextPuncIfString('catch'))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
if (!v0) { step = 5; continue; }
case 4:
step = 7;
case 7:
v1 = (f1 = f1 || this_tok_mustBeNum(0x28, false))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
 type = v1;
// catch var
        if (type !== 13) { step = 10; continue; }
case 9:
step = 12;
case 12:
v2 = (f2 = f2 || this_par_isReservedIdentifier(false))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 13;
case 13:
if (!v2) { step = 15; continue; }
case 14:
 step = 17; case 17:
v3 = (f3 = f3 || this_tok_throwSyntaxError('Catch scope var name is reserved'))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 18;
case 18:
case 15:
step = 19; case 19:
v4 = (f4 = f4 || this_tok_next(false))(thawValue);
if (frozen) return v4;
else f4 = null;
case 20:
step = 11;
continue;
case 10:
step = 21; case 21:
v5 = (f5 = f5 || this_tok_throwSyntaxError('Missing catch scope variable'))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 22;
case 22:
case 11:
step = 23; case 23:
v6 = (f6 = f6 || this_tok_mustBeNum(0x29, false))(thawValue);
if (frozen) return v6;
else f6 = null;
case 24:
step = 25; case 25:
v7 = (f7 = f7 || this_par_parseCompleteBlock(true, inFunction, inLoop, inSwitch, labelSet))(thawValue);
if (frozen) return v7;
else f7 = null;
case 26:
step = 5;
case 5:
return;
      }
    }
  };
}
  function this_par_parseFinally(inFunction, inLoop, inSwitch, labelSet){
var step = 1;
var v1, v0;
var f1, f0;
return function inside_this_par_parseFinally(thawValue){
  while (true) {
    switch (step) {
      case 1:
// finally { <stmts> }
step = 2;
case 2:
v0 = (f0 = f0 || this_tok_nextPuncIfString('finally'))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
if (!v0) { step = 5; continue; }
case 4:
step = 7; case 7:
v1 = (f1 = f1 || this_par_parseCompleteBlock(true, inFunction, inLoop, inSwitch, labelSet))(thawValue);
if (frozen) return v1;
else f1 = null;
case 8:
step = 5;
case 5:
return;
      }
    }
  };
}
  function this_par_parseDebugger(){
var step = 1;
var v1, v0;
var f1, f0;
return function inside_this_par_parseDebugger(thawValue){
  while (true) {
    switch (step) {
      case 1:
// debugger ;
step = 2; case 2:
v0 = (f0 = f0 || this_tok_next(true))(thawValue);
if (frozen) return v0;
else f0 = null;
case 3:
step = 4; case 4:
v1 = (f1 = f1 || this_par_parseSemi())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 5;
case 5:
return;
      }
    }
  };
}
  function this_par_parseWith(inFunction, inLoop, inSwitch, labelSet){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
return function inside_this_par_parseWith(thawValue){
  while (true) {
    switch (step) {
      case 1:
// with ( <exprs> ) <stmts>
step = 2; case 2:
v0 = (f0 = f0 || this_tok_next(false))(thawValue);
if (frozen) return v0;
else f0 = null;
case 3:
step = 4; case 4:
v1 = (f1 = f1 || this_par_parseStatementHeader())(thawValue);
if (frozen) return v1;
else f1 = null;
case 5:
step = 6; case 6:
v2 = (f2 = f2 || this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, false, ''))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 7;
case 7:
return;
      }
    }
  };
}
  function this_par_parseFunction(forFunctionDeclaration){
var step = 1;
var v6, v5, v4, v3, v2, v1, v0;
var f6, f5, f4, f3, f2, f1, f0;
var type;
return function inside_this_par_parseFunction(thawValue){
  while (true) {
    switch (step) {
      case 1:
// function [<idntf>] ( [<param>[,<param>..] ) { <stmts> }
step = 2;
case 2:
v0 = (f0 = f0 || this_tok_next(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 type = v0; // 'function'
      if (type !== 13) { step = 5; continue; }
step = 4;
case 4:
  // name
step = 7;
case 7:
v1 = (f1 = f1 || this_par_isReservedIdentifier(false))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
if (!v1) { step = 10; continue; }
case 9:
step = 14;
case 14:
v3 = (f3 = f3 || this_tok_getLastValue())(thawValue);
if (frozen) return v3;
else f3 = null;
case 15:
step = 12; case 12:
v2 = (f2 = f2 || this_tok_throwSyntaxError('Function name ['+v3+'] is reserved'))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 13;
case 13:
case 10:
step = 16; case 16:
v4 = (f4 = f4 || this_tok_next(false))(thawValue);
if (frozen) return v4;
else f4 = null;
case 17:
step = 6;
continue;
case 5:
 if (!forFunctionDeclaration) { step = 19; continue; }
case 18:
step = 21; case 21:
v5 = (f5 = f5 || this_tok_throwSyntaxError('Function declaration requires a name'))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 22;
case 22:
case 6:
case 19:
step = 23; case 23:
v6 = (f6 = f6 || this_par_parseFunctionRemainder(2, forFunctionDeclaration))(thawValue);
if (frozen) return v6;
else f6 = null;
step = 24;
case 24:
return;
      }
    }
  };
}
  function this_par_parseFunctionRemainder(paramCount, nextExpr){
var step = 1;
var v3, v2, v1, v0;
var f3, f2, f1, f0;
return function inside_this_par_parseFunctionRemainder(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2; case 2:
v0 = (f0 = f0 || this_tok_mustBeNum(0x28, false))(thawValue);
if (frozen) return v0;
else f0 = null;
case 3:
step = 4; case 4:
v1 = (f1 = f1 || this_par_parseParameters(paramCount))(thawValue);
if (frozen) return v1;
else f1 = null;
case 5:
step = 6; case 6:
v2 = (f2 = f2 || this_tok_mustBeNum(0x29, false))(thawValue);
if (frozen) return v2;
else f2 = null;
case 7:
step = 8; case 8:
v3 = (f3 = f3 || this_par_parseCompleteBlock(nextExpr, true, '', false, ''))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 9;
case 9:
return;
      }
    }
  };
}
  function this_par_parseParameters(paramCount){
var step = 1;
var v10, v9, v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f10, f9, f8, f7, f6, f5, f4, f3, f2, f1, f0;
return function inside_this_par_parseParameters(thawValue){
  while (true) {
    switch (step) {
      case 1:
// [<idntf> [, <idntf>]]
if (this_tok_lastType !== 13) { step = 3; continue; }
step = 2;
case 2:
if (paramCount !== 0) { step = 6; continue; }
case 5:
 step = 8; case 8:
v0 = (f0 = f0 || this_tok_throwSyntaxError('Getters have no parameters'))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 9;
case 9:
case 6:
step = 10;
case 10:
v1 = (f1 = f1 || this_par_isReservedIdentifier(false))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 11;
case 11:
if (!v1) { step = 13; continue; }
case 12:
 step = 15; case 15:
v2 = (f2 = f2 || this_tok_throwSyntaxError('Function param name is reserved.'))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 16;
case 16:
case 13:
step = 17; case 17:
v3 = (f3 = f3 || this_tok_next(true))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 18;
case 18:
// there are only two valid next tokens; either a comma or a closing paren
case 19:
step = 21;
case 21:
v4 = (f4 = f4 || this_tok_nextExprIfNum(0x2c))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 22;
case 22:
if (v4) { step = 24; continue; }
case 23:
 step = 20;
continue;
case 24:
if (paramCount !== 1) { step = 27; continue; }
case 26:
 step = 29; case 29:
v5 = (f5 = f5 || this_tok_throwSyntaxError('Setters have exactly one param'))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 30;
case 30:
// param name
step = 27;
case 27:
if (this_tok_lastType !== 13) { step = 32; continue; }
case 31:
step = 34;
case 34:
v6 = (f6 = f6 || this_par_isReservedIdentifier(false))(thawValue);
if (frozen) return v6;
else f6 = null;
step = 35;
case 35:
if (!v6) { step = 37; continue; }
case 36:
 step = 39; case 39:
v7 = (f7 = f7 || this_tok_throwSyntaxError('Function param name is reserved'))(thawValue);
if (frozen) return v7;
else f7 = null;
step = 40;
case 40:
case 37:
step = 41; case 41:
v8 = (f8 = f8 || this_tok_next(false))(thawValue);
if (frozen) return v8;
else f8 = null;
case 42:
step = 33;
continue;
case 32:
step = 43; case 43:
v9 = (f9 = f9 || this_tok_throwSyntaxError('Missing func param name'))(thawValue);
if (frozen) return v9;
else f9 = null;
step = 44;
case 44:
case 33:
step = 19;
continue
case 20:
step = 4;
continue;
case 3:
 if (paramCount !== 1) { step = 46; continue; }
case 45:
step = 48; case 48:
v10 = (f10 = f10 || this_tok_throwSyntaxError('Setters have exactly one param'))(thawValue);
if (frozen) return v10;
else f10 = null;
step = 49;
case 49:
case 4:
step = 46;
case 46:
return;
      }
    }
  };
}
  function this_par_parseBlock(nextExpr, inFunction, inLoop, inSwitch, labelSet){
var step = 1;
var v1, v0;
var f1, f0;
return function inside_this_par_parseBlock(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2; case 2:
v0 = (f0 = f0 || this_par_parseStatements(inFunction, inLoop, inSwitch, labelSet))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
// note: this parsing method is also used for functions. the only case where
      // the closing curly can be followed by a division rather than a regex lit
      // is with a function expression. that's why we needed to make it a parameter
      step = 4; case 4:
v1 = (f1 = f1 || this_tok_mustBeNum(0x7d, nextExpr))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 5;
case 5:
return;
      }
    }
  };
}
  function this_par_parseCompleteBlock(nextExpr, inFunction, inLoop, inSwitch, labelSet){
var step = 1;
var v1, v0;
var f1, f0;
return function inside_this_par_parseCompleteBlock(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2; case 2:
v0 = (f0 = f0 || this_tok_mustBeNum(0x7b, true))(thawValue);
if (frozen) return v0;
else f0 = null;
case 3:
step = 4; case 4:
v1 = (f1 = f1 || this_par_parseBlock(nextExpr, inFunction, inLoop, inSwitch, labelSet))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 5;
case 5:
return;
      }
    }
  };
}
  function this_par_parseSemi(){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
return function inside_this_par_parseSemi(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2;
case 2:
v0 = (f0 = f0 || this_tok_nextExprIfNum(0x3b))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
if (!v0) { step = 5; continue; }
step = 4;
case 4:
 return 9;
case 5:
step = 7;
case 7:
v1 = (f1 = f1 || this_par_parseAsi())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
if (!v1) { step = 10; continue; }
step = 9;
case 9:
 return 15;
case 10:
step = 12; case 12:
v2 = (f2 = f2 || this_tok_throwSyntaxError('Unable to parse semi, unable to apply ASI'))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 13;
case 13:
return;
      }
    }
  };
}
  function this_par_parseAsi(){
var step = 1;
var v0;
var f0;
var A;
return function inside_this_par_parseAsi(thawValue){
  while (true) {
    switch (step) {
      case 1:
// asi at EOF, if next token is } or if there is a newline between prev and next (black) token
      // asi prevented if asi would be empty statement, no asi in for-header, no asi if next token is regex
A = this_tok_firstTokenChar === 0x7d ;
if (A) { step = 3; continue; }
step = 2;
case 2:
 A =  this_tok_lastNewline ;  
step = 3;
case 3:
if (A) { step = 6; continue; }
step = 5;
case 5:
 A =  this_tok_lastType === 14; 
step = 6;
case 6:
if (!A) { step = 9; continue; }
case 8:
step = 11;
case 11:
v0 = (f0 = f0 || this_par_addAsi())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 12;
case 12:
return v0;
step = 9;
case 9:
return false;
return;
      }
    }
  };
}
  function this_par_addAsi(){
var step = 1;
var pos, options, white, black, oldTop, asi;
return function inside_this_par_addAsi(thawValue){
  while (true) {
    switch (step) {
      case 1:
pos = this_tok_pos;
       options = this_tok_options;
       white = this_tok_tokenCountAll++;
if (!(options.saveTokens)) { step = 3; continue; }
step = 2;
case 2:
// at this point we probably already parsed some whitespace and the next black token
        // we dont have to care about the whitespace, but the black token will have to be
        // updated with a new black and white index, and a new token has to be put before it.
// this is the white and black of the token after the ASI (oldTop)
         black = this_tok_tokenCountBlack++;
oldTop = this_tok_tokens.pop();
asi = {type:15, value:'', start:oldTop.start, stop:oldTop.start, white:white-1, black:black-1};
oldTop.white = white;
        oldTop.black = black;
this_tok_tokens.push(asi, oldTop);
        if (!(options.createBlackStream)) { step = 6; continue; }
step = 5;
case 5:
this_tok_black.push(asi, oldTop);
step = 6;
case 6:
// this kind of sucks since it probably already emitted the following token... we can't really help this atm.
      // (yes we could by delaying emitting by one token, but think of the perf-dren!)
      // pass on -1 for start/stop because we probably wont know it at this point (we could do this as well at a cost)
step = 3;
case 3:
if (!(options.onToken)) { step = 9; continue; }
step = 8;
case 8:
 options.onToken(15, '', -1, -1, white-1);
step = 9;
case 9:
return 15;
return;
      }
    }
  };
}
  function this_par_parseExpressionStatement(){
var step = 1;
var v1, v0;
var f1, f0;
return function inside_this_par_parseExpressionStatement(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2; case 2:
v0 = (f0 = f0 || this_par_parseExpressions())(thawValue);
if (frozen) return v0;
else f0 = null;
case 3:
step = 4; case 4:
v1 = (f1 = f1 || this_par_parseSemi())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 5;
case 5:
return;
      }
    }
  };
}
  function this_par_parseExpressionOrLabel(labelName, inFunction, inLoop, inSwitch, labelSet, freshLabels){
var step = 1;
var v11, v10, v9, v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f11, f10, f9, f8, f7, f6, f5, f4, f3, f2, f1, f0;
var identifier, assignable, count, labelSpaced, D, F;
return function inside_this_par_parseExpressionOrLabel(thawValue){
  while (true) {
    switch (step) {
      case 1:
// this method is only called at the start of a statement that starts
      // with an identifier that is neither `function` nor a statement keyword
// store value of identifier for label validation below.
step = 2;
case 2:
v0 = (f0 = f0 || this_tok_getLastValue())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 identifier = v0;
// this will stop before consuming the colon, if any.
step = 4;
case 4:
v1 = (f1 = f1 || this_par_parsePrimaryOrPrefix(false, false, true))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 5;
case 5:
 assignable = v1;
count = this_tok_tokenCountAll;
      step = 6; case 6:
v2 = (f2 = f2 || this_par_parseAssignments(assignable))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 7;
case 7:
// note: no need for grouped assignment check here (we cannot be in a group right now)
      step = 8; case 8:
v3 = (f3 = f3 || this_par_parseNonAssignments())(thawValue);
if (frozen) return v3;
else f3 = null;
step = 9;
case 9:
if (this_tok_firstTokenChar !== 0x3a) { step = 11; continue; }
step = 10;
case 10:
if (!(this_tok_tokenCountAll !== count)) { step = 14; continue; }
case 13:
 step = 16; case 16:
v4 = (f4 = f4 || this_tok_throwSyntaxError('Unexpected colon encountered'))(thawValue);
if (frozen) return v4;
else f4 = null;
case 17:
step = 14;
case 14:
if (assignable) { step = 19; continue; }
case 18:
 step = 21; case 21:
v5 = (f5 = f5 || this_tok_throwSyntaxError('Label ['+identifier+'] is a reserved keyword'))(thawValue);
if (frozen) return v5;
else f5 = null;
case 22:
step = 19;
case 19:
 labelSpaced = labelName + ' ';
        if (!(labelSet.indexOf(' ' + labelSpaced) >= 0)) { step = 24; continue; }
case 23:
 step = 26; case 26:
v6 = (f6 = f6 || this_tok_throwSyntaxError('Label ['+identifier+'] is already defined'))(thawValue);
if (frozen) return v6;
else f6 = null;
step = 27;
case 27:
case 24:
step = 28; case 28:
v7 = (f7 = f7 || this_tok_next(true))(thawValue);
if (frozen) return v7;
else f7 = null;
step = 29;
case 29:
if (!inLoop) { step = 31; continue; }
step = 30;
case 30:
 inLoop += labelSpaced; // these are the only valid jump targets for `continue`
step = 31;
case 31:
  D = labelSet ;
if (D) { step = 34; continue; }
step = 33;
case 33:
 D =  ' '; 
step = 34;
case 34:
  F = freshLabels;
if (F) { step = 37; continue; }
step = 36;
case 36:
 F = ' '; 
case 37:
step = 39; case 39:
v8 = (f8 = f8 || this_par_parseStatement(inFunction, inLoop, inSwitch, (D)+labelSpaced, false, (F)+labelSpaced))(thawValue);
if (frozen) return v8;
else f8 = null;
case 40:
step = 12;
continue;
case 11:
step = 41;
case 41:
v9 = (f9 = f9 || this_tok_nextExprIfNum(0x2c))(thawValue);
if (frozen) return v9;
else f9 = null;
step = 42;
case 42:
if (!v9) { step = 44; continue; }
case 43:
 step = 46; case 46:
v10 = (f10 = f10 || this_par_parseExpressions())(thawValue);
if (frozen) return v10;
else f10 = null;
step = 47;
case 47:
case 44:
step = 48; case 48:
v11 = (f11 = f11 || this_par_parseSemi())(thawValue);
if (frozen) return v11;
else f11 = null;
case 49:
step = 12;
case 12:
return;
      }
    }
  };
}
  function this_par_parseOptionalExpressions(){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
var tokCount;
return function inside_this_par_parseOptionalExpressions(thawValue){
  while (true) {
    switch (step) {
      case 1:
tokCount = this_tok_tokenCountAll;
      step = 2; case 2:
v0 = (f0 = f0 || this_par_parseExpressionOptional())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
if (!(tokCount !== this_tok_tokenCountAll)) { step = 5; continue; }
case 4:
case 7:
step = 9;
case 9:
v1 = (f1 = f1 || this_tok_nextExprIfNum(0x2c))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 10;
case 10:
if (v1) { step = 12; continue; }
case 11:
 step = 8;
continue; 
case 12:
step = 14; case 14:
v2 = (f2 = f2 || this_par_parseExpression())(thawValue);
if (frozen) return v2;
else f2 = null;
case 15:
step = 7;
continue
case 8:
step = 5;
case 5:
return;
      }
    }
  };
}
  function this_par_parseExpressions(){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
var groupAssignable;
return function inside_this_par_parseExpressions(thawValue){
  while (true) {
    switch (step) {
      case 1:
// track for parseGroup, if this expression is wrapped, is it still assignable?
step = 2;
case 2:
v0 = (f0 = f0 || this_par_parseExpression())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 groupAssignable = v0;
case 4:
step = 6;
case 6:
v1 = (f1 = f1 || this_tok_nextExprIfNum(0x2c))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 7;
case 7:
if (v1) { step = 9; continue; }
case 8:
 step = 5;
continue; 
case 9:
step = 11; case 11:
v2 = (f2 = f2 || this_par_parseExpression())(thawValue);
if (frozen) return v2;
else f2 = null;
step = 12;
case 12:
groupAssignable = 0;
step = 4;
continue
case 5:
return groupAssignable;
return;
      }
    }
  };
}
  function this_par_parseExpression(){
var step = 1;
var v1, v0;
var f1, f0;
var tokCount, groupAssignable;
return function inside_this_par_parseExpression(thawValue){
  while (true) {
    switch (step) {
      case 1:
tokCount = this_tok_tokenCountAll;
// track for parseGroup whether this expression still assignable when
step = 2;
case 2:
v0 = (f0 = f0 || this_par_parseExpressionOptional())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 groupAssignable = v0;
// either tokenizer pos moved, or we reached the end (we hadnt reached the end before)
      if (tokCount !== this_tok_tokenCountAll) { step = 5; continue; }
case 4:
 step = 7; case 7:
v1 = (f1 = f1 || this_tok_throwSyntaxError('Expected to parse an expression, did not find any'))(thawValue);
if (frozen) return v1;
else f1 = null;
case 8:
step = 5;
case 5:
return groupAssignable;
return;
      }
    }
  };
}
  function this_par_parseExpressionOptional(){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
var count, assignable, beforeAssignments, beforeNonAssignments, endCount;
return function inside_this_par_parseExpressionOptional(thawValue){
  while (true) {
    switch (step) {
      case 1:
count = this_tok_tokenCountAll;
step = 2;
case 2:
v0 = (f0 = f0 || this_par_parsePrimary(true))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 assignable = v0;
       beforeAssignments = this_tok_tokenCountAll;
      if (!(count !== beforeAssignments)) { step = 5; continue; }
case 4:
step = 7; case 7:
v1 = (f1 = f1 || this_par_parseAssignments(assignable))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
beforeNonAssignments = this_tok_tokenCountAll;
        step = 9; case 9:
v2 = (f2 = f2 || this_par_parseNonAssignments())(thawValue);
if (frozen) return v2;
else f2 = null;
step = 10;
case 10:
endCount = this_tok_tokenCountAll;
// if there was a non-assign binary op, the whole thing is nonassign
        // if there were only assign ops, the whole thing is assignable unless grouped
        // if there were no binary ops, the whole thing is whatever the primary was
if (!(beforeNonAssignments !== endCount)) { step = 12; continue; }
step = 11;
case 11:
 assignable = 0;
step = 13;
continue;
case 12:
 if (!(beforeAssignments !== beforeNonAssignments)) { step = 15; continue; }
step = 14;
case 14:
 assignable = 2;
case 13:
step = 15;
case 15:
// return state for parseGroup, to determine whether the group as a whole can be assignment lhs
      // the group needs to know about the prim expr AND any binary ops (inc assignments).
step = 5;
case 5:
return assignable;
return;
      }
    }
  };
}
  function this_par_parseAssignments(assignable){
var step = 1;
var v3, v2, v1, v0;
var f3, f2, f1, f0;
var strictAssign, A;
return function inside_this_par_parseAssignments(thawValue){
  while (true) {
    switch (step) {
      case 1:
// assignment ops are allowed until the first non-assignment binary op
strictAssign = this_par_options.strictAssignmentCheck;
case 2:
step = 4;
case 4:
v0 = (f0 = f0 || this_par_isAssignmentOperator())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 5;
case 5:
if (v0) { step = 7; continue; }
case 6:
 step = 3;
continue;
case 7:
A = !assignable ;
if (!A) { step = 10; continue; }
step = 9;
case 9:
 A =  strictAssign; 
step = 10;
case 10:
if (!A) { step = 13; continue; }
case 12:
 step = 15; case 15:
v1 = (f1 = f1 || this_tok_throwSyntaxError('LHS of this assignment is invalid assignee'))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 16;
case 16:
// any assignment means not a for-in per definition
case 13:
step = 17; case 17:
v2 = (f2 = f2 || this_tok_next(true))(thawValue);
if (frozen) return v2;
else f2 = null;
case 18:
step = 19;
case 19:
v3 = (f3 = f3 || this_par_parsePrimary(false))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 20;
case 20:
assignable = v3;
step = 2;
continue
case 3:
return;
      }
    }
  };
}
  function this_par_parseNonAssignments(){
var step = 1;
var v3, v2, v1, v0;
var f3, f2, f1, f0;
return function inside_this_par_parseNonAssignments(thawValue){
  while (true) {
    switch (step) {
      case 1:
// keep parsing non-assignment binary/ternary ops
case 2:
step = 4;
case 4:
v0 = (f0 = f0 || this_par_isBinaryOperator())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 5;
case 5:
if (!v0) { step = 7; continue; }
case 6:
step = 9; case 9:
v1 = (f1 = f1 || this_tok_next(true))(thawValue);
if (frozen) return v1;
else f1 = null;
case 10:
step = 11; case 11:
v2 = (f2 = f2 || this_par_parsePrimary(false))(thawValue);
if (frozen) return v2;
else f2 = null;
case 12:
step = 8;
continue;
case 7:
 if (this_tok_firstTokenChar !== 0x3f) { step = 14; continue; }
case 13:
 step = 16; case 16:
v3 = (f3 = f3 || this_par_parseTernary())(thawValue);
if (frozen) return v3;
else f3 = null;
case 17:
step = 15;
continue;
case 14:
 step = 3;
continue;
case 8:
case 15:
step = 2;
continue
case 3:
return;
      }
    }
  };
}
  function this_par_parseTernary(){
var step = 1;
var v3, v2, v1, v0;
var f3, f2, f1, f0;
return function inside_this_par_parseTernary(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2; case 2:
v0 = (f0 = f0 || this_tok_next(true))(thawValue);
if (frozen) return v0;
else f0 = null;
case 3:
step = 4; case 4:
v1 = (f1 = f1 || this_par_parseExpression())(thawValue);
if (frozen) return v1;
else f1 = null;
case 5:
step = 6; case 6:
v2 = (f2 = f2 || this_tok_mustBeNum(0x3a, true))(thawValue);
if (frozen) return v2;
else f2 = null;
case 7:
step = 8; case 8:
v3 = (f3 = f3 || this_par_parseExpression())(thawValue);
if (frozen) return v3;
else f3 = null;
step = 9;
case 9:
return;
      }
    }
  };
}
  function this_par_parseTernaryNoIn(){
var step = 1;
var v3, v2, v1, v0;
var f3, f2, f1, f0;
return function inside_this_par_parseTernaryNoIn(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2; case 2:
v0 = (f0 = f0 || this_tok_next(true))(thawValue);
if (frozen) return v0;
else f0 = null;
case 3:
step = 4; case 4:
v1 = (f1 = f1 || this_par_parseExpression())(thawValue);
if (frozen) return v1;
else f1 = null;
case 5:
step = 6; case 6:
v2 = (f2 = f2 || this_tok_mustBeNum(0x3a, true))(thawValue);
if (frozen) return v2;
else f2 = null;
case 7:
step = 8; case 8:
v3 = (f3 = f3 || this_par_parseExpressionNoIn())(thawValue);
if (frozen) return v3;
else f3 = null;
step = 9;
case 9:
return;
      }
    }
  };
}
  function this_par_parseExpressionsNoIn(){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
var validForInLhs;
return function inside_this_par_parseExpressionsNoIn(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2;
case 2:
v0 = (f0 = f0 || this_par_parseExpressionNoIn())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 validForInLhs = v0;
case 4:
step = 6;
case 6:
v1 = (f1 = f1 || this_tok_nextExprIfNum(0x2c))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 7;
case 7:
if (v1) { step = 9; continue; }
case 8:
 step = 5;
continue;
case 9:
// lhs of for-in cant be multiple expressions
        step = 11; case 11:
v2 = (f2 = f2 || this_par_parseExpressionNoIn())(thawValue);
if (frozen) return v2;
else f2 = null;
step = 12;
case 12:
validForInLhs = 0;
step = 4;
continue
case 5:
return validForInLhs;
return;
      }
    }
  };
}
  function this_par_parseExpressionNoIn(){
var step = 1;
var v6, v5, v4, v3, v2, v1, v0;
var f6, f5, f4, f3, f2, f1, f0;
var assignable, count, repeat, A;
return function inside_this_par_parseExpressionNoIn(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2;
case 2:
v0 = (f0 = f0 || this_par_parsePrimary(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 assignable = v0;
count = this_tok_tokenCountAll;
      step = 4; case 4:
v1 = (f1 = f1 || this_par_parseAssignments(assignable))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 5;
case 5:
 // any assignment is illegal in for-in, with and without group. no need to check here.
// keep parsing non-assignment binary/ternary ops unless `in`
       repeat = true;
step = 6;
case 6:
if (repeat) { step = 9; continue; }
case 8:
 step = 7;
continue; 
case 9:
step = 11;
case 11:
v2 = (f2 = f2 || this_par_isBinaryOperator())(thawValue);
if (frozen) return v2;
else f2 = null;
step = 12;
case 12:
if (!v2) { step = 14; continue; }
step = 13;
case 13:
// rationale for using getLastNum; this is the `in` check which will succeed
          // about 50% of the time (stats from 8mb of various js). the other time it
          // will check for a primary. it's therefore more likely that an getLastNum will
          // save time because it would cache the charCodeAt for the other token if
          // it failed the check
            A = this_tok_firstTokenChar === 0x69 ;
if (!A) { step = 17; continue; }
case 16:
step = 19;
case 19:
v3 = (f3 = f3 || this_tok_getNum(1))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 20;
case 20:
A =  v3 === 0x6e ;  
step = 17;
case 17:
if (!A) { step = 22; continue; }
step = 21;
case 21:
 A =  this_tok_lastLen === 2; 
step = 22;
case 22:
if (!A) { step = 25; continue; }
step = 24;
case 24:
  // in
            repeat = false;
step = 26;
continue;
case 25:
step = 27; case 27:
v4 = (f4 = f4 || this_tok_next(true))(thawValue);
if (frozen) return v4;
else f4 = null;
case 28:
step = 29; case 29:
v5 = (f5 = f5 || this_par_parsePrimary(false))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 30;
case 30:
case 26:
step = 15;
continue;
case 14:
 if (this_tok_firstTokenChar !== 0x3f) { step = 32; continue; }
case 31:
step = 34; case 34:
v6 = (f6 = f6 || this_par_parseTernaryNoIn())(thawValue);
if (frozen) return v6;
else f6 = null;
case 35:
step = 33;
continue;
case 32:
repeat = false;
case 15:
case 33:
step = 6;
continue
case 7:
return count === this_tok_tokenCountAll ? assignable : 0;
return;
      }
    }
  };
}
  function this_par_parsePrimary(optional){
var step = 1;
var v0;
var f0;
return function inside_this_par_parsePrimary(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2;
case 2:
v0 = (f0 = f0 || this_par_parsePrimaryOrPrefix(optional, false, false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
return v0;
return;
      }
    }
  };
}
  function this_par_parsePrimaryOrPrefix(optional, hasNew, maybeLabel){
var step = 1;
var v26, v25, v24, v23, v22, v21, v20, v19, v18, v17, v16, v15, v14, v13, v12, v11, v10, v9, v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f26, f25, f24, f23, f22, f21, f20, f19, f18, f17, f16, f15, f14, f13, f12, f11, f10, f9, f8, f7, f6, f5, f4, f3, f2, f1, f0;
var len, c, A, B, assignable;
return function inside_this_par_parsePrimaryOrPrefix(thawValue){
  while (true) {
    switch (step) {
      case 1:
//      len:
//      1=387k
//      4=196k (this=126k)
//      3=68k
//      8=67k
//      2=60k
//
//      type:
//      13=741k
//      9=102k
//      10:81k
//      7=80k
len = this_tok_lastLen;
       c = this_tok_firstTokenChar;
if (this_tok_lastType !== 13) { step = 3; continue; }
step = 2;
case 2:
if (!(len > 2)) { step = 6; continue; }
step = 5;
case 5:
if (c !== 0x74) { step = 9; continue; }
step = 8;
case 8:
A = len === 6 ;
if (!A) { step = 12; continue; }
case 11:
step = 14;
case 14:
v0 = (f0 = f0 || this_tok_nextExprIfString('typeof'))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 15;
case 15:
A =  v0; 
step = 12;
case 12:
if (!A) { step = 17; continue; }
step = 16;
case 16:
if (!hasNew) { step = 20; continue; }
case 19:
 step = 22; case 22:
v1 = (f1 = f1 || this_tok_throwSyntaxError('typeof is illegal right after new'))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 23;
case 23:
case 20:
step = 24; case 24:
v2 = (f2 = f2 || this_par_parsePrimaryOrPrefix(false, false, false))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 25;
case 25:
return 0;
case 17:
step = 10;
continue;
case 9:
   A = this_tok_firstTokenChar === 0x66 ;
if (!A) { step = 27; continue; }
case 26:
step = 29;
case 29:
v3 = (f3 = f3 || this_tok_getLastValue())(thawValue);
if (frozen) return v3;
else f3 = null;
step = 30;
case 30:
A =  v3 === 'function'; 
step = 27;
case 27:
if (!A) { step = 32; continue; }
case 31:
step = 34; case 34:
v4 = (f4 = f4 || this_par_parseFunction(false))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 35;
case 35:
// can never assign to function directly
step = 36;
case 36:
v5 = (f5 = f5 || this_par_parsePrimarySuffixes(0, hasNew, false))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 37;
case 37:
return v5;
step = 33;
continue;
case 32:
 if (c !== 0x6e) { step = 39; continue; }
case 38:
step = 41;
case 41:
v6 = (f6 = f6 || this_tok_nextExprIfString('new'))(thawValue);
if (frozen) return v6;
else f6 = null;
step = 42;
case 42:
if (!v6) { step = 44; continue; }
step = 43;
case 43:
// new is actually assignable if it has a trailing property AND at least one paren pair
              // TOFIX: isn't the OR flawed? HASNEW is a constant...
                B =  true ;
if (B) { step = 47; continue; }
step = 46;
case 46:
 B =  hasNew; 
case 47:
step = 49;
case 49:
v7 = (f7 = f7 || this_par_parsePrimaryOrPrefix(false,B, false))(thawValue);
if (frozen) return v7;
else f7 = null;
step = 50;
case 50:
return v7;
case 44:
step = 40;
continue;
case 39:
 if (c !== 0x64) { step = 52; continue; }
step = 51;
case 51:
A = len === 6 ;
if (!A) { step = 55; continue; }
case 54:
step = 57;
case 57:
v8 = (f8 = f8 || this_tok_nextExprIfString('delete'))(thawValue);
if (frozen) return v8;
else f8 = null;
step = 58;
case 58:
A =  v8; 
step = 55;
case 55:
if (!A) { step = 60; continue; }
step = 59;
case 59:
if (!hasNew) { step = 63; continue; }
case 62:
 step = 65; case 65:
v9 = (f9 = f9 || this_tok_throwSyntaxError('delete is illegal right after new'))(thawValue);
if (frozen) return v9;
else f9 = null;
step = 66;
case 66:
case 63:
step = 67; case 67:
v10 = (f10 = f10 || this_par_parsePrimaryOrPrefix(false, false, false))(thawValue);
if (frozen) return v10;
else f10 = null;
step = 68;
case 68:
return 0;
case 60:
step = 53;
continue;
case 52:
 if (c !== 0x76) { step = 70; continue; }
case 69:
step = 72;
case 72:
v11 = (f11 = f11 || this_tok_nextExprIfString('void'))(thawValue);
if (frozen) return v11;
else f11 = null;
step = 73;
case 73:
if (!v11) { step = 75; continue; }
step = 74;
case 74:
if (!hasNew) { step = 78; continue; }
case 77:
 step = 80; case 80:
v12 = (f12 = f12 || this_tok_throwSyntaxError('void is illegal right after new'))(thawValue);
if (frozen) return v12;
else f12 = null;
step = 81;
case 81:
case 78:
step = 82; case 82:
v13 = (f13 = f13 || this_par_parsePrimaryOrPrefix(false, false, false))(thawValue);
if (frozen) return v13;
else f13 = null;
step = 83;
case 83:
return 0;
case 75:
step = 33;
case 33:
case 40:
step = 53;
case 53:
case 70:
step = 10;
case 10:
case 6:
step = 84;
case 84:
v14 = (f14 = f14 || this_par_parsePrimaryCoreIdentifier(hasNew, maybeLabel))(thawValue);
if (frozen) return v14;
else f14 = null;
step = 85;
case 85:
return v14;
step = 3;
case 3:
  A = c === 0x21 ;
if (A) { step = 87; continue; }
step = 86;
case 86:
 A =  c === 0x7e; 
step = 87;
case 87:
  A = (A) ;
if (!A) { step = 90; continue; }
step = 89;
case 89:
 A =  this_tok_lastLen === 1; 
step = 90;
case 90:
if (!A) { step = 93; continue; }
step = 92;
case 92:
if (!hasNew) { step = 96; continue; }
case 95:
 step = 98; case 98:
v15 = (f15 = f15 || this_tok_throwSyntaxError('! and ~ are illegal right after new'))(thawValue);
if (frozen) return v15;
else f15 = null;
step = 99;
case 99:
case 96:
step = 100; case 100:
v16 = (f16 = f16 || this_tok_next(true))(thawValue);
if (frozen) return v16;
else f16 = null;
case 101:
step = 102; case 102:
v17 = (f17 = f17 || this_par_parsePrimaryOrPrefix(false, false, false))(thawValue);
if (frozen) return v17;
else f17 = null;
step = 103;
case 103:
return 0;
step = 93;
case 93:
  A = c === 0x2d ;
if (A) { step = 105; continue; }
step = 104;
case 104:
 A =  c === 0x2b; 
step = 105;
case 105:
if (!A) { step = 108; continue; }
step = 107;
case 107:
if (!hasNew) { step = 111; continue; }
case 110:
 step = 113; case 113:
v18 = (f18 = f18 || this_tok_throwSyntaxError('illegal operator right after new'))(thawValue);
if (frozen) return v18;
else f18 = null;
step = 114;
case 114:
// have to verify len anyways, for += and -= case
step = 111;
case 111:
if (this_tok_lastLen !== 1) { step = 116; continue; }
case 115:
step = 118; case 118:
v19 = (f19 = f19 || this_tok_next(true))(thawValue);
if (frozen) return v19;
else f19 = null;
case 119:
step = 120; case 120:
v20 = (f20 = f20 || this_par_parsePrimaryOrPrefix(false, false, false))(thawValue);
if (frozen) return v20;
else f20 = null;
case 121:
step = 117;
continue;
case 116:
step = 122;
case 122:
v21 = (f21 = f21 || this_tok_getNum(1))(thawValue);
if (frozen) return v21;
else f21 = null;
step = 123;
case 123:
if (v21 !== c) { step = 125; continue; }
case 124:
step = 127; case 127:
v22 = (f22 = f22 || this_tok_next(true))(thawValue);
if (frozen) return v22;
else f22 = null;
case 128:
step = 129;
case 129:
v23 = (f23 = f23 || this_par_parsePrimaryOrPrefix(false, false, false))(thawValue);
if (frozen) return v23;
else f23 = null;
step = 130;
case 130:
 assignable = v23;
            A = !assignable ;
if (!A) { step = 132; continue; }
step = 131;
case 131:
 A =  this_par_options.strictAssignmentCheck; 
step = 132;
case 132:
if (!A) { step = 135; continue; }
case 134:
 step = 137; case 137:
v24 = (f24 = f24 || this_tok_throwSyntaxError('The rhs of ++ or -- was not assignable'))(thawValue);
if (frozen) return v24;
else f24 = null;
step = 138;
case 138:
case 135:
step = 126;
continue;
case 125:
// this is a += or -= token (there's no other possibility left)
          // I believe it is illegal at this point :)
          step = 139; case 139:
v25 = (f25 = f25 || this_tok_throwSyntaxError('Illegal operator, expecting primary core'))(thawValue);
if (frozen) return v25;
else f25 = null;
step = 140;
case 140:
case 117:
step = 126;
case 126:
return 0;
case 108:
step = 141;
case 141:
v26 = (f26 = f26 || this_par_parsePrimaryCoreOther(optional, hasNew))(thawValue);
if (frozen) return v26;
else f26 = null;
step = 142;
case 142:
return v26;
return;
      }
    }
  };
}
  function this_par_parsePrimaryCoreIdentifier(hasNew, maybeLabel){
var step = 1;
var v6, v5, v4, v3, v2, v1, v0;
var f6, f5, f4, f3, f2, f1, f0;
var identifier, c, fail, assignable;
return function inside_this_par_parsePrimaryCoreIdentifier(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2;
case 2:
v0 = (f0 = f0 || this_tok_getLastValue())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 identifier = v0;
       c = this_tok_firstTokenChar;
// dont use ?: here (build script)
       fail;
      if (!maybeLabel) { step = 5; continue; }
case 4:
step = 7;
case 7:
v1 = (f1 = f1 || this_par_isReservedIdentifierSpecial())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 8;
case 8:
fail = v1;
step = 6;
continue;
case 5:
step = 9;
case 9:
v2 = (f2 = f2 || this_par_isReservedIdentifier(true))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 10;
case 10:
fail = v2;
step = 6;
case 6:
if (!fail) { step = 12; continue; }
case 11:
 step = 14; case 14:
v3 = (f3 = f3 || this_tok_throwSyntaxError('Reserved identifier ['+identifier+'] found in expression'))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 15;
case 15:
case 12:
step = 16; case 16:
v4 = (f4 = f4 || this_tok_next(false))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 17;
case 17:
// can not assign to keywords, anything else is fine here
step = 18;
case 18:
v5 = (f5 = f5 || this_par_isValueKeyword(c, identifier))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 19;
case 19:
 assignable = !v5 ? 1 : 0;
step = 20;
case 20:
v6 = (f6 = f6 || this_par_parsePrimarySuffixes(assignable, hasNew, maybeLabel))(thawValue);
if (frozen) return v6;
else f6 = null;
step = 21;
case 21:
return v6;
return;
      }
    }
  };
}
  function this_par_parsePrimaryCoreOther(optional, hasNew){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
var count, assignable;
return function inside_this_par_parsePrimaryCoreOther(thawValue){
  while (true) {
    switch (step) {
      case 1:
count = this_tok_tokenCountAll;
step = 2;
case 2:
v0 = (f0 = f0 || this_par_parsePrimaryValue(optional))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 assignable = v0;
      if (count !== this_tok_tokenCountAll) { step = 5; continue; }
step = 4;
case 4:
if (!optional) { step = 8; continue; }
step = 7;
case 7:
 return 0; // prevents `return.foo`
case 8:
step = 10; case 10:
v1 = (f1 = f1 || this_tok_throwSyntaxError('Missing required primary'))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 11;
case 11:
 // TOFIX: find case for this
case 5:
step = 12;
case 12:
v2 = (f2 = f2 || this_par_parsePrimarySuffixes(assignable, hasNew, false))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 13;
case 13:
return v2;
return;
      }
    }
  };
}
  function this_par_parsePrimaryValue(optional){
var step = 1;
var v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f8, f7, f6, f5, f4, f3, f2, f1, f0;
var t, A;
return function inside_this_par_parsePrimaryValue(thawValue){
  while (true) {
    switch (step) {
      case 1:
// at this point in the expression parser we will have ruled out anything else.
      // the next token(s) must be some kind of non-identifier expression value...
      // returns whether the entire thing is assignable
// we know it's going to be a punctuator so we wont use this_tok_isValue here
       t = this_tok_lastType;
        A = t === 10 ;
if (A) { step = 3; continue; }
step = 2;
case 2:
 A =  t === 8; 
step = 3;
case 3:
if (!A) { step = 6; continue; }
case 5:
step = 8; case 8:
v0 = (f0 = f0 || this_tok_next(false))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 9;
case 9:
return 0;
step = 6;
case 6:
if (t !== 7) { step = 11; continue; }
step = 10;
case 10:
// special case: numbers must always be followed by whitespace (or EOF)
        step = 13; case 13:
v1 = (f1 = f1 || this_tok_nextWhiteAfterNumber())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 14;
case 14:
return 0;
case 11:
step = 15;
case 15:
v2 = (f2 = f2 || this_tok_nextExprIfNum(0x28))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 16;
case 16:
if (!v2) { step = 18; continue; }
case 17:
step = 20;
case 20:
v3 = (f3 = f3 || this_par_parseGroup())(thawValue);
if (frozen) return v3;
else f3 = null;
step = 21;
case 21:
return v3;
case 18:
step = 22;
case 22:
v4 = (f4 = f4 || this_tok_nextExprIfNum(0x7b))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 23;
case 23:
if (!v4) { step = 25; continue; }
case 24:
step = 27; case 27:
v5 = (f5 = f5 || this_par_parseObject())(thawValue);
if (frozen) return v5;
else f5 = null;
step = 28;
case 28:
return 0;
case 25:
step = 29;
case 29:
v6 = (f6 = f6 || this_tok_nextExprIfNum(0x5b))(thawValue);
if (frozen) return v6;
else f6 = null;
step = 30;
case 30:
if (!v6) { step = 32; continue; }
case 31:
step = 34; case 34:
v7 = (f7 = f7 || this_par_parseArray())(thawValue);
if (frozen) return v7;
else f7 = null;
step = 35;
case 35:
return 0;
step = 32;
case 32:
if (optional) { step = 37; continue; }
case 36:
 step = 39; case 39:
v8 = (f8 = f8 || this_tok_throwSyntaxError('Unable to parse required primary value'))(thawValue);
if (frozen) return v8;
else f8 = null;
step = 40;
case 40:
// if the primary was optional but not found, the return value here is irrelevant
step = 37;
case 37:
return 1;
return;
      }
    }
  };
}
  function this_par_parsePrimarySuffixes(assignable, unassignableUntilAfterCall, maybeLabel){
var step = 1;
var v11, v10, v9, v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f11, f10, f9, f8, f7, f6, f5, f4, f3, f2, f1, f0;
var colonIsError, allowCallAssignment, c, A;
return function inside_this_par_parsePrimarySuffixes(thawValue){
  while (true) {
    switch (step) {
      case 1:
// --
      // ++
      // .<idntf>
      // [<exprs>]
      // (<exprs>)
// label edge case. if any suffix parsed, colon is no longer valid
       colonIsError = false;
       allowCallAssignment = this_par_options.allowCallAssignment;
if (!unassignableUntilAfterCall) { step = 3; continue; }
step = 2;
case 2:
 assignable = 0; // for new, must have trailing property _after_ a call
case 3:
step = 5;
case 5:
// see c frequency stats in /stats/primary suffix start.txt
         c = this_tok_firstTokenChar;
        if (!(c > 0x2e)) { step = 8; continue; }
step = 7;
case 7:
// only c>0x2e relevant is OPEN_SQUARE
          if (!(c !== 0x5b)) { step = 11; continue; }
case 10:
 step = 6;
continue;
case 11:
step = 13; case 13:
v0 = (f0 = f0 || this_tok_next(true))(thawValue);
if (frozen) return v0;
else f0 = null;
case 14:
step = 15; case 15:
v1 = (f1 = f1 || this_par_parseExpressions())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 16;
case 16:
 // required
          step = 17; case 17:
v2 = (f2 = f2 || this_tok_mustBeNum(0x5d, false))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 18;
case 18:
 // ] cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
            A = !unassignableUntilAfterCall ;
if (!A) { step = 20; continue; }
step = 19;
case 19:
 A =  !assignable; 
step = 20;
case 20:
if (!A) { step = 23; continue; }
step = 22;
case 22:
 assignable = 1; // trailing property
case 23:
step = 9;
continue;
case 8:
 if (c !== 0x2e) { step = 26; continue; }
step = 25;
case 25:
if (this_tok_lastType !== 7) { step = 29; continue; }
case 28:
 step = 6;
continue; // ASI: foo\n.5 -> [foo][\n][.5]
case 29:
step = 31; case 31:
v3 = (f3 = f3 || this_tok_next(false))(thawValue);
if (frozen) return v3;
else f3 = null;
case 32:
step = 33; case 33:
v4 = (f4 = f4 || this_tok_mustBeIdentifier(false))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 34;
case 34:
 // cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
            A = !unassignableUntilAfterCall ;
if (!A) { step = 36; continue; }
step = 35;
case 35:
 A =  !assignable; 
step = 36;
case 36:
if (!A) { step = 39; continue; }
step = 38;
case 38:
 assignable = 1; // trailing property
case 39:
step = 27;
continue;
case 26:
 if (c !== 0x28) { step = 42; continue; }
case 41:
step = 44; case 44:
v5 = (f5 = f5 || this_tok_next(true))(thawValue);
if (frozen) return v5;
else f5 = null;
case 45:
step = 46; case 46:
v6 = (f6 = f6 || this_par_parseOptionalExpressions())(thawValue);
if (frozen) return v6;
else f6 = null;
case 47:
step = 48; case 48:
v7 = (f7 = f7 || this_tok_mustBeNum(0x29, false))(thawValue);
if (frozen) return v7;
else f7 = null;
step = 49;
case 49:
 // ) cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          unassignableUntilAfterCall = false;
          assignable = allowCallAssignment; // call, only assignable in IE
step = 43;
continue;
case 42:
// postfix inc/dec are restricted, so no newline allowed here
            A = !this_tok_lastNewline ;
if (!A) { step = 51; continue; }
step = 50;
case 50:
   A = c === 0x2b ;
if (A) { step = 54; continue; }
step = 53;
case 53:
 A =  c === 0x2d; 
step = 54;
case 54:
A =  (A) ;  
step = 51;
case 51:
if (!A) { step = 57; continue; }
case 56:
step = 59;
case 59:
v8 = (f8 = f8 || this_tok_getNum(1))(thawValue);
if (frozen) return v8;
else f8 = null;
step = 60;
case 60:
A =  v8 === c; 
step = 57;
case 57:
if (!A) { step = 62; continue; }
step = 61;
case 61:
A = !assignable ;
if (!A) { step = 65; continue; }
step = 64;
case 64:
 A =  this_par_options.strictAssignmentCheck; 
step = 65;
case 65:
if (!A) { step = 68; continue; }
case 67:
 step = 70; case 70:
v9 = (f9 = f9 || this_tok_throwSyntaxError('Postfix increment not allowed here'))(thawValue);
if (frozen) return v9;
else f9 = null;
step = 71;
case 71:
case 68:
step = 72; case 72:
v10 = (f10 = f10 || this_tok_next(false))(thawValue);
if (frozen) return v10;
else f10 = null;
step = 73;
case 73:
assignable = 0; // ++
case 62:
step = 6;
continue;
case 9:
case 27:
step = 43;
case 43:
colonIsError = true;
step = 5;
continue
case 6:
  A = colonIsError ;
if (!A) { step = 75; continue; }
step = 74;
case 74:
 A =  maybeLabel ;  
step = 75;
case 75:
if (!A) { step = 78; continue; }
step = 77;
case 77:
 A =  c === 0x3a; 
step = 78;
case 78:
if (!A) { step = 81; continue; }
case 80:
 step = 83; case 83:
v11 = (f11 = f11 || this_tok_throwSyntaxError('Invalid label here, I think'))(thawValue);
if (frozen) return v11;
else f11 = null;
case 84:
step = 81;
case 81:
return assignable;
return;
      }
    }
  };
}
  function this_par_isAssignmentOperator(){
var step = 1;
var v1, v0;
var f1, f0;
var len, c, A;
return function inside_this_par_isAssignmentOperator(thawValue){
  while (true) {
    switch (step) {
      case 1:
// includes any "compound" operators
// this method works under the assumption that the current token is
      // part of the set of valid tokens for js. So we don't have to check
      // for string lengths unless we need to disambiguate optional chars
len = this_tok_lastLen;
       c = this_tok_firstTokenChar;
if (len !== 1) { step = 3; continue; }
step = 2;
case 2:
 return c === 0x3d;
step = 3;
case 3:
if (len !== 2) { step = 6; continue; }
step = 5;
case 5:
// if a token, which must be valid at this point has the equal sign
        // as second char and length 2 there is a white list and black list
        // of possible options;
        // good: += -= *= |= &= ^= /= ~=
        // bad: == >= <= !=
        // the danger here is testing becomes very hard because it doesnt
        // see the difference between assignment op and nonassign binary op
        // the gain is minimal since compound ops dont occur very often
A = 
            c === 0x2b ;
if (A) { step = 9; continue; }
step = 8;
case 8:
 A = 
            c === 0x2d ;  
step = 9;
case 9:
if (A) { step = 12; continue; }
step = 11;
case 11:
 A = 
            c === 0x7c ;  
step = 12;
case 12:
if (A) { step = 15; continue; }
step = 14;
case 14:
 A = 
            c === 0x26 ;  
step = 15;
case 15:
if (A) { step = 18; continue; }
step = 17;
case 17:
 A = 
            c === 0x2f
          ; 
step = 18;
case 18:
  A = (A) ;
if (!A) { step = 21; continue; }
case 20:
step = 23;
case 23:
v0 = (f0 = f0 || this_tok_getNum(1))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 24;
case 24:
A =  (v0 === 0x3d); 
step = 21;
case 21:
  A = (A) ;
if (A) { step = 26; continue; }
step = 25;
case 25:
 A = 
          c === 0x2a ;  
step = 26;
case 26:
if (A) { step = 29; continue; }
step = 28;
case 28:
 A = 
          c === 0x25 ;  
step = 29;
case 29:
if (A) { step = 32; continue; }
step = 31;
case 31:
 A = 
          c === 0x5e; 
step = 32;
case 32:
return A;
// these <<= >>= >>>= cases are very rare
// valid tokens starting with < are: < <= << <<= only len=3 is what we want here
step = 6;
case 6:
if (c !== 0x3c) { step = 35; continue; }
step = 34;
case 34:
 return len === 3;
// valid tokens starting with > are: > >> >= >>= >>> >>>=, we only look for >>= and >>>=
step = 35;
case 35:
if (c !== 0x3e) { step = 38; continue; }
step = 37;
case 37:
   A = len === 4 ;
if (A) { step = 41; continue; }
step = 40;
case 40:
   A = len === 3 ;
if (!A) { step = 44; continue; }
case 43:
step = 46;
case 46:
v1 = (f1 = f1 || this_tok_getNum(2))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 47;
case 47:
A =  v1 === 0x3d; 
step = 44;
case 44:
A =  (A); 
step = 41;
case 41:
return (A);
step = 38;
case 38:
return false;
return;
      }
    }
  };
}
  function this_par_isBinaryOperator(){
var step = 1;
var v4, v3, v2, v1, v0;
var f4, f3, f2, f1, f0;
var c, len, A;
return function inside_this_par_isBinaryOperator(thawValue){
  while (true) {
    switch (step) {
      case 1:
// _non-assignment binary operator
// this method works under the assumption that the current token is
      // part of the set of valid _tokens_ for js. That means we only have
      // to do extra checks for a token to disambiguate other valid tokens,
      // usually to eliminate assignments.
// if the input token is not a punctuator or identifier (-> in/instanceof)
      // the code will result in an error.
      // identifier happens about 0.5% of the time
      // punctuator is 99.5%
// len=1: 93%
      // len=2: 5%
      // len=3: 1%
      // len>3: nearly 1%
// function returns false in 86% of the calls
c = this_tok_firstTokenChar;
       len = this_tok_lastLen;
A = c === 0x3b ;
if (A) { step = 3; continue; }
step = 2;
case 2:
 A =  c === 0x29 ;  
step = 3;
case 3:
if (A) { step = 6; continue; }
step = 5;
case 5:
 A =  c === 0x2c; 
step = 6;
case 6:
if (!A) { step = 9; continue; }
step = 8;
case 8:
 return false; // expression enders: 26% 24% 20%
step = 9;
case 9:
if (len !== 1) { step = 12; continue; }
step = 11;
case 11:
A = c === 0x5d ;
if (A) { step = 15; continue; }
step = 14;
case 14:
 A =  c === 0x7d; 
step = 15;
case 15:
if (!A) { step = 18; continue; }
step = 17;
case 17:
 return false; // expression/statement enders: 7% 6%
step = 18;
case 18:
  A = c === 0x2b ;
if (A) { step = 21; continue; }
step = 20;
case 20:
 A =  c === 0x2a ;  
step = 21;
case 21:
if (A) { step = 24; continue; }
step = 23;
case 23:
 A =  c === 0x3c ;  
step = 24;
case 24:
if (A) { step = 27; continue; }
step = 26;
case 26:
 A =  c === 0x2d ;  
step = 27;
case 27:
if (A) { step = 30; continue; }
step = 29;
case 29:
 A =  c === 0x3e ;  
step = 30;
case 30:
if (A) { step = 33; continue; }
step = 32;
case 32:
 A =  c === 0x2f ;  
step = 33;
case 33:
if (A) { step = 36; continue; }
step = 35;
case 35:
 A =  c === 0x26 ;  
step = 36;
case 36:
if (A) { step = 39; continue; }
step = 38;
case 38:
 A =  c === 0x7c ;  
step = 39;
case 39:
if (A) { step = 42; continue; }
step = 41;
case 41:
 A =  c === 0x25 ;  
step = 42;
case 42:
if (A) { step = 45; continue; }
step = 44;
case 44:
 A =  c === 0x5e; 
step = 45;
case 45:
return A;
step = 12;
case 12:
if (len !== 2) { step = 48; continue; }
step = 47;
case 47:
A = c === 0x3d ;
if (A) { step = 51; continue; }
step = 50;
case 50:
 A =  c === 0x21 ;  
step = 51;
case 51:
if (A) { step = 54; continue; }
step = 53;
case 53:
 A =  c === 0x3c ;  
step = 54;
case 54:
if (A) { step = 57; continue; }
step = 56;
case 56:
 A =  c === 0x3e ;  
step = 57;
case 57:
if (A) { step = 60; continue; }
step = 59;
case 59:
   A = c === 0x26 ;
if (!A) { step = 63; continue; }
case 62:
step = 65;
case 65:
v0 = (f0 = f0 || this_tok_getNum(1))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 66;
case 66:
A =  v0 === 0x26; 
step = 63;
case 63:
A =  (A) ;  
step = 60;
case 60:
if (A) { step = 68; continue; }
step = 67;
case 67:
   A = c === 0x7c ;
if (!A) { step = 71; continue; }
case 70:
step = 73;
case 73:
v1 = (f1 = f1 || this_tok_getNum(1))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 74;
case 74:
A =  v1 === 0x7c; 
step = 71;
case 71:
A =  (A) ;  
step = 68;
case 68:
if (A) { step = 76; continue; }
case 75:
step = 78;
case 78:
v2 = (f2 = f2 || this_tok_getLastValue())(thawValue);
if (frozen) return v2;
else f2 = null;
step = 79;
case 79:
A =  v2 === 'in'; 
step = 76;
case 76:
return A;
step = 48;
case 48:
if (len !== 3) { step = 81; continue; }
step = 80;
case 80:
A = c === 0x3d ;
if (A) { step = 84; continue; }
step = 83;
case 83:
 A =  c === 0x21 ;  
step = 84;
case 84:
if (A) { step = 87; continue; }
step = 86;
case 86:
   A = c === 0x3e ;
if (!A) { step = 90; continue; }
case 89:
step = 92;
case 92:
v3 = (f3 = f3 || this_tok_getNum(2))(thawValue);
if (frozen) return v3;
else f3 = null;
step = 93;
case 93:
A =  v3 === 0x3e; 
step = 90;
case 90:
A =  (A); 
step = 87;
case 87:
return A;
step = 81;
case 81:
if (len !== 10) { step = 95; continue; }
case 94:
step = 97;
case 97:
v4 = (f4 = f4 || this_tok_getLastValue())(thawValue);
if (frozen) return v4;
else f4 = null;
step = 98;
case 98:
return v4 === 'instanceof';
// not a (non-assignment) binary operator
step = 95;
case 95:
return false;
return;
      }
    }
  };
}
  function this_par_parseGroup(){
var step = 1;
var v1, v0;
var f1, f0;
var groupAssignable;
return function inside_this_par_parseGroup(thawValue){
  while (true) {
    switch (step) {
      case 1:
// the expressions is required, the group is nonassignable if:
      // - wraps multiple expressions
      // - if the single expression is nonassignable
      // - if it wraps an assignment
step = 2;
case 2:
v0 = (f0 = f0 || this_par_parseExpressions())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 3;
case 3:
 groupAssignable = v0;
// groups cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      step = 4; case 4:
v1 = (f1 = f1 || this_tok_mustBeNum(0x29, false))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 5;
case 5:
if (groupAssignable !== 2) { step = 7; continue; }
step = 6;
case 6:
 groupAssignable = 0;
step = 7;
case 7:
return groupAssignable;
return;
      }
    }
  };
}
  function this_par_parseArray(){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
return function inside_this_par_parseArray(thawValue){
  while (true) {
    switch (step) {
      case 1:
case 2:
step = 4; case 4:
v0 = (f0 = f0 || this_par_parseExpressionOptional())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 5;
case 5:
 // just one because they are all optional (and arent in expressions)
step = 6;
case 6:
v1 = (f1 = f1 || this_tok_nextExprIfNum(0x2c))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 7;
case 7:
if (v1) { step = 2; continue; }
step = 3;
case 3:
 // elision
// array lits cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      step = 8; case 8:
v2 = (f2 = f2 || this_tok_mustBeNum(0x5d, false))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 9;
case 9:
return;
      }
    }
  };
}
  function this_par_parseObject(){
var step = 1;
var v2, v1, v0;
var f2, f1, f0;
var type, A;
return function inside_this_par_parseObject(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2;
case 2:
type = this_tok_lastType;
          A = type === 13 ;
if (A) { step = 5; continue; }
step = 4;
case 4:
 A =  type === 10 ;  
step = 5;
case 5:
if (A) { step = 8; continue; }
step = 7;
case 7:
 A =  type === 7; 
step = 8;
case 8:
if (!A) { step = 11; continue; }
case 10:
 step = 13; case 13:
v0 = (f0 = f0 || this_par_parsePair())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 14;
case 14:
 // 84% 9% 1% = 94%
case 11:
step = 15;
case 15:
v1 = (f1 = f1 || this_tok_nextExprIfNum(0x2c))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 16;
case 16:
if (v1) { step = 2; continue; }
step = 3;
case 3:
 // elision
// obj lits cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      step = 17; case 17:
v2 = (f2 = f2 || this_tok_mustBeNum(0x7d, false))(thawValue);
if (frozen) return v2;
else f2 = null;
step = 18;
case 18:
return;
      }
    }
  };
}
  function this_par_parsePair(){
var step = 1;
var v9, v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f9, f8, f7, f6, f5, f4, f3, f2, f1, f0;
var c, A;
return function inside_this_par_parsePair(thawValue){
  while (true) {
    switch (step) {
      case 1:
if (!(this_tok_lastLen !== 3)) { step = 3; continue; }
case 2:
step = 5;
case 5:
v0 = (f0 = f0 || this_par_parseData())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 6;
case 6:
return v0; // 92%
step = 3;
case 3:
 c = this_tok_firstTokenChar;
        A = c === 0x67 ;
if (!A) { step = 8; continue; }
case 7:
step = 10;
case 10:
v1 = (f1 = f1 || this_tok_nextPuncIfString('get'))(thawValue);
if (frozen) return v1;
else f1 = null;
step = 11;
case 11:
A =  v1; 
step = 8;
case 8:
if (!A) { step = 13; continue; }
step = 12;
case 12:
if (this_tok_lastType !== 13) { step = 16; continue; }
case 15:
step = 18; case 18:
v2 = (f2 = f2 || this_tok_next(false))(thawValue);
if (frozen) return v2;
else f2 = null;
case 19:
step = 20; case 20:
v3 = (f3 = f3 || this_par_parseFunctionRemainder(this_par_options.checkAccessorArgs ? 0 : 2, true))(thawValue);
if (frozen) return v3;
else f3 = null;
case 21:
step = 17;
continue;
case 16:
 step = 22; case 22:
v4 = (f4 = f4 || this_par_parseDataPart())(thawValue);
if (frozen) return v4;
else f4 = null;
step = 23;
case 23:
case 17:
step = 14;
continue;
case 13:
   A = c === 0x73 ;
if (!A) { step = 25; continue; }
case 24:
step = 27;
case 27:
v5 = (f5 = f5 || this_tok_nextPuncIfString('set'))(thawValue);
if (frozen) return v5;
else f5 = null;
step = 28;
case 28:
A =  v5; 
step = 25;
case 25:
if (!A) { step = 30; continue; }
step = 29;
case 29:
if (this_tok_lastType !== 13) { step = 33; continue; }
case 32:
step = 35; case 35:
v6 = (f6 = f6 || this_tok_next(false))(thawValue);
if (frozen) return v6;
else f6 = null;
case 36:
step = 37; case 37:
v7 = (f7 = f7 || this_par_parseFunctionRemainder(this_par_options.checkAccessorArgs ? 1 : 2, true))(thawValue);
if (frozen) return v7;
else f7 = null;
case 38:
step = 34;
continue;
case 33:
 step = 39; case 39:
v8 = (f8 = f8 || this_par_parseDataPart())(thawValue);
if (frozen) return v8;
else f8 = null;
step = 40;
case 40:
case 34:
step = 31;
continue;
case 30:
step = 41; case 41:
v9 = (f9 = f9 || this_par_parseData())(thawValue);
if (frozen) return v9;
else f9 = null;
step = 42;
case 42:
case 31:
step = 14;
case 14:
return;
      }
    }
  };
}
  function this_par_parseData(){
var step = 1;
var v1, v0;
var f1, f0;
return function inside_this_par_parseData(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2; case 2:
v0 = (f0 = f0 || this_tok_next(false))(thawValue);
if (frozen) return v0;
else f0 = null;
case 3:
step = 4; case 4:
v1 = (f1 = f1 || this_par_parseDataPart())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 5;
case 5:
return;
      }
    }
  };
}
  function this_par_parseDataPart(){
var step = 1;
var v1, v0;
var f1, f0;
return function inside_this_par_parseDataPart(thawValue){
  while (true) {
    switch (step) {
      case 1:
step = 2; case 2:
v0 = (f0 = f0 || this_tok_mustBeNum(0x3a, true))(thawValue);
if (frozen) return v0;
else f0 = null;
case 3:
step = 4; case 4:
v1 = (f1 = f1 || this_par_parseExpression())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 5;
case 5:
return;
      }
    }
  };
}
  function this_par_isReservedIdentifierSpecial(){
var step = 1;
var v16, v15, v14, v13, v12, v11, v10, v9, v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f16, f15, f14, f13, f12, f11, f10, f9, f8, f7, f6, f5, f4, f3, f2, f1, f0;
var value, c, A, d;
return function inside_this_par_isReservedIdentifierSpecial(thawValue){
  while (true) {
    switch (step) {
      case 1:
// Same as isReservedIdentifier but without the statement
      // keywords, value keywords and unary operators because
      // they'll be valid at this point. This check is specific
      // to the expression or label parsing func.
// Note that none of these checks should pass.
      // This function returns 100% false. Let's be quick about it.
value;
c = this_tok_firstTokenChar;
// stats:
      // len: 1:26%, 2:6%, 3:6%, 4:34%, 5:5%, 6:5%, 7:3%, 8:3%
      // chr: a:5%, b:4%, c:5%, d:3%, e:3%, f:1%, g:2%, h:1%, i:1%, j:1%, k:1%, l:1%, m:2%, n:2%, o:1%, p:2%, q:0%, r:2%, s:2%, t:30%, u:1%, v:1%, w:1%, x:0%, y:0%, z:0%, rest: 28%
      // so: len=1 and c=t and c as non-lowercase-letter should exit early
A = c < 0x63 ;
if (A) { step = 3; continue; }
step = 2;
case 2:
 A =  // 38%
        c === 0x74 ;  
step = 3;
case 3:
if (A) { step = 6; continue; }
step = 5;
case 5:
 A =  // 30%
        this_tok_lastLen === 1 // 14%
      ; 
step = 6;
case 6:
if (!A) { step = 9; continue; }
step = 8;
case 8:
 return false;
// stats now:
      // len: 1:0, 2:3%, 3:2%, 4:3%, 5:2%, 6:2%, 7:2%, 8:1%, >8:4%
      // chr: a:0, b:0, c:2%, d:1%, e:1%, f:1%, g:1%, h:1%, i:1%, j:0%, k:0%, l:1%, m:1%, n:1%, o:1%, p:2%, q:0%, r:1%, s:2%, t:0, u:0%, v:1%, w:0%, x:0%, y:0%, z:0%, rest:0
      // so: meh. note: no rest because capitals and such are already discarded with the <c check. same goes for _ and $.
// rest true: 9%, false: 11%?
step = 9;
case 9:
if (c !== 0x63) { step = 12; continue; }
step = 11;
case 11:
  // 2.5%
step = 14;
case 14:
v0 = (f0 = f0 || this_tok_getNum(1))(thawValue);
if (frozen) return v0;
else f0 = null;
step = 15;
case 15:
 d = v0;
          A = d === 0x6f ;
if (!A) { step = 17; continue; }
case 16:
step = 19;
case 19:
v1 = (f1 = f1 || this_tok_getLastValue())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 20;
case 20:
A =  v1 === 'const'; 
step = 17;
case 17:
if (!A) { step = 22; continue; }
step = 21;
case 21:
 return true;
step = 22;
case 22:
  A = d === 0x6c ;
if (!A) { step = 25; continue; }
case 24:
step = 27;
case 27:
v2 = (f2 = f2 || this_tok_getLastValue())(thawValue);
if (frozen) return v2;
else f2 = null;
step = 28;
case 28:
A =  v2 === 'class'; 
step = 25;
case 25:
if (!A) { step = 30; continue; }
step = 29;
case 29:
 return true;
step = 30;
case 30:
if (!(d !== 0x61)) { step = 33; continue; }
step = 32;
case 32:
 return false;
case 33:
step = 35;
case 35:
v3 = (f3 = f3 || this_tok_getLastValue())(thawValue);
if (frozen) return v3;
else f3 = null;
step = 36;
case 36:
 value = v3;
          A = value === 'catch' ;
if (A) { step = 38; continue; }
step = 37;
case 37:
 A =  value === 'case'; 
step = 38;
case 38:
return (A);
step = 12;
case 12:
if (c !== 0x73) { step = 41; continue; }
step = 40;
case 40:
  // 1.8%
step = 43;
case 43:
v4 = (f4 = f4 || this_tok_getNum(1))(thawValue);
if (frozen) return v4;
else f4 = null;
step = 44;
case 44:
 A = v4 === 0x75 ;
if (!A) { step = 46; continue; }
case 45:
step = 48;
case 48:
v5 = (f5 = f5 || this_tok_getLastValue())(thawValue);
if (frozen) return v5;
else f5 = null;
step = 49;
case 49:
A =  v5 === 'super'; 
step = 46;
case 46:
return A;
step = 41;
case 41:
if (c !== 0x64) { step = 51; continue; }
step = 50;
case 50:
  // 1.5%
step = 53;
case 53:
v6 = (f6 = f6 || this_tok_getNum(1))(thawValue);
if (frozen) return v6;
else f6 = null;
step = 54;
case 54:
 A = v6 === 0x65 ;
if (!A) { step = 56; continue; }
case 55:
step = 58;
case 58:
v7 = (f7 = f7 || this_tok_getLastValue())(thawValue);
if (frozen) return v7;
else f7 = null;
step = 59;
case 59:
A =  v7 === 'default'; 
step = 56;
case 56:
return A;
step = 51;
case 51:
if (c !== 0x65) { step = 61; continue; }
step = 60;
case 60:
  // 1.1%
step = 63;
case 63:
v8 = (f8 = f8 || this_tok_getNum(1))(thawValue);
if (frozen) return v8;
else f8 = null;
step = 64;
case 64:
 d = v8;
          A = d === 0x6c ;
if (!A) { step = 66; continue; }
case 65:
step = 68;
case 68:
v9 = (f9 = f9 || this_tok_getLastValue())(thawValue);
if (frozen) return v9;
else f9 = null;
step = 69;
case 69:
A =  v9 === 'else'; 
step = 66;
case 66:
  A = (A) ;
if (A) { step = 71; continue; }
step = 70;
case 70:
   A = d === 0x6e ;
if (!A) { step = 74; continue; }
case 73:
step = 76;
case 76:
v10 = (f10 = f10 || this_tok_getLastValue())(thawValue);
if (frozen) return v10;
else f10 = null;
step = 77;
case 77:
A =  v10 === 'enum'; 
step = 74;
case 74:
A =  (A); 
step = 71;
case 71:
if (!A) { step = 79; continue; }
step = 78;
case 78:
 return true;
step = 79;
case 79:
if (!(d !== 0x78)) { step = 82; continue; }
step = 81;
case 81:
 return false;
case 82:
step = 84;
case 84:
v11 = (f11 = f11 || this_tok_getLastValue())(thawValue);
if (frozen) return v11;
else f11 = null;
step = 85;
case 85:
 value = v11;
          A = value === 'export' ;
if (A) { step = 87; continue; }
step = 86;
case 86:
 A =  value === 'extends'; 
step = 87;
case 87:
return (A);
step = 61;
case 61:
if (c !== 0x66) { step = 90; continue; }
step = 89;
case 89:
  // 0.8%
step = 92;
case 92:
v12 = (f12 = f12 || this_tok_getNum(1))(thawValue);
if (frozen) return v12;
else f12 = null;
step = 93;
case 93:
 A = v12 === 0x69 ;
if (!A) { step = 95; continue; }
case 94:
step = 97;
case 97:
v13 = (f13 = f13 || this_tok_getLastValue())(thawValue);
if (frozen) return v13;
else f13 = null;
step = 98;
case 98:
A =  v13 === 'finally'; 
step = 95;
case 95:
return A;
step = 90;
case 90:
if (c !== 0x69) { step = 100; continue; }
step = 99;
case 99:
  // 0.8%
step = 102;
case 102:
v14 = (f14 = f14 || this_tok_getNum(1))(thawValue);
if (frozen) return v14;
else f14 = null;
step = 103;
case 103:
 d = v14;
          A = d === 0x6e ;
if (!A) { step = 105; continue; }
step = 104;
case 104:
   A = this_tok_lastLen === 2 ;
if (A) { step = 108; continue; }
case 107:
step = 110;
case 110:
v15 = (f15 = f15 || this_tok_getLastValue())(thawValue);
if (frozen) return v15;
else f15 = null;
step = 111;
case 111:
A =  v15 === 'instanceof'; 
step = 108;
case 108:
A =  (A); 
step = 105;
case 105:
  A = (A) ;
if (A) { step = 113; continue; }
step = 112;
case 112:
   A = d === 0x6d ;
if (!A) { step = 116; continue; }
case 115:
step = 118;
case 118:
v16 = (f16 = f16 || this_tok_getLastValue())(thawValue);
if (frozen) return v16;
else f16 = null;
step = 119;
case 119:
A =  v16 === 'import'; 
step = 116;
case 116:
A =  (A); 
step = 113;
case 113:
return A;
step = 100;
case 100:
return false;
return;
      }
    }
  };
}
  function this_par_isReservedIdentifier(ignoreValues){
var step = 1;
var v28, v27, v26, v25, v24, v23, v22, v21, v20, v19, v18, v17, v16, v15, v14, v13, v12, v11, v10, v9, v8, v7, v6, v5, v4, v3, v2, v1, v0;
var f28, f27, f26, f25, f24, f23, f22, f21, f20, f19, f18, f17, f16, f15, f14, f13, f12, f11, f10, f9, f8, f7, f6, f5, f4, f3, f2, f1, f0;
var c, len, value, A;
return function inside_this_par_isReservedIdentifier(thawValue){
  while (true) {
    switch (step) {
      case 1:
// Note that this function will return false most of the time
      // If it returns true a syntax error will probably be thrown.
      // In all non-error cases input token will be an identifier
// len=1: 36%
      // len=2: 7%
      // len=3: 7%
      // len=4: 24%
      // len=5: 5%
      // len=6: 4%
      // len=7: 3%
      // len=8: 3%
      // each len >8 is <=2%, combined: 11%
// keywords per len (from the 16mb bench file):
      // 1:
      // 2: do if in: never happens (could it validly?)
      // 3: new var for try: never happens (could it validly?)
      // 4: case else void this with enum true null: 17% [this:15.5%, true:1%, null:1.2%]
      // 5: break catch while throw class super const false: 1% [false: 1%]
      // 6: typeof return switch delete export import: never
      // 7: finally default extends: never
      // 8: continue debugger function: never
      // 9:
      // 10: instanceof: never
// From the above it's obvious that only value keywords might be found
      // by this function. anything else is probably an error.
      // The reason statement keywords are not found here is because that is
      // handled by a function that specifically scans them.
c = this_tok_firstTokenChar;
       len = this_tok_lastLen;
// a:8%, b:6%, c:6%, d:4%, e:4%, f:3%, g:2%, h:2%, i:4%, j:1%, k:1%, l:2%, m:2%, n:4%, o:2%, p:3%, q:0%, r:2%, s:3%, t:17%, u:1%, v:2%, w:1%, x:1%, y:1%, z:0%, rest:17%
if (len !== 1) { step = 3; continue; }
step = 2;
case 2:
 return false; // 39%
// stats after only dropping len=1:
      // len: 1:0, 2:7%, 3:7%, 4:22%, 5:5%, 6:4%, 7:3%, 8:3%, rest:10%
      // chr: a:2%, b:2%, c:3%, d:2%, e:2%, f:2%, g:1%, h:1%, i:2%, j:0%, k:1%, l:1%, m:1%, n:3%, o:1%, p:2%, q:0%, r:1%, s:3%, t:16%, u:1%, v:1%, w:1%, x:0%, y:0%, z:0%, rest: 12%
      // conclusion: len=4 (22%) has a significance. c=t (12%) does too. probably the same step, unfortunately. can probably do the <=a trick here as well
step = 3;
case 3:
if (!(c <= 0x61)) { step = 6; continue; }
step = 5;
case 5:
 return false; // 14%
// after dropping <=a
      // 1:0, 2:2%, 3:2%, 4:8%, 5:2%, 6:1%, 7:1%, 8:1%, rest: 3%
      // a:0, b:1%, c:1%, d:1%, e:1%, f:0%, g:0%, h:0%, i:1%, j:0%, k:0%, l:0%, m:1%, n:1%, o:1%, p:1%, q:0%, s:1%, t:7%, u:0%, v:1%, w:0%, x:0%, y:0%, z:0%, rest:0
      // so: only c=t and len=4 are standing out, slightly. rest is negligible
step = 6;
case 6:
if (len !== 4) { step = 9; continue; }
step = 8;
case 8:
  // 19%
        // case else void this with enum true null
        // relevant character stats per position:
        // 1: t:14% n:2% (centvw)
        // 2: h:12% a:1% e:1% o:1% r:1% u:2% (ahilnoru)
        // 3: i:13% d:1% e:1% l:2% u:1% (ilstu)
        // 4: s:13% e:3% l:2% t:1% (dehmls)
// true
        // this
        if (c !== 0x74) { step = 12; continue; }
step = 11;
case 11:
if (!ignoreValues) { step = 15; continue; }
step = 14;
case 14:
 return false;
case 15:
step = 17;
case 17:
v0 = (f0 = f0 || this_tok_getLastValue())(thawValue);
if (frozen) return v0;
else f0 = null;
step = 18;
case 18:
 value = v0;
            A = value === 'this' ;
if (A) { step = 20; continue; }
step = 19;
case 19:
 A =  value === 'true'; 
step = 20;
case 20:
return (A);
// null
step = 12;
case 12:
if (c !== 0x6e) { step = 23; continue; }
step = 22;
case 22:
A = !ignoreValues ;
if (!A) { step = 26; continue; }
case 25:
step = 28;
case 28:
v1 = (f1 = f1 || this_tok_getLastValue())(thawValue);
if (frozen) return v1;
else f1 = null;
step = 29;
case 29:
A =  v1 === 'null'; 
step = 26;
case 26:
return A;
// else
        // enum
step = 23;
case 23:
if (c !== 0x65) { step = 31; continue; }
step = 30;
case 30:
// case else true
step = 33;
case 33:
v2 = (f2 = f2 || this_tok_getLastValue())(thawValue);
if (frozen) return v2;
else f2 = null;
step = 34;
case 34:
 value = v2;
            A = value === 'else' ;
if (A) { step = 36; continue; }
step = 35;
case 35:
 A =  value === 'enum'; 
step = 36;
case 36:
return (A);
// case
step = 31;
case 31:
if (c !== 0x63) { step = 39; continue; }
case 38:
step = 41;
case 41:
v3 = (f3 = f3 || this_tok_getLastValue())(thawValue);
if (frozen) return v3;
else f3 = null;
step = 42;
case 42:
return v3 === 'case';
step = 39;
case 39:
if (!(c < 0x76)) { step = 44; continue; }
step = 43;
case 43:
 return false; // 2.3% (way more than the 0.15% of v and w)
// void
step = 44;
case 44:
if (c !== 0x76) { step = 47; continue; }
step = 46;
case 46:
A = !ignoreValues ;
if (!A) { step = 50; continue; }
case 49:
step = 52;
case 52:
v4 = (f4 = f4 || this_tok_getLastValue())(thawValue);
if (frozen) return v4;
else f4 = null;
step = 53;
case 53:
A =  v4 === 'void'; 
step = 50;
case 50:
return A;
// with
step = 47;
case 47:
if (c !== 0x77) { step = 55; continue; }
case 54:
step = 57;
case 57:
v5 = (f5 = f5 || this_tok_getLastValue())(thawValue);
if (frozen) return v5;
else f5 = null;
step = 58;
case 58:
return v5 === 'with';
step = 55;
case 55:
return false;
//      bcdefinrstvw
// 1:0 2:4.6 3:4 4:0 5:4.2 6:3 7:2.7 8:2.2 >8:6.9 = 27.6
      // a:0 b:1.5 c:2.5 d:1.5 e:1.5 f:2 g:1 h:0.5 i:1.5 j:0.5 k:0.5 l:1 m:1: n:1 o:1.5 p:2: q:0 r:1.5 s:2.5 t:1.5 u:1: v:1 w:0.5 x:0.5 y:0 z:0
step = 9;
case 9:
if (!(len >= 7)) { step = 60; continue; }
step = 59;
case 59:
  // 11.7%
// 7: finally default extends: never
        // 8: continue debugger function: never
        // 10: instanceof: never
        // cdefi
if (!(c > 0x69)) { step = 63; continue; }
step = 62;
case 62:
 return false; // 6.4%
step = 63;
case 63:
if (c !== 0x63) { step = 66; continue; }
step = 65;
case 65:
  // 1.5%
step = 68;
case 68:
v6 = (f6 = f6 || this_tok_getLastValue())(thawValue);
if (frozen) return v6;
else f6 = null;
step = 69;
case 69:
return v6 === 'continue';
step = 66;
case 66:
if (c !== 0x64) { step = 71; continue; }
step = 70;
case 70:
  // 0.8%
step = 73;
case 73:
v7 = (f7 = f7 || this_tok_getLastValue())(thawValue);
if (frozen) return v7;
else f7 = null;
step = 74;
case 74:
 value = v7;
            A = value === 'default' ;
if (A) { step = 76; continue; }
step = 75;
case 75:
 A =  value === 'debugger'; 
step = 76;
case 76:
return A;
step = 71;
case 71:
if (c !== 0x65) { step = 79; continue; }
step = 78;
case 78:
  // 0.8%
step = 81;
case 81:
v8 = (f8 = f8 || this_tok_getLastValue())(thawValue);
if (frozen) return v8;
else f8 = null;
step = 82;
case 82:
return v8 === 'extends';
step = 79;
case 79:
if (c !== 0x66) { step = 84; continue; }
step = 83;
case 83:
  // 0.5%
step = 86;
case 86:
v9 = (f9 = f9 || this_tok_getLastValue())(thawValue);
if (frozen) return v9;
else f9 = null;
step = 87;
case 87:
 value = v9;
            A = value === 'finally' ;
if (A) { step = 89; continue; }
step = 88;
case 88:
 A =  value === 'function'; 
step = 89;
case 89:
return A;
step = 84;
case 84:
if (c !== 0x69) { step = 92; continue; }
step = 91;
case 91:
  // 0.7%
step = 94;
case 94:
v10 = (f10 = f10 || this_tok_getLastValue())(thawValue);
if (frozen) return v10;
else f10 = null;
step = 95;
case 95:
return v10 === 'instanceof';
step = 92;
case 92:
return false; // 1%
// 3: new var for try : 4
      // 5: break catch while throw class super const false: 4.2
      // 6: typeof return switch delete export import: never: 3
step = 60;
case 60:
if (len !== 2) { step = 97; continue; }
step = 96;
case 96:
  // 4.6%
        if (c !== 0x69) { step = 100; continue; }
case 99:
step = 102;
case 102:
v11 = (f11 = f11 || this_tok_getLastValue())(thawValue);
if (frozen) return v11;
else f11 = null;
step = 103;
case 103:
 value = v11;
            A = value === 'if' ;
if (A) { step = 105; continue; }
step = 104;
case 104:
 A =  value === 'in'; 
step = 105;
case 105:
return A;
step = 100;
case 100:
if (c !== 0x64) { step = 108; continue; }
case 107:
step = 110;
case 110:
v12 = (f12 = f12 || this_tok_getLastValue())(thawValue);
if (frozen) return v12;
else f12 = null;
step = 111;
case 111:
return v12 === 'do';
step = 108;
case 108:
return false;
step = 97;
case 97:
if (len !== 5) { step = 113; continue; }
step = 112;
case 112:
  // 4.2%
        if (c !== 0x66) { step = 116; continue; }
step = 115;
case 115:
   A = !ignoreValues ;
if (!A) { step = 119; continue; }
case 118:
step = 121;
case 121:
v13 = (f13 = f13 || this_tok_getLastValue())(thawValue);
if (frozen) return v13;
else f13 = null;
step = 122;
case 122:
A =  v13 === 'false'; 
step = 119;
case 119:
return A;
step = 116;
case 116:
if (c !== 0x73) { step = 124; continue; }
case 123:
step = 126;
case 126:
v14 = (f14 = f14 || this_tok_getLastValue())(thawValue);
if (frozen) return v14;
else f14 = null;
step = 127;
case 127:
return v14 === 'super';
step = 124;
case 124:
if (c !== 0x63) { step = 129; continue; }
case 128:
step = 131;
case 131:
v15 = (f15 = f15 || this_tok_getLastValue())(thawValue);
if (frozen) return v15;
else f15 = null;
step = 132;
case 132:
 value = v15;
            A = value === 'catch' ;
if (A) { step = 134; continue; }
step = 133;
case 133:
 A =  value === 'class' ;  
step = 134;
case 134:
if (A) { step = 137; continue; }
step = 136;
case 136:
 A =  value === 'const'; 
step = 137;
case 137:
return A;
step = 129;
case 129:
if (c !== 0x74) { step = 140; continue; }
case 139:
step = 142;
case 142:
v16 = (f16 = f16 || this_tok_getLastValue())(thawValue);
if (frozen) return v16;
else f16 = null;
step = 143;
case 143:
return v16 === 'throw';
step = 140;
case 140:
if (c !== 0x62) { step = 145; continue; }
case 144:
step = 147;
case 147:
v17 = (f17 = f17 || this_tok_getLastValue())(thawValue);
if (frozen) return v17;
else f17 = null;
step = 148;
case 148:
return v17 === 'break';
step = 145;
case 145:
if (c !== 0x77) { step = 150; continue; }
case 149:
step = 152;
case 152:
v18 = (f18 = f18 || this_tok_getLastValue())(thawValue);
if (frozen) return v18;
else f18 = null;
step = 153;
case 153:
return v18 === 'while';
step = 150;
case 150:
return false;
step = 113;
case 113:
if (len !== 3) { step = 155; continue; }
step = 154;
case 154:
  // 4%
        if (c !== 0x6e) { step = 158; continue; }
step = 157;
case 157:
   A = !ignoreValues ;
if (!A) { step = 161; continue; }
case 160:
step = 163;
case 163:
v19 = (f19 = f19 || this_tok_getLastValue())(thawValue);
if (frozen) return v19;
else f19 = null;
step = 164;
case 164:
A =  v19 === 'new'; 
step = 161;
case 161:
return A;
step = 158;
case 158:
if (c !== 0x76) { step = 166; continue; }
case 165:
step = 168;
case 168:
v20 = (f20 = f20 || this_tok_getLastValue())(thawValue);
if (frozen) return v20;
else f20 = null;
step = 169;
case 169:
return v20 === 'var';
step = 166;
case 166:
if (c !== 0x74) { step = 171; continue; }
case 170:
step = 173;
case 173:
v21 = (f21 = f21 || this_tok_getLastValue())(thawValue);
if (frozen) return v21;
else f21 = null;
step = 174;
case 174:
return v21 === 'try';
step = 171;
case 171:
if (c !== 0x66) { step = 176; continue; }
case 175:
step = 178;
case 178:
v22 = (f22 = f22 || this_tok_getLastValue())(thawValue);
if (frozen) return v22;
else f22 = null;
step = 179;
case 179:
return v22 === 'for';
step = 176;
case 176:
return false;
// 3%
step = 155;
case 155:
if (c !== 0x73) { step = 181; continue; }
case 180:
step = 183;
case 183:
v23 = (f23 = f23 || this_tok_getLastValue())(thawValue);
if (frozen) return v23;
else f23 = null;
step = 184;
case 184:
return v23 === 'switch';
step = 181;
case 181:
if (c !== 0x72) { step = 186; continue; }
case 185:
step = 188;
case 188:
v24 = (f24 = f24 || this_tok_getLastValue())(thawValue);
if (frozen) return v24;
else f24 = null;
step = 189;
case 189:
return v24 === 'return';
step = 186;
case 186:
if (c !== 0x74) { step = 191; continue; }
step = 190;
case 190:
   A = !ignoreValues ;
if (!A) { step = 194; continue; }
case 193:
step = 196;
case 196:
v25 = (f25 = f25 || this_tok_getLastValue())(thawValue);
if (frozen) return v25;
else f25 = null;
step = 197;
case 197:
A =  v25 === 'typeof'; 
step = 194;
case 194:
return A;
step = 191;
case 191:
if (c !== 0x69) { step = 199; continue; }
case 198:
step = 201;
case 201:
v26 = (f26 = f26 || this_tok_getLastValue())(thawValue);
if (frozen) return v26;
else f26 = null;
step = 202;
case 202:
return v26 === 'import';
step = 199;
case 199:
if (c !== 0x65) { step = 204; continue; }
case 203:
step = 206;
case 206:
v27 = (f27 = f27 || this_tok_getLastValue())(thawValue);
if (frozen) return v27;
else f27 = null;
step = 207;
case 207:
return v27 === 'export';
step = 204;
case 204:
if (c !== 0x64) { step = 209; continue; }
step = 208;
case 208:
   A = !ignoreValues ;
if (!A) { step = 212; continue; }
case 211:
step = 214;
case 214:
v28 = (f28 = f28 || this_tok_getLastValue())(thawValue);
if (frozen) return v28;
else f28 = null;
step = 215;
case 215:
A =  v28 === 'delete'; 
step = 212;
case 212:
return A;
step = 209;
case 209:
return false;
return;
      }
    }
  };
}
  function this_par_isValueKeyword(c, word){
var step = 1;
var A;
return function inside_this_par_isValueKeyword(thawValue){
  while (true) {
    switch (step) {
      case 1:
if (!(word.length === 4)) { step = 3; continue; }
step = 2;
case 2:
if (c !== 0x74) { step = 6; continue; }
step = 5;
case 5:
   A = word === 'this' ;
if (A) { step = 9; continue; }
step = 8;
case 8:
 A =  word === 'true'; 
step = 9;
case 9:
return A;
step = 6;
case 6:
  A = c === 0x6e ;
if (!A) { step = 12; continue; }
step = 11;
case 11:
 A =  word === 'null'; 
step = 12;
case 12:
return A;
step = 3;
case 3:
  A = c === 0x66 ;
if (!A) { step = 15; continue; }
step = 14;
case 14:
 A =  word.length === 5 ;  
step = 15;
case 15:
if (!A) { step = 18; continue; }
step = 17;
case 17:
 A =  word === 'false'; 
step = 18;
case 18:
return A;
return;
      }
    }
  };
}
// indices match slots of the start-regexes (where applicable)
  // this order is determined by regex/parser rules so they are fixed
// WHITE_SPACE, LINETERMINATOR COMMENT_SINGLE COMMENT_MULTI
// boolean constants
var Par = exports.Par = function(input, options){
    {{{{ var A = options ; }} if (!A) {{A =  {}; }}}this_par_options = options = (A);
}if (!options.saveTokens) options.saveTokens = false;
    if (!options.createBlackStream) options.createBlackStream = false;
    if (!options.functionMode) options.functionMode = false;
    if (!options.regexNoClassEscape) options.regexNoClassEscape = false;
    if (!options.strictForInCheck) options.strictForInCheck = false;
    if (!options.strictAssignmentCheck) options.strictAssignmentCheck = false;
    if (!options.checkAccessorArgs) options.checkAccessorArgs = false;
    if (!options.requireDoWhileSemi) options.requireDoWhileSemi = false;
    options.allowCallAssignment = options.allowCallAssignment ? 1 : 0;
// `this['xxx'] prevents build script mangling :)
    this_par_tok = new Tok(input, this_par_options);
    this['run'] = this_par_run; // used in Par.parse
// special build
    if (typeof frozen !== 'undefined') {
      this['frozenObject'] = {
        frozen: true,
        thaw: null
      };
    }
  };
Par[18] = 'white space';
  Par[10] = 'string';
  Par[7] = 'number';
  Par[8] = 'regex';
  Par[9] = 'punctuator';
  Par[13] = 'identifier';
  Par[14] = 'EOF';
  Par[15] = 'ASI';
  Par[16] = 'error';
Par.WHITE = 18; // WHITE_SPACE LINETERMINATOR COMMENT_SINGLE COMMENT_MULTI
  Par.STRING = 10;
  Par.NUMBER = 7;
  Par.REGEX = 8;
  Par.PUNCTUATOR = 9;
  Par.IDENTIFIER = 13;
  Par.EOF = 14;
  Par.ASI = 15;
  Par.ERROR = 16;
Par.Tok = Tok;
Par.updateTok = function(T) {
    Tok = T;
    Par.Tok = Tok;
  };
Par.parse = function(input, options){
    var par = new Par(input, options);
// no need for .call; for streamer the generator ignores it, we call/apply below.
    // We consider runWithoutFurtherInput a testing mechanism so dont have to care
    // about the api there either. Regular build works fine without call here.
    var f = par.run();
// `frozen` is added as a module global in an extra build step
    if (typeof frozen !== 'undefined') {
      // f will be a generator
// The browser will yield when the parser needs more input the first time
      // (it will always do this, even at a "proper" EOF). If you supplied a
      // `frozenCallback` option, that function will be called with the `thawValue`.
      // This is optional though. It is either way up to you to call `thaw` to
      // continue parsing. Passing on `false` will treat the current EOF as an
      // actual EOF and act accordingly. Otherwise it will accept the argument
      // as new string input, concat it to the existing input and continue parsing.
{{{{ var A = options ; } if (A) {A =  options.runWithoutFurtherInput; }}}if (A) {
        // testing
        do{{{{{{ {
          // start parsing nao
          var yieldValue = f.call(par, false);
        } }}}}}}while (frozen);
        f = yieldValue;
      } else {
        var thaw = f;
        f = par.frozenObject;
        f.thaw = function(){ return thaw.apply(par, arguments); };
      }
    }}
return f;
  };
// note: this causes deopt in chrome by this bug: https://code.google.com/p/v8/issues/detail?id=2246
  ;
//######### end of par.js #########
})(typeof exports === "undefined" ? window : exports);
