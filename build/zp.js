(function(exports){
  var uniRegex = exports.uni = /[\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u0487\u048a-\u0524\u0526\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0621-\u065e\u0660-\u0669\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07c0-\u07f5\u07fa\u0901-\u0939\u093c-\u094d\u0950-\u0954\u0958-\u0963\u0966-\u096f\u0971\u0972\u097b-\u097f\u0981-\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7\u09c8\u09cb-\u09ce\u09d7\u09dc\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a66-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5c\u0b5d\u0b5f-\u0b63\u0b66-\u0b6f\u0b71\u0b82\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c58\u0c59\u0c60-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0cde\u0ce0-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d60-\u0d63\u0d66-\u0d6f\u0d7a-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e50-\u0e59\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc\u0edd\u0f00\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f8b\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1049\u1050-\u1099\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc\u1100-\u1159\u115f-\u11a2\u11a8-\u11f9\u1200-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u1676\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772\u1773\u1780-\u17b3\u17b6-\u17d3\u17d7\u17dc\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1820-\u1877\u1880-\u18aa\u1900-\u191c\u1920-\u192b\u1930-\u193b\u1946-\u196d\u1970-\u1974\u1980-\u19a9\u19b0-\u19c9\u19d0-\u19d9\u1a00-\u1a1b\u1b00-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1baa\u1bae-\u1bb9\u1c00-\u1c37\u1c40-\u1c49\u1c4d-\u1c7d\u1d00-\u1de6\u1dfe-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffb\u203f\u2040\u2054\u2071\u207f\u2090-\u2094\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb\u2ced\u2cf2\u2d00-\u2d25\u2d30-\u2d65\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005-\u3007\u3021-\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u3099\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31b7\u31f0-\u31ff\u3400\u4db5\u4e00\u9fc3\ua000-\ua1af\ua60c\ua620-\ua629\ua640-\ua660\ua662-\ua66d\ua66f\ua67c\ua67d\ua67f-\ua697\ua717-\ua71f\ua722-\ua788\ua78b-\ua78d\ua790\ua792\ua7a0\ua7a2\ua7a4\ua7a6\ua7a8\ua7aa\ua802\ua806\ua80b\ua823-\ua827\ua880\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua900-\ua909\ua926-\ua92d\ua947-\ua953\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\ufb00-\ufb06\ufb13-\ufb17\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff70\uff9e\uff9f]/;

  var this_tok_input =  '';
  var this_tok_len =  0;
  var this_tok_pos =  0;
  var this_tok_options =  null;
  var this_tok_lastStart =  0;
  var this_tok_lastStop =  0;
  var this_tok_lastLen =  0;
  var this_tok_lastType =  0;
  var this_tok_lastValue =  '';
  var this_tok_lastNewline =  false;
  var this_tok_nextNum1 =  0;
  var this_tok_nextNum2 =  0;
  var this_tok_tokenCountAll =  0;
  var this_tok_tokens =  null;
  var this_tok_black =  null;
  function this_tok_isType(t){
      return this_tok_lastType === t;
    }
  function this_tok_isValue(){
      return (
        (this_tok_lastType !== 9) &&        (this_tok_lastType === 10 || this_tok_lastType === 7 || this_tok_lastType === 13 || this_tok_lastType === 8)
      );
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
  function this_tok_nextExprIfString(str){
      var equals = this_tok_isString(str);
      if (equals) this_tok_nextExpr();
      return equals;
    }
  function this_tok_mustBeNum(num, nextIsExpr){
      if (this_tok_isNum(num)) {
        this_tok_next(nextIsExpr);
      } else {
        throw 'Expected char=' + String.fromCharCode(num) + ' got=' + String.fromCharCode(this_tok_getLastNum()) + '.' + this_tok_syntaxError();
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

      ++this_tok_tokenCountAll;

      var start = this_tok_lastStart = this_tok_pos;
      if (start >= this_tok_len) {
        this_tok_nextNum1 = 0;
        return 14;
      }

      var nextChar;
      if (!this_tok_nextNum2 || this_tok_lastLen !== 1) {
        nextChar = this_tok_nextNum1 = this_tok_input.charCodeAt(start);
      } else {
        nextChar = this_tok_nextNum1 = this_tok_nextNum2;
      }
      this_tok_nextNum2 = 0;

      var result = this_tok_nextTokenDeterminator(nextChar, expressionStart);
      this_tok_lastLen = (this_tok_lastStop = this_tok_pos) - start;

      return result;
    }
  function this_tok_nextTokenDeterminator(c, expressionStart) {
      if (c < 0x31) return this_tok_nextTokenDeterminator_a(c, expressionStart);

      var b = c & 0xffdf;      if (b >= 0x41 && b <= 0x5a) return this_tok_parseIdentifier();

      if (c > 0x39) return this_tok_nextTokenDeterminator_b(c, expressionStart);
      return this_tok_parseDecimalNumber();
    }
  function this_tok_nextTokenDeterminator_a(c, expressionStart) {
      switch (c) {
        case 0x20:          return this_tok_parseOneChar(18);
        case 0x2e:
          return this_tok_parseLeadingDot();
        case 0x28:
          return this_tok_parseOneChar(9);
        case 0x29:
          return this_tok_parseOneChar(9);
        case 0x0D:
          return this_tok_parseCR();
        case 0x0A:
          return this_tok_parseNewline();
        case 0x2c:
          return this_tok_parseOneChar(9);
        case 0x09:
          return this_tok_parseOneChar(18);
        case 0x22:
          return this_tok_parseDoubleString();
        case 0x2b:
          return this_tok_parseSameOrCompound(c);
        case 0x30:
          return this_tok_parseLeadingZero();
        case 0x2f:
          return this_tok_parseFwdSlash(expressionStart);
        case 0x21:
          return this_tok_parseEqualSigns();
        case 0x26:
          return this_tok_parseSameOrCompound(c);
        case 0x2d:
          return this_tok_parseSameOrCompound(c);
        case 0x27:
          return this_tok_parseSingleString();
        case 0x2a:
          return this_tok_parseCompoundAssignment();
        case 0x24:
          return this_tok_parseIdentifier();
        case 0x25:
          return this_tok_parseCompoundAssignment();
        case 0x0C:
          return this_tok_parseOneChar(18);
        case 0x0B:
          return this_tok_parseOneChar(18);
        default:
          throw 'Unexpected character in token scanner... fixme! [' + c + ']' + this_tok_syntaxError();
      }
    }
  function this_tok_nextTokenDeterminator_b(c, expressionStart) {
      switch (c) {
        case 0x3b:
          return this_tok_parseOneChar(9);
        case 0x3d:
          return this_tok_parseEqualSigns();
        case 0x7b:
          return this_tok_parseOneChar(9);
        case 0x7d:
          return this_tok_parseOneChar(9);
        case 0x5b:
          return this_tok_parseOneChar(9);
        case 0x5d:
          return this_tok_parseOneChar(9);
        case 0x3a:
          return this_tok_parseOneChar(9);
        case 0x5f:
          return this_tok_parseIdentifier();
        case 0x7c:
          return this_tok_parseSameOrCompound(c);
        case 0x3f:
          return this_tok_parseOneChar(9);
        case 0x3c:
          return this_tok_parseLtgtPunctuator(c);
        case 0x3e:
          return this_tok_parseLtgtPunctuator(c);
        case 0x5e:
          return this_tok_parseCompoundAssignment();
        case 0x7e:
          return this_tok_parseCompoundAssignment();
        case 0x2028:
          return this_tok_parseNewline();
        case 0x2029:
          return this_tok_parseNewline();
        case 0xA0:
          return this_tok_parseOneChar(18);
        case 0xFEFF:
          return this_tok_parseOneChar(18);
        case 0x5c:
          return this_tok_parseBackslash();
        default:
          if (c > 127 && uniRegex.test(String.fromCharCode(c))) {
            return this_tok_parseIdentifier();
          }

          throw 'Unexpected character in token scanner... fixme! [' + c + ']' + this_tok_syntaxError();
      }
    }
  function this_tok_parseBackslash(){
      this_tok_parseAndValidateUnicodeAsIdentifier(this_tok_pos, this_tok_input, true);
      this_tok_pos += 6;
      this_tok_pos = this_tok_parseIdentifierRest();
      return 13;
    }
  function this_tok_parseOneChar(type){
      ++this_tok_pos;
      return type;
    }
  function this_tok_parseFwdSlash(expressionStart){
      var d = this_tok_input.charCodeAt(this_tok_pos+1);
      if (d === 0x2f) return this_tok_parseSingleComment();
      if (d === 0x2a) return this_tok_parseMultiComment();
      if (expressionStart) return this_tok_parseRegex();
      return this_tok_parseDivPunctuator(d);
    }
  function this_tok_parseNewline() {
      return this_tok_verifiedNewline(this_tok_pos);
    }
  function this_tok_parseCR(){
      var pos = this_tok_pos;

      if (this_tok_input.charCodeAt(pos+1) === 0x0A) ++pos;

      return this_tok_verifiedNewline(pos);
    }
  function this_tok_verifiedNewline(pos){
      this_tok_lastNewline = true;

      var input = this_tok_input;
      var tokens = this_tok_tokens;
      var saveTokens = this_tok_options.saveTokens;
      var count = this_tok_tokenCountAll;

      while (true) {
        var c = input.charCodeAt(++pos);

        if (c !== 0x20 && c !== 0x09) break;

        ++count;
        if (saveTokens) {
          var s = pos-1;
          tokens.push({type:18, value:input.slice(s, pos), start:s, stop:pos, white:tokens.length});
        }
      }

      this_tok_nextNum2 = c;
      this_tok_tokenCountAll = count;
      this_tok_lastValue = '';
      this_tok_lastStart = pos-1;
      this_tok_pos = pos;

      return 18;
    }
  function this_tok_parseSameOrCompound(c){
      var pos = this_tok_pos+1;
      var d = this_tok_input.charCodeAt(pos);
      this_tok_pos = pos + ((d === c || d === 0x3d) ? 1 : 0);

      return 9;
    }
  function this_tok_parseEqualSigns(){
      var len = 1;
      if (this_tok_input.charCodeAt(this_tok_lastStart+1) === 0x3d) {
        if (this_tok_input.charCodeAt(this_tok_lastStart+2) === 0x3d) len = 3;
        else len = 2;
      }
      this_tok_pos += len;
      return 9;
    }
  function this_tok_parseLtgtPunctuator(c){
      var len = 1;
      var d = this_tok_input.charCodeAt(this_tok_lastStart+1);
      if (d === 0x3d) len = 2;
      else if (d === c) {
        len = 2;
        var e = this_tok_input.charCodeAt(this_tok_lastStart+2);
        if (e === 0x3d) len = 3;
        else if (e === c && c !== 0x3c) {
          len = 3;
          if (this_tok_input.charCodeAt(this_tok_lastStart+3) === 0x3d) len = 4;
        }
      }
      this_tok_pos += len;
      return 9;
    }
  function this_tok_parseCompoundAssignment(){
      var len = 1;
      if (this_tok_input.charCodeAt(this_tok_pos+1) === 0x3d) len = 2;
      this_tok_pos += len;
      return 9;
    }
  function this_tok_parseDivPunctuator(d){
      if (d === 0x3d) this_tok_pos += 2;
      else ++this_tok_pos;
      return 9;
    }
  function this_tok_parseSingleComment(){
      var pos = this_tok_pos + 1;
      var input = this_tok_input;
      var len = input.length;

      while (++pos < len) {
        var c = input.charCodeAt(pos);
        if (c === 0x0D || c === 0x0A || (c ^ 0x2028) <= 1  ) break;
      }

      this_tok_pos = pos;

      return 18;

    }
  function this_tok_parseMultiComment(){
      var pos = this_tok_pos + 2;
      var input = this_tok_input;
      var len = input.length;

      var noNewline = true;
      var c = 0;
      var d = this_tok_input.charCodeAt(pos);
      while (pos++ < len) {
        c = d;
        d = input.charCodeAt(pos);

        if (c === 0x2a && d === 0x2f) break;
        if (noNewline) noNewline = !(c === 0x0D || c === 0x0A || (c ^ 0x2028) <= 1);      }

      this_tok_pos = pos+1;
      if (!noNewline) this_tok_lastNewline = true;

      return 18;
    }
  function this_tok_parseSingleString(){
      return this_tok_parseString(0x27);
    }
  function this_tok_parseDoubleString(){
      return this_tok_parseString(0x22);
    }
  function this_tok_parseString(targetChar){
      var pos = this_tok_pos + 1;
      var input = this_tok_input;
      var len = input.length;
      var c = 0;
      while (pos < len) {
        c = input.charCodeAt(pos++);

        if (c === targetChar) {
          this_tok_pos = pos;
          return 10;
        }

        if ((c & 8) === 8) {
          if (c === 0x5c) pos = this_tok_parseStringEscape(pos);
          else if ((c & 83) < 3 && (c === 0x0A || c === 0x0D || c === 0x2028 || c === 0x2029)) {
            throw 'No newlines in strings! ' + this_tok_syntaxError();
          }
        }
      }

      throw 'Unterminated string found at '+pos;
    }
  function this_tok_parseStringEscape(pos){
      var input = this_tok_input;
      var c = input.charCodeAt(pos);

      if (c === 0x75) {
        if (this_tok_parseUnicodeEscapeBody(pos+1)) pos += 4;
        else throw 'Invalid unicode escape.'+this_tok_syntaxError();
      } else if (c === 0x0D) {
        if (input.charCodeAt(pos+1) === 0x0A) ++pos;
      } else if (c === 0x78) {
        if (this_tok_parseHexDigit(input.charCodeAt(pos+1)) && this_tok_parseHexDigit(input.charCodeAt(pos+2))) pos += 2;
        else throw 'Invalid hex escape.'+this_tok_syntaxError();
      }
      return pos+1;
    }
  function this_tok_parseUnicodeEscapeBody(pos){
      var input = this_tok_input;

      return this_tok_parseHexDigit(input.charCodeAt(pos)) && this_tok_parseHexDigit(input.charCodeAt(pos+1)) && this_tok_parseHexDigit(input.charCodeAt(pos+2)) && this_tok_parseHexDigit(input.charCodeAt(pos+3));
    }
  function this_tok_parseHexDigit(c){
      return ((c <= 0x39 && c >= 0x30) || (c >= 0x61 && c <= 0x66) || (c >= 0x41 && c <= 0x46));
    }
  function this_tok_parseLeadingDot(){
      var c = this_tok_input.charCodeAt(this_tok_pos+1);

      if (c >= 0x30 && c <= 0x39) return this_tok_parseAfterDot(this_tok_pos+2);

      ++this_tok_pos;
      return 9;
    }
  function this_tok_parseLeadingZero(){
      var d = this_tok_input.charCodeAt(this_tok_pos+1);
      if (d === 0x78 || d === 0x58) {        this_tok_parseHexNumber();
      } else if (d === 0x2e) {
        this_tok_parseAfterDot(this_tok_pos+2);
      } else if (d <= 0x39 && d >= 0x30) {
        throw 'Invalid octal literal.'+this_tok_syntaxError();
      } else {
        this_tok_pos = this_tok_parseExponent(d, this_tok_pos+1, this_tok_input);
      }

      return 7;
    }
  function this_tok_parseHexNumber(delta){
      var pos = this_tok_pos + 1;
      var input = this_tok_input;
      var len = input.length;

      do var c = input.charCodeAt(++pos);
      while ((c <= 0x39 && c >= 0x30) || (c >= 0x61 && c <= 0x66) || (c >= 0x41 && c <= 0x46));

      this_tok_pos = pos;
      return 7;
    }
  function this_tok_parseDecimalNumber(){
      var pos = this_tok_pos;
      var input = this_tok_input;
      var len = input.length;

      do var c = input.charCodeAt(++pos);
      while (c >= 0x30 && c <= 0x39);

      if (c === 0x2e) return this_tok_parseAfterDot(pos+1);

      this_tok_pos = this_tok_parseExponent(c, pos, input);
      return 7;
    }
  function this_tok_parseAfterDot(pos){
      var input = this_tok_input;
      var c = input.charCodeAt(pos);
      while (c >= 0x30 && c <= 0x39) c = input.charCodeAt(++pos);

      pos = this_tok_parseExponent(c, pos, input);

      this_tok_pos = pos;

      return 7;
    }
  function this_tok_parseExponent(c, pos, input){
      if (c === 0x65 || c === 0x45) {
        c = input.charCodeAt(++pos);
        if (c === 0x2d || c === 0x2b) c = input.charCodeAt(++pos);

        if (c >= 0x30 && c <= 0x39) c = input.charCodeAt(++pos);
        else throw 'Missing required digits after exponent.'+this_tok_syntaxError();

        while (c >= 0x30 && c <= 0x39) c = input.charCodeAt(++pos);
      }
      return pos;
    }
  function this_tok_parseRegex(){
      this_tok_pos++;
      this_tok_regexBody();
      this_tok_regexFlags();

      return 8;
    }
  function this_tok_regexBody(){
      var input = this_tok_input;
      var len = input.length;
      while (this_tok_pos < len) {
        var c = input.charCodeAt(this_tok_pos++);

        if (c === 0x5c) {          var d = input.charCodeAt(this_tok_pos++);
          if (d === 0x0A || d === 0x0D || (d ^ 0x2028) <= 1  ) {
            throw 'Newline can not be escaped in regular expression.'+this_tok_syntaxError();
          }
        }
        else if (c === 0x28) this_tok_regexBody();        else if (c === 0x29 || c === 0x2f) return;
        else if (c === 0x5b) this_tok_regexClass();
        else if (c === 0x0A || c === 0x0D || (c ^ 0x2028) <= 1  ) {
          throw 'Newline can not be escaped in regular expression ['+c+'].'+this_tok_syntaxError();
        }
      }

      throw 'Unterminated regular expression at eof.'+this_tok_syntaxError();
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
        if (c === 0x0A || c === 0x0D || (c ^ 0x2028) <= 1  ) {
          throw 'Illegal newline in regex char class.'+this_tok_syntaxError();
        }
        if (c === 0x5c) {          if (this_tok_options.regexNoClassEscape) {
            var d = input.charCodeAt(pos++);
            if (d === 0x0A || d === 0x0D || (d ^ 0x2028) <= 1  ) {
              throw 'Newline can not be escaped in regular expression.'+this_tok_syntaxError();
            }
          }
        }
      }

      throw 'Unterminated regular expression at eof.'+this_tok_syntaxError();
    }
  function this_tok_regexFlags(){
      --this_tok_pos;      this_tok_pos = this_tok_parseIdentifierRest();
    }
  function this_tok_parseIdentifier(){
      this_tok_pos = this_tok_parseIdentifierRest();
      return 13;
    }
  function this_tok_parseIdentifierRest(){
      var input = this_tok_input;
      var len = input.length;
      var start = this_tok_lastStart;
      var pos = this_tok_pos + 1;

      while (true) {

        var c = input.charCodeAt(pos);
        var b = c & 0xffdf;
        while (b >= 0x41 && b <= 0x5a) {
          c = input.charCodeAt(++pos);
          b = c & 0xffdf;
        }

        var delta = this_tok_parseOtherIdentifierParts(c, pos, input);
        if (!delta) break;
        pos += delta;
      }

      return pos;
    }
  function this_tok_parseOtherIdentifierParts(c, pos, input){
      if (c >= 0x30 ? c <= 0x39 || c === 0x5f : c === 0x24) {
        return 1;
      }

      if (c === 0x5c) {
        this_tok_parseAndValidateUnicodeAsIdentifier(pos, input, false);
        return 6;
      }

      if (c > 127) {
        if (uniRegex.test(String.fromCharCode(c))) {
          return 1;
        }
      }

      return 0;
    }
  function this_tok_parseAndValidateUnicodeAsIdentifier(pos, input, atStart){
      if (input.charCodeAt(pos + 1) === 0x75 && this_tok_parseUnicodeEscapeBody(pos + 2)) {

        var u = parseInt(input.slice(pos+2, pos+6), 16);
        var b = u & 0xffdf;
        if (b >= 0x41 && b <= 0x5a) {
          return true;
        }
        if (u >= 0x30 && u <= 0x39) {
          if (atStart) throw 'Digit not allowed at start of identifier, not even escaped.'+this_tok_syntaxError();
          return true;
        }
        if (u === 0x5f || u === 0x24) {
          return true;
        }
        if (uniRegex.test(String.fromCharCode(u))) {
          return true;
        }

        throw 'Encountered \\u escape ('+u+') but the char is not a valid identifier part.'
      }

      this_tok_pos = pos;
      throw 'Unexpected backslash inside identifier.'+this_tok_syntaxError();
    }
  function this_tok_getLastValue(){
      return this_tok_lastValue || (this_tok_lastValue = this_tok_input.substring(this_tok_lastStart, this_tok_lastStop));

    }
  function this_tok_getLastNum(){
      return this_tok_nextNum1;
    }
  function this_tok_getNum(offset){
      return this_tok_input.charCodeAt(this_tok_lastStart+offset)
    }
  function this_tok_getLastLen(){
      return this_tok_lastLen;
    }
  function this_tok_getLastNewline(){
      return this_tok_lastNewline;
    }
  function this_tok_syntaxError(value){
      var pos = (this_tok_lastStop === this_tok_pos) ? this_tok_lastStart : this_tok_pos;

      return (
        ' A syntax error at pos='+pos+' '+
        (
          typeof value !== 'undefined' ?
            'expected '+(typeof value === 'number' ? 'type='+Tok[value] : 'value=`'+value+'`') +
            ' is '+(typeof value === 'number' ? Tok[this_tok_lastType] : '`'+this_tok_getLastValue()+'`') + ' '
            :
            ''
        ) +
        'Search for #|#: `'+this_tok_input.substring(pos-2000, pos)+'#|#'+this_tok_input.substring(pos, pos+2000)+'`'
      );
    }
  var Tok = exports.Tok = function(input, options){
    this_tok_options = options || {};    this_tok_input = (input||'');
    this_tok_len = this_tok_input.length;

    this_tok_pos = 0;

    this_tok_lastStart = 0;
    this_tok_lastStop = 0;
    this_tok_lastLen = 0;
    this_tok_lastType = 0;
    this_tok_lastValue = '';
    this_tok_lastNewline = false;

    this_tok_nextNum1 = 0;
    this_tok_nextNum2 = 0;

    this_tok_tokenCountAll = 0;

    if (options.saveTokens) {
      this['tokens'] = this_tok_tokens = [];
      if (options.createBlackStream) this['black'] = this_tok_black = [];
    }
  };

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
  Tok.WHITE = 18;  var this_par_options =  null;
  var this_par_tok =  null;
  function this_par_run(){
      this_tok_nextExpr();
      this_par_parseStatements(false, false, false, '');

      if (this_tok_pos !== this_tok_len || this_tok_lastType !== 14) throw 'Did not complete parsing... '+this_tok_syntaxError();

      return this;
    }
  function this_par_parseStatements(inFunction, inLoop, inSwitch, labelSet){
      while (!this_tok_isType(14) && this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, true));
    }
  function this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, optional){
      if (this_tok_isType(13)) {
        return this_par_parseIdentifierStatement(inFunction, inLoop, inSwitch, labelSet);
      } else {
        return this_par_parseNonIdentifierStatement(inFunction, inLoop, inSwitch, labelSet, optional);
      }
    }
  function this_par_parseNonIdentifierStatement(inFunction, inLoop, inSwitch, labelSet, optional) {
      var c = this_tok_getLastNum();

      if (c === 0x7d) {        if (!optional) throw 'Expected more input...';        return false;
      }

      if (c === 0x7b) {        this_tok_nextExpr();
        this_par_parseBlock(true, inFunction, inLoop, inSwitch, labelSet);
        return true;
      }

      return this_par_parseNonIdentifierStatementNonCurly(c, optional);
    }
  function this_par_parseNonIdentifierStatementNonCurly(c, optional){
      if (c === 0x28) {        this_par_parseExpressionStatement();
        return true;
      }

      if (c === 0x3b) {        this_tok_nextExpr();
        return true;
      }

      if (c === 0x2b || c === 0x2d) {        if (this_tok_getNum(1) === c || this_tok_getLastLen() === 1) {
          this_par_parseExpressionStatement();
          return true;
        }
        throw 'Statement cannot start with binary op.'+this_tok_syntaxError();
      }

      if (this_tok_isValue() || c === 0x5b) {
        this_par_parseExpressionStatement();
        return true;
      }

      if (c === 0x21) {        if (this_tok_getLastLen() === 1) {
          this_par_parseExpressionStatement();
          return true;
        }
        throw 'Statement cannot start with binary op.'+this_tok_syntaxError();
      }

      if (c === 0x7e) {
        this_par_parseExpressionStatement();
        return true;
      }

      if (!optional) throw 'Expected more input...';
      return false;
    }
  function this_par_parseIdentifierStatement(inFunction, inLoop, inSwitch, labelSet){
      var value = this_tok_getLastValue();

      var len = this_tok_getLastLen();

      if (len >= 2 && len <= 8) {
        var c = this_tok_getLastNum();

        if (c === 0x74) {
          if (value === 'try') return this_par_parseTry(inFunction, inLoop, inSwitch, labelSet);
          if (value === 'throw') return this_par_parseThrow();
        }
        else if (c === 0x69 && len === 2 && this_tok_getNum(1) === 0x66) return this_par_parseIf(inFunction, inLoop, inSwitch, labelSet);
        else if (c === 0x76 && value === 'var') return this_par_parseVar();
        else if (c === 0x72 && value === 'return') return this_par_parseReturn(inFunction, inLoop, inSwitch);
        else if (c === 0x66) {
          if (value === 'function') return this_par_parseFunction(true);
          if (value === 'for') return this_par_parseFor(inFunction, inLoop, inSwitch, labelSet);
        }
        else if (c === 0x63) {
          if (value === 'continue') return this_par_parseContinue(inFunction, inLoop, inSwitch, labelSet);
          if (value === 'case') return false;        }
        else if (c === 0x62 && value === 'break') return this_par_parseBreak(inFunction, inLoop, inSwitch, labelSet);
        else if (c === 0x64) {
          if (value === 'default') return false;          if (len === 2 && this_tok_getNum(1) === 0x6f) return this_par_parseDo(inFunction, inLoop, inSwitch, labelSet);
          if (value === 'debugger') return this_par_parseDebugger();
        }
        else if (c === 0x73 && value === 'switch') return this_par_parseSwitch(inFunction, inLoop, inSwitch, labelSet);
        else if (c === 0x77) {
          if (value === 'while') return this_par_parseWhile(inFunction, inLoop, inSwitch, labelSet);
          if (value === 'with') return this_par_parseWith(inFunction, inLoop, inSwitch, labelSet);
        }
      }

      this_par_parseExpressionOrLabel(value, inFunction, inLoop, inSwitch, labelSet);

      return true;
    }
  function this_par_parseStatementHeader(){
      this_tok_mustBeNum(0x28, true);
      this_par_parseExpressions();
      this_tok_mustBeNum(0x29, true);
    }
  function this_par_parseVar(){
      this_tok_nextPunc();
      do {
        if (this_par_isReservedIdentifier(false)) throw 'Var name is reserved.'+this_tok_syntaxError();
        this_tok_mustBeIdentifier(true);
        if (this_tok_isNum(0x3d) && this_tok_getLastLen() === 1) {
          this_tok_nextExpr();
          this_par_parseExpression();
        }
      } while(this_tok_nextExprIfNum(0x2c));
      this_par_parseSemi();

      return true;
    }
  function this_par_parseVarPartNoIn(){
      var vars = 0;

      do {
        if (this_par_isReservedIdentifier(false)) throw 'Var name is reserved.'+this_tok_syntaxError();
        this_tok_mustBeIdentifier(true);
        ++vars;

        if (this_tok_isNum(0x3d) && this_tok_getLastLen() === 1) {
          this_tok_nextExpr();
          this_par_parseExpressionNoIn();
        }

      } while(this_tok_nextExprIfNum(0x2c));

      return vars === 1;
    }
  function this_par_parseIf(inFunction, inLoop, inSwitch, labelSet){
      this_tok_nextPunc();
      this_par_parseStatementHeader();
      this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, false);

      if (this_tok_getLastValue() === 'else') {
        this_tok_nextExpr();
        this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, false);
      }

      return true;
    }
  function this_par_parseDo(inFunction, inLoop, inSwitch, labelSet){
      this_tok_nextExpr();      this_par_parseStatement(inFunction, true, inSwitch, labelSet, false);
      this_tok_mustBeString('while', false);
      this_tok_mustBeNum(0x28, true);
      this_par_parseExpressions();
      this_tok_mustBeNum(0x29, false);      this_par_parseSemi();

      return true;
    }
  function this_par_parseWhile(inFunction, inLoop, inSwitch, labelSet){
      this_tok_nextPunc();
      this_par_parseStatementHeader();
      this_par_parseStatement(inFunction, true, inSwitch, labelSet, false);

      return true;
    }
  function this_par_parseFor(inFunction, inLoop, inSwitch, labelSet){
      this_tok_nextPunc();      this_tok_mustBeNum(0x28, true);

      if (this_tok_nextExprIfNum(0x3b)) this_par_parseForEachHeader();      else {
        var validForInLhs;

        if (this_tok_isNum(0x76) && this_tok_nextPuncIfString('var')) validForInLhs = this_par_parseVarPartNoIn();
        else validForInLhs = this_par_parseExpressionsNoIn();

        if (this_tok_nextExprIfNum(0x3b)) this_par_parseForEachHeader();
        else if (this_tok_getLastNum() !== 0x69 || this_tok_getNum(1) !== 0x6e || this_tok_getLastLen() !== 2) throw 'Expected `in` or `;` here...'+this_tok_syntaxError();
        else if (!validForInLhs && this_par_options.strictForInCheck) throw 'Encountered illegal for-in lhs.'+this_tok_syntaxError();
        else this_par_parseForInHeader();
      }

      this_tok_mustBeNum(0x29, true);
      this_par_parseStatement(inFunction, true, inSwitch, labelSet, false);

      return true;
    }
  function this_par_parseForEachHeader(){
      this_par_parseOptionalExpressions();
      this_tok_mustBeNum(0x3b, true);
      this_par_parseOptionalExpressions();
    }
  function this_par_parseForInHeader(){
      this_tok_nextExpr();      this_par_parseExpressions();
    }
  function this_par_parseContinue(inFunction, inLoop, inSwitch, labelSet){
      if (!inLoop) throw 'Can only continue in a loop.'+this_tok_syntaxError();

      this_tok_nextPunc();      if (!this_tok_getLastNewline() && this_tok_isType(13)) {
        this_par_parseLabel(labelSet);
      }

      this_par_parseSemi();

      return true;
    }
  function this_par_parseBreak(inFunction, inLoop, inSwitch, labelSet){
      this_tok_nextPunc();      if (this_tok_getLastNewline() || !this_tok_isType(13)) {        if (!inLoop && !inSwitch) {
          throw 'Break without value only in loops or switches.'+this_tok_syntaxError();
        }
      } else {
        this_par_parseLabel(labelSet);
      }

      this_par_parseSemi();

      return true;
    }
  function this_par_parseLabel(labelSet){
      var label = this_tok_getLastValue();
      if (labelSet && labelSet.indexOf(label) >= 0) {
        this_tok_nextExpr();      } else {
        throw 'Label ['+label+'] not found in label set ['+labelSet+'].'+this_tok_syntaxError();
      }
    }
  function this_par_parseReturn(inFunction, inLoop, inSwitch){
      if (!inFunction && !this_par_options.functionMode) throw 'Can only return in a function.'+this_tok_syntaxError('break');

      this_tok_nextExpr();
      if (this_tok_getLastNewline()) this_par_addAsi();
      else {
        this_par_parseOptionalExpressions();
        this_par_parseSemi();
      }

      return true;
    }
  function this_par_parseThrow(){
      this_tok_nextExpr();
      if (this_tok_getLastNewline()) {
        throw 'No newline allowed directly after a throw, ever.'+this_tok_syntaxError();
      }

      this_par_parseExpressions();
      this_par_parseSemi();

      return true;
    }
  function this_par_parseSwitch(inFunction, inLoop, inSwitch, labelSet){
      this_tok_nextPunc();
      this_par_parseStatementHeader();
      this_tok_mustBeNum(0x7b, true);
      this_par_parseSwitchBody(inFunction, inLoop, true, labelSet);
      this_tok_mustBeNum(0x7d, true);

      return true;
    }
  function this_par_parseSwitchBody(inFunction, inLoop, inSwitch, labelSet){
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
      this_par_parseExpressions();
      this_tok_mustBeNum(0x3a, true);
      this_par_parseStatements(inFunction, inLoop, inSwitch, labelSet);
    }
  function this_par_parseDefault(inFunction, inLoop, inSwitch, labelSet){
      this_tok_mustBeNum(0x3a, true);
      this_par_parseStatements(inFunction, inLoop, inSwitch, labelSet);
    }
  function this_par_parseTry(inFunction, inLoop, inSwitch, labelSet){
      this_tok_nextPunc();
      this_par_parseCompleteBlock(true, inFunction, inLoop, inSwitch, labelSet);

      var one = this_par_parseCatch(inFunction, inLoop, inSwitch, labelSet);
      var two = this_par_parseFinally(inFunction, inLoop, inSwitch, labelSet);

      if (!one && !two) throw 'Try must have at least a catch or finally block or both.'+this_tok_syntaxError();
      return true;
    }
  function this_par_parseCatch(inFunction, inLoop, inSwitch, labelSet){
      if (this_tok_nextPuncIfString('catch')) {
        this_tok_mustBeNum(0x28, false);

        if (this_tok_isType(13)) {
          if (this_par_isReservedIdentifier(false)) throw 'Catch scope var name is reserved.'+this_tok_syntaxError();
          this_tok_nextPunc();
        } else {
          throw 'Missing catch scope variable.'+this_tok_syntaxError();
        }

        this_tok_mustBeNum(0x29, false);
        this_par_parseCompleteBlock(true, inFunction, inLoop, inSwitch, labelSet);

        return true;
      }
      return false;
    }
  function this_par_parseFinally(inFunction, inLoop, inSwitch, labelSet){
      if (this_tok_nextPuncIfString('finally')) {
        this_par_parseCompleteBlock(true, inFunction, inLoop, inSwitch, labelSet);

        return true;
      }
      return false;
    }
  function this_par_parseDebugger(){
      this_tok_nextPunc();
      this_par_parseSemi();

      return true;
    }
  function this_par_parseWith(inFunction, inLoop, inSwitch, labelSet){
      this_tok_nextPunc();
      this_par_parseStatementHeader();
      this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, false);

      return true;
    }
  function this_par_parseFunction(forFunctionDeclaration){
      this_tok_nextPunc();      if (this_tok_isType(13)) {        if (this_par_isReservedIdentifier(false)) throw 'Function name ['+this_tok_getLastValue()+'] is reserved.'+this_tok_syntaxError();
        this_tok_nextPunc();
      } else if (forFunctionDeclaration) {
        throw 'Function declaration requires a name.'+this_tok_syntaxError();
      }
      this_par_parseFunctionRemainder(-1, forFunctionDeclaration);

      return true;
    }
  function this_par_parseFunctionRemainder(paramCount, forFunctionDeclaration){
      this_tok_mustBeNum(0x28, false);
      this_par_parseParameters(paramCount);
      this_tok_mustBeNum(0x29, false);
      this_par_parseCompleteBlock(forFunctionDeclaration, true, false, false, '');
    }
  function this_par_parseParameters(paramCount){
      if (this_tok_isType(13)) {
        if (paramCount === 0) throw 'Getters have no parameters.'+this_tok_syntaxError();
        if (this_par_isReservedIdentifier(false)) throw 'Function param name is reserved.'+this_tok_syntaxError();
        this_tok_nextExpr();
        while (this_tok_nextExprIfNum(0x2c)) {
          if (paramCount === 1) throw 'Setters have exactly one param.'+this_tok_syntaxError();

          if (this_tok_isType(13)) {
            if (this_par_isReservedIdentifier(false)) throw 'Function param name is reserved.'+this_tok_syntaxError();
            this_tok_nextPunc();
          } else {
            throw 'Missing func param name.'+this_tok_syntaxError();
          }
        }
      } else if (paramCount === 1) {
        throw 'Setters have exactly one param.'+this_tok_syntaxError();
      }
    }
  function this_par_parseBlock(notForFunctionExpression, inFunction, inLoop, inSwitch, labelSet){
      this_par_parseStatements(inFunction, inLoop, inSwitch, labelSet);
      this_tok_mustBeNum(0x7d, notForFunctionExpression);
    }
  function this_par_parseCompleteBlock(notForFunctionExpression, inFunction, inLoop, inSwitch, labelSet){
      this_tok_mustBeNum(0x7b, true);
      this_par_parseBlock(notForFunctionExpression, inFunction, inLoop, inSwitch, labelSet);
    }
  function this_par_parseSemi(){
      if (this_tok_nextExprIfNum(0x3b)) return 9;
      if (this_par_parseAsi()) return 15;
      throw 'Unable to parse semi, unable to apply ASI.'+this_tok_syntaxError();
    }
  function this_par_parseAsi(){
      if (this_tok_isNum(0x7d) || (this_tok_getLastNewline() && !this_tok_isType(8)) || this_tok_isType(14)) {
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
      var identifier = this_tok_getLastValue();

      var assignable = this_par_parsePrimaryOrPrefix(false, false, true);

      this_par_parseAssignments(assignable);
      this_par_parseNonAssignments();

      if (this_tok_nextExprIfNum(0x3a)) {
        if (!assignable) throw 'Label ['+identifier+'] is a reserved keyword.'+this_tok_syntaxError();
        this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet+' '+labelName, false);
      } else {
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
      var groupAssignable = this_par_parseExpression();
      while (this_tok_nextExprIfNum(0x2c)) {
        this_par_parseExpression();
        groupAssignable = false;
      }
      return groupAssignable;
    }
  function this_par_parseExpression(){
      var tokCount = this_tok_tokenCountAll;

      var groupAssignable = this_par_parseExpressionOptional();

      if (tokCount === this_tok_tokenCountAll) throw 'Expected to parse an expression, did not find any.'+this_tok_syntaxError();

      return groupAssignable;
    }
  function this_par_parseExpressionOptional(){
      var count = this_tok_tokenCountAll;
      var assignable = this_par_parsePrimary(true);
      var beforeAssignments = this_tok_tokenCountAll;
      if (count !== beforeAssignments) {
        this_par_parseAssignments(assignable);
        var beforeNonAssignments = this_tok_tokenCountAll;
        this_par_parseNonAssignments();
        var endCount = this_tok_tokenCountAll;

        assignable = (beforeNonAssignments === endCount) && (beforeAssignments !== beforeNonAssignments || assignable);
      }

      return assignable;
    }
  function this_par_parseAssignments(assignable){
      while (this_par_isAssignmentOperator()) {
        if (!assignable && this_par_options.strictAssignmentCheck) throw 'LHS of this assignment is invalid assignee.'+this_tok_syntaxError();
        this_tok_nextExpr();
        assignable = this_par_parsePrimary(false);
      }
    }
  function this_par_parseNonAssignments(){
      while (true) {
        if (this_par_isBinaryOperator()) {
          this_tok_nextExpr();
          this_par_parsePrimary(false);
        }
        else if (this_tok_isNum(0x3f)) this_par_parseTernary();
        else break;
      }
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
      var validForInLhs = this_par_parseExpressionNoIn();
      while (this_tok_nextExprIfNum(0x2c)) {
        this_par_parseExpressionNoIn();
        validForInLhs = false;
      }

      return validForInLhs;
    }
  function this_par_parseExpressionNoIn(){
      var assignable = this_par_parsePrimary(false);
      var count = this_tok_tokenCountAll;
      this_par_parseAssignments(assignable);

      var repeat = true;
      while (repeat) {
        if (this_par_isBinaryOperator()) {
          if (this_tok_getLastNum() === 0x69 && this_tok_getNum(1) === 0x6e && this_tok_getLastLen() === 2) {            repeat = false;
          } else {
            this_tok_nextExpr();
            this_par_parsePrimary(false);
          }
        } else if (this_tok_isNum(0x3f)) {
          this_par_parseTernaryNoIn();
        } else {
          repeat = false;
        }
      }

      return (assignable && count === this_tok_tokenCountAll);
    }
  function this_par_parsePrimary(optional){
      return this_par_parsePrimaryOrPrefix(optional, false, false);
    }
  function this_par_parsePrimaryOrPrefix(optional, hasNew, maybeLabel){
      var len = this_tok_getLastLen();
      var c = this_tok_getLastNum();

      if (this_tok_isType(13)) {
        if (len > 2) {
          if (c === 0x74) {
            if (len === 6 && this_tok_nextExprIfString('typeof')) {
              if (hasNew) throw 'typeof is illegal right after new.' + this_tok_syntaxError();
              this_par_parsePrimaryOrPrefix(false, false, false);
              return false;
            }
          } else if (this_tok_isNum(0x66) && this_tok_isString('function')) {
              this_par_parseFunction(false);

              return this_par_parsePrimarySuffixes(false, hasNew, false);
          } else if (c === 0x6e) {
            if (this_tok_nextExprIfString('new')) {
              return this_par_parsePrimaryOrPrefix(false, true || hasNew, false);
            }
          } else if (c === 0x64) {
            if (len === 6 && this_tok_nextExprIfString('delete')) {
              if (hasNew) throw 'delete is illegal right after new.'+this_tok_syntaxError();
              this_par_parsePrimaryOrPrefix(false, false, false);
              return false;
            }
          } else if (c === 0x76) {
            if (this_tok_nextExprIfString('void')) {
              if (hasNew) throw 'void is illegal right after new.'+this_tok_syntaxError();
              this_par_parsePrimaryOrPrefix(false, false, false);
              return false;
            }
          }
        }

        return this_par_parsePrimaryCoreIdentifier(optional, hasNew, maybeLabel);
      }

      if ((c === 0x21 || c === 0x7e) && this_tok_getLastLen() === 1) {
        if (hasNew) throw '! and ~ are illegal right after new.'+this_tok_syntaxError();
        this_tok_nextExpr();
        this_par_parsePrimaryOrPrefix(false, false, false);
        return false;
      }

      if (c === 0x2d || c === 0x2b) {
        if (hasNew) throw 'illegal operator right after new.'+this_tok_syntaxError();
        if (this_tok_getLastLen() === 1) {
          this_tok_nextExpr();
          this_par_parsePrimaryOrPrefix(false, false, false);
        } else if (this_tok_getNum(1) === c) {
          this_tok_nextExpr();
          var assignable = this_par_parsePrimaryOrPrefix(false, false, false);
          if (!assignable && this_par_options.strictAssignmentCheck) throw 'The rhs of ++ or -- was not assignable.' + this_tok_syntaxError();
        }
        return false;
      }

      return this_par_parsePrimaryCoreOther(optional, hasNew, maybeLabel);
    }
  function this_par_parsePrimaryCoreIdentifier(optional, hasNew, maybeLabel){
      var identifier = this_tok_getLastValue();
      var c = this_tok_getLastNum();

      if (maybeLabel ? this_par_isReservedIdentifierSpecial() : this_par_isReservedIdentifier(true)) {
        throw 'Reserved identifier ['+identifier+'] found in expression.'+this_tok_syntaxError();
      }

      this_tok_nextPunc();

      return this_par_parsePrimarySuffixes(!this_par_isValueKeyword(c, identifier), hasNew, maybeLabel);
    }
  function this_par_parsePrimaryCoreOther(optional, hasNew, maybeLabel){
      var assignable = this_par_parsePrimaryValue(optional);
      return this_par_parsePrimarySuffixes(assignable, hasNew, maybeLabel);
    }
  function this_par_parsePrimaryValue(optional){
      var t = this_tok_lastType;
      if (t === 10 || t === 7 || t === 8) {
        this_tok_nextPunc();
        return false;
      }

      if (this_tok_nextExprIfNum(0x28)) {
        return this_par_parseGroup();
      }

      if (this_tok_nextExprIfNum(0x7b)) {
        this_par_parseObject();
        return false;
      }

      if (this_tok_nextExprIfNum(0x5b)) {
        this_par_parseArray();
        return false;
      }

      if (!optional) throw 'Unable to parse required primary value.'+this_tok_syntaxError();
      return true;
    }
  function this_par_parsePrimarySuffixes(assignable, unassignableUntilAfterCall, maybeLabel){
      var colonIsError = false;

      if (unassignableUntilAfterCall) assignable = false;      while (true) {
        var c = this_tok_getLastNum();
        if (c > 0x2e) {
          if (c !== 0x5b) break;
          this_tok_nextExpr();
          this_par_parseExpressions();          this_tok_mustBeNum(0x5d, false);          if (!unassignableUntilAfterCall) assignable = true;        } else if (c === 0x2e) {
          if (!this_tok_isType(9)) throw 'Dot/Number (?) after identifier?'+this_tok_syntaxError();          this_tok_nextPunc();
          this_tok_mustBeIdentifier(false);          if (!unassignableUntilAfterCall) assignable = true;        } else if (c === 0x28) {
          this_tok_nextExpr();
          this_par_parseOptionalExpressions();
          this_tok_mustBeNum(0x29, false);          unassignableUntilAfterCall = false;
          assignable = false;        } else {

          if ((c === 0x2b || c === 0x2d) && this_tok_getNum(1) === c) {
            if (!assignable && this_par_options.strictAssignmentCheck) throw 'Postfix increment not allowed here.' + this_tok_syntaxError();
            this_tok_nextPunc();
            assignable = false;          }

          break;
        }
        colonIsError = true;
      }
      if (colonIsError && maybeLabel && c === 0x3a) throw 'Invalid label here, I think.'+this_tok_syntaxError();
      return assignable;
    }
  function this_par_isAssignmentOperator(){
      var len = this_tok_getLastLen();
      var c = this_tok_getLastNum();

      if (len === 1) return c === 0x3d;

      if (len === 2) {
        return ((
            c === 0x2b ||
            c === 0x2d ||
            c === 0x7c ||
            c === 0x26 ||
            c === 0x2f
          ) && (this_tok_getNum(1) === 0x3d)) ||
          c === 0x2a ||
          c === 0x25 ||
          c === 0x5e;
      }

      if (c === 0x3c) return len === 3;

      if (c === 0x3e) return (len === 4 || (len === 3 && this_tok_getNum(2) === 0x3d));

      return false;
    }
  function this_par_isBinaryOperator(){
      var c = this_tok_getLastNum();
      var len = this_tok_getLastLen();

      if (c === 0x3b || c === 0x29 || c === 0x2c) return false;      if (len === 1) {
        if (c === 0x5d || c === 0x7d) return false;        return c === 0x2b || c === 0x2a || c === 0x3c || c === 0x2d || c === 0x3e || c === 0x2f || c === 0x26 || c === 0x7c || c === 0x25 || c === 0x5e;
      }
      if (len === 2) {
        return c === 0x3d || c === 0x21 || c === 0x3c || c === 0x3e || (c === 0x26 && this_tok_getNum(1) === 0x26) || (c === 0x7c && this_tok_getNum(1) === 0x7c) || this_tok_isString('in');
      }
      if (len === 3) {
        return c === 0x3d || c === 0x21 || (c === 0x3e && this_tok_getNum(2) === 0x3e)
      }
      if (len === 10) return this_tok_isString('instanceof');

      return false;
    }
  function this_par_parseGroup(){
      var groupAssignable = this_par_parseExpressions();

      this_tok_mustBeNum(0x29, false);

      return groupAssignable;
    }
  function this_par_parseArray(){
      do {
        this_par_parseExpressionOptional();      } while (this_tok_nextExprIfNum(0x2c));      this_tok_mustBeNum(0x5d, false);
    }
  function this_par_parseObject(){
      do {
        if (this_tok_isValue() && !this_tok_isType(8)) this_par_parsePair();
      } while (this_tok_nextExprIfNum(0x2c));      this_tok_mustBeNum(0x7d, false);
    }
  function this_par_parsePair(){
      if (this_tok_isNum(0x67) && this_tok_nextPuncIfString('get')) {
        if (this_tok_isType(13)) {
          if (this_par_isReservedIdentifier(false)) throw 'Getter name is reserved.'+this_tok_syntaxError();
          this_tok_nextPunc();

          this_par_parseFunctionRemainder(0, true);
        }
        else this_par_parseDataPart();
      } else if (this_tok_isNum(0x73) && this_tok_nextPuncIfString('set')) {
        if (this_tok_isType(13)) {
          if (this_par_isReservedIdentifier(false)) throw 'Getter name is reserved.'+this_tok_syntaxError();
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
  function this_par_isReservedIdentifierSpecial(){
      var value;
      var c = this_tok_getLastNum();

      if (
        c < 0x63 ||        c === 0x74 ||        this_tok_getLastLen() === 1      ) return false;

      if (c === 0x63) {        var d = this_tok_getNum(1);
        return (d === 0x6f && this_tok_getLastValue() === 'const') || (d === 0x61 && ((value=this_tok_getLastValue()) === 'catch' || value === 'case')) || (d === 0x6c && this_tok_getLastValue() === 'class')
      }

      if (c === 0x73) {        return this_tok_getNum(1) === 0x75 && this_tok_getLastValue() === 'super';
      }

      if (c === 0x64) {        return this_tok_getNum(1) === 0x65 && this_tok_getLastValue() === 'default';
      }

      if (c === 0x65) {        var d = this_tok_getNum(1);
        return (d === 0x6c && this_tok_getLastValue() === 'else') || (d === 0x6e && this_tok_getLastValue() === 'enum') || (d === 0x78 && ((value=this_tok_getLastValue()) === 'export' || value === 'extends'));
      }

      if (c === 0x66) {        return this_tok_getNum(1) === 0x69 && this_tok_getLastValue() === 'finally';
      }

      if (c === 0x69) {        var d = this_tok_getNum(1);
        return (d === 0x6e && (this_tok_getLastLen() === 2 || this_tok_getLastValue() === 'instanceof')) || (d === 0x6d && this_tok_getLastValue() === 'import');
      }

      return false;
    }
  function this_par_isReservedIdentifier(ignoreValues){
      var value;
      var c = this_tok_getLastNum();
      var len = this_tok_getLastLen();

      if (len === 1) return false;      if (c <= 0x61) return false;      if (len === 4) {        if (c === 0x74) {
          if (ignoreValues) return false;
          var value = this_tok_getLastValue();
          return (value === 'this' || value === 'true');
        }

        if (c === 0x6e) {
          return !ignoreValues && this_tok_getLastValue() === 'null';
        }

        if (c === 0x65) {
          var value = this_tok_getLastValue();
          return (value === 'else' || value === 'enum');
        }

        if (c === 0x63) {
          return this_tok_getLastValue() === 'case';
        }

        if (c < 0x76) return false;        if (c === 0x76) {
          return !ignoreValues && this_tok_getLastValue() === 'void';
        }

        if (c === 0x77) {
          return this_tok_getLastValue() === 'with';
        }

        return false;
      }

      if (len >= 7) {        if (c > 0x69) return false;        if (c === 0x63) {          return this_tok_getLastValue() === 'continue';
        }

        if (c === 0x64) {          var value = this_tok_getLastValue();
          return value === 'default' || value === 'debugger';
        }

        if (c === 0x65) {          return this_tok_getLastValue() === 'extends';
        }

        if (c === 0x66) {          var value = this_tok_getLastValue();
          return value === 'finally' || value === 'function';
        }

        if (c === 0x69) {          return this_tok_getLastValue() === 'instanceof';
        }

        return false;      }

      if (len === 2) {        if (c === 0x69) {
          var value = this_tok_getLastValue();
          return value === 'if' || value === 'in';
        }
        if (c === 0x64) return this_tok_getLastValue() === 'do';
        return false;
      }

      if (len === 5) {        if (c === 0x66) return !ignoreValues && this_tok_getLastValue() === 'false';
        if (c === 0x73) return this_tok_getLastValue() === 'super';
        if (c === 0x63) {
          var value = this_tok_getLastValue();
          return value === 'catch' || value === 'class' || value === 'const';
        }
        if (c === 0x74) return this_tok_getLastValue() === 'throw';
        if (c === 0x62) return this_tok_getLastValue() === 'break';
        if (c === 0x77) return this_tok_getLastValue() === 'while';
        return false;
      }

      if (len === 3) {        if (c === 0x6e) return !ignoreValues && this_tok_getLastValue() === 'new';
        if (c === 0x76) return this_tok_getLastValue() === 'var';
        if (c === 0x74) return this_tok_getLastValue() === 'try';
        if (c === 0x66) return this_tok_getLastValue() === 'for';
        return false;
      }

      if (c === 0x73) return this_tok_getLastValue() === 'switch';
      if (c === 0x72) return this_tok_getLastValue() === 'return';
      if (c === 0x74) return !ignoreValues && this_tok_getLastValue() === 'typeof';
      if (c === 0x69) return this_tok_getLastValue() === 'import';
      if (c === 0x65) return this_tok_getLastValue() === 'export';
      if (c === 0x64) return !ignoreValues && this_tok_getLastValue() === 'delete';
      return false;
    }
  function this_par_isValueKeyword(c, word){
      if (word.length === 4) {
        if (c === 0x74) return word === 'this' || word === 'true';
        return c === 0x6e && word === 'null';
      }
      return c === 0x66 && word.length === 5 && word === 'false';
    }
  var Par = exports.Par = function(input, options){
    this_par_options = options = options || {};

    if (!options.saveTokens) options.saveTokens = false;
    if (!options.createBlackStream) options.createBlackStream = false;
    if (!options.functionMode) options.functionMode = false;
    if (!options.regexNoClassEscape) options.regexNoClassEscape = false;
    if (!options.strictForInCheck) options.strictForInCheck = false;
    if (!options.strictAssignmentCheck) options.strictAssignmentCheck = false;

    this['tok'] = new Tok(input, this_par_options);
    if (options.nextToken) this['tok'].nextTokenIfElse_search = options.nextToken;
    this['run'] = this_par_run;  };

  Par.updateTok = function(T) {
    Tok = T;
  };

  Par.parse = function(input, options){
    var par = new Par(input, options);
    par.run();

    return par;
  };

})(typeof exports === "undefined" ? window : exports);
