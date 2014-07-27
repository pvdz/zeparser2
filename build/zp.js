(function(exports){
//######### uni.js #########

// http://qfox.nl/notes/155
// http://qfox.nl/notes/90

  var uniRegex = exports.uni = /[\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u0487\u048a-\u0524\u0526\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0621-\u065e\u0660-\u0669\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07c0-\u07f5\u07fa\u0901-\u0939\u093c-\u094d\u0950-\u0954\u0958-\u0963\u0966-\u096f\u0971\u0972\u097b-\u097f\u0981-\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7\u09c8\u09cb-\u09ce\u09d7\u09dc\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a66-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5c\u0b5d\u0b5f-\u0b63\u0b66-\u0b6f\u0b71\u0b82\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c58\u0c59\u0c60-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0cde\u0ce0-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d60-\u0d63\u0d66-\u0d6f\u0d7a-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e50-\u0e59\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc\u0edd\u0f00\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f8b\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1049\u1050-\u1099\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc\u1100-\u1159\u115f-\u11a2\u11a8-\u11f9\u1200-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u1676\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772\u1773\u1780-\u17b3\u17b6-\u17d3\u17d7\u17dc\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1820-\u1877\u1880-\u18aa\u1900-\u191c\u1920-\u192b\u1930-\u193b\u1946-\u196d\u1970-\u1974\u1980-\u19a9\u19b0-\u19c9\u19d0-\u19d9\u1a00-\u1a1b\u1b00-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1baa\u1bae-\u1bb9\u1c00-\u1c37\u1c40-\u1c49\u1c4d-\u1c7d\u1d00-\u1de6\u1dfe-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffb\u203f\u2040\u2054\u2071\u207f\u2090-\u2094\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb\u2ced\u2cf2\u2d00-\u2d25\u2d30-\u2d65\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005-\u3007\u3021-\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u3099\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31b7\u31f0-\u31ff\u3400\u4db5\u4e00\u9fc3\ua000-\ua1af\ua60c\ua620-\ua629\ua640-\ua660\ua662-\ua66d\ua66f\ua67c\ua67d\ua67f-\ua697\ua717-\ua71f\ua722-\ua788\ua78b-\ua78d\ua790\ua792\ua7a0\ua7a2\ua7a4\ua7a6\ua7a8\ua7aa\ua802\ua806\ua80b\ua823-\ua827\ua880\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua900-\ua909\ua926-\ua92d\ua947-\ua953\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\ufb00-\ufb06\ufb13-\ufb17\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff70\uff9e\uff9f]/;

//######### end of uni.js #########

//######### tok.js #########

  var this_tok_input =  '';
  var this_tok_len =  0;
  var this_tok_pos =  0;
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
  function this_tok_getMoreInput(mustHaveMore){
      var had = false;

      if (!this_tok_reachedEof) {

        do {

          had = this_tok_waitForInput();
        } while (had !== false && !had.length);

        if (had) {
          this_tok_input += had;
          this_tok_len = this_tok_input.length; // note: this might cause problems with cached lengths when freezing at the right time with the right input. TOFIX: test and solve
        }
      }

      if (had === false) {
        // if there was no more input, next time skip the freeze part
        this_tok_reachedEof = true;
        if (mustHaveMore) this_tok_throwSyntaxError('Unexpected EOF');
      }

      return had;
    }
  function this_tok_updateInput(input){
      this_tok_input += input;
      this_tok_len += input.length;
    }
  function this_tok_waitForInput(){
      // noop
      return false;
    }
  function this_tok_nextExprIfNum(num){
      var equals = this_tok_firstTokenChar === num;
      if (equals) this_tok_next(true);
      return equals;
    }
  function this_tok_nextPuncIfString(str){
      var equals = this_tok_getLastValue() === str;
      if (equals) this_tok_next(false);
      return equals;
    }
  function this_tok_nextExprIfString(str){
      var equals = this_tok_getLastValue() === str;
      if (equals) this_tok_next(true);
      return equals;
    }
  function this_tok_mustBeNum(num, nextIsExpr){
      if (this_tok_firstTokenChar === num) return this_tok_next(nextIsExpr);
      this_tok_throwSyntaxError('Expected char=' + String.fromCharCode(num) + ' ('+num+') got=' + String.fromCharCode(this_tok_firstTokenChar)+' ('+this_tok_firstTokenChar+')');
    }
  function this_tok_mustBeIdentifier(nextIsExpr){
      if (this_tok_lastType === 13) return this_tok_next(nextIsExpr);
      this_tok_throwSyntaxError('Expecting current type to be IDENTIFIER but is '+typeToString[this_tok_lastType]+' ('+this_tok_lastType+')');
    }
  function this_tok_mustBeString(str, nextIsExpr){
      if (this_tok_getLastValue() === str) return this_tok_next(nextIsExpr);
      this_tok_throwSyntaxError('Expecting current value to be ['+str+'] is ['+this_tok_getLastValue()+']');
    }
  function this_tok_next(expressionStart){
      this_tok_lastNewline = false;

      var options = this_tok_options;
      var saveTokens = options.saveTokens;
      var onToken = options.onToken;
      var tokens = this_tok_tokens;

      do {

        var type = this_tok_nextAnyToken(expressionStart);
        if (saveTokens) {
          var token = {type:type, value:this_tok_getLastValue(), start:this_tok_lastOffset, stop:this_tok_pos, white:this_tok_tokenCountAll};
          tokens.push(token);
        }
        if (onToken) {
          onToken(type, this_tok_getLastValue(), this_tok_lastOffset, this_tok_pos, this_tok_tokenCountAll);
        }
        ++this_tok_tokenCountAll;
      } while (type === 18);

      if (saveTokens) {
        token.black = this_tok_tokenCountBlack++;
        if (options.createBlackStream) {
          this_tok_black.push(token);
        }
      }

      this_tok_lastType = type;
      return type;
    }
  function this_tok_nextWhiteAfterNumber(){
      var count = this_tok_tokenCountAll;
      var type = this_tok_next(false);
      if ((type === 13 || type === 7) && this_tok_tokenCountAll === count+1) {
        this_tok_throwSyntaxError('Must be at least one whitespace token between numbers and identifiers or other numbers');
      }
      return type;
    }
  function this_tok_nextAnyToken(expressionStart){
      // note: this is one of the most called functions of zeparser...

      // note: the offset might change in the newline+space optim trick, so dont re-use it
      var fullStart = this_tok_lastOffset = this_tok_pos;

      if (fullStart >= this_tok_len && !this_tok_getMoreInput(false)) {
        this_tok_firstTokenChar = 0;
        return 14;
      }
      var nextChar = this_tok_firstTokenChar = this_tok_input.charCodeAt(fullStart) | 0;

      var type = this_tok_nextTokenDeterminator(nextChar, expressionStart);
      this_tok_lastLen = (this_tok_lastStop = this_tok_pos) - this_tok_lastOffset;

      return type;
    }
  function this_tok_nextTokenDeterminator(c, expressionStart) {
      if (c < 0x31) return this_tok_nextTokenDeterminator_a(c, expressionStart);

      var b = c & 0xffdf; // clear 0x20. note that input string must be in range of utf-16, so 0xffdf will suffice.
      if (b >= 0x41 && b <= 0x5a) return this_tok_parseIdentifier();

      if (c > 0x39) return this_tok_nextTokenDeterminator_b(c);
      return this_tok_parseDecimalNumber();
    }
  function this_tok_nextTokenDeterminator_a(c, expressionStart) {
      switch (c) {
        case 0x20: // note: many spaces are caught by immediate newline checks (see parseCR and parseVerifiedNewline)
          return ++this_tok_pos,(18);
        case 0x2e:
          return this_tok_parseLeadingDot();
        case 0x28:
          return ++this_tok_pos,(9);
        case 0x29:
          return ++this_tok_pos,(9);
        case 0x0D:
          return this_tok_parseCR();
        case 0x0A:
          return this_tok_parseVerifiedNewline(this_tok_pos, 0);
        case 0x2c:
          return ++this_tok_pos,(9);
        case 0x09:
          return ++this_tok_pos,(18);
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
          return ++this_tok_pos,(18);
        case 0x0B:
          return ++this_tok_pos,(18);
        default:
          // cannot be unicode because it's < ORD_L_A and ORD_L_A_UC
          this_tok_throwSyntaxError('Unexpected character in token scanner... fixme! [' + c + ']');
      }
    }
  function this_tok_nextTokenDeterminator_b(c) {
      switch (c) {
        case 0x3b:
          return ++this_tok_pos,(9);
        case 0x3d:
          return this_tok_parseEqualSigns();
        case 0x7b:
          return ++this_tok_pos,(9);
        case 0x7d:
          return ++this_tok_pos,(9);
        case 0x5b:
          return ++this_tok_pos,(9);
        case 0x5d:
          return ++this_tok_pos,(9);
        case 0x3a:
          return ++this_tok_pos,(9);
        case 0x5f:
          return this_tok_parseIdentifier();
        case 0x7c:
          return this_tok_parseSameOrCompound(c);
        case 0x3f:
          return ++this_tok_pos,(9);
        case 0x3c:
          return this_tok_parseLtgtPunctuator(c);
        case 0x3e:
          return this_tok_parseLtgtPunctuator(c);
        case 0x5e:
          return this_tok_parseCompoundAssignment();
        case 0x7e:
          return this_tok_parseCompoundAssignment();
        case 0x2028:
          return this_tok_parseVerifiedNewline(this_tok_pos, 0);
        case 0x2029:
          return this_tok_parseVerifiedNewline(this_tok_pos, 0);
        case 0x5c:
          return this_tok_parseBackslash();
        default:
          return this_tok_parseOtherUnicode(c);
      }
    }
  function this_tok_parseOtherUnicode(c){
      if (this_tok_isExoticWhitespace(c)) return ++this_tok_pos,(18);
      if (uniRegex.test(String.fromCharCode(c))) return this_tok_parseIdentifier();

      this_tok_throwSyntaxError('Unexpected character in token scanner... fixme! [' + c + ']');
    }
  function this_tok_isExoticWhitespace(c){
      // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp
      // http://en.wikipedia.org/wiki/Whitespace_character
      // note that this is nearly the last line of defense and virtually never executed.
      switch (c) {
        case 0xA0:
        case 0xFEFF:
        case 0x0085: // NEL
        case 0x1680:
        case 0x180e: // not uni whitespace but accepted, regardless
        case 0x2000:
        case 0x2001:
        case 0x2002:
        case 0x2003:
        case 0x2004:
        case 0x2005:
        case 0x2006:
        case 0x2007:
        case 0x2008:
        case 0x2009:
        case 0x200a:
//        case ORD_ZWS: // not accepted AFAICS
        case 0x202f:
        case 0x205f:
        case 0x3000:
          return true;
      }
      return false;
    }
  function this_tok_parseBackslash(){
      // this is currently causing the top test to fail
      this_tok_parseAndValidateUnicodeAsIdentifier(this_tok_pos, true); // TOFIX: replace bool with constant, figure out why dropping input here only doesnt affect tests (missing test)
      this_tok_pos += 6;

      // parseIdentifierRest assumes the first char still needs to be consumed, if we dont rewind the next char is consumed unchecked
      --this_tok_pos;

      this_tok_pos = this_tok_parseIdentifierRest();
      return 13;
    }
  function this_tok_parseFwdSlash(expressionStart){
      if (this_tok_pos+1 >= this_tok_len) this_tok_getMoreInput(false);
      var d = this_tok_input.charCodeAt(this_tok_pos+1);
      if (d === 0x2f) return this_tok_parseSingleComment();
      if (d === 0x2a) return this_tok_parseMultiComment();
      if (expressionStart) return this_tok_parseRegex();
      return this_tok_parseDivPunctuator(d);
    }
  function this_tok_parseCR(){
      // next char confirmed to be CR. check the next char for LF to
      // consume it for the CRLF case. this is completely optional.

      var pos = this_tok_pos;
      if (pos+1 >= this_tok_len) this_tok_getMoreInput(false);
      var crlf = (pos+1 < this_tok_len && this_tok_input.charCodeAt(pos+1)) === 0x0A ? 1 : 0;

      return this_tok_parseVerifiedNewline(pos + crlf, crlf);
    }
  function this_tok_parseVerifiedNewline(pos, extraForCrlf){
      // mark for ASI
      this_tok_lastNewline = true;

      var input = this_tok_input; // normally we dont cache input, but its okay here since we dont ask for more input anywhere
      var tokens = this_tok_tokens;
      var saveTokens = this_tok_options.saveTokens;
      var onToken = this_tok_options.onToken;
      var count = this_tok_tokenCountAll;

      // in JS source it's common to find spaces or tabs after newlines
      // due to indentation. we optimize here by eliminating the scanner
      // overhead by directly checking for spaces and tabs first.
      // note: first loop consumes the verified newline.

      // only check for EOF, get new input elsewhere, no need to stream here

      while (++pos < this_tok_len) {

        var c = input.charCodeAt(pos);

        if (c !== 0x20 && c !== 0x09) break;

        if (saveTokens) {
          // we just checked another token, stash the _previous_ one.
          var s = pos-(1+extraForCrlf);
          var v = input.slice(s, pos);
          tokens.push({type:18, value:v, start:s, stop:pos, white:count});
        }
        if (onToken) {
          var s = pos-(1+extraForCrlf);
          var v = input.slice(s, pos);
          onToken(18, v, s, pos, count);
        }

        extraForCrlf = 0; // only first iteration char is newline
        ++count;
      }

      this_tok_tokenCountAll = count;
      this_tok_lastOffset = pos-(1+extraForCrlf);
      this_tok_pos = pos;

      return 18;
    }
  function this_tok_parseSameOrCompound(c){
      // |&-+

      var pos = this_tok_pos+1;
      if (pos >= this_tok_len) this_tok_getMoreInput(false);
      var d = this_tok_input.charCodeAt(pos);
      // pick one, any one :) (this func runs too infrequent to make a significant difference)
//      this.pos += (d === c || d === ORD_IS_3D) ? 2 : 1;
//      this.pos += 1 + (!(d - c && d - ORD_IS_3D) |0);
//      this.pos += (d === c || d === ORD_IS_3D) ? 2 : 1;
//      this.pos += 1 + ((!(c-d))|0) + ((!(d-ORD_IS_3D))|0);
//      this.pos += 1 + (d === c | d === ORD_IS_3D);
//      this.pos += 1 + !(d-c && d-ORD_IS_3D);

      this_tok_pos = pos + ((d === c || d === 0x3d) ? 1 : 0);

      return 9;
    }
  function this_tok_parseEqualSigns(){
      var len = 1;
      var offset = this_tok_lastOffset;
      if (offset+1 >= this_tok_len) this_tok_getMoreInput(false);
      if (this_tok_input.charCodeAt(offset+1) === 0x3d) {
        if (offset+2 >= this_tok_len) this_tok_getMoreInput(false);
        if (this_tok_input.charCodeAt(offset+2) === 0x3d) len = 3;
        else len = 2;
      }
      this_tok_pos += len;
      return 9;
    }
  function this_tok_parseLtgtPunctuator(c){
      var len = 1;
      var offset = this_tok_lastOffset;
      if (offset+1 >= this_tok_len) this_tok_getMoreInput(false);
      var d = this_tok_input.charCodeAt(offset+1);
      if (d === 0x3d) len = 2;
      else if (d === c) {
        len = 2;
        if (offset+2 >= this_tok_len) this_tok_getMoreInput(false);
        var e = this_tok_input.charCodeAt(offset+2);
        if (e === 0x3d) len = 3;
        else if (e === c && c !== 0x3c) {
          len = 3;
          if (offset+3 >= this_tok_len) this_tok_getMoreInput(false);
          if (this_tok_input.charCodeAt(offset+3) === 0x3d) len = 4;
        }
      }
      this_tok_pos += len;
      return 9;
    }
  function this_tok_parseCompoundAssignment(){
      var len = 1;
      if (this_tok_pos+1 >= this_tok_len) this_tok_getMoreInput(false);
      if (this_tok_input.charCodeAt(this_tok_pos+1) === 0x3d) len = 2;
      this_tok_pos += len;
      return 9;
    }
  function this_tok_parseDivPunctuator(d){
      // cant really be a //, /* or regex because they should have been checked before calling this function
      // could rewrite this to OR magic and eliminate a branch
      if (d === 0x3d) this_tok_pos += 2;
      else ++this_tok_pos;
      return 9;
    }
  function this_tok_parseSingleComment(){
      var pos = this_tok_pos + 1;

      // note: although we _know_ a newline will happen next; explicitly checking for it is slower than not.

      do {

        if (++pos >= this_tok_len && !this_tok_getMoreInput(false)) break;
        var c = this_tok_input.charCodeAt(pos);
        if (!c || c === 0x0D || c === 0x0A || (c ^ 0x2028) <= 1) break; // c !== ORD_PS && c !== ORD_LS
      } while (true);

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
    }
  function this_tok_parseMultiComment(){
      var pos = this_tok_pos + 2;

      var noNewline = true;
      var c = 0;
      if (pos >= this_tok_len) this_tok_getMoreInput(false);
      var d = this_tok_input.charCodeAt(pos);

      while (d) {

        c = d;
        if (++pos >= this_tok_len) this_tok_getMoreInput(false);
        d = this_tok_input.charCodeAt(pos);

        if (c === 0x2a && d === 0x2f) {
          this_tok_pos = pos+1;
          // yes I hate the double negation, but it saves doing ! above
          if (!noNewline) this_tok_lastNewline = true;

          return 18;
        }
        if (noNewline) noNewline = !(c === 0x0D || c === 0x0A || (c ^ 0x2028) <= 1); // c === ORD_PS || c === ORD_LS
      }

      this_tok_throwSyntaxError('Unterminated multi line comment found');
    }
  function this_tok_parseSingleString(){
      return this_tok_parseString(0x27);
    }
  function this_tok_parseDoubleString(){
      return this_tok_parseString(0x22);
    }
  function this_tok_parseString(targetChar){
      var pos = this_tok_pos + 1;

      do {

        if (pos >= this_tok_len) this_tok_getMoreInput(false);
        var c = this_tok_input.charCodeAt(pos++);

        if (c === targetChar) {
          this_tok_pos = pos;
          return 10;
        }

        // &8: all newlines and backslash have their 4th bit set (prevents additional checks for 63%)
        if ((c & 8) === 8) {
          if (c === 0x5c) pos = this_tok_parseStringEscape(pos);
            // c&83<3: it's a filter :) all newlines have their 5th bit set and 7th bit unset.
            // none of them have first AND second bit set. this filters about 95%
            // ftr: c&80 filters 84%, c&3<3 filters 75%. together they filter 95% :)
          else if ((c & 83) < 3 && (c === 0x0A || c === 0x0D || c === 0x2028 || c === 0x2029)) {
            this_tok_throwSyntaxError('No newlines in strings!');
          }
        }
      } while (c);

      this_tok_throwSyntaxError('Unterminated string found');
    }
  function this_tok_parseStringEscape(pos){
      if (pos >= this_tok_len) this_tok_getMoreInput(false);
      var c = this_tok_input.charCodeAt(pos);

      // unicode escapes
      if (c === 0x75) {
        if (this_tok_parseUnicodeEscapeBody(pos+1)) pos += 4;
        else this_tok_throwSyntaxError('Invalid unicode escape');
      // line continuation; skip windows newlines as if they're one char
      } else if (c === 0x0D) {
        // keep in mind, we are already skipping a char. no need to check
        // for other line terminators here. we are merely checking to see
        // whether we need to skip an additional character for CRLF.
        if (pos+1 >= this_tok_len) this_tok_getMoreInput(false);
        if (this_tok_input.charCodeAt(pos+1) === 0x0A) ++pos;
      // hex escapes
      } else if (c === 0x78) {
        if (pos+1 >= this_tok_len) this_tok_getMoreInput(false);
        if (pos+2 >= this_tok_len) this_tok_getMoreInput(false);
        if (this_tok_parseHexDigit(this_tok_input.charCodeAt(pos+1)) && this_tok_parseHexDigit(this_tok_input.charCodeAt(pos+2))) pos += 2;
        else this_tok_throwSyntaxError('Invalid hex escape');
      }
      return pos+1;
    }
  function this_tok_parseUnicodeEscapeBody(pos){
      if (pos >= this_tok_len) this_tok_getMoreInput(false);
      if (pos+1 >= this_tok_len) this_tok_getMoreInput(false);
      if (pos+2 >= this_tok_len) this_tok_getMoreInput(false);
      if (pos+3 >= this_tok_len) this_tok_getMoreInput(false);
      var input = this_tok_input; // cache input now, it wont change any further
      return this_tok_parseHexDigit(input.charCodeAt(pos)) && this_tok_parseHexDigit(input.charCodeAt(pos+1)) && this_tok_parseHexDigit(input.charCodeAt(pos+2)) && this_tok_parseHexDigit(input.charCodeAt(pos+3));
    }
  function this_tok_parseHexDigit(c){
      // 0-9, a-f, A-F
      return ((c <= 0x39 && c >= 0x30) || (c >= 0x61 && c <= 0x66) || (c >= 0x41 && c <= 0x46));
    }
  function this_tok_parseLeadingDot(){
      if (this_tok_pos+1 >= this_tok_len) this_tok_getMoreInput(false);
      var c = this_tok_input.charCodeAt(this_tok_pos+1);

      if (c >= 0x30 && c <= 0x39) return this_tok_parseAfterDot(this_tok_pos+2);

      ++this_tok_pos;
      return 9;
    }
  function this_tok_parseLeadingZero(){
      // a numeric that starts with zero is is either a decimal or hex
      // 0.1234  0.  0e12 0e-12 0e12+ 0.e12 0.1e23 0xdeadbeeb

      // trailing zero at eof can be valid, but must be checked for additional input first
      if (this_tok_pos+1 >= this_tok_len && !this_tok_getMoreInput(false)) {
        ++this_tok_pos;
        return 7;
      }

      var d = this_tok_input.charCodeAt(this_tok_pos+1);
      if (d === 0x78 || d === 0x58) { // x or X
        this_tok_parseHexNumber();
      } else if (d === 0x2e) {
        this_tok_parseAfterDot(this_tok_pos+2);
      } else if (d <= 0x39 && d >= 0x30) {
        this_tok_throwSyntaxError('Invalid octal literal');
      } else {
        this_tok_pos = this_tok_parseExponent(d, this_tok_pos+1);
      }

      return 7;
    }
  function this_tok_parseHexNumber(){
      var pos = this_tok_pos + 1;

      // (could use OR, eliminate casing branch)

      do {

        if (++pos >= this_tok_len && !this_tok_getMoreInput(false)) break;
        var c = this_tok_input.charCodeAt(pos);
      } while ((c <= 0x39 && c >= 0x30) || (c >= 0x61 && c <= 0x66) || (c >= 0x41 && c <= 0x46));

      this_tok_pos = pos;
      return 7;
    }
  function this_tok_parseDecimalNumber(){
      // just encountered a 1-9 as the start of a token...

      var pos = this_tok_pos;

      do {

        if (++pos >= this_tok_len && !this_tok_getMoreInput(false)) break;
        var c = this_tok_input.charCodeAt(pos);
      } while (c >= 0x30 && c <= 0x39);

      if (c === 0x2e) return this_tok_parseAfterDot(pos+1);

      this_tok_pos = this_tok_parseExponent(c, pos);
      return 7;
    }
  function this_tok_parseAfterDot(pos){
      if (pos < this_tok_len || this_tok_getMoreInput(false)) {

        do { var c = this_tok_input.charCodeAt(pos);

        } while (c >= 0x30 && c <= 0x39 && (++pos < this_tok_len || this_tok_getMoreInput(false)));
      }

      pos = this_tok_parseExponent(c, pos);

      this_tok_pos = pos;

      return 7;
    }
  function this_tok_parseExponent(c, pos){
      if (c === 0x65 || c === 0x45) {
        if (++pos >= this_tok_len) this_tok_getMoreInput(false);
        c = this_tok_input.charCodeAt(pos);
        // sign is optional (especially for plus)
        if (c === 0x2d || c === 0x2b) {
          if (++pos >= this_tok_len) this_tok_getMoreInput(false); // must have at least one char after +-
          c = this_tok_input.charCodeAt(pos);
        }

        // first digit is mandatory
        if (c >= 0x30 && c <= 0x39) {
          if (++pos >= this_tok_len && !this_tok_getMoreInput(false)) return pos;
          c = this_tok_input.charCodeAt(pos);
        }
        else this_tok_throwSyntaxError('Missing required digits after exponent');

        // rest is optional

        while (c >= 0x30 && c <= 0x39) {

          if (++pos >= this_tok_len && !this_tok_getMoreInput(false)) return pos;
          c = this_tok_input.charCodeAt(pos);
        }
      }
      return pos;
    }
  function this_tok_parseRegex(){
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
      this_tok_regexFlags();

      return 8;
    }
  function this_tok_regexBody(){
      // TOFIX: should try to have the regex parser only use pos, not this.pos

      while (true) {

        if (this_tok_pos >= this_tok_len && !this_tok_getMoreInput(false)) this_tok_throwSyntaxError('Unterminated regular expression at eof');
        var c = this_tok_input.charCodeAt(this_tok_pos++);

        if (c === 0x5c) { // backslash
          if (this_tok_pos >= this_tok_len && !this_tok_getMoreInput(false)) this_tok_throwSyntaxError('Unterminated regular expression escape at eof');
          var d = this_tok_input.charCodeAt(this_tok_pos++);
          if (d === 0x0A || d === 0x0D || (d ^ 0x2028) <= 1 /*d === ORD_PS || d === ORD_LS*/) {
            this_tok_throwSyntaxError('Newline can not be escaped in regular expression');
          }
        }
        else if (c === 0x2f) return;
        else if (c === 0x5b) this_tok_regexClass();
        else if (c === 0x0A || c === 0x0D || (c ^ 0x2028) <= 1 /*c === ORD_PS || c === ORD_LS*/) {
          this_tok_throwSyntaxError('Newline can not be escaped in regular expression ['+c+']');
        }
      }
    }
  function this_tok_regexClass(){
      var pos = this_tok_pos;

      while (true) {

        if (pos >= this_tok_len && !this_tok_getMoreInput(false)) {
          this_tok_throwSyntaxError('Unterminated regular expression');
        }

        var c = this_tok_input.charCodeAt(pos++);

        if (c === 0x5d) {
          this_tok_pos = pos;
          return;
        }

        if (c === 0x5c) {
          // there's a historical dispute over whether backslashes in regex classes
          // add a slash or its next char. ES5 settled it to "it's an escape".
          if (this_tok_options.regexNoClassEscape) {
            if (pos >= this_tok_len) this_tok_getMoreInput(false);
            var d = this_tok_input.charCodeAt(pos++);
            if (d === 0x0A || d === 0x0D || (d ^ 0x2028) <= 1 /*d === ORD_PS || d === ORD_LS*/) {
              this_tok_throwSyntaxError('Newline can not be escaped in regular expression');
            }
          }
        } else if (c === 0x0A || c === 0x0D || (c ^ 0x2028) <= 1) { // c === ORD_PS || c === ORD_LS
          this_tok_throwSyntaxError('Illegal newline in regex char class');
        }
      }
    }
  function this_tok_regexFlags(){
      // http://es5.github.io/#x15.10.4.1
      // "If F contains any character other than "g", "i", or "m", or if it contains the same character more than once, then throw a SyntaxError exception."
      // flags may be unicode escaped

      if (this_tok_options.skipRegexFlagCheck) {
        --this_tok_pos; // parseIdentifierRest assumes the current char can be consumed, but that's not the case here, so we compensate
        this_tok_pos = this_tok_parseIdentifierRest();
        return;
      }

      // okay, we have to actually verify the flags now

      var pos = this_tok_pos;

      var g = false;
      var m = false;
      var i = false;

      if (pos < this_tok_len || this_tok_getMoreInput(false)) {
        var c = this_tok_input.charCodeAt(pos);

        while (true) {

          var backslash = false;

          // check backslash first so we can replace c with the canonical value of the escape
          if (c === 0x5c) {
            // only valid here is `\u006` followed by a 7=g 9=i or d=m
            backslash = true;
            c = this_tok_regexFlagUniEscape(pos + 1);
          }

          if (c === 0x67) {
            if (g) throw 'Illegal duplicate regex flag';
            g = true;
          } else if (c === 0x69) {
            if (i) throw 'Illegal duplicate regex flag';
            i = true;
          } else if (c === 0x6D) {
            if (m) throw 'Illegal duplicate regex flag';
            m = true;
          } else {
            break;
          }

          if (backslash) pos += 5;
          if (++pos >= this_tok_len && !this_tok_getMoreInput(false)) break;
          c = this_tok_input.charCodeAt(pos);
        }
      }
      this_tok_pos = pos;
    }
  function this_tok_regexFlagUniEscape(pos){
      if (pos >= this_tok_len) this_tok_getMoreInput(false);
      if (pos+1 >= this_tok_len) this_tok_getMoreInput(false);
      if (pos+2 >= this_tok_len) this_tok_getMoreInput(false);
      if (pos+3 >= this_tok_len) this_tok_getMoreInput(false);
      var input = this_tok_input; // safe to cache for the next line (only)
      if (input.charCodeAt(pos) !== 0x75 || input.charCodeAt(pos+1) !== 0x30 || input.charCodeAt(pos+2) !== 0x30 || input.charCodeAt(pos+3) !== 0x36) {
        return 0;
      }

      if (pos+4 >= this_tok_len) this_tok_getMoreInput(false);
      var c = this_tok_input.charCodeAt(pos+4);
      if (c === 0x37) {
        return 0x67;
      }
      if (c === 0x39) {
        return 0x69;
      }
      if (c === 0x64) {
        return 0x6D;
      }

      return 0;
    }
  function this_tok_parseIdentifier(){
      this_tok_pos = this_tok_parseIdentifierRest();
      return 13;
    }
  function this_tok_parseIdentifierRest(){
      // also used by regex flag parser!

      var pos = this_tok_pos + 1;

      // note: statements in this loop are the second most executed statements

      while (true) {

        // sequential lower case letters are very common, 5:2
        // combining lower and upper case letters here to reduce branching later https://twitter.com/mraleph/status/467277652110614528
        if (pos >= this_tok_len && !this_tok_getMoreInput(false)) break;
        var c = this_tok_input.charCodeAt(pos);
        var b = c & 0xffdf;

        while (b >= 0x41 && b <= 0x5a) {

          if (++pos >= this_tok_len && !this_tok_getMoreInput(false)) break;
          c = this_tok_input.charCodeAt(pos);
          b = c & 0xffdf;
        }

        var delta = this_tok_parseOtherIdentifierParts(c, pos);
        if (!delta) break;
        pos += delta;
      }

      return pos;
    }
  function this_tok_parseOtherIdentifierParts(c, pos){
      // dont use ?: here; for build
      if (c >= 0x30) { if (c <= 0x39 || c === 0x5f) return 1; }
      else if (c === 0x24) return 1;

      // \uxxxx
      if (c === 0x5c) {
        // TOFIX: seems the atStart flag is ignored. make a test. (input is always passed on but was removed at the finger print of func)
        this_tok_parseAndValidateUnicodeAsIdentifier(pos, false);
        return 6;
      }

      if (c > 127) {
        if (uniRegex.test(String.fromCharCode(c))) {
          return 1;
        }
        // dont throw; could be PS/LS...
      }

      return 0;
    }
  function this_tok_parseAndValidateUnicodeAsIdentifier(pos, atStart){
      if (pos+1 >= this_tok_len) this_tok_getMoreInput(false);
      if (this_tok_input.charCodeAt(pos + 1) === 0x75 && this_tok_parseUnicodeEscapeBody(pos + 2)) {

        // parseUnicodeEscapeBody will ensure enough input for this slice
        var u = parseInt(this_tok_input.slice(pos+2, pos+6), 16);
        var b = u & 0xffdf;
        if (b >= 0x41 && b <= 0x5a) {
          return true;
        }
        if (u >= 0x30 && u <= 0x39) {
          if (atStart) this_tok_throwSyntaxError('Digit not allowed at start of identifier, not even escaped');
          return true;
        }
        if (u === 0x5f || u === 0x24) {
          return true;
        }
        if (uniRegex.test(String.fromCharCode(u))) {
          return true;
        }

        this_tok_throwSyntaxError('Encountered \\u escape ('+u+') but the char is not a valid identifier part');
      }

      this_tok_pos = pos;
      this_tok_throwSyntaxError('Unexpected backslash inside identifier');
    }
  function this_tok_getLastValue(){
//      return this.input.substring(this.lastOffset, this.lastStop);
//      return this.input.slice(this.lastOffset, this.lastStop);
      return this_tok_input.substr(this_tok_lastOffset, this_tok_lastLen);

      // this seems slightly slower
//      var val = this.lastValue;
//      if (!val) {
//        val = this.lastValue = this.input.substring(this.lastOffset, this.lastStop);
//      }
//      return val;
    }
  function this_tok_getNum(offset){

      return this_tok_input.charCodeAt(this_tok_lastOffset+offset);
    }
  function this_tok_throwSyntaxError(message){
      if (this_tok_options.neverThrow) {
        if (this_tok_options.onToken) this_tok_options.onToken.call(null, 16);
        if (this_tok_options.saveTokens) this_tok_tokens.push({type:16}); // TOFIX improve
        return; // TOFIX: do we consume? either we do and we risk consuming tokens for no reason or we dont and we risk infinite loops.
      }
      var pos = (this_tok_lastStop === this_tok_pos) ? this_tok_lastOffset : this_tok_pos;
      var inp = this_tok_input;
      throw message+'. A syntax error at pos='+pos+' Search for #|#: `'+inp.substring(pos-2000, pos)+'#|#'+inp.substring(pos, pos+2000)+'`';
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

    this_tok_input = (input||'');
    this_tok_len = this_tok_input.length;

    // v8 "appreciates" it when all instance properties are set explicitly
    this_tok_pos = 0;
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

      // prepare
      this_tok_next(true);
      // go!
      this_par_parseStatements(false, '', false, '');

      if (this_tok_pos !== this_tok_len || this_tok_lastType !== 14) this_tok_throwSyntaxError('Did not complete parsing..');

      return {
        par: this,
        tok: this_par_tok,
        options: this_par_options,
        whites: this_tok_tokens,
        blacks: this_tok_black,
        tokenCountWhite: this_tok_tokenCountAll,
        tokenCountBlack: this_tok_tokenCountBlack,
      };
    }
  function this_par_parseStatements(inFunction, inLoop, inSwitch, labelSet){

      // note: statements are optional, this function might not parse anything
      while (this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, true, ''))

        ;
    }
  function this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, optional, freshLabels){
      if (this_tok_lastType === 13) {
        this_par_parseIdentifierStatement(inFunction, inLoop, inSwitch, labelSet, freshLabels);
        return true;
      }
      // can be false for close curly and eof
      return this_par_parseNonIdentifierStatement(inFunction, inLoop, inSwitch, labelSet, optional);
    }
  function this_par_parseNonIdentifierStatement(inFunction, inLoop, inSwitch, labelSet, optional) {

      var c = this_tok_firstTokenChar;

      if (c === 0x7d) { // 65.6%
        if (!optional) this_tok_throwSyntaxError('Expected more input..'); // {if(x)}
        return false;
      }

      if (c === 0x7b) { // 33.2%
        this_tok_next(true);
        this_par_parseBlock(true, inFunction, inLoop, inSwitch, labelSet);
        return true;
      }

      return this_par_parseNonIdentifierStatementNonCurly(c, optional);
    }
  function this_par_parseNonIdentifierStatementNonCurly(c, optional){

      // relative to this function: punc=96%, string=4%, number=1%, rest 0%

      if (c === 0x28) { // 56%
        this_par_parseExpressionStatement();
        return true;
      }

      if (c === 0x3b) { // 26% empty statement
        // this shouldnt occur very often, but they still do.
        this_tok_next(true);
        return true;
      }

      if (c === 0x2b || c === 0x2d) { // 5% 3%
        if (this_tok_getNum(1) === c || this_tok_lastLen === 1) {
          this_par_parseExpressionStatement();
          return true;
        }
        this_tok_throwSyntaxError('Statement cannot start with binary op');
      }

      var type = this_tok_lastType;

      // rare
      if (type === 10 || c === 0x5b) { // 4% 2%
        this_par_parseExpressionStatement();
        return true;
      }

      // almost never
      if (c === 0x21) { // 2%
        if (this_tok_lastLen === 1) {
          this_par_parseExpressionStatement();
          return true;
        }
        this_tok_throwSyntaxError('Statement cannot start with binary op');
      }

      // now you're just running tests
      if (type === 7 || c === 0x7e || type === 8) { // 1% 0% 0%
        this_par_parseExpressionStatement();
        return true;
      }

      // note: need this check because EOF is always valid at the end of the
      // program and, I think, will always trigger once, of course.
      if (!optional) this_tok_throwSyntaxError('Expected more input..');

      // EOF (I dont think there's any other valid reason?)
      return false;
    }
  function this_par_parseIdentifierStatement(inFunction, inLoop, inSwitch, labelSet, freshLabels){

      // The current token is an identifier. Either its value will be
      // checked in this function (parseIdentifierStatement) or in the
      // parseExpressionOrLabel function. So we can just get it now.
      var value = this_tok_getLastValue();

      var len = this_tok_lastLen;

      // yes, this check makes a *huge* difference
      if (len >= 2) {
        // bcdfirstvw, not in that order.
        var c = this_tok_firstTokenChar;

        if (c === 0x74) {
          if (len !== 4) { // often `this`, only 7% (abs) passes here
            if (value === 'try') return this_par_parseTry(inFunction, inLoop, inSwitch, labelSet);
            if (value === 'throw') return this_par_parseThrow();
          }
        }
        else if (c === 0x69) {
          if (value === 'if') return this_par_parseIf(inFunction, inLoop, inSwitch, labelSet);
        }
        else if (c === 0x76) {
          if (value === 'var') return this_par_parseVar();
        }
        else if (c === 0x72) {
          if (value === 'return') return this_par_parseReturn(inFunction);
        }
        else if (c === 0x66) {
          if (value === 'for') return this_par_parseFor(inFunction, inSwitch, labelSet, inLoop+freshLabels);
          if (value === 'function') return this_par_parseFunction(true);
        }
        else if (c === 0x63) {
          if (value === 'case') return this_par_parseCase(inSwitch);
          if (value === 'continue') return this_par_parseContinue(inLoop, labelSet);
        }
        else if (c === 0x62) {
          if (value === 'break') return this_par_parseBreak(inLoop, inSwitch, labelSet);
        }
        else if (c === 0x64) {
          if (value === 'default') return this_par_parseDefault(inSwitch);
          if (value === 'do') return this_par_parseDo(inFunction, inSwitch, labelSet, inLoop+freshLabels);
          if (value === 'debugger') return this_par_parseDebugger();
        }
        else if (c === 0x73) {
          if (value === 'switch') return this_par_parseSwitch(inFunction, inLoop, labelSet);
        }
        else if (c === 0x77) {
          if (value === 'while') return this_par_parseWhile(inFunction, inSwitch, labelSet, inLoop+freshLabels);
          if (value === 'with') return this_par_parseWith(inFunction, inLoop, inSwitch, labelSet);
        }
      }

      // this function _must_ parse _something_, if we parsed nothing, it's an expression statement or labeled statement
      this_par_parseExpressionOrLabel(value, inFunction, inLoop, inSwitch, labelSet, freshLabels);
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

      this_tok_next(false);

      do {

        if (this_par_isReservedIdentifier(false)) this_tok_throwSyntaxError('Var name is reserved');
        this_tok_mustBeIdentifier(true);
        if (this_tok_firstTokenChar === 0x3d && this_tok_lastLen === 1) {
          this_tok_next(true);
          this_par_parseExpression();
        }
      } while(this_tok_nextExprIfNum(0x2c));
      this_par_parseSemi();
    }
  function this_par_parseVarPartNoIn(){

      var vars = 0;

      do {

        if (this_par_isReservedIdentifier(false)) this_tok_throwSyntaxError('Var name ['+this_tok_getLastValue()+'] is reserved');
        this_tok_mustBeIdentifier(true);
        ++vars;

        if (this_tok_firstTokenChar === 0x3d && this_tok_lastLen === 1) {
          this_tok_next(true);
          this_par_parseExpressionNoIn();
        }

      } while(this_tok_nextExprIfNum(0x2c));

      return vars === 1;
    }
  function this_par_parseIf(inFunction, inLoop, inSwitch, labelSet){
      // if (<exprs>) <stmt>
      // if (<exprs>) <stmt> else <stmt>

      this_tok_next(false);
      this_par_parseStatementHeader();
      this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, false, '');

      if (this_tok_getLastValue() === 'else') {
        this_tok_next(true);
        this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, false, '');
      }
    }
  function this_par_parseDo(inFunction, inSwitch, labelSet, inLoop){
      // do <stmt> while ( <exprs> ) ;

      this_tok_next(true); // do
      this_par_parseStatement(inFunction, inLoop || ' ', inSwitch, labelSet, false, '');
      this_tok_mustBeString('while', false);
      this_tok_mustBeNum(0x28, true);
      this_par_parseExpressions();
      this_tok_mustBeNum(0x29, true);

      // spec requires the semi but browsers made it optional
      if (this_par_options.requireDoWhileSemi || this_tok_firstTokenChar === 0x3b) {
        this_par_parseSemi();
      }
    }
  function this_par_parseWhile(inFunction, inSwitch, labelSet, inLoop){
      // while ( <exprs> ) <stmt>

      this_tok_next(false);
      this_par_parseStatementHeader();
      this_par_parseStatement(inFunction, inLoop || ' ', inSwitch, labelSet, false, '');
    }
  function this_par_parseFor(inFunction, inSwitch, labelSet, inLoop){
      // for ( <expr-no-in-=> in <exprs> ) <stmt>
      // for ( var <idntf> in <exprs> ) <stmt>
      // for ( var <idntf> = <expr-no-in> in <exprs> ) <stmt>
      // for ( <expr-no-in> ; <expr> ; <expr> ) <stmt>

      this_tok_next(false); // for
      this_tok_mustBeNum(0x28, true);

      if (this_tok_nextExprIfNum(0x3b)) this_par_parseForEachHeader(); // empty first expression in for-each
      else {
        var validForInLhs;

        if (this_tok_firstTokenChar === 0x76 && this_tok_nextPuncIfString('var')) validForInLhs = this_par_parseVarPartNoIn();
        // expression_s_ because it might be regular for-loop...
        // (though if it isn't, it can't have more than one expr)
        else validForInLhs = this_par_parseExpressionsNoIn();

        if (this_tok_nextExprIfNum(0x3b)) this_par_parseForEachHeader();
        else if (this_tok_firstTokenChar !== 0x69 || this_tok_getNum(1) !== 0x6e || this_tok_lastLen !== 2) this_tok_throwSyntaxError('Expected `in` or `;` here..');
        else if (!validForInLhs && this_par_options.strictForInCheck) this_tok_throwSyntaxError('Encountered illegal for-in lhs');
        else this_par_parseForInHeader();
      }

      this_tok_mustBeNum(0x29, true);
      this_par_parseStatement(inFunction, inLoop || ' ', inSwitch, labelSet, false, '');
    }
  function this_par_parseForEachHeader(){
      // <expr> ; <expr> ) <stmt>

      this_par_parseOptionalExpressions();
      this_tok_mustBeNum(0x3b, true);
      this_par_parseOptionalExpressions();
    }
  function this_par_parseForInHeader(){
      // in <exprs> ) <stmt>

      this_tok_next(true); // `in` validated by `parseFor`
      this_par_parseExpressions();
    }
  function this_par_parseContinue(inLoop, labelSet){
      // continue ;
      // continue <idntf> ;
      // newline right after keyword = asi

      if (!inLoop) this_tok_throwSyntaxError('Can only continue in a loop');

      var type = this_tok_next(false); // token after continue cannot be a regex, either way.

      if (type === 13 && !this_tok_lastNewline) {
        var label = this_tok_getLastValue();
        if (!labelSet || labelSet.indexOf(' '+label+' ') < 0) {
          this_tok_throwSyntaxError('Label ['+label+'] not found in label set ['+labelSet+']');
        }
        if (!inLoop || inLoop.indexOf(' '+label+' ') < 0) {
          this_tok_throwSyntaxError('Label ['+label+'] is not a valid label for this loop');
        }
        this_tok_next(true); // label (already validated)
      }
      // continue without a label. note that this doesnt "allow" non-identifiers since it'll require a semi/asi next.

      this_par_parseSemi();
    }
  function this_par_parseBreak(inLoop, inSwitch, labelSet){
      // break ;
      // break <idntf> ;
      // break \n <idntf> ;
      // newline right after keyword = asi

      var type = this_tok_next(false); // token after break cannot be a regex, either way.

      if (type !== 13 || this_tok_lastNewline) {
        // break without a label. note that this doesnt "allow" non-identifiers since it'll require a semi/asi next.
        if (!inLoop && !inSwitch) {
          // break without label
          this_tok_throwSyntaxError('Break without value only in loops or switches');
        }
      } else {
        var label = this_tok_getLastValue();
        if (!labelSet || labelSet.indexOf(' '+label+' ') < 0) {
          this_tok_throwSyntaxError('Label ['+label+'] not found in label set ['+labelSet+']');
        }
        this_tok_next(true); // label (already validated)
      }

      this_par_parseSemi();
    }
  function this_par_parseReturn(inFunction){
      // return ;
      // return <exprs> ;
      // newline right after keyword = asi

      if (!inFunction && !this_par_options.functionMode) this_tok_throwSyntaxError('Can only return in a function');

      this_tok_next(true);
      if (!this_tok_lastNewline) this_par_parseOptionalExpressions();
      this_par_parseSemi();
    }
  function this_par_parseThrow(){
      // throw <exprs> ;

      this_tok_next(true);
      if (this_tok_lastNewline) this_tok_throwSyntaxError('No newline allowed directly after a throw, ever');

      this_par_parseExpressions();
      this_par_parseSemi();
    }
  function this_par_parseSwitch(inFunction, inLoop, labelSet){
      // switch ( <exprs> ) { <switchbody> }

      this_tok_next(false);
      this_par_parseStatementHeader();
      this_tok_mustBeNum(0x7b, true);

      var value = this_tok_getLastValue();
      var defaults = 0;
      if (value === 'default') ++defaults;
      if (value !== 'case' && !defaults && value !== '}') this_tok_throwSyntaxError('Switch body must begin with case or default or be empty');

      while (this_par_parseStatement(inFunction, inLoop, true, labelSet, true, '')) {

        // switches are quite infrequent so this overhead is okay, compared ot the alternatives
        if (this_tok_getLastValue() === 'default' && ++defaults > 1) this_tok_throwSyntaxError('Only one default allowed per switch');
      }

      this_tok_mustBeNum(0x7d, true);
    }
  function this_par_parseCase(inSwitch){

      if (!inSwitch) this_tok_throwSyntaxError('Can only use case in a switch');
      this_tok_next(true);
      this_par_parseExpressions();
      this_tok_mustBeNum(0x3a, false);
    }
  function this_par_parseDefault(inSwitch){

      if (!inSwitch) this_tok_throwSyntaxError('Can only use default in a switch'); // cant really hit this right now because label checks supersede it
      this_tok_next(true);
      this_tok_mustBeNum(0x3a, false);
    }
  function this_par_parseTry(inFunction, inLoop, inSwitch, labelSet){
      // try { <stmts> } catch ( <idntf> ) { <stmts> }
      // try { <stmts> } finally { <stmts> }
      // try { <stmts> } catch ( <idntf> ) { <stmts> } finally { <stmts> }

      this_tok_next(false);
      this_par_parseCompleteBlock(true, inFunction, inLoop, inSwitch, labelSet);

      var count = this_tok_tokenCountAll;
      this_par_parseCatch(inFunction, inLoop, inSwitch, labelSet);
      this_par_parseFinally(inFunction, inLoop, inSwitch, labelSet);
      if (count === this_tok_tokenCountAll) this_tok_throwSyntaxError('Try must have at least a catch or finally block or both');
    }
  function this_par_parseCatch(inFunction, inLoop, inSwitch, labelSet){
      // catch ( <idntf> ) { <stmts> }

      if (this_tok_nextPuncIfString('catch')) {
        var type = this_tok_mustBeNum(0x28, false);

        // catch var
        if (type === 13) {
          if (this_par_isReservedIdentifier(false)) this_tok_throwSyntaxError('Catch scope var name is reserved');
          this_tok_next(false);
        } else {
          this_tok_throwSyntaxError('Missing catch scope variable');
        }

        this_tok_mustBeNum(0x29, false);
        this_par_parseCompleteBlock(true, inFunction, inLoop, inSwitch, labelSet);
      }
    }
  function this_par_parseFinally(inFunction, inLoop, inSwitch, labelSet){
      // finally { <stmts> }

      if (this_tok_nextPuncIfString('finally')) {
        this_par_parseCompleteBlock(true, inFunction, inLoop, inSwitch, labelSet);
      }
    }
  function this_par_parseDebugger(){
      // debugger ;

      this_tok_next(true);
      this_par_parseSemi();
    }
  function this_par_parseWith(inFunction, inLoop, inSwitch, labelSet){
      // with ( <exprs> ) <stmts>

      this_tok_next(false);
      this_par_parseStatementHeader();
      this_par_parseStatement(inFunction, inLoop, inSwitch, labelSet, false, '');
    }
  function this_par_parseFunction(forFunctionDeclaration){
      // function [<idntf>] ( [<param>[,<param>..] ) { <stmts> }

      var type = this_tok_next(false); // 'function'
      if (type === 13) { // name
        if (this_par_isReservedIdentifier(false)) this_tok_throwSyntaxError('Function name ['+this_tok_getLastValue()+'] is reserved');
        this_tok_next(false);
      } else if (forFunctionDeclaration) {
        this_tok_throwSyntaxError('Function declaration requires a name');
      }
      this_par_parseFunctionRemainder(2, forFunctionDeclaration);
    }
  function this_par_parseFunctionRemainder(paramCount, nextExpr){

      this_tok_mustBeNum(0x28, false);
      this_par_parseParameters(paramCount);
      this_tok_mustBeNum(0x29, false);
      this_par_parseCompleteBlock(nextExpr, true, '', false, '');
    }
  function this_par_parseParameters(paramCount){
      // [<idntf> [, <idntf>]]

      if (this_tok_lastType === 13) {
        if (paramCount === 0) this_tok_throwSyntaxError('Getters have no parameters');
        if (this_par_isReservedIdentifier(false)) this_tok_throwSyntaxError('Function param name is reserved.');
        this_tok_next(true);
        // there are only two valid next tokens; either a comma or a closing paren

        while (this_tok_nextExprIfNum(0x2c)) {

          if (paramCount === 1) this_tok_throwSyntaxError('Setters have exactly one param');

          // param name
          if (this_tok_lastType === 13) {
            if (this_par_isReservedIdentifier(false)) this_tok_throwSyntaxError('Function param name is reserved');
            this_tok_next(false);
          } else {
            this_tok_throwSyntaxError('Missing func param name');
          }
        }
      } else if (paramCount === 1) {
        this_tok_throwSyntaxError('Setters have exactly one param');
      }
    }
  function this_par_parseBlock(nextExpr, inFunction, inLoop, inSwitch, labelSet){
      this_par_parseStatements(inFunction, inLoop, inSwitch, labelSet);
      // note: this parsing method is also used for functions. the only case where
      // the closing curly can be followed by a division rather than a regex lit
      // is with a function expression. that's why we needed to make it a parameter
      this_tok_mustBeNum(0x7d, nextExpr);
    }
  function this_par_parseCompleteBlock(nextExpr, inFunction, inLoop, inSwitch, labelSet){
      this_tok_mustBeNum(0x7b, true);
      this_par_parseBlock(nextExpr, inFunction, inLoop, inSwitch, labelSet);
    }
  function this_par_parseSemi(){

      if (this_tok_nextExprIfNum(0x3b)) return 9;
      if (this_par_parseAsi()) return 15;
      this_tok_throwSyntaxError('Unable to parse semi, unable to apply ASI');
    }
  function this_par_parseAsi(){
      // asi at EOF, if next token is } or if there is a newline between prev and next (black) token
      // asi prevented if asi would be empty statement, no asi in for-header, no asi if next token is regex

      if (this_tok_firstTokenChar === 0x7d || this_tok_lastNewline || this_tok_lastType === 14) {
        return this_par_addAsi();
      }
      return false;
    }
  function this_par_addAsi(){

      var pos = this_tok_pos;
      var options = this_tok_options;
      var white = this_tok_tokenCountAll++;

      if (options.saveTokens) {
        // at this point we probably already parsed some whitespace and the next black token
        // we dont have to care about the whitespace, but the black token will have to be
        // updated with a new black and white index, and a new token has to be put before it.

        // this is the white and black of the token after the ASI (oldTop)
        var black = this_tok_tokenCountBlack++;

        var oldTop = this_tok_tokens.pop();

        var asi = {type:15, value:'', start:oldTop.start, stop:oldTop.start, white:white-1, black:black-1};

        oldTop.white = white;
        oldTop.black = black;

        this_tok_tokens.push(asi, oldTop);
        if (options.createBlackStream) {
          this_tok_black.push(asi, oldTop);
        }
      }

      // this kind of sucks since it probably already emitted the following token... we can't really help this atm.
      // (yes we could by delaying emitting by one token, but think of the perf-dren!)
      // pass on -1 for start/stop because we probably wont know it at this point (we could do this as well at a cost)
      if (options.onToken) options.onToken(15, '', -1, -1, white-1);

      return 15;
    }
  function this_par_parseExpressionStatement(){
      this_par_parseExpressions();
      this_par_parseSemi();
    }
  function this_par_parseExpressionOrLabel(labelName, inFunction, inLoop, inSwitch, labelSet, freshLabels){
      // this method is only called at the start of a statement that starts
      // with an identifier that is neither `function` nor a statement keyword

      // store value of identifier for label validation below.
      var identifier = this_tok_getLastValue();

      // this will stop before consuming the colon, if any.
      var assignable = this_par_parsePrimaryOrPrefix(false, false, true);

      var count = this_tok_tokenCountAll;
      this_par_parseAssignments(assignable);
      // note: no need for grouped assignment check here (we cannot be in a group right now)
      this_par_parseNonAssignments();

      if (this_tok_firstTokenChar === 0x3a) {
        if (this_tok_tokenCountAll !== count) this_tok_throwSyntaxError('Unexpected colon encountered');
        if (!assignable) this_tok_throwSyntaxError('Label ['+identifier+'] is a reserved keyword');
        var labelSpaced = labelName + ' ';
        if (labelSet.indexOf(' ' + labelSpaced) >= 0) this_tok_throwSyntaxError('Label ['+identifier+'] is already defined');
        this_tok_next(true);

        if (inLoop) inLoop += labelSpaced; // these are the only valid jump targets for `continue`
        this_par_parseStatement(inFunction, inLoop, inSwitch, (labelSet || ' ')+labelSpaced, false, (freshLabels||' ')+labelSpaced);
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
      // track for parseGroup, if this expression is wrapped, is it still assignable?
      var groupAssignable = this_par_parseExpression();

      while (this_tok_nextExprIfNum(0x2c)) {

        this_par_parseExpression();
        groupAssignable = 0;
      }
      return groupAssignable;
    }
  function this_par_parseExpression(){

      var tokCount = this_tok_tokenCountAll;

      // track for parseGroup whether this expression still assignable when
      var groupAssignable = this_par_parseExpressionOptional();

      // either tokenizer pos moved, or we reached the end (we hadnt reached the end before)
      if (tokCount === this_tok_tokenCountAll) this_tok_throwSyntaxError('Expected to parse an expression, did not find any');

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

        // if there was a non-assign binary op, the whole thing is nonassign
        // if there were only assign ops, the whole thing is assignable unless grouped
        // if there were no binary ops, the whole thing is whatever the primary was

        if (beforeNonAssignments !== endCount) assignable = 0;
        else if (beforeAssignments !== beforeNonAssignments) assignable = 2;
      }

      // return state for parseGroup, to determine whether the group as a whole can be assignment lhs
      // the group needs to know about the prim expr AND any binary ops (inc assignments).
      return assignable;
    }
  function this_par_parseAssignments(assignable){
      // assignment ops are allowed until the first non-assignment binary op

      var strictAssign = this_par_options.strictAssignmentCheck;

      while (this_par_isAssignmentOperator()) {

        if (!assignable && strictAssign) this_tok_throwSyntaxError('LHS of this assignment is invalid assignee');
        // any assignment means not a for-in per definition
        this_tok_next(true);
        assignable = this_par_parsePrimary(false);
      }
    }
  function this_par_parseNonAssignments(){

      // keep parsing non-assignment binary/ternary ops

      while (true) {

        if (this_par_isBinaryOperator()) {
          this_tok_next(true);
          this_par_parsePrimary(false);
        }
        else if (this_tok_firstTokenChar === 0x3f) this_par_parseTernary();
        else break;
      }
    }
  function this_par_parseTernary(){

      this_tok_next(true);
      this_par_parseExpression();
      this_tok_mustBeNum(0x3a, true);
      this_par_parseExpression();
    }
  function this_par_parseTernaryNoIn(){

      this_tok_next(true);
      this_par_parseExpression();
      this_tok_mustBeNum(0x3a, true);
      this_par_parseExpressionNoIn();
    }
  function this_par_parseExpressionsNoIn(){

      var validForInLhs = this_par_parseExpressionNoIn();

      while (this_tok_nextExprIfNum(0x2c)) {

        // lhs of for-in cant be multiple expressions
        this_par_parseExpressionNoIn();
        validForInLhs = 0;
      }

      return validForInLhs;
    }
  function this_par_parseExpressionNoIn(){
      var assignable = this_par_parsePrimary(false);

      var count = this_tok_tokenCountAll;
      this_par_parseAssignments(assignable); // any assignment is illegal in for-in, with and without group. no need to check here.

      // keep parsing non-assignment binary/ternary ops unless `in`
      var repeat = true;

      while (repeat) {

        if (this_par_isBinaryOperator()) {
          // rationale for using getLastNum; this is the `in` check which will succeed
          // about 50% of the time (stats from 8mb of various js). the other time it
          // will check for a primary. it's therefore more likely that an getLastNum will
          // save time because it would cache the charCodeAt for the other token if
          // it failed the check
          if (this_tok_firstTokenChar === 0x69 && this_tok_getNum(1) === 0x6e && this_tok_lastLen === 2) { // in
            repeat = false;
          } else {
            this_tok_next(true);
            this_par_parsePrimary(false);
          }
        } else if (this_tok_firstTokenChar === 0x3f) {
          this_par_parseTernaryNoIn();
        } else {
          repeat = false;
        }
      }

      return count === this_tok_tokenCountAll ? assignable : 0;
    }
  function this_par_parsePrimary(optional){
      return this_par_parsePrimaryOrPrefix(optional, false, false);
    }
  function this_par_parsePrimaryOrPrefix(optional, hasNew, maybeLabel){
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

      var len = this_tok_lastLen;
      var c = this_tok_firstTokenChar;

      if (this_tok_lastType === 13) {
        if (len > 2) {
          if (c === 0x74) {
            if (len === 6 && this_tok_nextExprIfString('typeof')) {
              if (hasNew) this_tok_throwSyntaxError('typeof is illegal right after new');
              this_par_parsePrimaryOrPrefix(false, false, false);
              return 0;
            }
          } else if (this_tok_firstTokenChar === 0x66 && this_tok_getLastValue() === 'function') {
              this_par_parseFunction(false);

              // can never assign to function directly
              return this_par_parsePrimarySuffixes(0, hasNew, false);
          } else if (c === 0x6e) {
            if (this_tok_nextExprIfString('new')) {
              // new is actually assignable if it has a trailing property AND at least one paren pair
              // TOFIX: isn't the OR flawed? HASNEW is a constant...
              return this_par_parsePrimaryOrPrefix(false, true || hasNew, false);
            }
          } else if (c === 0x64) {
            if (len === 6 && this_tok_nextExprIfString('delete')) {
              if (hasNew) this_tok_throwSyntaxError('delete is illegal right after new');
              this_par_parsePrimaryOrPrefix(false, false, false);
              return 0;
            }
          } else if (c === 0x76) {
            if (this_tok_nextExprIfString('void')) {
              if (hasNew) this_tok_throwSyntaxError('void is illegal right after new');
              this_par_parsePrimaryOrPrefix(false, false, false);
              return 0;
            }
          }
        }

        return this_par_parsePrimaryCoreIdentifier(hasNew, maybeLabel);
      }

      if ((c === 0x21 || c === 0x7e) && this_tok_lastLen === 1) {
        if (hasNew) this_tok_throwSyntaxError('! and ~ are illegal right after new');
        this_tok_next(true);
        this_par_parsePrimaryOrPrefix(false, false, false);
        return 0;
      }

      if (c === 0x2d || c === 0x2b) {
        if (hasNew) this_tok_throwSyntaxError('illegal operator right after new');
        // have to verify len anyways, for += and -= case
        if (this_tok_lastLen === 1) {
          this_tok_next(true);
          this_par_parsePrimaryOrPrefix(false, false, false);
        } else if (this_tok_getNum(1) === c) {
          this_tok_next(true);
          var assignable = this_par_parsePrimaryOrPrefix(false, false, false);
          if (!assignable && this_par_options.strictAssignmentCheck) this_tok_throwSyntaxError('The rhs of ++ or -- was not assignable');
        } else {
          // this is a += or -= token (there's no other possibility left)
          // I believe it is illegal at this point :)
          this_tok_throwSyntaxError('Illegal operator, expecting primary core');
        }
        return 0;
      }

      return this_par_parsePrimaryCoreOther(optional, hasNew);
    }
  function this_par_parsePrimaryCoreIdentifier(hasNew, maybeLabel){

      var identifier = this_tok_getLastValue();
      var c = this_tok_firstTokenChar;

      // dont use ?: here (build script)
      var fail;
      if (maybeLabel) fail = this_par_isReservedIdentifierSpecial();
      else fail = this_par_isReservedIdentifier(true);
      if (fail) this_tok_throwSyntaxError('Reserved identifier ['+identifier+'] found in expression');

      this_tok_next(false);

      // can not assign to keywords, anything else is fine here
      var assignable = !this_par_isValueKeyword(c, identifier) ? 1 : 0;
      return this_par_parsePrimarySuffixes(assignable, hasNew, maybeLabel);
    }
  function this_par_parsePrimaryCoreOther(optional, hasNew){

      var count = this_tok_tokenCountAll;
      var assignable = this_par_parsePrimaryValue(optional);
      if (count === this_tok_tokenCountAll) {
        if (optional) return 0; // prevents `return.foo`
        this_tok_throwSyntaxError('Missing required primary'); // TOFIX: find case for this
      }
      return this_par_parsePrimarySuffixes(assignable, hasNew, false);
    }
  function this_par_parsePrimaryValue(optional){
      // at this point in the expression parser we will have ruled out anything else.
      // the next token(s) must be some kind of non-identifier expression value...
      // returns whether the entire thing is assignable

      // we know it's going to be a punctuator so we wont use this_tok_isValue here
      var t = this_tok_lastType;
      if (t === 10 || t === 8) {
        this_tok_next(false);
        return 0;
      }

      if (t === 7) {
        // special case: numbers must always be followed by whitespace (or EOF)
        this_tok_nextWhiteAfterNumber();
        return 0;
      }

      if (this_tok_nextExprIfNum(0x28)) {
        return this_par_parseGroup();
      }

      if (this_tok_nextExprIfNum(0x7b)) {
        this_par_parseObject();
        return 0;
      }

      if (this_tok_nextExprIfNum(0x5b)) {
        this_par_parseArray();
        return 0;
      }

      if (!optional) this_tok_throwSyntaxError('Unable to parse required primary value');
      // if the primary was optional but not found, the return value here is irrelevant
      return 1;
    }
  function this_par_parsePrimarySuffixes(assignable, unassignableUntilAfterCall, maybeLabel){
      // --
      // ++
      // .<idntf>
      // [<exprs>]
      // (<exprs>)

      // label edge case. if any suffix parsed, colon is no longer valid
      var colonIsError = false;
      var allowCallAssignment = this_par_options.allowCallAssignment;

      if (unassignableUntilAfterCall) assignable = 0; // for new, must have trailing property _after_ a call

      while (true) {

        // see c frequency stats in /stats/primary suffix start.txt
        var c = this_tok_firstTokenChar;
        if (c > 0x2e) {
          // only c>0x2e relevant is OPEN_SQUARE
          if (c !== 0x5b) break;
          this_tok_next(true);
          this_par_parseExpressions(); // required
          this_tok_mustBeNum(0x5d, false); // ] cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          if (!unassignableUntilAfterCall && !assignable) assignable = 1; // trailing property
        } else if (c === 0x2e) {
          if (this_tok_lastType === 7) break; // ASI: foo\n.5 -> [foo][\n][.5]

          this_tok_next(false);
          this_tok_mustBeIdentifier(false); // cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          if (!unassignableUntilAfterCall && !assignable) assignable = 1; // trailing property
        } else if (c === 0x28) {
          this_tok_next(true);
          this_par_parseOptionalExpressions();
          this_tok_mustBeNum(0x29, false); // ) cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
          unassignableUntilAfterCall = false;
          assignable = allowCallAssignment; // call, only assignable in IE
        } else {
          // postfix inc/dec are restricted, so no newline allowed here
          if (!this_tok_lastNewline && (c === 0x2b || c === 0x2d) && this_tok_getNum(1) === c) {
            if (!assignable && this_par_options.strictAssignmentCheck) this_tok_throwSyntaxError('Postfix increment not allowed here');
            this_tok_next(false);
            assignable = 0; // ++
          }

          break;
        }
        colonIsError = true;
      }
      if (colonIsError && maybeLabel && c === 0x3a) this_tok_throwSyntaxError('Invalid label here, I think');
      return assignable;
    }
  function this_par_isAssignmentOperator(){
      // includes any "compound" operators

      // this method works under the assumption that the current token is
      // part of the set of valid tokens for js. So we don't have to check
      // for string lengths unless we need to disambiguate optional chars

      var len = this_tok_lastLen;
      var c = this_tok_firstTokenChar;

      if (len === 1) return c === 0x3d;

      if (len === 2) {
        // if a token, which must be valid at this point has the equal sign
        // as second char and length 2 there is a white list and black list
        // of possible options;
        // good: += -= *= |= &= ^= /= ~=
        // bad: == >= <= !=
        // the danger here is testing becomes very hard because it doesnt
        // see the difference between assignment op and nonassign binary op
        // the gain is minimal since compound ops dont occur very often

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

      // these <<= >>= >>>= cases are very rare

      // valid tokens starting with < are: < <= << <<= only len=3 is what we want here
      if (c === 0x3c) return len === 3;

      // valid tokens starting with > are: > >> >= >>= >>> >>>=, we only look for >>= and >>>=
      if (c === 0x3e) return (len === 4 || (len === 3 && this_tok_getNum(2) === 0x3d));

      return false;
    }
  function this_par_isBinaryOperator(){
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

      var c = this_tok_firstTokenChar;
      var len = this_tok_lastLen;

      if (c === 0x3b || c === 0x29 || c === 0x2c) return false; // expression enders: 26% 24% 20%
      if (len === 1) {
        if (c === 0x5d || c === 0x7d) return false; // expression/statement enders: 7% 6%
        return c === 0x2b || c === 0x2a || c === 0x3c || c === 0x2d || c === 0x3e || c === 0x2f || c === 0x26 || c === 0x7c || c === 0x25 || c === 0x5e;
      }
      if (len === 2) {
        return c === 0x3d || c === 0x21 || c === 0x3c || c === 0x3e || (c === 0x26 && this_tok_getNum(1) === 0x26) || (c === 0x7c && this_tok_getNum(1) === 0x7c) || this_tok_getLastValue() === 'in';
      }
      if (len === 3) {
        return c === 0x3d || c === 0x21 || (c === 0x3e && this_tok_getNum(2) === 0x3e);
      }
      if (len === 10) return this_tok_getLastValue() === 'instanceof';

      // not a (non-assignment) binary operator
      return false;
    }
  function this_par_parseGroup(){
      // the expressions is required, the group is nonassignable if:
      // - wraps multiple expressions
      // - if the single expression is nonassignable
      // - if it wraps an assignment
      var groupAssignable = this_par_parseExpressions();

      // groups cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      this_tok_mustBeNum(0x29, false);

      if (groupAssignable === 2) groupAssignable = 0;

      return groupAssignable;
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

        var type = this_tok_lastType;
        if (type === 13 || type === 10 || type === 7) this_par_parsePair(); // 84% 9% 1% = 94%
      } while (this_tok_nextExprIfNum(0x2c)); // elision

      // obj lits cannot be followed by a regex (not even on new line, asi wouldnt apply, would parse as div)
      this_tok_mustBeNum(0x7d, false);
    }
  function this_par_parsePair(){

      if (this_tok_lastLen !== 3) return this_par_parseData(); // 92%

      var c = this_tok_firstTokenChar;
      if (c === 0x67 && this_tok_nextPuncIfString('get')) {
        if (this_tok_lastType === 13) {
          this_tok_next(false);
          this_par_parseFunctionRemainder(this_par_options.checkAccessorArgs ? 0 : 2, true);
        }
        else this_par_parseDataPart();
      } else if (c === 0x73 && this_tok_nextPuncIfString('set')) {
        if (this_tok_lastType === 13) {
          this_tok_next(false);
          this_par_parseFunctionRemainder(this_par_options.checkAccessorArgs ? 1 : 2, true);
        }
        else this_par_parseDataPart();
      } else {
        this_par_parseData();
      }
    }
  function this_par_parseData(){
      this_tok_next(false);
      this_par_parseDataPart();
    }
  function this_par_parseDataPart(){
      this_tok_mustBeNum(0x3a, true);
      this_par_parseExpression();
    }
  function this_par_isReservedIdentifierSpecial(){
      // Same as isReservedIdentifier but without the statement
      // keywords, value keywords and unary operators because
      // they'll be valid at this point. This check is specific
      // to the expression or label parsing func.

      // Note that none of these checks should pass.
      // This function returns 100% false. Let's be quick about it.

      var value;

      var c = this_tok_firstTokenChar;

      // stats:
      // len: 1:26%, 2:6%, 3:6%, 4:34%, 5:5%, 6:5%, 7:3%, 8:3%
      // chr: a:5%, b:4%, c:5%, d:3%, e:3%, f:1%, g:2%, h:1%, i:1%, j:1%, k:1%, l:1%, m:2%, n:2%, o:1%, p:2%, q:0%, r:2%, s:2%, t:30%, u:1%, v:1%, w:1%, x:0%, y:0%, z:0%, rest: 28%
      // so: len=1 and c=t and c as non-lowercase-letter should exit early

      if (
        c < 0x63 || // 38%
        c === 0x74 || // 30%
        this_tok_lastLen === 1 // 14%
      ) return false;

      // stats now:
      // len: 1:0, 2:3%, 3:2%, 4:3%, 5:2%, 6:2%, 7:2%, 8:1%, >8:4%
      // chr: a:0, b:0, c:2%, d:1%, e:1%, f:1%, g:1%, h:1%, i:1%, j:0%, k:0%, l:1%, m:1%, n:1%, o:1%, p:2%, q:0%, r:1%, s:2%, t:0, u:0%, v:1%, w:0%, x:0%, y:0%, z:0%, rest:0
      // so: meh. note: no rest because capitals and such are already discarded with the <c check. same goes for _ and $.

      // rest true: 9%, false: 11%?

      if (c === 0x63) { // 2.5%
        var d = this_tok_getNum(1);
        if (d === 0x6f && this_tok_getLastValue() === 'const') return true;
        if (d === 0x6c && this_tok_getLastValue() === 'class') return true;
        if (d !== 0x61) return false;
        var value = this_tok_getLastValue();
        return (value === 'catch' || value === 'case');
      }

      if (c === 0x73) { // 1.8%
        return this_tok_getNum(1) === 0x75 && this_tok_getLastValue() === 'super';
      }

      if (c === 0x64) { // 1.5%
        return this_tok_getNum(1) === 0x65 && this_tok_getLastValue() === 'default';
      }

      if (c === 0x65) { // 1.1%
        var d = this_tok_getNum(1);
        if ((d === 0x6c && this_tok_getLastValue() === 'else') || (d === 0x6e && this_tok_getLastValue() === 'enum')) return true;
        if (d !== 0x78) return false;
        var value = this_tok_getLastValue();
        return (value === 'export' || value === 'extends');
      }

      if (c === 0x66) { // 0.8%
        return this_tok_getNum(1) === 0x69 && this_tok_getLastValue() === 'finally';
      }

      if (c === 0x69) { // 0.8%
        var d = this_tok_getNum(1);
        return (d === 0x6e && (this_tok_lastLen === 2 || this_tok_getLastValue() === 'instanceof')) || (d === 0x6d && this_tok_getLastValue() === 'import');
      }

      return false;
    }
  function this_par_isReservedIdentifier(ignoreValues){
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

      var c = this_tok_firstTokenChar;
      var len = this_tok_lastLen;

      // a:8%, b:6%, c:6%, d:4%, e:4%, f:3%, g:2%, h:2%, i:4%, j:1%, k:1%, l:2%, m:2%, n:4%, o:2%, p:3%, q:0%, r:2%, s:3%, t:17%, u:1%, v:2%, w:1%, x:1%, y:1%, z:0%, rest:17%

      if (len === 1) return false; // 39%

      // stats after only dropping len=1:
      // len: 1:0, 2:7%, 3:7%, 4:22%, 5:5%, 6:4%, 7:3%, 8:3%, rest:10%
      // chr: a:2%, b:2%, c:3%, d:2%, e:2%, f:2%, g:1%, h:1%, i:2%, j:0%, k:1%, l:1%, m:1%, n:3%, o:1%, p:2%, q:0%, r:1%, s:3%, t:16%, u:1%, v:1%, w:1%, x:0%, y:0%, z:0%, rest: 12%
      // conclusion: len=4 (22%) has a significance. c=t (12%) does too. probably the same step, unfortunately. can probably do the <=a trick here as well

      if (c <= 0x61) return false; // 14%

      // after dropping <=a
      // 1:0, 2:2%, 3:2%, 4:8%, 5:2%, 6:1%, 7:1%, 8:1%, rest: 3%
      // a:0, b:1%, c:1%, d:1%, e:1%, f:0%, g:0%, h:0%, i:1%, j:0%, k:0%, l:0%, m:1%, n:1%, o:1%, p:1%, q:0%, s:1%, t:7%, u:0%, v:1%, w:0%, x:0%, y:0%, z:0%, rest:0
      // so: only c=t and len=4 are standing out, slightly. rest is negligible

      if (len === 4) { // 19%
        // case else void this with enum true null
        // relevant character stats per position:
        // 1: t:14% n:2% (centvw)
        // 2: h:12% a:1% e:1% o:1% r:1% u:2% (ahilnoru)
        // 3: i:13% d:1% e:1% l:2% u:1% (ilstu)
        // 4: s:13% e:3% l:2% t:1% (dehmls)

        // true
        // this
        if (c === 0x74) {
          if (ignoreValues) return false;
          var value = this_tok_getLastValue();
          return (value === 'this' || value === 'true');
        }

        // null
        if (c === 0x6e) {
          return !ignoreValues && this_tok_getLastValue() === 'null';
        }

        // else
        // enum
        if (c === 0x65) {
          // case else true
          var value = this_tok_getLastValue();
          return (value === 'else' || value === 'enum');
        }

        // case
        if (c === 0x63) {
          return this_tok_getLastValue() === 'case';
        }

        if (c < 0x76) return false; // 2.3% (way more than the 0.15% of v and w)

        // void
        if (c === 0x76) {
          return !ignoreValues && this_tok_getLastValue() === 'void';
        }

        // with
        if (c === 0x77) {
          return this_tok_getLastValue() === 'with';
        }

        return false;
      }

//      bcdefinrstvw

      // 1:0 2:4.6 3:4 4:0 5:4.2 6:3 7:2.7 8:2.2 >8:6.9 = 27.6
      // a:0 b:1.5 c:2.5 d:1.5 e:1.5 f:2 g:1 h:0.5 i:1.5 j:0.5 k:0.5 l:1 m:1: n:1 o:1.5 p:2: q:0 r:1.5 s:2.5 t:1.5 u:1: v:1 w:0.5 x:0.5 y:0 z:0

      if (len >= 7) { // 11.7%

        // 7: finally default extends: never
        // 8: continue debugger function: never
        // 10: instanceof: never
        // cdefi

        if (c > 0x69) return false; // 6.4%

        if (c === 0x63) { // 1.5%
          return this_tok_getLastValue() === 'continue';
        }

        if (c === 0x64) { // 0.8%
          var value = this_tok_getLastValue();
          return value === 'default' || value === 'debugger';
        }

        if (c === 0x65) { // 0.8%
          return this_tok_getLastValue() === 'extends';
        }

        if (c === 0x66) { // 0.5%
          var value = this_tok_getLastValue();
          return value === 'finally' || value === 'function';
        }

        if (c === 0x69) { // 0.7%
          return this_tok_getLastValue() === 'instanceof';
        }

        return false; // 1%
      }

      // 3: new var for try : 4
      // 5: break catch while throw class super const false: 4.2
      // 6: typeof return switch delete export import: never: 3

      if (len === 2) { // 4.6%
        if (c === 0x69) {
          var value = this_tok_getLastValue();
          return value === 'if' || value === 'in';
        }
        if (c === 0x64) return this_tok_getLastValue() === 'do';
        return false;
      }

      if (len === 5) { // 4.2%
        if (c === 0x66) return !ignoreValues && this_tok_getLastValue() === 'false';
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

      if (len === 3) { // 4%
        if (c === 0x6e) return !ignoreValues && this_tok_getLastValue() === 'new';
        if (c === 0x76) return this_tok_getLastValue() === 'var';
        if (c === 0x74) return this_tok_getLastValue() === 'try';
        if (c === 0x66) return this_tok_getLastValue() === 'for';
        return false;
      }

      // 3%

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

  // indices match slots of the start-regexes (where applicable)
  // this order is determined by regex/parser rules so they are fixed

      // WHITE_SPACE, LINETERMINATOR COMMENT_SINGLE COMMENT_MULTI

  // boolean constants

  var Par = exports.Par = function(input, options){
    this_par_options = options = (options || {});

    if (!options.saveTokens) options.saveTokens = false;
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
        frozen: false,
        value: undefined,
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
    // the call makes sure run has the proper context for the streaming version
    // it will be the only instance method that has the proper context :)
    // TOFIX: we can probably eliminate that now?
    var f = par.run.call(par);

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

      if (options && options.runWithoutFurtherInput) {
        // testing
        do {
          // start parsing nao
          var yieldValue = f(false);
        } while (frozen);
        f = yieldValue;
      } else {
        par.frozenObject.thaw = f;
        f = par.frozenObject;
      }
    }

    return f;
  };

  // note: this causes deopt in chrome by this bug: https://code.google.com/p/v8/issues/detail?id=2246
  ;

//######### end of par.js #########

})(typeof exports === "undefined" ? window : exports);
