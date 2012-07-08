var Par = function(input){
    this.tok = new Tok(input);
};

Par.prototype = {
    run: function(){
        // prepare
        this.tok.nextExpr();

        // go!
        this.parseStatements();
    },

    parseStatements: function(){
        var protect = 10000;
        while (--protect && this.tok.lastBlack != EOF && this.parseStatement());
        if (!protect) throw 'loop protection triggered '+this.tok.debug();
    },
    parseStatement: function(){
        if (this.tok.is(IDENTIFIER)) {
            switch (this.tok.getLastValue()) {
                case 'var': this.parseVar(); break;
                case 'if': this.parseIf(); break;
                case 'do': this.parseDo(); break;
                case 'while': this.parseWhile(); break;
                case 'for': this.parseFor(); break;
                case 'continue': this.parseContinue(); break;
                case 'break': this.parseBreak(); break;
                case 'return': this.parseReturn(); break;
                case 'throw': this.parseThrow(); break;
                case 'switch': this.parseSwitch(); break;
                case 'try': this.parseTry(); break;
                case 'debugger': this.parseDebugger(); break;
                case 'with': this.parseWith(); break;
                case 'function': this.parseFunction(); break;
                default:
                    if (
                        this.tok.is('case') ||
                        this.tok.is('default')
                    ) {
                        // case and default are handled elsewhere
                        return false;
                    }

                    this.parseExpressionOrLabel();
                    break;
            }

            return true;
        }

        if (
            this.tok.is(VALUE) ||
            this.tok.is('(') ||
            this.tok.is('[') ||
            this.tok.is('++') ||
            this.tok.is('--') ||
            this.tok.is('+') ||
            this.tok.is('-') ||
            this.tok.is('~') ||
            this.tok.is('!')
        ) return this.parseExpressionStatement();

        if (this.tok.nextIf('{')) return this.parseBlock();
        if (this.tok.nextIf(';')) return true; // empty statement
        if (this.tok.is(EOF)) return false;

        console.error('Unfinished statement business... '+this.tok.debug());
    },

    parseVar: function(){
        // var <vars>
        // - foo
        // - foo=bar
        // - ,foo=bar

        this.tok.next();
        do {
            this.tok.mustBe(IDENTIFIER);
            if (this.tok.nextIf('=')) {
                this.parseExpression();
            }
        } while(this.tok.nextIf(','));
        this.parseSemi();

        return true;
    },
    parseVarPartNoIn: function(){
        this.tok.next();
        do {
            this.tok.mustBe(IDENTIFIER);
            if (this.tok.nextIf('=')) {
                this.parseExpressionNoIn();
            }
        } while(this.tok.nextIf(','));
    },
    parseIf: function(){
        // if (<exprs>) <stmt>
        // if (<exprs>) <stmt> else <stmt>

        this.tok.next();
        this.tok.mustBe('(');
        this.parseExpressions();
        this.tok.mustBe(')');
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
        this.tok.mustBe('(');
        this.parseExpressions();
        this.tok.mustBe(')');
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

        var parsedAssignment = false;
        if (this.tok.is('var')) this.parseVarPartNoIn();
        else parsedAssignment = this.parseExpressionNoIn();

        if (this.tok.nextIf(';')) this.parseForEach();
        else {
            if (parsedAssignment) {
                // TOFIX: this is a syntax error...
                console.warn("Syntax error, illegal assignment in for-in", this.tok.debug());
            }
            this.parseForIn();
        }
    },
    parseForEach: function(){
        // <expr> ; <expr> ) <stmt>

        this.parseExpression();
        this.tok.mustBe(';');
        this.parseExpression();
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
        this.tok.nextIf(IDENTIFIER);
        this.parseSemi();
    },
    parseBreak: function(){
        // break ;
        // break <idntf> ;
        // newline right after keyword = asi

        this.tok.next();
        this.tok.nextIf(IDENTIFIER);
        this.parseSemi();
    },
    parseReturn: function(){
        // return ;
        // return <exprs> ;
        // newline right after keyword = asi

        this.tok.nextExpr();
        this.parseExpressions();
        this.parseSemi();
    },
    parseThrow: function(){
        // throw <exprs> ;

        this.tok.nextExpr();
        this.parseExpressions();
        this.parseSemi();
    },
    parseSwitch: function(){
        // switch ( <exprs> ) { <switchbody> }

        this.tok.next();
        this.tok.mustBe('(');
        this.parseExpressions();
        this.tok.mustBe(')');
        this.tok.mustBe('{');
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
        while (this.tok.nextIf('case')) {
            this.parseCase();
        }
    },
    parseCase: function(){
        // case <value> : <stmts-no-case-default>
        if (this.tok.nextIf(VALUE)) {
            this.tok.mustBe(':');
            this.parseStatements();
        }
    },
    parseDefault: function(){
        // default <value> : <stmts-no-case-default>
        this.tok.mustBe(':');
        this.parseStatements();
    },
    parseTry: function(){
        // try { <stmts> } catch ( <idntf> ) { <stmts> }
        // try { <stmts> } finally { <stmts> }
        // try { <stmts> } catch ( <idntf> ) { <stmts> } finally { <stmts> }

        this.tok.next();
        this.tok.mustBe('{');
        this.parseStatements();
        this.tok.mustBe('}');

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
            this.tok.mustBe('{');
            this.parseStatements();
            this.tok.mustBe('}');

            return true;
        }
    },
    parseFinally: function(){
        // finally { <stmts> }

        if (this.tok.nextIf('finally')) {
            this.tok.mustBe('{');
            this.parseStatements();
            this.tok.mustBe('}');

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
        this.tok.mustBe('(');
        this.parseExpressions();
        this.tok.mustBe(')');
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
        this.tok.mustBe('{');
        this.parseStatements();
        this.tok.mustBe('}');
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
        this.tok.mustBe('}');
    },
    parseSemi: function(){
        if (this.tok.nextIf(';')) return true;
        if (this.parseAsi()) return true;

        throw 'Unable to parse semi, unable to apply ASI: '+this.tok.debug();
    },
    parseAsi: function(){
        if (this.tok.is(EOF)) return true;
        if (this.tok.is('}')) return true;

        // need to fix the newline one...
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
        var checkLabel = this.tok.is(IDENTIFIER);

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
        while (this.parseBinaryOperator()) {
            if (this.tok.is('?')) this.parseTernary();
            else this.parsePrimaryAfter();
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
        while (this.parseBinaryOperator()) {
            if (this.tok.is('?')) this.parseTernary();
            else this.parsePrimaryAfter();
        }
    },
    parseTernary: function(){
        this.tok.nextExpr();
        this.parseExpression();
        this.tok.mustBe(':');
        this.parseExpression();
    },
    parsePrimaryAfter: function(){
        this.tok.nextExpr();
        this.parsePrimary();
    },
    parseExpressionNoIn: function(){
        var parsedAssignment = false; // not allowed in for-in
        this.parsePrimary();

        // assignment ops are allowed until the first non-assignment binary op
        while (this.parseAssignmentOperator() && !this.tok.is('in')) {
            this.tok.nextExpr();
            this.parsePrimary();
            parsedAssignment = true; // wruh-oh
        }

        // keep parsing non-assignment binary ops
        while (this.parseBinaryOperator() && !this.tok.is('in')) {
            this.tok.nextExpr();
            this.parsePrimary();
        }

        return parsedAssignment;
    },
    parsePrimary: function(checkLabel){
        // parses parts of an expression without any binary operators

        this.parseUnary();

        if (this.tok.is('function')) {
            this.parseFunction();
        } else if (!this.tok.nextIf(VALUE)) {
            if (this.tok.nextIf('[')) this.parseArray();
            else if (this.tok.nextIf('{')) this.parseObject();
            else if (this.tok.nextExprIf('(')) this.parseGroup();
        } else if (checkLabel) {
            // now's the time... you just ticked off an identifier, check the current token for being a colon!
            if (this.tok.is(':')) return;
        }

        this.parsePrimarySuffixes();
    },
    parseUnary: function(){
        // start with unary
        var val = this.tok.getLastValue();
        var rex = /^(?:delete|void|typeof|new|\+\+?|--?|~|!)$/;
        if (rex.test(val)) {
            do {
                val = this.tok.nextExpr();
            } while (!this.tok.is(EOF) && rex.test(val));
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
                console.log(this.tok.debug())
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
        return (/^(?:[+*%&|^\/-]|<<|>>>?)?=$/.test(val));
    },
    parseBinaryOperator: function(){
        // non-assignment binary operator
        var val = this.tok.getLastValue();
        return (/^(?:[+*%|^&?\/-]|[=!]==?|<=|>=|<<?|>>?>?|&&|instanceof|in|\|\|)$/.test(val));
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
            if (this.tok.is(VALUE)) this.parsePair();
        } while (this.tok.nextExprIf(',')); // elision
        this.tok.mustBe('}');
    },
    parsePair: function(){
        if (this.tok.nextIf('get')) {
            if (this.tok.is(IDENTIFIER)) this.parseFunction();
            else this.parseDataPart();
        } else if (this.tok.nextIf('set')) {
            if (this.tok.is(IDENTIFIER)) this.parseFunction();
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
        this.tok.mustBe(':');
        this.parseExpression();
    },
};
