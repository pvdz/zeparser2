var Par = function(input){
    this.tok = new Tok(input);
};

Par.prototype = {
    run: function(){
        // prepare
        this.tok.nextExpr();

        // go!
        this.parseStatements(false, false, false);
    },

    parseStatements: function(inFunction, inLoop, inSwitch){
        while (!this.tok.isType(EOF) && this.parseStatement(inFunction, inLoop, inSwitch));
    },
    parseStatement: function(inFunction, inLoop, inSwitch){
      if (this.tok.isType(IDENTIFIER)) {
        // dont "just" return true. case and default still return false
        return this.parseIdentifierStatement(inFunction, inLoop, inSwitch);
      }

      if (this.tok.isValue()) {
        this.parseExpressionStatement();
        return true;
      }

      var val = this.tok.getLastValue();
      var c = val.charCodeAt(0);
      if (
          c === 0x28 || // (
          c === 0x5b || // [
          c === 0x7e || // ~
          c === 0x21    // !
      ) {
        this.parseExpressionStatement();
        return true;
      }

      if (c === 0x7b) { // {
        this.tok.nextExpr();
        this.parseBlock(inFunction, inLoop, inSwitch);
        return true;
      }
      if (c === 0x3b) { // [
        this.tok.nextExpr();
        return true;
      } // empty statement

      if (c === 0x2b || c === 0x2d) { // - +
        this.parseExpressionStatement();
        return true;
      }

      if (this.tok.isType(EOF)) return false;
    },
    parseIdentifierStatement: function(inFunction, inLoop, inSwitch){
      var val = this.tok.getLastValue();

      if (val === 'var') this.parseVar();
      else if (val === 'if') this.parseIf(inFunction, inLoop, inSwitch);
      else if (val === 'do') this.parseDo(inFunction, inLoop, inSwitch);
      else if (val === 'while') this.parseWhile(inFunction, inLoop, inSwitch);
      else if (val === 'for') this.parseFor(inFunction, inLoop, inSwitch);
      else if (val === 'throw') this.parseThrow();
      else if (val === 'switch') this.parseSwitch(inFunction, inLoop, inSwitch);
      else if (val === 'try') this.parseTry(inFunction, inLoop, inSwitch);
      else if (val === 'debugger') this.parseDebugger();
      else if (val === 'with') this.parseWith(inFunction, inLoop, inSwitch);
      else if (val === 'function') this.parseFunction();
      else if (val === 'continue') this.parseContinue(inFunction, inLoop, inSwitch);
      else if (val === 'break') this.parseBreak(inFunction, inLoop, inSwitch);
      else if (val === 'return') this.parseReturn(inFunction, inLoop, inSwitch);
      // case and default are handled elsewhere
      else if (val === 'case' || val === 'default') return false;
      else this.parseExpressionOrLabel(inFunction, inLoop, inSwitch);

      return true;
    },
    parseStatementHeader: function(){
        this.tok.mustBeNum(0x28, true); // (
        this.parseExpressions();
        this.tok.mustBeNum(0x29, true); // )
    },

    parseVar: function(){
//        console.log(this.tok.pos)
        // var <vars>
        // - foo
        // - foo=bar
        // - ,foo=bar

        this.tok.next();
        do {
            this.tok.mustBeType(IDENTIFIER, true);
            if (this.tok.nextExprIfNum(0x3d)) { // =
                this.parseExpression();
            }
        } while(this.tok.nextIfNum(0x2c)); // ,
        this.parseSemi();

        return true;
    },
    parseVarPartNoIn: function(){
        this.tok.next();
        do {
            this.tok.mustBeType(IDENTIFIER,true);
            if (this.tok.nextExprIfNum(0x3d)) { // =
                this.parseExpressionNoIn();
            }
        } while(this.tok.nextIfNum(0x2c)); // ,
    },
    parseIf: function(inFunction, inLoop, inSwitch){
        // if (<exprs>) <stmt>
        // if (<exprs>) <stmt> else <stmt>

        this.tok.next();
        this.parseStatementHeader();
        this.parseStatement(inFunction, inLoop, inSwitch);

        this.parseElse(inFunction, inLoop, inSwitch);

        return true;
    },
    parseElse: function(inFunction, inLoop, inSwitch){
        // else <stmt>;

        if (this.tok.nextIf('else')) {
            this.parseStatement(inFunction, inLoop, inSwitch);
        }
    },
    parseDo: function(inFunction, inLoop, inSwitch){
        // do <stmt> while ( <exprs> ) ;

        this.tok.nextExpr(); // do
        this.parseStatement(inFunction, true, inSwitch);
        this.tok.mustBe('while');
        this.tok.mustBeNum(0x28); // (
        this.parseExpressions();
        this.tok.mustBeNum(0x29); // )
        this.parseSemi();
    },
    parseWhile: function(inFunction, inLoop, inSwitch){
        // while ( <exprs> ) <stmt>

        this.tok.next();
        this.parseStatementHeader();
        this.parseStatement(inFunction, true, inSwitch);
    },
    parseFor: function(inFunction, inLoop, inSwitch){
      // for ( <expr-no-in-=> in <exprs> ) <stmt>
      // for ( var <idntf> in <exprs> ) <stmt>
      // for ( var <idntf> = <exprs> in <exprs> ) <stmt>
      // for ( <expr-no-in> ; <expr> ; <expr> ) <stmt>

      // need to excavate this... investigate specific edge cases for `for-in`

      this.tok.next(); // for
      this.tok.mustBeNum(0x28, true); // (

      if (this.tok.is('var')) this.parseVarPartNoIn();
      else this.parseExpressionsNoIn();

      // 3b = ;
      if (this.tok.nextExprIfNum(0x3b)) this.parseForEachHeader();
      else this.parseForInHeader();

      this.tok.mustBeNum(0x29, true); // )
      this.parseStatement(inFunction, true, inSwitch);
    },
    parseForEachHeader: function(){
        // <expr> ; <expr> ) <stmt>

        this.parseExpressions();
        this.tok.mustBeNum(0x3b, true); // ;
        this.parseExpressions();
    },
    parseForInHeader: function(){
        // in <exprs> ) <stmt>

        this.tok.mustBe('in', true);
        this.parseExpressions();
    },
    parseContinue: function(inFunction, inLoop, inSwitch){
        // continue ;
        // continue <idntf> ;
        // newline right after keyword = asi

        if (!inLoop) throw 'You can only continue in a loop';

        this.tok.next();
        if (this.tok.lastNewline) this.addAsi();
        else {
            this.tok.nextIfType(IDENTIFIER);
            this.parseSemi();
        }
    },
    parseBreak: function(inFunction, inLoop, inSwitch){
        // break ;
        // break <idntf> ;
        // newline right after keyword = asi

        this.tok.next(); // break
        if (this.tok.lastNewline) {
          if (!inLoop && !inSwitch) throw 'You can only use breaks without a label in a switch or a loop (asi)';
          this.addAsi();
        } else {
            if (!this.tok.nextIfType(IDENTIFIER)) { // label name
              if (!inLoop && !inSwitch) throw 'You can only use breaks without a label in a switch or a loop';
            }
            this.parseSemi();
        }
    },
    parseReturn: function(inFunction, inLoop, inSwitch){
        // return ;
        // return <exprs> ;
        // newline right after keyword = asi

        if (!inFunction) throw 'Can only return in a function '+this.tok.syntaxError('break');

        this.tok.nextExpr();
        if (this.tok.lastNewline) this.addAsi();
        else {
            this.parseExpressions();
            this.parseSemi();
        }
    },
    parseThrow: function(){
        // throw <exprs> ;

        this.tok.nextExpr();
        if (this.tok.lastNewline) this.addAsi();
        else {
            this.parseExpressions();
            this.parseSemi();
        }
    },
    parseSwitch: function(inFunction, inLoop, inSwitch){
        // switch ( <exprs> ) { <switchbody> }

        this.tok.next();
        this.parseStatementHeader();
        this.tok.mustBeNum(0x7b, true); // {
        this.parseSwitchBody(inFunction, inLoop, true);
        this.tok.mustBeNum(0x7d, true); // }
    },
    parseSwitchBody: function(inFunction, inLoop, inSwitch){
        // [<cases>] [<default>] [<cases>]

        // default can go anywhere...
        this.parseCases(inFunction, inLoop, inSwitch);
        if (this.tok.nextIf('default')) {
            this.parseDefault(inFunction, inLoop, inSwitch);
            this.parseCases(inFunction, inLoop, inSwitch);
        }
    },
    parseCases: function(inFunction, inLoop, inSwitch){
        while (this.tok.nextIf('case')) {
            this.parseCase(inFunction, inLoop, inSwitch);
        }
    },
    parseCase: function(inFunction, inLoop, inSwitch){
        // case <value> : <stmts-no-case-default>
        this.parseExpressions();
        this.tok.mustBeNum(0x3a,true); // :
        this.parseStatements(inFunction, inLoop, inSwitch);
    },
    parseDefault: function(inFunction, inLoop, inSwitch){
        // default <value> : <stmts-no-case-default>
        this.tok.mustBeNum(0x3a,true); // :
        this.parseStatements(inFunction, inLoop, inSwitch);
    },
    parseTry: function(inFunction, inLoop, inSwitch){
        // try { <stmts> } catch ( <idntf> ) { <stmts> }
        // try { <stmts> } finally { <stmts> }
        // try { <stmts> } catch ( <idntf> ) { <stmts> } finally { <stmts> }

        this.tok.next();
        this.parseCompleteBlock(inFunction, inLoop, inSwitch);

        var one = this.parseCatch(inFunction, inLoop, inSwitch);
        var two = this.parseFinally(inFunction, inLoop, inSwitch);

        if (!one && !two) throw 'Try must have at least a catch or finally block or both: '+this.tok.debug();
    },
    parseCatch: function(inFunction, inLoop, inSwitch){
        // catch ( <idntf> ) { <stmts> }

        if (this.tok.nextIf('catch')) {
            this.tok.mustBeNum(0x28); // (
            this.tok.mustBeType(IDENTIFIER);
            this.tok.mustBeNum(0x29); // )
            this.parseCompleteBlock(inFunction, inLoop, inSwitch);

            return true;
        }
    },
    parseFinally: function(inFunction, inLoop, inSwitch){
        // finally { <stmts> }

        if (this.tok.nextIf('finally')) {
            this.parseCompleteBlock(inFunction, inLoop, inSwitch);

            return true;
        }
    },
    parseDebugger: function(){
        // debugger ;

        this.tok.next();
        this.parseSemi();
    },
    parseWith: function(inFunction, inLoop, inSwitch){
        // with ( <exprs> ) <stmts>

        this.tok.next();
        this.parseStatementHeader();
        this.parseStatement(inFunction, inLoop, inSwitch);
    },
    parseFunction: function(hasName){
        // function [<idntf>] ( [<param>[,<param>..] ) { <stmts> }

        this.tok.next(); // 'function'
        this.tok.nextIfType(IDENTIFIER); // name
        this.parseFunctionRemainder();
    },
    parseNamedFunction: function(hasName){
        // function [<idntf>] ( [<param>[,<param>..] ) { <stmts> }

        this.tok.next(); // 'function'
        this.tok.mustBeType(IDENTIFIER); // name
        this.parseFunctionRemainder();
    },
    parseFunctionRemainder: function(){
        this.tok.mustBeNum(0x28); // (
        this.parseParameters();
        this.tok.mustBeNum(0x29); // )
        this.parseCompleteBlock(true, false, false); // this resets loop and switch status
    },
    parseParameters: function(){
        // [<idntf> [, <idntf>]]

        if (this.tok.nextIfType(IDENTIFIER)) {
            while (this.tok.nextIfNum(0x2c)) { // ,
                this.tok.mustBeType(IDENTIFIER);
            }
        }
    },
    parseBlock: function(inFunction, inLoop, inSwitch){
        this.parseStatements(inFunction, inLoop, inSwitch);
        this.tok.mustBeNum(0x7d, true); // }
        return true;
    },
    parseCompleteBlock: function(inFunction, inLoop, inSwitch){
        this.tok.mustBeNum(0x7b, true); // {
        this.parseBlock(inFunction, inLoop, inSwitch);
    },
    parseSemi: function(){
        if (this.tok.nextExprIfNum(0x3b)) return PUNCTUATOR; // ;
        if (this.parseAsi()) return ASI;
        throw 'Unable to parse semi, unable to apply ASI';
//      : '+this.tok.debug()+' #### '+
//            this.tok.input.substring(this.tok.lastStart-2000, this.tok.lastStart)+
//            '###'+
//            this.tok.input.substring(this.tok.lastStart, this.tok.lastStart+2000);
    },
    parseAsi: function(){
      // asi at EOF, if next token is } or if there is a newline between prev and next (black) token
      // asi prevented if asi would be empty statement, no asi in for-header, no asi if next token is regex

      // 0x7d=}
      if (this.tok.isType(EOF) || this.tok.isNum(0x7d) || (this.tok.lastNewline && !this.tok.isType(REGEX))) {
          return this.addAsi();
      }
      return false;
    },
    addAsi: function(){
//        console.log("Aplying ASI");
        ++this.tok.tokenCount;
        return ASI;
    },
    parseExpressionStatement: function(){
        this.parseExpressions();
        this.parseSemi();

        return true;
    },

    parseExpressionOrLabel: function(inFunction, inLoop, inSwitch){
        var found = this.parseExpressionForLabel(inFunction, inLoop, inSwitch);
        if (!found) {
            if (this.tok.nextExprIfNum(0x2c)) this.parseExpressions();
            this.parseSemi();
        }
    },

    parseExpressionForLabel: function(inFunction, inLoop, inSwitch){
        // dont check for label if you can already see it'll fail
        var checkLabel = this.tok.isType(IDENTIFIER);

        this.parsePrimary(checkLabel);

        // ugly but mandatory label check
        // if this is a label, the primary parser
        // will have bailed when seeing the colon.
        if (checkLabel && this.tok.nextIfNum(0x3a)) { // :
            this.parseStatement(inFunction, inLoop, inSwitch);
            return true;
        }

        // assignment ops are allowed until the first non-assignment binary op
        while (this.parseAssignmentOperator()) {
            this.parsePrimaryAfter();
        }

        // keep parsing non-assignment binary/ternary ops
        while (true) {
          if (this.parseBinaryOperator()) this.parsePrimaryAfter();
          else if (this.tok.isNum(0x3f)) this.parseTernary(); // ?
          else break;
        }
    },

    parseExpressions: function(){
        do {
            this.parseExpression();
        } while (this.tok.nextExprIfNum(0x2c));
    },
    parseExpression: function(){
      this.parsePrimary();

      // assignment ops are allowed until the first non-assignment binary op
      while (this.parseAssignmentOperator()) {
        this.parsePrimaryAfter();
      }

      // keep parsing non-assignment binary/ternary ops
      while (true) {
        if (this.parseBinaryOperator()) this.parsePrimaryAfter();
        else if (this.tok.isNum(0x3f)) this.parseTernary();
        else break;
      }
    },
  parseTernary: function(){
    this.tok.nextExpr();
    this.parseExpression();
    this.tok.mustBeNum(0x3a,true); // :
    this.parseExpression();
  },
  parseTernaryNoIn: function(){
    this.tok.nextExpr();
    this.parseExpression();
    this.tok.mustBeNum(0x3a,true); // :
    this.parseExpressionNoIn();
  },
    parsePrimaryAfter: function(){
        this.tok.nextExpr();
        this.parsePrimary();
    },
    parseExpressionsNoIn: function(){
        do {
            this.parseExpressionNoIn();
        } while (this.tok.nextExprIfNum(0x2c));
    },
    parseExpressionNoIn: function(){
      this.parsePrimary();

      // TOFIX: i think i should drop first while to fix `illegal bare assignment in for-in`
      //        because `for (x=y in z);` is not valid syntax (`for ((x=y)in z);` would be)
      //        but note that this is used for both var and non-var for-in's, so check for that.

      // assignment ops are allowed until the first non-assignment binary op
      while (this.parseAssignmentOperator()) {
        this.tok.nextExpr();
        this.parsePrimary();
      }

      // keep parsing non-assignment binary/ternary ops unless `in`
      while (true) {
        if (this.parseBinaryOperator()) {
          if (this.tok.is('in')) break;
          else this.parsePrimaryAfter();
        }
        else if (this.tok.isNum(0x3f)) this.parseTernaryNoIn();
        else break;
      }
    },
    parsePrimary: function(checkLabel){
      // parses parts of an expression without any binary operators

      this.parseUnary();

      if (this.tok.is('function')) {
        this.parseFunction();
      } else if (!this.tok.nextIfValue(VALUE)) {
        if (this.tok.nextExprIfNum(0x5b)) this.parseArray();
        else if (this.tok.nextIfNum(0x7b)) this.parseObject();
        else if (this.tok.nextExprIfNum(0x28)) this.parseGroup();
      } else if (checkLabel) {
        // now's the time... you just ticked off an identifier, check the current token for being a colon!
        // 3a = :
        if (this.tok.isNum(0x3a)) return;
      }

      this.parsePrimarySuffixes();
    },
    parseUnary: function(){
      while (!this.tok.isType(EOF) && this.testUnary()) {
        this.tok.nextExpr();
      }
    },
    testUnary: function(){
      // this method works under the assumption that the current token is
      // part of the set of valid tokens for js. So we don't have to check
      // for string lengths unless we need to disambiguate optional chars

      // regexUnary: /^(?:delete|void|typeof|new|\+\+?|--?|~|!)$/,
      var val = this.tok.getLastValue();
      var len = val.length;
      var c = val.charCodeAt(0);

      if (c === 0x2b) {
        if (len === 1) return true; // +
        if (val.charCodeAt(1) === 0x2b) return true; // ++
      }
      if (c === 0x2d) {
        if (len === 1) return true; // -
        if (val.charCodeAt(1) === 0x2d) return true; // --
      }
      if (c === 0x7e || c === 0x21) return true; // ~ !
      if (c === 0x64 && val === 'delete') return true;
      if (c === 0x76 && val === 'void') return true;
      if (c === 0x74 && val === 'typeof') return true;
      if (c === 0x6e && val === 'new') return true;

      return false;
    },
    parsePrimarySuffixes: function(){
        // --
        // ++
        // .<idntf>
        // [<exprs>]
        // (<exprs>)

        while (true) {
            if (this.tok.nextIfNum(0x2e)) {
                this.tok.mustBeType(IDENTIFIER);
            }
            else if (this.tok.nextExprIfNum(0x28)) {
                this.parseExpressions();
                this.tok.mustBeNum(0x29); // )
            }
            else if (this.tok.nextExprIfNum(0x5b)) {
                this.parseExpressions();
                this.tok.mustBeNum(0x5d); // ]
            }
            else if (this.tok.nextIf('--')) break; // ends primary expressions
            else if (this.tok.nextIf('++')) break; // ends primary expressions
            else break;
        }
    },
    parseAssignmentOperator: function(){
      // includes any "compound" operators
      // used to be: /^(?:[+*%&|^\/-]|<<|>>>?)?=$/
      // return (this.regexAssignmentOp.test(val));

      // this method works under the assumption that the current token is
      // part of the set of valid tokens for js. So we don't have to check
      // for string lengths unless we need to disambiguate optional chars

      var val = this.tok.getLastValue();
      var len = val.length;
      var c = val.charCodeAt(0);

      // in this case, directly matching for '=' might actually be faster... though minute
      if (len === 1 && val.charCodeAt(0) === 0x3d) return true; // =

      if (len === 2 && (
        c === 0x2b || // +
        c === 0x2a || // *
        c === 0x25 || // %
        c === 0x26 || // &
        c === 0x7c || // |
        c === 0x5e || // ^
        c === 0x2f || // /
        c === 0x2d    // -
        ) && val.charCodeAt(1) === 0x3d // =
      ) return true;

      if (
        len === 3 &&
        c === 0x3c &&
        val.charCodeAt(1) === 0x3c &&
        val.charCodeAt(2) === 0x3d
      ) return true; // <<=

      if (c === 0x3e && val.charCodeAt(1) === 0x3e) {
        if (len === 4 && val.charCodeAt(2) === 0x3e && val.charCodeAt(3) === 0x3d) return true; // >>>=
        if (len === 3 && val.charCodeAt(2) === 0x3d) return true; // >>=
      }

      return false;
    },
    parseBinaryOperator: function(){
      // non-assignment binary operator
      // /^(?:[+*%|^&\/-]|[=!]==?|<=|>=|<<?|>>?>?|&&|instanceof|in|\|\|)$/,
      //return (this.regexNonAssignBinaryOp.test(val));

      // this method works under the assumption that the current token is
      // part of the set of valid tokens for js. So we don't have to check
      // for string lengths unless we need to disambiguate optional chars

      var val = this.tok.getLastValue();
      var len = val.length;


      var c = val.charCodeAt(0);

      if ((
        c === 0x2b || // +
        c === 0x2a || // *
        c === 0x25 || // %
        c === 0x5e || // ^
        c === 0x2f || // /
        c === 0x2d    // -
      )) return true;

      if (c === 0x3d || c === 0x21) { // = !
        if (val.charCodeAt(1) === 0x3d) { // =
          if (len === 2) return true; // == !=
          if (val.charCodeAt(2) === 0x3d) return true; // === !==
        }
      }

      if (c === 0x3c) {
        if (len === 1) return true; // <
        var d = val.charCodeAt(1);
        if (d === 0x3c || d === 0x3d) return true; // << <=
      }

      if (c === 0x3e) {
        if (len === 1) return true; // >
        var d = val.charCodeAt(1);
        if (d === 0x3d) return true; // >=
        if (d === 0x3e) {
          if (len == 2) return true; // >>
          if (val.charCodeAt(2) === 0x3e) return true; // >>>
        }
      }

      if (c === 0x26) {
        if (len === 1) return true; // &
        if (val.charCodeAt(1) === 0x26) return true; // &&
      }

      if (c === 0x7c) {
        if (len === 1) return true; // |
        if (val.charCodeAt(1) === 0x7c) return true; // ||
      }

      if (c === 0x69 && (val === 'in' || val === 'instanceof')) return true;

      return false;
    },

    parseGroup: function(){
        this.parseExpressions();
        this.tok.mustBeNum(0x29); // )
    },
    parseArray: function(){
        do {
            this.parseExpressions();
        } while (this.tok.nextExprIfNum(0x2c)); // elision

        this.tok.mustBeNum(0x5d); // ]
    },
    parseObject: function(){
        do {
            if (this.tok.isValue()) this.parsePair();
        } while (this.tok.nextExprIfNum(0x2c)); // elision
        this.tok.mustBeNum(0x7d); // }
    },
    parsePair: function(){
        if (this.tok.nextIf('get')) {
            if (this.tok.isType(IDENTIFIER)) this.parseFunction();
            else this.parseDataPart();
        } else if (this.tok.nextIf('set')) {
            if (this.tok.isType(IDENTIFIER)) this.parseFunction();
            else this.parseDataPart();
        } else {
            this.parseData();
        }
    },
    parseData: function(){
        this.tok.next();
        this.parseDataPart();
    },
    parseDataPart: function(){
        this.tok.mustBeNum(0x3a,true); // :
        this.parseExpression();
    },
};
