/** 
 *
 * Translate the syntax tree into Javascript code.
 *
 */
var _     = require('underscore');

var JKT   = require('./generator');

exports.translate = function (expressions) {

  var SINGLE_EQUAL = ' = ';
  var TRIPLE_EQUAL = ' === ';

  var SEMICOLON    = ';';
  var COMMA        = ', ';
  var VAR          = 'var ';
  var RETURN       = 'return ';
  var IN           = ' in ';

  var OPEN_NOT     = '!( ';
  var CLOSE_NOT    = ')';

  var OPEN_BRACKET = '[';
  var CLOSE_BRACKET = ']';

  var OPEN_IF      = 'if (';
  var CLOSE_IF     = ') {';
  var OPEN_ELSE    = 'else {';
  var OPEN_ELSE_IF = 'else if (';

  var OPEN_FOR     = 'for (';
  var CLOSE_FOR    = ') {';

  var OPEN_FUNC    = 'function (';
  var CLOSE_FUNC   = ') {';
  var OPEN_CALL    = '(function (){';
  var CLOSE_CALL   = '}).call(this)';
  var CLOSE_BODY   = '}';


  var isReservedWord = function (word) {
    switch (word) {
      case 'abstract':   case 'boolean':  case 'break':
      case 'byte':       case 'case':     case 'catch':
      case 'char':       case 'continue': case 'debugger':
      case 'default':    case 'delete':   case 'do':
      case 'double':     case 'else':     case 'final':
      case 'finally':    case 'float':    case 'for':
      case 'function':   case 'goto':     case 'long':
      case 'if':         case 'in':       case 'infinity':
      case 'instanceof': case 'int':      case 'NaN':
      case 'native':     case 'new':      case 'return':
      case 'short':      case 'switch':   case 'synchronized':
      case 'this':       case 'throw':    case 'throws':
      case 'transient':  case 'try':      case 'typeof':
      case 'undefined':  case 'var':      case 'void':
      case 'volatile':   case 'while':    case 'with':
        return true;
      default:
        return false;
    }
  };

  var JKT_DEFINE = function (expression) {

    var DEFINE_DECL = expression[0];
    var DEFINE_VAR  = expression[1];
    var DEFINE_BODY = expression[2];
    var EMPTY       = expression[3];

    var validate = function () {

      // Are there a proper number of arguments?
      if (DEFINE_BODY === undefined)
        throw new SyntaxError('Define expects two arguments, but you only provided one.');
      if (EMPTY !== undefined)
        throw new SyntaxError('Define expects two arguments, but you provided more.');

      // Is this a valid variable name? (Inexhaustive test).
      if (isReservedWord(DEFINE_VAR))
        throw new SyntaxError('Set cannot be used with a reserved word: ' + DEFINE_VAR + '.');
      if (DEFINE_VAR[0].search(/[A-Za-z_$]/))
        throw new SyntaxError('Set cannot begin the ' + DEFINE_VAR[0] + ' character.');

    };

    var translate = function () {
      validate();
      if (_.isArray(DEFINE_VAR))
        return VAR + _.first(DEFINE_VAR) + SINGLE_EQUAL + JKT_LAMBDA(['λ', _.rest(DEFINE_VAR), DEFINE_BODY]) + SEMICOLON;
      else
        return VAR + JKT_TRANSLATE(DEFINE_VAR) + SINGLE_EQUAL + JKT_TRANSLATE(DEFINE_BODY) + SEMICOLON;
    };

    return translate();

  };

  var JKT_LAMBDA = function (expression) {

    var LAMBDA_DECL = expression[0];
    var LAMBDA_ARGS = expression[1];
    var LAMBDA_BODY = expression[2];
    var EMPTY       = expression[3];

    var parameters = function () {
      return _.map(LAMBDA_ARGS, JKT_TRANSLATE).join();
    };

    var validate = function () {

      // Are there a proper number of arguments?
      if (LAMBDA_BODY === undefined) 
        throw new SyntaxError('Lambda expects two arguments, but you only provided one.');
      if (EMPTY !== undefined)
        throw new SyntaxError('Lambda expects two arguments, but you provided more.');

    };

    var translate = function () {
      validate();
      PREFIX = (_.first(LAMBDA_BODY) === 'cond' || _.first(LAMBDA_BODY) === 'if' || _.first(LAMBDA_BODY) === 'let') ? '' : RETURN;
      return OPEN_FUNC + parameters(LAMBDA_ARGS) + CLOSE_FUNC + PREFIX + JKT_TRANSLATE(LAMBDA_BODY) + SEMICOLON + CLOSE_BODY;
    }

    return translate();
  };

  var JKT_LET = function (expression) {

    var LET_DECL = expression[0];
    var LET_VARS = expression[1];
    var LET_BODY = expression[2];
    var EMPTY    = expression[3];

    console.log('let');
    console.log(expression);

    var validate = function () {

      // Are there a proper number of arguments?
      if (LET_BODY === undefined) 
        throw new SyntaxError('Let expects two arguments, but you only provided one.');
      if (EMPTY !== undefined)
        throw new SyntaxError('Let expects two arguments, but you provided more.');

    };

    var translate = function () {
      validate();
      return _.reduce(LET_VARS, function (memo, LET_VAR, index) {
        return memo + VAR + LET_VAR[0] + SINGLE_EQUAL + JKT_TRANSLATE(LET_VAR[1]) + SEMICOLON;
      }, RETURN + OPEN_CALL) + JKT_TRANSLATE(LET_BODY) + SEMICOLON + CLOSE_CALL; 
    };

    return translate();

  };

  var JKT_HASH = function (expression) {

    var HASH_DECL = expression[0];
    var HASH_VALS = expression[1];
    var EMPTY     = expression[2];

    var validate = function () {

      // Are there a proper number of arguments?
      if (EMPTY !== undefined)
        throw new SyntaxError('Hash expects one argument, but you provided more.');

      _.each(HASH_VALS, function (index, HASH_VAL){
        // Are there a proper number of arguments?
        if (HASH_VAL.length !== 2)
          throw new SyntaxError('Hash properties expect two arguments, but you provided ' + HASH_VAL.length + '.');
      });

    };

    var translate = function () {
      validate();
      return (_.reduce(HASH_VALS, function (memo, HASH_VAL, index) {
        var end = (index === HASH_VALS.length - 1) ? '' : ',';
        return memo + _.first(HASH_VAL) + ':' + JKT_TRANSLATE(_.last(HASH_VAL)) + end;
      }, '{') + '}') || '{}';
    } ;

    return translate();
  };

  var JKT_SET = function (expression) {

    var SET_DECL = expression[0];
    var SET_VAR  = expression[1];
    var SET_VAL  = expression[2];
    var EMPTY    = expression[3];

    var validate = function () {

      // Are there a proper number of arguments?
      if (SET_VAL === undefined)
        throw new SyntaxError('Set expects two arguments, but you only provided one.');
      if (EMPTY !== undefined)
        throw new SyntaxError('Set expects two arguments, but you provided more.');

      // Is this a valid variable name? (Inexhaustive test).
      if (isReservedWord(SET_VAR))
        throw new SyntaxError('Set cannot be used with a reserved word: ' + SET_VAR + '.');
      if (SET_VAR[0].search(/[A-Za-z_$]/))
        throw new SyntaxError('Set cannot begin the ' + SET_VAR[0] + ' character.');

    };

    var translate = function () {
      validate();
      return SET_VAR + SINGLE_EQUAL + JKT_TRANSLATE(SET_VAL) + SEMICOLON;
    };

    return translate();

  };

  var JKT_DO = function (expression) {

  	var DO_DECL = expression[0];
  	var DO_VARS = expression[1];
  	var DO_COND = expression[2];
  	var DO_BODY = expression[3];
    var EMPTY   = expression[4];

  	var validate = function () {

      // Are there a proper number of arguments?
      if (EMPTY !== undefined)
        throw new SyntaxError('Do expects three arguments, but you provided more.');

  	};

  	var translate = function () {
      validate();

      var declaration = _.reduce(DO_VARS, function (memo, DO_VAR, index) {
        return memo + VAR + JKT_TRANSLATE(DO_VAR[0]) + SEMICOLON;
      }, '');

      var assignment = _.reduce(DO_VARS, function (memo, DO_VAR, index) {
        var SUFFIX = (index === DO_VARS.length - 1) ? '' : COMMA;
        return memo + JKT_TRANSLATE(DO_VAR[0]) + SINGLE_EQUAL + JKT_TRANSLATE(DO_VAR[1]) + SUFFIX;
      }, '') + SEMICOLON;

      var condition = JKT_TRANSLATE(DO_COND[0]) + SEMICOLON;

      var step = _.reduce(DO_VARS, function (memo, DO_VAR, index) {
        var SUFFIX = (index === DO_VARS.length - 1) ? '' : COMMA;
        var LEFT   = JKT_TRANSLATE(DO_VAR[0]);
        var RIGHT  = JKT_TRANSLATE(DO_VAR[2]);
        return (LEFT === RIGHT) ? memo : memo + LEFT + SINGLE_EQUAL + RIGHT + SUFFIX;
      }, '');

      var post = (DO_COND[1] !== undefined) ? RETURN + JKT_TRANSLATE(DO_COND[1]) + SEMICOLON : '';

      return OPEN_CALL + declaration + OPEN_FOR + assignment + condition + step + CLOSE_FOR + JKT_TRANSLATE(DO_BODY) + post + CLOSE_CALL;
  	};

  	return translate();
  	
  };

  var JKT_IF = function (expression) {

    var IF_DECL  = expression[0];
    var IF_BOOL  = expression[1];
    var IF_TRUE  = expression[2];
    var IF_FALSE = expression[3];
    var EMPTY    = expression[4];

    var validate = function () {

      // Are there a proper number of arguments?
      // if (IF_FALSE === undefined)
        // throw new SyntaxError('If expects three arguments, but you provided fewer.');
      if (EMPTY !== undefined)
        throw new SyntaxError('If expects three arguments, but provided more');

    };

    var translate = function () {
      validate();
      return (IF_FALSE === undefined) ?
        JKT.cond.if(JKT_TRANSLATE(IF_BOOL), JKT_TRANSLATE(IF_TRUE))
      : OPEN_IF + JKT_TRANSLATE(IF_BOOL) + CLOSE_IF + 
        RETURN + JKT_TRANSLATE(IF_TRUE) + SEMICOLON + CLOSE_BODY + OPEN_ELSE + 
        RETURN + JKT_TRANSLATE(IF_FALSE) + SEMICOLON + CLOSE_BODY;
    };

    return translate();

  };

  var JKT_COND = function (expression) {

    var COND_DECL = _.first(expression);
    var COND_EXPS = _.rest(expression);

    var validate = function () {

      // Are there a proper number of arguments?
      if (COND_EXPS === undefined)
        throw new SyntaxError('Cond expects one argument, but you provided none.');

      _.each(COND_EXPS, function (COND_EXP){
        // Are there a proper number of arguments?
        if (COND_EXP.length !== 2)
          throw new SyntaxError('Cond statements expect two arguments, but you provided ' + COND_EXP.length + '.');
      }); 

    };

    var translate = function () {
      validate();
      return _.reduce(COND_EXPS, function (memo, COND_EXP) {
        if (_.first(COND_EXP) === 'else')
          return memo + OPEN_ELSE + RETURN + JKT_TRANSLATE(COND_EXP[1]) + SEMICOLON + CLOSE_BODY;
        else if (memo === '')
          return memo + OPEN_IF + JKT_TRANSLATE(COND_EXP[0]) + CLOSE_IF + RETURN + JKT_TRANSLATE(COND_EXP[1]) + SEMICOLON + CLOSE_BODY;
        else
          return memo + OPEN_ELSE_IF + JKT_TRANSLATE(COND_EXP[0]) + CLOSE_IF + RETURN + JKT_TRANSLATE(COND_EXP[1]) + SEMICOLON + CLOSE_BODY;
      }, '');
    };

    return translate();

  };

  var JKT_PROCEDURE = function (expression) {

    var PROC_DECL = _.first(expression);
    var PROC_BODY = _.rest(expression);

    var binary_operation = function (operation, parameters){

      return _.reduce(_.rest(parameters), function (memo, parameter) {
        return memo + operation + JKT_TRANSLATE(parameter);
      }, JKT_TRANSLATE(_.first(parameters)));

    };

    var validate = function () {

      // Are there a proper number of arguments?
      if (PROC_BODY === undefined)
        throw new SyntaxError('Procedure calls expect at least one argument, but you provided none.');

    };

    var translate = function () {
      validate();
      switch (PROC_DECL) {
        case '+':
        case '*':
        case '/':
        case '-':
        case '%':
        case '<':
        case '>':
        case '<=':
        case '>=':
          return binary_operation(PROC_DECL, PROC_BODY);
        case '=':
          return binary_operation('===', PROC_BODY);
        case 'or':
          return binary_operation('||', PROC_BODY);
        case 'and':
          return binary_operation('&&', PROC_BODY);
        case 'call':
          return JKT_TRANSLATE(_.first(PROC_BODY)) + '();';
        case 'in':
          return JKT_TRANSLATE(_.first(PROC_BODY)) + IN + JKT_TRANSLATE(_.last(PROC_BODY));
        case 'list':
          return OPEN_BRACKET + _.map(PROC_BODY, JKT_TRANSLATE).join() + CLOSE_BRACKET;
        case 'null_bool':
          return PROC_BODY.unshift('eql_proc') && PROC_BODY.push('null') && JKT_TRANSLATE(PROC_BODY);
        case 'pair_bool':
          var obj = JKT_TRANSLATE(_.first(PROC_BODY));
          return obj + '.isArray && ' + obj + '.isArray()';
        case 'vector_set_bang':
          return JKT_TRANSLATE(PROC_BODY[0]) + OPEN_BRACKET + JKT_TRANSLATE(PROC_BODY[1]) + CLOSE_BRACKET + SINGLE_EQUAL + JKT_TRANSLATE(PROC_BODY[2]) + SEMICOLON;
        case 'vector_ref':
          return JKT_TRANSLATE(PROC_BODY[0]) + OPEN_BRACKET + JKT_TRANSLATE(PROC_BODY[1]) + CLOSE_BRACKET;
        case 'not':
          if (_.first(_.first(PROC_BODY)) === '=')
            return JKT_PROCEDURE(['neql', _.first(_.rest(_.first(PROC_BODY)))]);
          else
            return OPEN_NOT + JKT_TRANSLATE(_.first(PROC_BODY)) + CLOSE_CALL;
        case 'neql':
          return binary_operation('!==', _.flatten(PROC_BODY));
        default:
          return PROC_DECL + '(' + _.map(PROC_BODY, JKT_TRANSLATE).join() + ')';
      };
    };

    return translate();

  };

  var JKT_BEGIN = function (expression) {

    var BEGIN_DECL = _.first(expression);
    var BEGIN_EXPS = _.rest(expression);

    var validate = function () {

      // Are there a proper number of arguments?
      if (BEGIN_EXPS === undefined)
        throw new SyntaxError('Begin expects one argument, but you provided none.');

      _.each(BEGIN_EXPS, function (BEGIN_EXP) {
        // Are there a proper number of arguments?
        if (BEGIN_EXP.length !== 2)
          throw new SyntaxError('Begin statements expect two arguments, but you provided ' + BEGIN_EXP.length + '.');
      }); 

    }

    var translate = function () {
      validate();
      return _.reduce(BEGIN_EXPS, function (memo, BEGIN_EXP, index) {
        var PREFIX = (index === BEGIN_EXP.length - 1) ? RETURN : '';
        return memo + PREFIX + JKT_TRANSLATE(BEGIN_EXP) + SEMICOLON;
      }, OPEN_CALL) + CLOSE_CALL;
    };

    return translate();

  };

	var JKT_TRANSLATE = function (expression) {
		if (_.isString(expression) || !_.isArray(expression))
			return expression;
		switch (_.first(expression)) {
			case 'if':
				return JKT_IF(expression);
			case 'set_bang':
				return JKT_SET(expression);
			case 'define':
				return JKT_DEFINE(expression);
      case 'do':
        return JKT_DO(expression);
			case 'λ':
			case 'lambda':
				return JKT_LAMBDA(expression);
			case'let':
				return JKT_LET(expression);
			case 'hash':
				return JKT_HASH(expression);
			case 'cond':
				return JKT_COND(expression);
			case 'begin':
				return JKT_BEGIN(expression);
			default:
				return JKT_PROCEDURE(expression);
		}
	};

  return (_.isArray(expressions)) ? _.map(expressions, JKT_TRANSLATE).join('\n\n') : JKT_TRANSLATE(expressions);
};

