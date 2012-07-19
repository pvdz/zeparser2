var Par = function(input){
    this.tok = new Tok(input);
};

Par.prototype = {
    regexUnary: /^(?:delete|void|typeof|new|\+\+?|--?|~|!)$/,
    regexAssignmentOp: /^(?:[+*%&|^\/-]|<<|>>>?)?=$/,
    regexNonAssignBinaryOp: /^(?:[+*%|^&\/-]|[=!]==?|<=|>=|<<?|>>?>?|&&|instanceof|in|\|\|)$/,

    run: function(){
        // prepare
        this.tok.nextExpr();

        // go!
        this.parseStatements();
    },

    parseStatements: function(){
        var protect = 100000;
        while (--protect && !this.tok.isType(EOF) && this.parseStatement());
        if (!protect) throw 'loop protection triggered '+this.tok.debug();
    },
    parseStatement: function(){
      if (this.tok.isType(IDENTIFIER)) {
        // dont "just" return true. case and default still return false
        return this.parseIdentifierStatement();
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

      var d = val.charCodeAt(0); // ++ --
      if ((c === 0x2b && d === 0x2b) || (c === 0x2d || d === 0x2d)) {
        this.parseExpressionStatement();
        return true;
      }

      if (c === 0x7b) { // {
        this.tok.nextExpr();
        this.parseBlock();
        return true;
      }
      if (c === 0x3b) { // [
        this.tok.nextExpr();
        return true;
      } // empty statement

      if (this.tok.isType(EOF)) return false;
    },
    parseIdentifierStatement: function(){
      var val = this.tok.getLastValue();

      if (val === 'var') this.parseVar();
      else if (val === 'if') this.parseIf();
      else if (val === 'do') this.parseDo();
      else if (val === 'while') this.parseWhile();
      else if (val === 'for') this.parseFor();
      else if (val === 'continue') this.parseContinue();
      else if (val === 'break') this.parseBreak();
      else if (val === 'return') this.parseReturn();
      else if (val === 'throw') this.parseThrow();
      else if (val === 'switch') this.parseSwitch();
      else if (val === 'try') this.parseTry();
      else if (val === 'debugger') this.parseDebugger();
      else if (val === 'with') this.parseWith();
      else if (val === 'function') this.parseFunction();
      // case and default are handled elsewhere
      else if (val === 'case' || val === 'default') return false;
      else this.parseExpressionOrLabel();

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
            this.tok.mustBe(IDENTIFIER, true);
            if (this.tok.nextExprIf('=')) {
                this.parseExpression();
            }
        } while(this.tok.nextIf(','));
        this.parseSemi();

        return true;
    },
    parseVarPartNoIn: function(){
        this.tok.next();
        do {
            this.tok.mustBe(IDENTIFIER,true);
            if (this.tok.nextExprIf('=')) {
                this.parseExpressionNoIn();
            }
        } while(this.tok.nextIf(','));
    },
    parseIf: function(){
        // if (<exprs>) <stmt>
        // if (<exprs>) <stmt> else <stmt>

        this.tok.next();
        this.parseStatementHeader();
        this.parseStatement();

        this.parseElse();

        return true;
    },
    parseElse: function(){
        // else <stmt>;

        if (this.tok.nextIf('else')) {
            this.parseStatement();
        }
    },
    parseDo: function(){
        // do <stmt> while ( <exprs> ) ;

        this.tok.nextExpr();
        this.parseStatement();
        this.tok.mustBe('while');
        this.tok.mustBe('(');
        this.parseExpressions();
        this.tok.mustBe(')');
        this.parseSemi();
    },
    parseWhile: function(){
        // while ( <exprs> ) <stmt>

        this.tok.next();
        this.parseStatementHeader();
        this.parseStatement();
    },
    parseFor: function(){
      // for ( <expr-no-in-=> in <exprs> ) <stmt>
      // for ( var <idntf> in <exprs> ) <stmt>
      // for ( var <idntf> = <exprs> in <exprs> ) <stmt>
      // for ( <expr-no-in> ; <expr> ; <expr> ) <stmt>

      // need to excavate this... investigate specific edge cases for `for-in`

      this.tok.next();
      this.tok.mustBe('(');

      if (this.tok.is('var')) this.parseVarPartNoIn();
      else this.parseExpressionsNoIn();

      if (this.tok.nextIf(';')) this.parseForEach();
      else this.parseForIn();
    },
    parseForEach: function(){
        // <expr> ; <expr> ) <stmt>

        this.parseExpressions();
        this.tok.mustBe(';');
        this.parseExpressions();
        this.tok.mustBe(')');
        this.parseStatement();
    },
    parseForIn: function(){
        // in <exprs> ) <stmt>

        this.tok.mustBe('in');
        this.parseExpressions();
        this.tok.mustBe(')');
        this.parseStatement();
    },
    parseContinue: function(){
        // continue ;
        // continue <idntf> ;
        // newline right after keyword = asi

        this.tok.next();
        if (this.tok.lastNewline) this.addAsi();
        else {
            this.tok.nextIf(IDENTIFIER);
            this.parseSemi();
        }
    },
    parseBreak: function(){
        // break ;
        // break <idntf> ;
        // newline right after keyword = asi

        this.tok.next();
        if (this.tok.lastNewline) this.addAsi();
        else {
            this.tok.nextIf(IDENTIFIER);
            this.parseSemi();
        }
    },
    parseReturn: function(){
        // return ;
        // return <exprs> ;
        // newline right after keyword = asi

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
    parseSwitch: function(){
        // switch ( <exprs> ) { <switchbody> }

        this.tok.next();
        this.parseStatementHeader();
        this.tok.mustBe('{', true);
        this.parseSwitchBody();
        this.tok.mustBe('}');
    },
    parseSwitchBody: function(){
        // [<cases>] [<default>] [<cases>]

        // default can go anywhere...
        this.parseCases();
        if (this.tok.nextIf('default')) {
            this.parseDefault();
            this.parseCases();
        }
    },
    parseCases: function(){
        while (this.tok.nextIf('case',true)) {
            this.parseCase();
        }
    },
    parseCase: function(){
        // case <value> : <stmts-no-case-default>
        this.parseExpressions();
        this.tok.mustBe(':',true);
        this.parseStatements();
    },
    parseDefault: function(){
        // default <value> : <stmts-no-case-default>
        this.tok.mustBe(':',true);
        this.parseStatements();
    },
    parseTry: function(){
        // try { <stmts> } catch ( <idntf> ) { <stmts> }
        // try { <stmts> } finally { <stmts> }
        // try { <stmts> } catch ( <idntf> ) { <stmts> } finally { <stmts> }

        this.tok.next();
        this.parseCompleteBlock();

        var one = this.parseCatch();
        var two = this.parseFinally();

        if (!one && !two) throw 'Try must have at least a catch or finally block or both: '+this.tok.debug();
    },
    parseCatch: function(){
        // catch ( <idntf> ) { <stmts> }

        if (this.tok.nextIf('catch')) {
            this.tok.mustBe('(');
            this.tok.mustBe(IDENTIFIER);
            this.tok.mustBe(')');
            this.parseCompleteBlock();

            return true;
        }
    },
    parseFinally: function(){
        // finally { <stmts> }

        if (this.tok.nextIf('finally')) {
            this.parseCompleteBlock();

            return true;
        }
    },
    parseDebugger: function(){
        // debugger ;

        this.tok.next();
        this.parseSemi();
    },
    parseWith: function(){
        // with ( <exprs> ) <stmts>

        this.tok.next();
        this.parseStatementHeader();
        this.parseStatement();
    },
    parseFunction: function(hasName){
        // function [<idntf>] ( [<param>[,<param>..] ) { <stmts> }

        this.tok.next(); // 'function'
        this.tok.nextIf(IDENTIFIER); // name
        this.parseFunctionRemainder();
    },
    parseNamedFunction: function(hasName){
        // function [<idntf>] ( [<param>[,<param>..] ) { <stmts> }

        this.tok.next(); // 'function'
        this.tok.mustBe(IDENTIFIER); // name
        this.parseFunctionRemainder();
    },
    parseFunctionRemainder: function(){
        this.tok.mustBe('(');
        this.parseParameters();
        this.tok.mustBe(')');
        this.parseCompleteBlock();
    },
    parseParameters: function(){
        // [<idntf> [, <idntf>]]

        if (this.tok.nextIf(IDENTIFIER)) {
            while (this.tok.nextIf(',')) {
                this.tok.mustBe(IDENTIFIER);
            }
        }
    },
    parseBlock: function(){
        this.parseStatements();
        this.tok.mustBe('}', true);
        return true;
    },
    parseCompleteBlock: function(){
        this.tok.mustBe('{', true);
        this.parseBlock();
    },
    parseSemi: function(){
        if (this.tok.nextIf(';')) return PUNCTUATOR;
        if (this.parseAsi()) return ASI;
        throw 'Unable to parse semi, unable to apply ASI';
//      : '+this.tok.debug()+' #### '+
//            this.tok.input.substring(this.tok.lastStart-2000, this.tok.lastStart)+
//            '###'+
//            this.tok.input.substring(this.tok.lastStart, this.tok.lastStart+2000);
    },
    parseAsi: function(){
      // 0x7d=}
      if (this.tok.isType(EOF) || this.tok.isNum(0x7d) || this.tok.lastNewline) {
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

    parseExpressionOrLabel: function(){
        var found = this.parseExpressionForLabel();
        if (!found) {
            if (this.tok.nextExprIf(',')) this.parseExpressions();
            this.parseSemi();
        }
    },

    parseExpressionForLabel: function(){
        // dont check for label if you can already see it'll fail
        var checkLabel = this.tok.isType(IDENTIFIER);

        this.parsePrimary(checkLabel);

        // ugly but mandatory label check
        // if this is a label, the primary parser
        // will have bailed when seeing the colon.
        if (checkLabel && this.tok.nextIf(':')) {
            this.parseStatement();
            return true;
        }

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

    parseExpressions: function(){
        do {
            this.parseExpression();
        } while (this.tok.nextExprIf(','));
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
    this.tok.mustBe(':',true);
    this.parseExpression();
  },
  parseTernaryNoIn: function(){
    this.tok.nextExpr();
    this.parseExpression();
    this.tok.mustBe(':',true);
    this.parseExpressionNoIn();
  },
    parsePrimaryAfter: function(){
        this.tok.nextExpr();
        this.parsePrimary();
    },
    parseExpressionsNoIn: function(){
        do {
            this.parseExpressionNoIn();
        } while (this.tok.nextExprIf(','));
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
      } else if (!this.tok.nextIf(VALUE)) {
        if (this.tok.nextExprIf('[')) this.parseArray();
        else if (this.tok.nextIf('{')) this.parseObject();
        else if (this.tok.nextExprIf('(')) this.parseGroup();
      } else if (checkLabel) {
        // now's the time... you just ticked off an identifier, check the current token for being a colon!
        // 3a = :
        if (this.tok.isNum(0x3a)) return;
      }

      this.parsePrimarySuffixes();
    },
    parseUnary: function(){
        // start with unary
        var rex = this.regexUnary;
        if (rex.test(this.tok.getLastValue())) {
            do {
                this.tok.nextExpr();
            } while (!this.tok.isType(EOF) && rex.test(this.tok.getLastValue()));
        }
    },
    parsePrimarySuffixes: function(){
        // --
        // ++
        // .<idntf>
        // [<exprs>]
        // (<exprs>)

        while (true) {
            if (this.tok.nextIf('.')) {
                this.tok.mustBe(IDENTIFIER);
            }
            else if (this.tok.nextExprIf('(')) {
                this.parseExpressions();
                this.tok.mustBe(')');
            }
            else if (this.tok.nextExprIf('[')) {
                this.parseExpressions();
                this.tok.mustBe(']');
            }
            else if (this.tok.nextIf('--')) break; // ends primary expressions
            else if (this.tok.nextIf('++')) break; // ends primary expressions
            else break;
        }
    },
    parseAssignmentOperator: function(){
        // includes any "compound" operator

        var val = this.tok.getLastValue();
        return (this.regexAssignmentOp.test(val));
    },
    parseBinaryOperator: function(){
        // non-assignment binary operator
        var val = this.tok.getLastValue();
        return (this.regexNonAssignBinaryOp.test(val));
    },

    parseGroup: function(){
        this.parseExpressions();
        this.tok.mustBe(')');
    },
    parseArray: function(){
        do {
            this.parseExpressions();
        } while (this.tok.nextExprIf(',')); // elision

        this.tok.mustBe(']');
    },
    parseObject: function(){
        do {
            if (this.tok.isValue()) this.parsePair();
        } while (this.tok.nextExprIf(',')); // elision
        this.tok.mustBe('}');
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
        this.tok.mustBe(':',true);
        this.parseExpression();
    },
};
