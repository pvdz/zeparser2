(function(exports){
//######### uni.js #########

// http://qfox.nl/notes/155
// http://qfox.nl/notes/90

  var uniRegex = exports.uni = /[\u0030-\u0039\u0041-\u005a\u005f\u0061-\u007a\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u0487\u048a-\u0524\u0526\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0621-\u065e\u0660-\u0669\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07c0-\u07f5\u07fa\u0901-\u0939\u093c-\u094d\u0950-\u0954\u0958-\u0963\u0966-\u096f\u0971\u0972\u097b-\u097f\u0981-\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7\u09c8\u09cb-\u09ce\u09d7\u09dc\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a66-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5c\u0b5d\u0b5f-\u0b63\u0b66-\u0b6f\u0b71\u0b82\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c58\u0c59\u0c60-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0cde\u0ce0-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d60-\u0d63\u0d66-\u0d6f\u0d7a-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e50-\u0e59\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc\u0edd\u0f00\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f8b\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1049\u1050-\u1099\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc\u1100-\u1159\u115f-\u11a2\u11a8-\u11f9\u1200-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u1676\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772\u1773\u1780-\u17b3\u17b6-\u17d3\u17d7\u17dc\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1820-\u1877\u1880-\u18aa\u1900-\u191c\u1920-\u192b\u1930-\u193b\u1946-\u196d\u1970-\u1974\u1980-\u19a9\u19b0-\u19c9\u19d0-\u19d9\u1a00-\u1a1b\u1b00-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1baa\u1bae-\u1bb9\u1c00-\u1c37\u1c40-\u1c49\u1c4d-\u1c7d\u1d00-\u1de6\u1dfe-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffb\u203f\u2040\u2054\u2071\u207f\u2090-\u2094\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb\u2ced\u2cf2\u2d00-\u2d25\u2d30-\u2d65\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005-\u3007\u3021-\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u3099\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31b7\u31f0-\u31ff\u3400\u4db5\u4e00\u9fc3\ua000-\ua1af\ua60c\ua620-\ua629\ua640-\ua660\ua662-\ua66d\ua66f\ua67c\ua67d\ua67f-\ua697\ua717-\ua71f\ua722-\ua788\ua78b-\ua78d\ua790\ua792\ua7a0\ua7a2\ua7a4\ua7a6\ua7a8\ua7aa\ua802\ua806\ua80b\ua823-\ua827\ua880\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua900-\ua909\ua926-\ua92d\ua947-\ua953\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\ufb00-\ufb06\ufb13-\ufb17\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff70\uff9e\uff9f]/;

//######### end of uni.js #########

//######### tok.js #########

  var this_tok_input =  '';
  var this_tok_len =  0;
  var this_tok_pos =  0;
  var this_tok_options =  null;
  var this_tok_lastStart =  0;
  var this_tok_lastStop =  0;
  var this_tok_lastLen =  0;
  var this_tok_lastType =  -1;
  var this_tok_lastValue =  '';
  var this_tok_lastNewline =  false;
  var this_tok_nextNum1 =  -1;
  var this_tok_nextNum2 =  -1;
  var this_tok_tokenCountAll =  0;
  var this_tok_tokens =  null;
  var this_tok_black =  null;
  function this_tok_isType(t){
      return this_tok_lastType === t;
    }
  function this_tok_isValue(){
      return this_tok_lastType === 10 || this_tok_lastType === 7 || this_tok_lastType === 13 || this_tok_lastType === 8 || false;
    }
  function this_tok_isNum(n){
      return this_tok_getLastNum() === n;
    }
  function this_tok_isString(value){
      return this_tok_getLastValue() === value;
    }
  function this_tok_nextPuncIfValue(){
      var equals = this_tok_isValue();
      if (equals) this_tok_nextPunc();
      return equals;
    }
  function this_tok_nextExprIfNum(num){
      var equals = this_tok_isNum(num);
      if (equals) this_tok_nextExpr();
      return equals;
    }
  function this_tok_nextPuncIfString(str){
      var equals = this_tok_isString(str);
      if (equals) this_tok_nextPunc();
      return equals;
    }
  function this_tok_mustBeNum(num, nextIsExpr){
      if (this_tok_isNum(num)) {
        this_tok_next(nextIsExpr);
      } else {
        throw this_tok_syntaxError(num);
      }
    }
  function this_tok_mustBeIdentifier(nextIsExpr){
      if (this_tok_isType(13)) {
        this_tok_next(nextIsExpr);
      } else {
        throw this_tok_syntaxError(13);
      }
    }
  function this_tok_mustBeString(str, nextIsExpr){
      if (this_tok_isString(str)) {
        this_tok_next(nextIsExpr);
      } else {
        throw this_tok_syntaxError(str);
      }
    }
  function this_tok_nextExpr(){
      return this_tok_next(true);
    }
  function this_tok_nextPunc(){
      return this_tok_next(false);
    }
  function this_tok_next(expressionStart){
      this_tok_lastNewline = false;

      var toStream = this_tok_options.saveTokens;

      do {
        var type = this_tok_nextWhiteToken(expressionStart);
        if (toStream) {
          var token = {type:type, value:this_tok_getLastValue(), start:this_tok_lastStart, stop:this_tok_pos, white:this_tok_tokens.length};
          this_tok_tokens.push(token);
        }
      } while (type === 18);

      if (toStream && this_tok_options.createBlackStream) {
        token.black = this_tok_black.length;
        this_tok_black.push(token);
      }

      this_tok_lastType = type;
      return type;
    }
  function this_tok_nextWhiteToken(expressionStart){
      this_tok_lastValue = '';

      // prepare charCodeAt cache...
      if (this_tok_lastLen === 1) this_tok_nextNum1 = this_tok_nextNum2;
      else this_tok_nextNum1 = -1;
      this_tok_nextNum2 = -1;

      ++this_tok_tokenCountAll;

      var pos = this_tok_pos;
      var start = this_tok_lastStart = pos;
      var result = 14;
      if (pos < this_tok_len) result = this_tok_nextToken(expressionStart, pos);
      this_tok_lastLen = (this_tok_lastStop = this_tok_pos) - start;

      return result;
    }
  function this_tok_nextToken(expressionStart, pos){
      var input = this_tok_input;
      var c = this_tok_getLastNum(); // this.pos === this.lastStart
      var result = -1;

      // https://twitter.com/ariyahidayat/status/225447566815395840
      // Punctuator, Identifier, Keyword, String, Numeric, Boolean, Null, RegularExpression
      // so:
      // Whitespace, RegularExpression, Punctuator, Identifier, LineTerminator, String, Numeric
      if (c >= 0x21 && c <= 0x2f && this_tok_punctuator(c)) result = 9;
      else if (this_tok_asciiIdentifier(c)) result = 13;
      else if (c >= 0x3a && this_tok_punctuator(c)) result = 9;
      else if (c === 0x20) ++this_tok_pos, result = 18;
      else result = this_tok_nextToken_2(c, pos, input, expressionStart);

      return result;
    }
  function this_tok_nextToken_2(c, pos, input, expressionStart){
      var result = -1;

      if (this_tok_lineTerminator(c, pos)) result = 18;
      else if (c === 0x22) result = this_tok_stringDouble();
      else if (this_tok_number(c,pos,input)) result = 7; // number after punctuator, check algorithm if that changes!
      else if (this_tok_whitespace(c)) result = 18; // (doesnt check for space, must go after lineterminator, update algo if this changes)
      else if (c === 0x27) result = this_tok_stringSingle();
      else if (c === 0x2f) {
        var n = this_tok_getLastNum2(); // this.pos === this.lastStart+1
        if (n === 0x2f) result = this_tok_commentSingle(pos, input);
        else if (n === 0x2a) result = this_tok_commentMulti(pos, input);
        else if (expressionStart) result = this_tok_regex();
        else result = this_tok_punctuatorDiv(c,n);
      }
      else throw 'dont know what to parse now. '+this_tok_syntaxError();

      return result;
    }
  function this_tok_punctuator(c){
      var len = 0;
      //    >>>=,
      //    === !== >>> <<= >>=
      //    <= >= == != ++ -- << >> && || += -= *= %= &= |= ^= /=
      //    { } ( ) [ ] . ; ,< > + - * % | & ^ ! ~ ? : = /
      if (c === 0x2e) { // 15.30%
        var d = this_tok_getLastNum2();
        if (d < 0x30 || d > 0x39) len = 1;
      } else if (
        c === 0x28 || // 11.9%
        c === 0x29 || // 11.90%
        c === 0x3b || // 8.44%
        c === 0x2c // 8.09%
      ) {
        len = 1;
      } else if (c === 0x3d) { // 7.45%
        len = this_tok_punctuatorCompare(c);
      } else if (
        c === 0x7b || // 4.96%
        c === 0x7d // 4.96%
      ) {
        len = 1;
      } else if (c >= 0x3a) {
        len = this_tok_punctuator_2(c);
      } else if (c >= 0x21 && c <= 0x2d) {
        len = this_tok_punctuator_3(c);
      }

      if (len) {
        this_tok_pos += len;
        return true;
      }
      return false;
    }
  function this_tok_punctuator_2(c){
      var len = 0;
      if (
        c === 0x3a || // 2.98%
        c === 0x5b || // 2.63%
        c === 0x5d || // 2.63%
        c === 0x3f // 0.40%
      ) {
        len = 1;
      } else if (c === 0x7c) { // 0.55%
        len = this_tok_punctuatorSame(c);
      } else if (
        c === 0x3c || // 0.33%
        c === 0x3e // 0.19%
      ) {
        len = this_tok_punctuatorLtgt(c);
      } else if (
        c === 0x5e || // 0.01%
        c === 0x7e // 0.00%
      ) {
        len = this_tok_punctuatorCompound(c);
      }
      return len;
    }
  function this_tok_punctuator_3(c){
      var len = 0;
      if (c === 0x22) { // 3.67%
        // string, wont be a punctuator
      } else if (c === 0x2b) { // 1.49%
        len = this_tok_punctuatorSame(c);
      } else if (c === 0x21) { // 0.84%
        len = this_tok_punctuatorCompare(c);
      } else if (
        c === 0x26 || // 0.66%
        c === 0x2d // 0.45%
      ) {
        len = this_tok_punctuatorSame(c);
      } else if (
        c === 0x2a || // 0.26%
        c === 0x25 // 0.02%
      ) {
        len = this_tok_punctuatorLtgt(c);
      }
      return len;
    }
  function this_tok_punctuatorSame(c){
      var d = this_tok_getLastNum2();
      return (d === 0x3d || d === c) ? 2 : 1;
    }
  function this_tok_punctuatorCompare(c){
      var len = 1;
      if (this_tok_getLastNum2() === 0x3d) {
        len = 2;
        if (this_tok_getLastNum3() === 0x3d) len = 3;
      }
      return len;
    }
  function this_tok_punctuatorLtgt(c){
      var len = 1;
      var d = this_tok_getLastNum2();
      if (d === 0x3d) len = 2;
      else if (d === c) {
        len = 2;
        var e = this_tok_getLastNum3();
        if (e === 0x3d) len = 3;
        else if (e === c && c !== 0x3c) {
          len = 3;
          if (this_tok_getLastNum4() === 0x3d) len = 4;
        }
      }
      return len;
    }
  function this_tok_punctuatorCompound(c){
      var len = 1;
      if (this_tok_getLastNum2() === 0x3d) len = 2;
      return len;
    }
  function this_tok_punctuatorDiv(c,d){
      // cant really be a //, /* or regex because they should have been checked before calling this function
      if (d === 0x3d) this_tok_pos += 2;
      else ++this_tok_pos;
      return 9;
    }
  function this_tok_whitespace(c){
      // space is already checked in nextToken
//      if (/*c === ORD_SPACE || */c === ORD_TAB || c === ORD_VTAB || c === ORD_FF || c === ORD_NBSP || c === ORD_BOM) {
      // note: tab=0x09, ff=0x0c, vtab=0x0b
      // cr=0x0a but whitespace() should go after lineterminator()! (update this if that changes)
      if ((c <= 0x0C && c >= 0x09) || c === 0xA0 || c === 0xFEFF) {
        ++this_tok_pos;
        return true;
      }
      return false;
    }
  function this_tok_lineTerminator(c, pos){
      var parsed = false;
      if (c === 0x0D){
        this_tok_lastNewline = true;
        // handle \r\n normalization here
        var d = this_tok_getLastNum2();
        if (d === 0x0A) {
          this_tok_pos = pos + 2;
        } else {
          this_tok_pos = pos + 1;
        }
        parsed = true;
      } else if (c === 0x0A || c === 0x2028 || c === 0x2029) {
        this_tok_lastNewline = true;
        this_tok_pos = pos + 1;
        parsed = true;
      }
      return parsed;
    }
  function this_tok_commentSingle(pos, input){
      var len = input.length;
      ++pos;
      var c = -1;
      while (pos < len) {
        c = input.charCodeAt(++pos);
        if (c === 0x0D || c === 0x0A || c === 0x2028 || c === 0x2029) break;
      }
      this_tok_pos = pos;

      return 18;
    }
  function this_tok_commentMulti(pos, input){
      var len = input.length;
      var hasNewline = false;
      var c=0,d = this_tok_getLastNum3(); // at this point we are reading this.lastStart+2
      pos += 2;
      while (pos < len) {
        c = d;
        d = input.charCodeAt(++pos);

        if (c === 0x2a && d === 0x2f) break;

        // only check one newline
        // TODO: check whether the extra check is worth the overhead for eliminating repetitive checks
        // (hint: if you generally check more characters here than you can skip, it's not worth it)
        if (hasNewline || c === 0x0D || c === 0x0A || c === 0x2028 || c === 0x2029) hasNewline = this_tok_lastNewline = true;
      }
      this_tok_pos = pos+1;

      return 18;
    }
  function this_tok_stringSingle(){
      var pos = this_tok_pos + 1;
      var input = this_tok_input;
      var len = input.length;

      // TODO: rewrite this while
      var c;
      while (c !== 0x27) {
        if (pos >= len) throw 'Unterminated string found at '+pos;
        c = input.charCodeAt(pos++);

        if (c === 0x5c) pos = this_tok_stringEscape(pos);
        else if ((c <= 0x0D && (c === 0x0A || c === 0x0D)) || c === 0x2028 || c === 0x2029) throw 'No newlines in strings!';
      }

      this_tok_pos = pos;
      return 10;
    }
  function this_tok_stringDouble(){
      var pos = this_tok_pos + 1;
      var input = this_tok_input;
      var len = input.length;

      // TODO: rewrite this while
      var c;
      while (c !== 0x22) {
        if (pos >= len) throw 'Unterminated string found at '+pos;
        c = input.charCodeAt(pos++);

        if (c === 0x5c) pos = this_tok_stringEscape(pos);
        else if ((c <= 0x0D && (c === 0x0A || c === 0x0D)) || c === 0x2028 || c === 0x2029) throw 'No newlines in strings!';
      }

      this_tok_pos = pos;
      return 10;
    }
  function this_tok_stringEscape(pos){
      var input = this_tok_input;
      var c = input.charCodeAt(pos);

      // unicode escapes
      if (c === 0x75) {
        if (this_tok_unicode(pos+1)) pos += 4;
        else throw 'Invalid unicode escape';
      // line continuation; skip windows newlines as if they're one char
      } else if (c === 0x0D) {
        // keep in mind, we are already skipping a char. no need to check
        // for other line terminators here. we are merely checking to see
        // whether we need to skip an additional character for CRLF.
        if (input.charCodeAt(pos+1) === 0x0A) ++pos;
      // hex escapes
      } else if (c === 0x78) {
        if (this_tok_hexicode(input.charCodeAt(pos+1)) && this_tok_hexicode(input.charCodeAt(pos+2))) pos += 2;
        else throw 'Invalid hex escape';
      }
      return pos+1;
    }
  function this_tok_unicode(pos){
      var input = this_tok_input;

      return this_tok_hexicode(input.charCodeAt(pos)) && this_tok_hexicode(input.charCodeAt(pos+1)) && this_tok_hexicode(input.charCodeAt(pos+2)) && this_tok_hexicode(input.charCodeAt(pos+3));
    }
  function this_tok_hexicode(c){
      // 0-9, a-f, A-F
      return ((c <= 0x39 && c >= 0x30) || (c >= 0x61 && c <= 0x66) || (c >= 0x41 && c <= 0x46));
    }
  function this_tok_number(c, pos, input){
      // 1-9 just means decimal literal
      if (c >= 0x31 && c <= 0x39) this_tok_decimalNumber(this_tok_getLastNum2(), pos+1, input); // do this after punctuator... the -1 is kind of a hack in that
      // leading zero can mean decimal or hex literal
      else if (c === 0x30) this_tok_decOrHex(c, pos, input);
      // dot means decimal, without the leading digits
      else if (c === 0x2e) this_tok_decimalFromDot(c, pos, input); // dot, start of the number (rare)
      // yeah, no number. move on.
      else return false;
      // we parsed a number.
      return true;
    }
  function this_tok_decOrHex(c, pos, input){
      // numeric is either a decimal or hex
      // 0.1234  .123  .0  0.  0e12 0e-12 0e12+ 0.e12 0.1e23 0xdeadbeeb

      var d = this_tok_getLastNum2();
      if (d !== 0x78 && d !== 0x78) { // x or X
        // next can only be numbers or dots...
        this_tok_decimalNumber(d, pos+1, input);
      } else {
        this_tok_hexNumber(pos+2);
      }

      return 7;
    }
  function this_tok_decimalNumber(c, pos, input){
      // TOFIX: what?
      // leading digits. assume c is preceeded by at least one digit (that might have been zero..., tofix in the future)
      while (c >= 0x30 && c <= 0x39) c = input.charCodeAt(++pos);
      // .123e+40 part
      return this_tok_decimalFromDot(c, pos, input);
    }
  function this_tok_decimalFromDot(c, pos, input){
      if (c === 0x2e) { // dot
        c = input.charCodeAt(++pos);
        while (c >= 0x30 && c <= 0x39) c = input.charCodeAt(++pos);
      }

      if (c === 0x65 || c === 0x45) {
        c = input.charCodeAt(++pos);
        // sign is optional (especially for plus)
        if (c === 0x2d || c === 0x2b) c = input.charCodeAt(++pos);

        // first digit is mandatory
        if (c >= 0x30 && c <= 0x39) c = input.charCodeAt(++pos);
        else throw 'Missing required digits after exponent. '+this_tok_syntaxError();

        // rest is optional
        while (c >= 0x30 && c <= 0x39) c = input.charCodeAt(++pos);
      }

      this_tok_pos = pos;

      return 7;
    }
  function this_tok_hexNumber(pos){
      var input = this_tok_input;
      var len = input.length;
      // hex
      while (pos < len && this_tok_hexicode(input.charCodeAt(pos))) ++pos;
      this_tok_pos = pos;
    }
  function this_tok_regex(){
      // /foo/
      // /foo[xyz]/
      // /foo(xyz)/
      // /foo{xyz}/
      // /foo(?:foo)/
      // /foo(!:foo)/
      // /foo(?!foo)bar/
      // /foo\dbar/
      this_tok_pos++;
      this_tok_regexBody();
  //    this.pos++;
      this_tok_regexFlags();

      return 8;
    }
  function this_tok_regexBody(){
      var input = this_tok_input;
      var len = input.length;
      // TOFIX: fix loop
      while (this_tok_pos < len) {
        var c = input.charCodeAt(this_tok_pos++);

        if (c === 0x5c) { // backslash
          var d = input.charCodeAt(this_tok_pos++);
          if (d === 0x0A || d === 0x0D || d === 0x2028 || d === 0x2029) {
            throw new Error('Newline can not be escaped in regular expression at '+this_tok_pos);
          }
        }
        else if (c === 0x28) this_tok_regexBody();
        else if (c === 0x29 || c === 0x2f) return;
        else if (c === 0x5b) this_tok_regexClass();
        else if (c === 0x0A || c === 0x0D || c === 0x2028 || c === 0x2029) {
          throw new Error('Newline can not be escaped in regular expression at '+this_tok_pos);
        }
      }

      throw new Error('Unterminated regular expression at eof');
    }
  function this_tok_regexClass(){
      var input = this_tok_input;
      var len = input.length;
      var pos = this_tok_pos;
      while (pos < len) {
        var c = input.charCodeAt(pos++);

        if (c === 0x5d) {
          this_tok_pos = pos;
          return;
        }
        if (c === 0x0A || c === 0x0D || c === 0x2028 || c === 0x2029) {
          throw 'Illegal newline in regex char class at '+pos;
        }
        if (c === 0x5c) { // backslash
          // there's a historical dispute over whether backslashes in regex classes
          // add a slash or its next char. ES5 settled it to "it's an escape".
          if (this_tok_options.regexNoClassEscape) {
            var d = input.charCodeAt(pos++);
            if (d === 0x0A || d === 0x0D || d === 0x2028 || d === 0x2029) {
              throw new Error('Newline can not be escaped in regular expression at '+pos);
            }
          }
        }
      }

      throw new Error('Unterminated regular expression at eof');
    }
  function this_tok_regexFlags(){
      // we cant use the actual identifier parser because that's assuming the identifier
      // starts at the beginning of this token, which is not the case for regular expressions.
      // so we use the remainder parser, which parses the second up to the rest of the identifier

      this_tok_pos = this_tok_asciiIdentifierRest(0);
    }
  function this_tok_asciiIdentifier(c){
      var toAdd = this_tok_asciiIdentifierStart(c);
      if (toAdd === 0) return false;

      // 2nd char up till the end of the identifier
      this_tok_pos = this_tok_asciiIdentifierRest(toAdd);

      return true;
    }
  function this_tok_asciiIdentifierStart(c){
      // a-z A-Z $ _ (no number here!)
      if ((c >= 0x61 && c <= 0x7a) || (c >= 0x41 && c <= 0x5a) || c === 0x5f || c === 0x24) {
        return 1;
      // \uxxxx
      } else if (c === 0x5c) {
        var pos = this_tok_pos;
        if (this_tok_getLastNum2() === 0x75 && this_tok_unicode(pos+2)) {
          return 6;
        } else {
          throw 'No backslash in identifier (xept for \\u). '+this_tok_syntaxError();
        }
      // above ascii range? might be valid unicode char
      } else if (c > 127) {
        if (uniRegex.test(String.fromCharCode(c))) return 1;
      }
      // do nothing so we return 0
      return 0;
    }
  function this_tok_asciiIdentifierRest(toAdd){
      var input = this_tok_input;
      var len = input.length;
      var pos = this_tok_pos + toAdd;

      // also used by regex flag parser
      while (pos < len) {
        var c = input.charCodeAt(pos);

        // a-z A-Z 0-9 $ _
        if ((c >= 0x61 && c <= 0x7a) || (c >= 0x41 && c <= 0x5a) || (c >= 0x30 && c <= 0x39) || c === 0x5f || c === 0x24) {
          ++pos;
          // \uxxxx
        } else if (c === 0x5c && input.charCodeAt(pos+1) === 0x75 && this_tok_unicode(pos+2)) {
          pos += 6;
        } else if (c > 127 && uniRegex.test(String.fromCharCode(c))) {
          pos += 1;
        } else {
          break;
        }
      }

      return pos;
    }
  function this_tok_getLastValue(){
      return this_tok_lastValue || (this_tok_lastValue = this_tok_input.substring(this_tok_lastStart, this_tok_lastStop));

      // this seems slightly slower
//      var val = this.lastValue;
//      if (!val) {
//        var input = this.input;
//        val = this.lastValue = input.substring(this.lastStart, this.lastStop);
//      }
//      return val;
    }
  function this_tok_getLastNum(){
      var n = this_tok_nextNum1;
      if (n === -1) return this_tok_nextNum1 = this_tok_input.charCodeAt(this_tok_lastStart);
      return n;
    }
  function this_tok_getLastNum2(){
      var n = this_tok_nextNum2;
      if (n === -1) return this_tok_nextNum2 = this_tok_input.charCodeAt(this_tok_lastStart+1);
      return n;
    }
  function this_tok_getLastNum3(){
      return this_tok_input.charCodeAt(this_tok_lastStart+2);
    }
  function this_tok_getLastNum4(){
      return this_tok_input.charCodeAt(this_tok_lastStart+3);
    }
  function this_tok_debug(){
      return '`'+this_tok_getLastValue()+'` @ '+this_tok_pos+' ('+Tok[this_tok_lastType]+')';
    }
  function this_tok_syntaxError(value){
      return 'A syntax error at pos='+this_tok_pos+" expected "+(typeof value == 'number' ? 'type='+Tok[value] : 'value=`'+value+'`')+' is `'+this_tok_getLastValue()+'` '+
          '('+Tok[this_tok_lastType]+') #### `'+this_tok_input.substring(this_tok_pos-2000, this_tok_pos)+'#|#'+this_tok_input.substring(this_tok_pos, this_tok_pos+2000)+'`';
    }
  // indices match slots of the start-regexes (where applicable)
  // this order is determined by regex/parser rules so they are fixed
      // WHITE_SPACE LINETERMINATOR COMMENT_SINGLE COMMENT_MULTI

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
  var Tok = exports.Tok = function(input, options){
    this_tok_options = options || {}; // should be same as in Par, if any

    this_tok_input = (input||'');
    this_tok_len = this_tok_input.length;

    // v8 "appreciates" it when all instance properties are set explicitly
    this_tok_pos = 0;

    this_tok_lastStart = 0;
    this_tok_lastStop = 0;
    this_tok_lastLen = 0;
    this_tok_lastType = -1;
    this_tok_lastValue = '';
    this_tok_lastNewline = -1;

    // charCodeAt will never return -1, so -1 means "uninitialized". allows us to keep this value a number, always
    this_tok_nextNum1 = -1;
    this_tok_nextNum2 = -1;

    this_tok_tokenCountAll = 0;

    if (options.saveTokens) {
      // looks like double assignment but after build step, changes into `this['tokens'] = this_tok_tokens = [];`
      this['tokens'] = this_tok_tokens = [];
      if (options.createBlackStream) this['black'] = this_tok_black = [];
    }
  };

  // reverse lookup (only used for error messages..)

  Tok[1] = 'whitespace';
  Tok[2] = 'lineterminator';
  Tok[3] = 'comment_single';
  Tok[4] = 'comment_multi';
  Tok[10] = 'string';
  Tok[5] = 'string_single';
  Tok[6] = 'string_multi';
  Tok[7] = 'number';
  Tok[11] = 'numeric_dec';
  Tok[12] = 'numeric_hex';
  Tok[8] = 'regex';
  Tok[9] = 'punctuator';
  Tok[13] = 'identifier';
  Tok[14] = 'eof';
  Tok[15] = 'asi';
  Tok[16] = 'error';
  Tok[18] = 'white';

  Tok.WHITE_SPACE = 1;
  Tok.LINETERMINATOR = 2;
  Tok.COMMENT_SINGLE = 3;
  Tok.COMMENT_MULTI = 4;
  Tok.STRING = 10;
  Tok.STRING_SINGLE = 5;
  Tok.STRING_DOUBLE = 6;
  Tok.NUMBER = 7;
  Tok.NUMERIC_DEC = 11;
  Tok.NUMERIC_HEX = 12;
  Tok.REGEX = 8;
  Tok.PUNCTUATOR = 9;
  Tok.IDENTIFIER = 13;
  Tok.EOF = 14;
  Tok.ASI = 15;
  Tok.ERROR = 16;
  Tok.WHITE = 18; // WHITE_SPACE LINETERMINATOR COMMENT_SINGLE COMMENT_MULTI

//######### end of tok.js #########

//######### par.js #########

// If you see magic numbers and bools all over the place, it means this
// file has been post-processed by a build script. If you want to read
// this file, see https://github.com/qfox/zeparser2
  var this_par_options =  null;
  var this_par_tok =  null;
  function this_par_run(){
      // prepare
      this_tok_nextExpr();
      // go!
      this_par_parseStatements(false, false, false, null);
      if (this_tok_pos !== this_tok_len) throw 'Did not complete parsing... '+this_tok_syntaxError();

      return this;
    }
  function this_par_parseStatements(inFunction, inLoop, inSwitch, labelSet){
      // note: statements are optional, this function might not parse anything
      while (!this_tok_isType(14) && this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, true));
    }
  function this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, optional){
      if (this_tok_isType(13)) {
        // dont "just" return true. case and default still return false
        return this_par_parseIdentifierStatement(inFunction, inLoop, inSwitch, labelSet);
      }

      var c = this_tok_getLastNum();

      if (c === 0x7b) {
        this_tok_nextExpr();
        this_par_parseBlock(true, inFunction, inLoop, inSwitch, labelSet);
        return true;
      }

      if (c === 0x28 || c === 0x5b || c === 0x7e || c === 0x2b || c === 0x2d || c === 0x21) {
        this_par_parseExpressionStatement();
        return true;
      }

      if (c === 0x3b) { // empty statement
        // this shouldnt occur very often, but they still do.
        this_tok_nextExpr();
        return true;
      }

      if (this_tok_isValue()) {
        this_par_parseExpressionStatement();
        return true;
      }

      if (!optional) throw 'Expected more input...';
      return false;
    }
  function this_par_parseIdentifierStatement(inFunction, inLoop, inSwitch, labelSet){
      // The current token is an identifier. Either its value will be
      // checked in this function (parseIdentifierStatement) or in the
      // parseExpressionOrLabel function. So we can just get it now.
      var value = this_tok_getLastValue();

      // track whether this token was parsed. if not, do parseExpressionOrLabel at the end
      var startCount = this_tok_tokenCountAll;

      var len = this_tok_lastLen;

      // TODO: could add identifier check to conditionally call parseExpressionOrLabel vs parseExpression

      // yes, this check makes a *huge* difference
      if (len >= 2 && len <= 8) {
        // bcdfirstvw, not in that order.
        var c = this_tok_getLastNum();

        if (c === 0x74) {
          if (value === 'try') this_par_parseTry(inFunction, inLoop, inSwitch, labelSet);
          else if (value === 'throw') this_par_parseThrow();
        }
        else if (c === 0x69 && len === 2 && this_tok_getLastNum2() === 0x66) this_par_parseIf(inFunction, inLoop, inSwitch, labelSet);
        else if (c === 0x76 && value === 'var') this_par_parseVar();
        else if (c === 0x72 && value === 'return') this_par_parseReturn(inFunction, inLoop, inSwitch);
        else if (c === 0x66) {
          if (value === 'function') this_par_parseFunction(true);
          else if (value === 'for') this_par_parseFor(inFunction, inLoop, inSwitch, labelSet);
        }
        else if (c === 0x63) {
          if (value === 'continue') this_par_parseContinue(inFunction, inLoop, inSwitch, labelSet);
          else if (value === 'case') return false; // case is handled elsewhere
        }
        else if (c === 0x62 && value === 'break') this_par_parseBreak(inFunction, inLoop, inSwitch, labelSet);
        else if (c === 0x64) {
          if (value === 'default') return false; // default is handled elsewhere
          else if (len === 2 && this_tok_getLastNum2() === 0x6f) this_par_parseDo(inFunction, inLoop, inSwitch, labelSet);
          else if (value === 'debugger') this_par_parseDebugger();
        }
        else if (c === 0x73 && value === 'switch') this_par_parseSwitch(inFunction, inLoop, inSwitch, labelSet);
        else if (c === 0x77) {
          if (value === 'while') this_par_parseWhile(inFunction, inLoop, inSwitch, labelSet);
          else if (value === 'with') this_par_parseWith(inFunction, inLoop, inSwitch, labelSet);
        }
      }

      // this function _must_ parse _something_, if we parsed nothing, it's an expression statement or labeled statement
      if (this_tok_tokenCountAll === startCount) this_par_parseExpressionOrLabel(value, inFunction, inLoop, inSwitch, labelSet);

      return true;
    }
  function this_par_parseStatementHeader(){
      this_tok_mustBeNum(0x28, true);
      this_par_parseExpressions();
      this_tok_mustBeNum(0x29, true);
    }
  function this_par_parseVar(){
      // var <vars>
      // - foo
      // - foo=bar
      // - ,foo=bar

      this_tok_nextPunc();
      do {
        if (this_par_isReservedIdentifier(false)) throw 'var name is reserved';
        this_tok_mustBeIdentifier(true); // TOFIX: can never be regex nor div. does that matter?
        if (this_tok_isNum(0x3d) && this_tok_lastLen === 1) {
          this_tok_nextExpr();
          this_par_parseExpression();
        }
      } while(this_tok_nextExprIfNum(0x2c));
      this_par_parseSemi();
    }
  function this_par_parseVarPartNoIn(){
      var state = 0;
      do {
        if (this_par_isReservedIdentifier(false)) throw 'var name is reserved';
        this_tok_mustBeIdentifier(true);

        if (this_tok_isNum(0x3d) && this_tok_lastLen === 1) {
          this_tok_nextExpr();
          this_par_parseExpressionNoIn();
        }
      } while(this_tok_nextExprIfNum(0x2c) && (state = 2));

      return state;
    }
  function this_par_parseIf(inFunction, inLoop, inSwitch, labelSet){
      // if (<exprs>) <stmt>
      // if (<exprs>) <stmt> else <stmt>

      this_tok_nextPunc();
      this_par_parseStatementHeader();
      this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, false);

      this_par_parseElse(inFunction, inLoop, inSwitch, labelSet);
    }
  function this_par_parseElse(inFunction, inLoop, inSwitch, labelSet){
      // else <stmt>;

      if (this_tok_getLastValue() === 'else') {
        this_tok_nextExpr();
        this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, false);
      }
    }
  function this_par_parseDo(inFunction, inLoop, inSwitch, labelSet){
      // do <stmt> while ( <exprs> ) ;

      this_tok_nextExpr(); // do
      this_par_parseStatement(inFunction, true, inSwitch, labelSet, false);
      this_tok_mustBeString('while', false);
      this_tok_mustBeNum(0x28, true);
      this_par_parseExpressions();
      this_tok_mustBeNum(0x29, false); //no regex following because it's either semi or newline without asi if a forward slash follows it
      this_par_parseSemi();
    }
  function this_par_parseWhile(inFunction, inLoop, inSwitch, labelSet){
      // while ( <exprs> ) <stmt>

      this_tok_nextPunc();
      this_par_parseStatementHeader();
      this_par_parseStatement(inFunction, true, inSwitch, labelSet, false);
    }
  function this_par_parseFor(inFunction, inLoop, inSwitch, labelSet){
      // for ( <expr-no-in-=> in <exprs> ) <stmt>
      // for ( var <idntf> in <exprs> ) <stmt>
      // for ( var <idntf> = <expr-no-in> in <exprs> ) <stmt>
      // for ( <expr-no-in> ; <expr> ; <expr> ) <stmt>

      var state = 0;

      this_tok_nextPunc(); // for
      this_tok_mustBeNum(0x28, true);

      if (this_tok_nextExprIfNum(0x3b)) this_par_parseForEachHeader(); // empty first expression in for-each
      else {

        if (this_tok_isNum(0x76) && this_tok_nextPuncIfString('var')) state = this_par_parseVarPartNoIn();
        // expression_s_ because it might be regular for-loop...
        // (though if it isn't, it can't have more than one expr)
        else state = this_par_parseExpressionsNoIn();

        if (this_tok_nextExprIfNum(0x3b)) this_par_parseForEachHeader();
        else if (this_tok_getLastNum() !== 0x69 || this_tok_getLastNum2() !== 0x6e || this_tok_lastLen !== 2) throw 'Expected `in` or `;` here... '+this_tok_syntaxError();
        else if (state && this_par_options.strictForInCheck) throw 'Encountered illegal for-in lhs. '+this_tok_syntaxError();
        else this_par_parseForInHeader();
      }

      this_tok_mustBeNum(0x29, true);
      this_par_parseStatement(inFunction, true, inSwitch, labelSet, false);
    }
  function this_par_parseForEachHeader(){
      // <expr> ; <expr> ) <stmt>

      this_par_parseOptionalExpressions();
      this_tok_mustBeNum(0x3b, true);
      this_par_parseOptionalExpressions();
    }
  function this_par_parseForInHeader(){
      // in <exprs> ) <stmt>

      this_tok_nextExpr(); // `in` validated by `parseFor`
      this_par_parseExpressions();
    }
  function this_par_parseContinue(inFunction, inLoop, inSwitch, labelSet){
      // continue ;
      // continue <idntf> ;
      // newline right after keyword = asi

      if (!inLoop) throw 'Can only continue in a loop. '+this_tok_syntaxError();

      this_tok_nextPunc(); // token after continue cannot be a regex, either way.

      if (!this_tok_lastNewline && this_tok_isType(13)) {
        this_par_parseLabel(labelSet);
      }

      this_par_parseSemi();
    }
  function this_par_parseBreak(inFunction, inLoop, inSwitch, labelSet){
      // break ;
      // break <idntf> ;
      // break \n <idntf> ;
      // newline right after keyword = asi

      this_tok_nextPunc(); // token after break cannot be a regex, either way.

      if (this_tok_lastNewline || !this_tok_isType(13)) { // no label after break?
        if (!inLoop && !inSwitch) {
          // break without label
          throw 'Break without value only in loops or switches. '+this_tok_syntaxError();
        }
      } else {
        this_par_parseLabel(labelSet);
      }

      this_par_parseSemi();
    }
  function this_par_parseLabel(labelSet){
      // next tag must be an identifier
      var label = this_tok_getLastValue();
      if (labelSet.indexOf(label) >= 0) {
        this_tok_nextExpr(); // label (already validated)
      } else {
        throw 'Label ['+label+'] not found in label set. '+this_tok_syntaxError();
      }
    }
  function this_par_parseReturn(inFunction, inLoop, inSwitch){
      // return ;
      // return <exprs> ;
      // newline right after keyword = asi

      if (!inFunction && !this_par_options.functionMode) throw 'Can only return in a function '+this_tok_syntaxError('break');

      this_tok_nextExpr();
      if (this_tok_lastNewline) this_par_addAsi();
      else {
        this_par_parseOptionalExpressions();
        this_par_parseSemi();
      }
    }
  function this_par_parseThrow(){
      // throw <exprs> ;

      this_tok_nextExpr();
      if (this_tok_lastNewline) {
        throw 'No newline allowed directly after a throw, ever. '+this_tok_syntaxError();
      } else {
        this_par_parseExpressions();
        this_par_parseSemi();
      }
    }
  function this_par_parseSwitch(inFunction, inLoop, inSwitch, labelSet){
      // switch ( <exprs> ) { <switchbody> }

      this_tok_nextPunc();
      this_par_parseStatementHeader();
      this_tok_mustBeNum(0x7b, true);
      this_par_parseSwitchBody(inFunction, inLoop, true, labelSet);
      this_tok_mustBeNum(0x7d, true);
    }
  function this_par_parseSwitchBody(inFunction, inLoop, inSwitch, labelSet){
      // [<cases>] [<default>] [<cases>]

      // default can go anywhere...
      this_par_parseCases(inFunction, inLoop, inSwitch, labelSet);
      if (this_tok_nextPuncIfString('default')) {
        this_par_parseDefault(inFunction, inLoop, inSwitch, labelSet);
        this_par_parseCases(inFunction, inLoop, inSwitch, labelSet);
      }
    }
  function this_par_parseCases(inFunction, inLoop, inSwitch, labelSet){
      while (this_tok_nextPuncIfString('case')) {
        this_par_parseCase(inFunction, inLoop, inSwitch, labelSet);
      }
    }
  function this_par_parseCase(inFunction, inLoop, inSwitch, labelSet){
      // case <value> : <stmts-no-case-default>
      this_par_parseExpressions();
      this_tok_mustBeNum(0x3a, true);
      this_par_parseStatements(inFunction, inLoop, inSwitch, labelSet);
    }
  function this_par_parseDefault(inFunction, inLoop, inSwitch, labelSet){
      // default <value> : <stmts-no-case-default>
      this_tok_mustBeNum(0x3a, true);
      this_par_parseStatements(inFunction, inLoop, inSwitch, labelSet);
    }
  function this_par_parseTry(inFunction, inLoop, inSwitch, labelSet){
      // try { <stmts> } catch ( <idntf> ) { <stmts> }
      // try { <stmts> } finally { <stmts> }
      // try { <stmts> } catch ( <idntf> ) { <stmts> } finally { <stmts> }

      this_tok_nextPunc();
      this_par_parseCompleteBlock(true, inFunction, inLoop, inSwitch, labelSet);

      var one = this_par_parseCatch(inFunction, inLoop, inSwitch, labelSet);
      var two = this_par_parseFinally(inFunction, inLoop, inSwitch, labelSet);

      if (!one && !two) throw 'Try must have at least a catch or finally block or both: '+this_tok_debug();
    }
  function this_par_parseCatch(inFunction, inLoop, inSwitch, labelSet){
      // catch ( <idntf> ) { <stmts> }

      if (this_tok_nextPuncIfString('catch')) {
        this_tok_mustBeNum(0x28, false);

        // catch var
        if (this_tok_isType(13)) {
          if (this_par_isReservedIdentifier(false)) throw 'Catch scope var name is reserved';
          this_tok_nextPunc();
        } else {
          throw 'Missing catch scope variable';
        }

        this_tok_mustBeNum(0x29, false);
        this_par_parseCompleteBlock(true, inFunction, inLoop, inSwitch, labelSet);

        return true;
      }
      return false;
    }
  function this_par_parseFinally(inFunction, inLoop, inSwitch, labelSet){
      // finally { <stmts> }

      if (this_tok_nextPuncIfString('finally')) {
        this_par_parseCompleteBlock(true, inFunction, inLoop, inSwitch, labelSet);

        return true;
      }
      return false;
    }
  function this_par_parseDebugger(){
      // debugger ;

      this_tok_nextPunc();
      this_par_parseSemi();
    }
  function this_par_parseWith(inFunction, inLoop, inSwitch, labelSet){
      // with ( <exprs> ) <stmts>

      this_tok_nextPunc();
      this_par_parseStatementHeader();
      this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, false);
    }
  function this_par_parseFunction(forFunctionDeclaration){
      // function [<idntf>] ( [<param>[,<param>..] ) { <stmts> }

      this_tok_nextPunc(); // 'function'
      if (this_tok_isType(13)) { // name
        if (this_par_isReservedIdentifier(false)) throw 'function name is reserved';
        this_tok_nextPunc();
      } else if (forFunctionDeclaration) {
        throw 'function declaration name is required';
      }
      this_par_parseFunctionRemainder(-1, forFunctionDeclaration);
    }
  function this_par_parseFunctionRemainder(paramCount, forFunctionDeclaration){
      this_tok_mustBeNum(0x28, false);
      this_par_parseParameters(paramCount);
      this_tok_mustBeNum(0x29, false);
      this_par_parseCompleteBlock(forFunctionDeclaration, true, false, false, null);
    }
  function this_par_parseParameters(paramCount){
      // [<idntf> [, <idntf>]]
      if (this_tok_isType(13)) {
        if (paramCount === 0) throw 'Getters have no parameters';
        if (this_par_isReservedIdentifier(false)) throw 'Function param name is reserved';
        this_tok_nextExpr();
        // there are only two valid next tokens; either a comma or a closing paren
        while (this_tok_nextExprIfNum(0x2c)) {
          if (paramCount === 1) throw 'Setters have exactly one param';

          // param name
          if (this_tok_isType(13)) {
            if (this_par_isReservedIdentifier(false)) throw 'Function param name is reserved';
            this_tok_nextPunc();
          } else {
            throw 'Missing func param name';
          }
        }
      } else if (paramCount === 1) {
        throw 'Setters have exactly one param';
      }
    }
  function this_par_parseBlock(notForFunctionExpression, inFunction, inLoop, inSwitch, labelSet){
      this_par_parseStatements(inFunction, inLoop, inSwitch, labelSet);
      // note: this parsing method is also used for functions. the only case where
      // the closing curly can be followed by a division rather than a regex lit
      // is with a function expression. that's why we needed to make it a parameter
      this_tok_mustBeNum(0x7d, notForFunctionExpression);
    }
  function this_par_parseCompleteBlock(notForFunctionExpression, inFunction, inLoop, inSwitch, labelSet){
      this_tok_mustBeNum(0x7b, true);
      this_par_parseBlock(notForFunctionExpression, inFunction, inLoop, inSwitch, labelSet);
    }
  function this_par_parseSemi(){
      if (this_tok_nextExprIfNum(0x3b)) return 9;
      if (this_par_parseAsi()) return 15;
      throw 'Unable to parse semi, unable to apply ASI. '+this_tok_syntaxError();
    }
  function this_par_parseAsi(){
      // asi at EOF, if next token is } or if there is a newline between prev and next (black) token
      // asi prevented if asi would be empty statement, no asi in for-header, no asi if next token is regex

      if (this_tok_isNum(0x7d) || (this_tok_lastNewline && !this_tok_isType(8)) || this_tok_isType(14)) {
        return this_par_addAsi();
      }
      return false;
    }
  function this_par_addAsi(){
      ++this_tok_tokenCountAll;
      return 15;
    }
  function this_par_parseExpressionStatement(){
      this_par_parseExpressions();
      this_par_parseSemi();
    }
  function this_par_parseExpressionOrLabel(labelName, inFunction, inLoop, inSwitch, labelSet){
      // this method is only called at the start of
      // a statement that starts with an identifier.

      // ugly but mandatory label check
      // if this is a label, the parsePrimary parser
      // will have bailed when seeing the colon.
      var state = this_par_parsePrimaryOrLabel(labelName);
      if (state & 8) {

        // the label will have been checked for being a reserved keyword
        // except for the value keywords. so we need to do that here.
        // no need to check for function, because that cant occur here.
        // note that it's pretty rare for the parser to reach this
        // place, so i dont feel it's very important to take the uber
        // optimized route. simple string comparisons will suffice.
        // note that this is already confirmed to be used as a label so
        // if any of these checks match, an error will be thrown.
        if (this_par_isValueKeyword(labelName)) {
          throw 'Reserved identifier found in label. '+this_tok_syntaxError();
        }

        if (!labelSet) labelSet = [labelName];
        else labelSet.push(labelName);

        this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, false);
        labelSet.pop();

      } else {

        // TOFIX: add test case where this fails; `state & NONASSIGNEE` needs parenthesis
        this_par_parseAssignments(state & 1 > 0);
        this_par_parseNonAssignments();

        if (this_tok_nextExprIfNum(0x2c)) this_par_parseExpressions();
        this_par_parseSemi();
      }
    }
  function this_par_parseOptionalExpressions(){
      var tokCount = this_tok_tokenCountAll;
      this_par_parseExpressionOptional();
      if (tokCount !== this_tok_tokenCountAll) {
        while (this_tok_nextExprIfNum(0x2c)) {
          this_par_parseExpression();
        }
      }
    }
  function this_par_parseExpressions(){
      var nonAssignee = this_par_parseExpression();
      while (this_tok_nextExprIfNum(0x2c)) {
        this_par_parseExpression();
        // not sure, but if the expression was not an assignment, it's probably irrelevant
        // except in the case of a group, in which case it becomes an invalid assignee, so:
        nonAssignee = true;
      }
      return nonAssignee;
    }
  function this_par_parseExpression(){
      var tokCount = this_tok_tokenCountAll;

      var nonAssignee = this_par_parseExpressionOptional();

      // either tokenizer pos moved, or we reached the end (we hadnt reached the end before)
      if (tokCount === this_tok_tokenCountAll) throw 'Expected to parse an expression, did not find any';

      return nonAssignee;
    }
  function this_par_parseExpressionOptional(){
      var nonAssignee = this_par_parsePrimary(true);
      // if there was no assignment, state will be the same.
      nonAssignee = this_par_parseAssignments(nonAssignee) !== 0;

      // any binary operator is illegal as assignee and illegal as for-in lhs
      if (this_par_parseNonAssignments()) nonAssignee = true;

      return nonAssignee;
    }
  function this_par_parseAssignments(nonAssignee){
      // assignment ops are allowed until the first non-assignment binary op
      var nonForIn = 0;
      while (this_par_isAssignmentOperator()) {
        if (nonAssignee && this_par_options.strictAssignmentCheck) throw 'LHS is invalid assignee';
        // any assignment means not a for-in per definition
        this_tok_nextExpr();
        nonAssignee = this_par_parsePrimary(false);
        nonForIn = 2; // always
      }

      return (nonAssignee ? 1 : 0) | nonForIn;
    }
  function this_par_parseNonAssignments(){
      var parsed = false;
      // keep parsing non-assignment binary/ternary ops
      while (true) {
        if (this_par_isBinaryOperator()) {
          this_tok_nextExpr();
          this_par_parsePrimary(false);
        }
        else if (this_tok_isNum(0x3f)) this_par_parseTernary();
        else break;
        // any binary is a non-for-in
        parsed = true;
      }
      return parsed;
    }
  function this_par_parseTernary(){
      this_tok_nextExpr();
      this_par_parseExpression();
      this_tok_mustBeNum(0x3a, true);
      this_par_parseExpression();
    }
  function this_par_parseTernaryNoIn(){
      this_tok_nextExpr();
      this_par_parseExpression();
      this_tok_mustBeNum(0x3a, true);
      this_par_parseExpressionNoIn();
    }
  function this_par_parseExpressionsNoIn(){
      var state = this_par_parseExpressionNoIn();
      while (this_tok_nextExprIfNum(0x2c)) {
        // lhs of for-in cant be multiple expressions
        state = this_par_parseExpressionNoIn() | 2;
      }

      return state;
    }
  function this_par_parseExpressionNoIn(){
      var nonAssignee = this_par_parsePrimary(false);

      var state = this_par_parseAssignments(nonAssignee);

      // keep parsing non-assignment binary/ternary ops unless `in`
      var repeat = true;
      while (repeat) {
        if (this_par_isBinaryOperator()) {
          // rationale for using getLastNum; this is the `in` check which will succeed
          // about 50% of the time (stats from 8mb of various js). the other time it
          // will check for a primary. it's therefore more likely that an getLastNum will
          // save time because it would cache the charCodeAt for the other token if
          // it failed the check
          if (this_tok_getLastNum() === 0x69 && this_tok_getLastNum2() === 0x6e && this_tok_lastLen === 2) { // in
            repeat = false;
          } else {
            this_tok_nextExpr();
            // (seems this should be a required part...)
            this_par_parsePrimary(false);
            state = NEITHER;
          }
        } else if (this_tok_isNum(0x3f)) {
          this_par_parseTernaryNoIn();
          state = NEITHER; // the lhs of a for-in cannot contain a ternary operator
        } else {
          repeat = false;
        }
      }

      return state; // example:`for (x+b++ in y);`
    }
  function this_par_parsePrimary(optional){
      // parses parts of an expression without any binary operators
      var nonAssignee = false;
      var parsedUnary = this_par_parseUnary(); // no unary can be valid in the lhs of an assignment

      if (this_tok_isType(13)) {
        var identifier = this_tok_getLastValue();
        if (this_tok_isNum(0x66) && identifier === 'function') {
          this_par_parseFunction(false);
          nonAssignee = true;
        } else {
          if (this_par_isReservedIdentifier(true)) throw 'Reserved identifier found in expression';
          this_tok_nextPunc();
          // any non-keyword identifier can be assigned to
          if (!nonAssignee && this_par_isValueKeyword(identifier)) nonAssignee = true;
        }
      } else {
        nonAssignee = this_par_parsePrimaryValue(optional && !parsedUnary);
      }

      var suffixNonAssignee = this_par_parsePrimarySuffixes();
      if (suffixNonAssignee === 4) nonAssignee = true;
      else if (suffixNonAssignee === 1) nonAssignee = true;
      else if (suffixNonAssignee === 0 && parsedUnary) nonAssignee = true;

      return nonAssignee;
    }
  function this_par_parsePrimaryOrLabel(labelName){
      // note: this function is only executed for statements that start
      //       with an identifier . the function keyword will already
      //       have been filtered out by the main statement start
      //       parsing method. So we dont have to check for the function
      //       keyword here; it cant occur.
      var state = 0;

      // if we parse any unary, we wont have to check for label
      var hasPrefix = this_par_parseUnary();

      // simple shortcut: this function is only called if (at
      // the time of calling) the next token was an identifier.
      // if parseUnary returns true, we wont know what the type
      // of the next token is. otherwise it must still be identifier!
      if (!hasPrefix || this_tok_isType(13)) {
        // in fact... we dont have to check for any of the statement
        // identifiers (break, return, if) because parseIdentifierStatement
        // will already have ensured a different code path in that case!
        // TOFIX: check how often this is called and whether it's worth investigating...
        if (this_par_isReservedIdentifier(true)) throw 'Reserved identifier found in expression. '+this_tok_syntaxError();

        this_tok_nextPunc();

        // now's the time... you just ticked off an identifier, check the current token for being a colon!
        // (quick check first: if there was a unary operator, this cant be a label)
        if (!hasPrefix) {
          if (this_tok_nextExprIfNum(0x3a)) return 8;
        }
        if (hasPrefix || this_par_isValueKeyword(labelName)) state = 1;
      } else {
        if (this_par_parsePrimaryValue(false) || hasPrefix) state = 1;
      }

      var suffixState = this_par_parsePrimarySuffixes();
      if (suffixState & 4) state = 0;
      else if (suffixState & 1) state = 1;

      return state;
    }
  function this_par_parsePrimaryValue(optional){
      // at this point in the expression parser we will
      // have ruled out anything else. the next token(s) must
      // be some kind of expression value...

      var nonAssignee = false;
      if (this_tok_nextPuncIfValue()) {
        nonAssignee = true;
      } else {
        if (this_tok_nextExprIfNum(0x28)) nonAssignee = this_par_parseGroup();
        else if (this_tok_nextExprIfNum(0x7b)) this_par_parseObject();
        else if (this_tok_nextExprIfNum(0x5b)) this_par_parseArray();
        else if (!optional) throw 'Unable to parse required primary value';
      }

      return nonAssignee;
    }
  function this_par_parseUnary(){
      var parsed = false;
      // TOFIX: why was there an EOF check here?
      while (/*!this_tok_isType(EOF) && */this_par_testUnary()) {
        this_tok_nextExpr();
        parsed = true;
      }
      return parsed; // return bool to determine possibility of label
    }
  function this_par_testUnary(){
      // this method works under the assumption that the current token is
      // part of the set of valid tokens for js. So we don't have to check
      // for string lengths unless we need to disambiguate optional chars

      var c = this_tok_getLastNum();

      if (c === 0x74) return this_tok_getLastValue() === 'typeof';
      else if (c === 0x6e) return this_tok_getLastValue() === 'new';
      else if (c === 0x64) return this_tok_getLastValue() === 'delete';
      else if (c === 0x21) return true;
      else if (c === 0x76) return this_tok_getLastValue() === 'void';
      else if (c === 0x2d) return (this_tok_lastLen === 1 || (this_tok_getLastNum2() === 0x2d));
      else if (c === 0x2b) return (this_tok_lastLen === 1 || (this_tok_getLastNum2() === 0x2b));
      else if (c === 0x7e) return true;

      return false;
    }
  function this_par_parsePrimarySuffixes(){
      // --
      // ++
      // .<idntf>
      // [<exprs>]
      // (<exprs>)

      var nonAssignee = 0;

      // TODO: the order of these checks doesn't appear to be optimal (numbers first?)
      var repeat = true;
      while (repeat) {
        var c = this_tok_getLastNum();
        // need tokenizer to check for a punctuator because it could never be a regex (foo.bar, we're at the dot between)
        if (((c/10)|0)!==4) { // ORD_DOT ORD_OPEN_PAREN ORD_PLUS ORD_MIN are all 40's
//        if (c > 0x2e) { // ORD_DOT ORD_OPEN_PAREN ORD_PLUS ORD_MIN are all 40's
          if (c === 0x5b) {
            this_tok_nextExpr();
            this_par_parseExpressions(); // required
            this_tok_mustBeNum(0x5d, false); // ] cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
            nonAssignee = 4; // dynamic property can be assigned to (for-in lhs), expressions for-in state are ignored
          } else {
            repeat = false;
          }
        } else if (c === 0x2e) {
          if (!this_tok_isType(9)) throw 'Number (?) after identifier?';
          this_tok_nextPunc();
          this_tok_mustBeIdentifier(false); // cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          nonAssignee = 4; // property name can be assigned to (for-in lhs)
        } else if (c === 0x28) {
          this_tok_nextExpr();
          this_par_parseOptionalExpressions();
          this_tok_mustBeNum(0x29, false); // ) cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          nonAssignee = 1; // call cannot be assigned to (for-in lhs) (ok, there's an IE case, but let's ignore that...)
        } else if (c === 0x2b && this_tok_getLastNum2() === 0x2b) {
          this_tok_nextPunc();
          // postfix unary operator lhs cannot have trailing property/call because it must be a LeftHandSideExpression
          nonAssignee = 1; // cannot assign to foo++
          repeat = false;
        } else if (c === 0x2d &&  this_tok_getLastNum2() === 0x2d) {
          this_tok_nextPunc();
          // postfix unary operator lhs cannot have trailing property/call because it must be a LeftHandSideExpression
          nonAssignee = 1; // cannot assign to foo--
          repeat = false;
        } else {
          repeat = false;
        }
      }
      return nonAssignee;
    }
  function this_par_isAssignmentOperator(){
      // includes any "compound" operators

      // this method works under the assumption that the current token is
      // part of the set of valid tokens for js. So we don't have to check
      // for string lengths unless we need to disambiguate optional chars

      var len = this_tok_lastLen;

      if (len === 1) return this_tok_getLastNum() === 0x3d;

      else if (len === 2) {
        if (this_tok_getLastNum2() !== 0x3d) return false;
        var c = this_tok_getLastNum();
        return (
          c === 0x2b ||
          c === 0x2d ||
          c === 0x2a ||
          c === 0x7c ||
          c === 0x26 ||
          c === 0x25 ||
          c === 0x5e ||
          c === 0x2f
        );
      }

      else {
        // these <<= >>= >>>= cases are very rare
        if (len === 3 && this_tok_getLastNum() === 0x3c) {
          return (this_tok_getLastNum2() === 0x3c && this_tok_getLastNum3() === 0x3d); // <<=
        }
        else if (this_tok_getLastNum() === 0x3e) {
          return ((this_tok_getLastNum2() === 0x3e) && (
            (len === 4 && this_tok_getLastNum3() === 0x3e && this_tok_getLastNum4() === 0x3d) || // >>>=
            (len === 3 && this_tok_getLastNum3() === 0x3d) // >>=
          ));
        }
      }

      return false;
    }
  function this_par_isBinaryOperator(){
      // non-assignment binary operator

      // this method works under the assumption that the current token is
      // part of the set of valid _tokens_ for js. So we don't have to check
      // for string lengths unless we need to disambiguate optional chars
      // and we dont need to worry about validation. the operator is either
      // going to be a punctuator, `in`, or `instanceof`. But note that the
      // token might still be a completely unrelated (error) kind of token.
      // We will parse it in such a way that the error condition is always
      // the longest path, though.

      var c = this_tok_getLastNum();

      // so we have a valid  token, checking for binary ops is simple now except
      // that we have to make sure it's not an (compound) assignment!

      // About 80% of the calls to this method result in none of the ifs
      // even matching. The times the method returns `false` is even bigger.
      // To this end, we preliminary check a few cases so we can jump quicker.

      // (most frequent, for 27% 23% and 20% of the times this method is
      // called, c will be one of them (simple expression enders)
      if (c === 0x29 || c === 0x3b || c === 0x2c) return false;

      // quite frequent (more than any other single if below it) are } (8%)
      // and ] (7%). Maybe I'll remove this in the future. The overhead may
      // not be worth the gains. Hard to tell... :)
      else if (c === 0x5d || c === 0x7d) return false;

      // if len is more than 1, it's either a compound assignment (+=) or a unary op (++)
      else if (c === 0x2b) return (this_tok_lastLen === 1);

      // === !==
      else if (c === 0x3d || c === 0x21) return (this_tok_getLastNum2() === 0x3d && (this_tok_lastLen === 2 || this_tok_getLastNum3() === 0x3d));

      // & &&
      else if (c === 0x26) return (this_tok_lastLen === 1 || this_tok_getLastNum2() === 0x26);

      // | ||
      else if (c === 0x7c) return (this_tok_lastLen === 1 || this_tok_getLastNum2() === 0x7c);

      else if (c === 0x3c) {
        if (this_tok_lastLen === 1) return true;
        var d = this_tok_getLastNum2();
        // the len check prevents <<= (which is an assignment)
        return ((d === 0x3c && this_tok_lastLen === 2) || d === 0x3d); // << <=
      }

      // if len is more than 1, it's a compound assignment (*=)
      else if (c === 0x2a) return (this_tok_lastLen === 1);

      else if (c === 0x3e) {
        var len = this_tok_lastLen;
        if (len === 1) return true;
        var d = this_tok_getLastNum2();
        // the len checks prevent >>= and >>>= (which are assignments)
        return (d === 0x3d || (len === 2 && d === 0x3e) || (len === 3 && this_tok_getLastNum3() === 0x3e)); // >= >> >>>
      }

      // if len is more than 1, it's a compound assignment (%=, ^=, /=, -=)
      else if (c === 0x25 || c === 0x5e || c === 0x2f || c === 0x2d) return (this_tok_lastLen === 1);

      // if not punctuator, it could still be `in` or `instanceof`...
      else if (c === 0x69) return ((this_tok_lastLen === 2 && this_tok_getLastNum2() === 0x6e) || (this_tok_lastLen === 10 && this_tok_getLastValue() === 'instanceof'));

      // not a (non-assignment) binary operator
      return false;
    }
  function this_par_parseGroup(){
      // the expressions are required. nonassignable if:
      // - wraps multiple expressions
      // - if the single expression is nonassignable
      // - if it wraps an assignment
      var nonAssignee = this_par_parseExpressions();
      // groups cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      this_tok_mustBeNum(0x29, false);

      return nonAssignee;
    }
  function this_par_parseArray(){
      do {
        this_par_parseExpressionOptional(); // just one because they are all optional (and arent in expressions)
      } while (this_tok_nextExprIfNum(0x2c)); // elision

      // array lits cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      this_tok_mustBeNum(0x5d, false);
    }
  function this_par_parseObject(){
      do {
        // object literal keys can be most values, but not regex literal.
        // since that's an error, it's unlikely you'll ever see that triggered.
        if (this_tok_isValue() && !this_tok_isType(8)) this_par_parsePair();
      } while (this_tok_nextExprIfNum(0x2c)); // elision

      // obj lits cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      this_tok_mustBeNum(0x7d, false);
    }
  function this_par_parsePair(){
      if (this_tok_isNum(0x67) && this_tok_nextPuncIfString('get')) {
        if (this_tok_isType(13)) {
          if (this_par_isReservedIdentifier(false)) throw 'Getter name is reserved';
          this_tok_nextPunc();

          this_par_parseFunctionRemainder(0, true);
        }
        else this_par_parseDataPart();
      } else if (this_tok_isNum(0x73) && this_tok_nextPuncIfString('set')) {
        if (this_tok_isType(13)) {
          if (this_par_isReservedIdentifier(false)) throw 'Getter name is reserved';
          this_tok_nextPunc();

          this_par_parseFunctionRemainder(1, true);
        }
        else this_par_parseDataPart();
      } else {
        this_par_parseData();
      }
    }
  function this_par_parseData(){
      this_tok_nextPunc();
      this_par_parseDataPart();
    }
  function this_par_parseDataPart(){
      this_tok_mustBeNum(0x3a, true);
      this_par_parseExpression();
    }
  function this_par_isReservedIdentifier(ignoreValues){
      // note that this function will return false most of the time
      // if it returns true, a syntax error will probably be thrown

      // TOFIX: skip statement keywords when checking for label

      if (this_tok_lastLen > 1) {
        var c = this_tok_getLastNum();
        if (c >= 0x61 && c <= 0x77) {
          if (c < 0x67 || c > 0x71) {
            if (c === 0x74) {
              var d = this_tok_getLastNum2();
              if (d === 0x68) {
                var id = this_tok_getLastValue();
                if (id === 'this') return !ignoreValues;
                return id === 'throw';
              } else if (d === 0x72) {
                var id = this_tok_getLastValue();
                if (id === 'true') return !ignoreValues;
                if (id === 'try') return true;
              } else if (d === 0x79) {
                return this_tok_getLastValue() === 'typeof';
              }
            } else if (c === 0x73) {
              var d = this_tok_getLastNum2();
              if (d === 0x77) {
                return this_tok_getLastValue() === 'switch';
              } else if (d === 0x75) {
                return this_tok_getLastValue() === 'super';
              } else {
                return false;
              }
            } else if (c === 0x66) {
              var d = this_tok_getLastNum2();
              if (d === 0x61) {
                if (ignoreValues) return false;
                return this_tok_getLastValue() === 'false';
              } else if (d === 0x75) {
                // this is an ignoreValues case as well, but can never be triggered
                // rationale: this function is only called with ignoreValues true
                // when checking a label. labels are first words of statements. if
                // function is the first word of a statement, it will never branch
                // to parsing an identifier expression statement. and never get here.
                return this_tok_getLastValue() === 'function';
              } else if (d === 0x6f) {
                return this_tok_getLastValue() === 'for';
              } else if (d === 0x69) {
                return this_tok_getLastValue() === 'finally';
              }
            } else if (c === 0x64) {
              var d = this_tok_getLastNum2();
              if (d === 0x6f) {
                return this_tok_lastLen === 2; // do
              } else if (d === 0x65) {
                var id = this_tok_getLastValue();
                return id === 'debugger' || id === 'default' || id === 'delete';
              }
            } else if (c === 0x65) {
              var d = this_tok_getLastNum2();
              if (d === 0x6c) {
                return this_tok_getLastValue() === 'else';
              } else if (d === 0x6e) {
                return this_tok_getLastValue() === 'enum';
              } else if (d === 0x78) {
                var id = this_tok_getLastValue();
                return id === 'export' || id === 'extends';
              }
            } else if (c === 0x62) {
              return this_tok_getLastNum2() === 0x72 && this_tok_getLastValue() === 'break';
            } else if (c === 0x63) {
              var d = this_tok_getLastNum2();
              if (d === 0x61) {
                var id = this_tok_getLastValue();
                return id === 'case' || id === 'catch';
              } else if (d === 0x6f) {
                var id = this_tok_getLastValue();
                return id === 'continue' || id === 'const';
              } else if (d === 0x6c) {
                return this_tok_getLastValue() === 'class';
              }
            } else if (c === 0x72) {
              if (this_tok_getLastNum2() === 0x65) {
                return this_tok_getLastValue() === 'return';
              }
            } else if (c === 0x76) {
              var d = this_tok_getLastNum2();
              if (d === 0x61) {
                return this_tok_getLastValue() === 'var';
              } else if (d === 0x6f) {
                return this_tok_getLastValue() === 'void';
              }
            } else if (c === 0x77) {
              var d = this_tok_getLastNum2();
              if (d === 0x68) {
                return this_tok_getLastValue() === 'while';
              } else if (d === 0x69) {
                return this_tok_getLastValue() === 'with';
              }
            }
          // we checked for b-f and r-w, but must not forget
          // to check n and i:
          } else if (c === 0x6e) {
            var d = this_tok_getLastNum2();
            if (d === 0x75) {
              if (ignoreValues) return false;
              return this_tok_getLastValue() === 'null';
            } else if (d === 0x65) {
              return this_tok_getLastValue() === 'new';
            }
          } else if (c === 0x69) {
            var d = this_tok_getLastNum2();
            if (d === 0x6e) {
              return this_tok_lastLen === 2 || this_tok_getLastValue() === 'instanceof'; // 'in'
            } else if (d === 0x66) {
              return this_tok_lastLen === 2; // 'if'
            } else if (d === 0x6d) {
              return this_tok_getLastValue() === 'import';
            }
          }
        }
      }

      return false;
    }
  function this_par_isValueKeyword(word){
      return word === 'true' || word === 'false' || word === 'this' || word === 'null';
    }
  // indices match slots of the start-regexes (where applicable)
  // this order is determined by regex/parser rules so they are fixed
      // WHITE_SPACE, LINETERMINATOR COMMENT_SINGLE COMMENT_MULTI

  // extra assignment and for-in checks
      // invalid lhs for assignments
      // comma, assignment, non-assignee
  var NEITHER = 1 | 2;
  // boolean constants
  var Par = exports.Par = function(input, options){
    this_par_options = options = options || {};

    if (!options.saveTokens) options.saveTokens = false;
    if (!options.createBlackStream) options.createBlackStream = false;
    if (!options.functionMode) options.functionMode = false;
    if (!options.regexNoClassEscape) options.regexNoClassEscape = false;
    if (!options.strictForInCheck) options.strictForInCheck = false;
    if (!options.strictAssignmentCheck) options.strictAssignmentCheck = false;

    // `this['tok'] prevents build script mangling :)
    this['tok'] = new Tok(input, this_par_options);
    this['run'] = this_par_run; // used in Par.parse
  };

  exports.Par.parse = function(input, options){
    var par = new Par(input, options);
    par.run();
    return par;
  };

//######### end of par.js #########

})(typeof exports === "undefined" ? window : exports);
