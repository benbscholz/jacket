/** 
 *
 * Translate the syntax tree into Javascript code.
 *
 */
var _     = require('underscore');

exports.translate = function (expressions) {

  var SINGLE_EQUAL = ' = ';
  var TRIPLE_EQUAL = ' === ';

  var SEMICOLON    = ';';
  var VAR          = 'var ';
  var RETURN       = 'return ';

  var OPEN_NOT     = '!( ';
  var CLOSE_NOT    = ')';

  var OPEN_BRACKET = '[';
  var CLOSE_BRACKET = ']';

  var OPEN_IF      = 'if (';
  var CLOSE_IF     = ') {';
  var OPEN_ELSE    = '} else {';
  var OPEN_ELSE_IF = '} else if (';

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
      return OPEN_FUNC + parameters(LAMBDA_ARGS) + CLOSE_FUNC + JKT_TRANSLATE(LAMBDA_BODY) + CLOSE_BODY;
    }

    return translate();
  };

  var JKT_LET = function (expression) {

    var LET_DECL = expression[0];
    var LET_VARS = expression[1];
    var LET_BODY = expression[2];
    var EMPTY    = expression[3];

    var validate = function () {

      // Are there a proper number of arguments?
      if (LET_BODY === undefined) 
        throw new SyntaxError('Let expects two arguments, but you only provided one.');
      if (EMPTY !== undefined)
        throw new SyntaxError('Let expects two arguments, but you provided more.');

    };

    var translate = function () {
      validate();
      return _.reduce(LET_VARS, function (memo, variable) {
        return memo + VAR + variable[0] + SINGLE_EQUAL + JKT_TRANSLATE(variable[1]) + SEMICOLON;
      }, RETURN + OPEN_CALL) + JKT_TRANSLATE(LET_BODY) + CLOSE_CALL;
    };

    return translate();

  };

  var JKT_HASH = function (expression) {

    var HASH_DECL = expression[0];
    var HASH_VALS = expression[1];
    var EMPTY     = expression[2];

    var validate = function () {

      // Are there a proper number of arguments?
      if (HASH_VALS === undefined)
        throw new SyntaxError('Hash expects one argument, but you provided none.');
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
      return _.reduce(HASH_VALS, function (memo, HASH_VAL, index) {
        var end = (index === HASH_VALS.length - 1) ? '' : ',';
        return memo + _.first(HASH_VAL) + ':' + JKT_TRANSLATE(_.last(HASH_VAL)) + end;
      }, '{') + '}';
    };
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
      return VAR + SET_VAR + SINGLE_EQUAL + JKT_TRANSLATE(SET_VAL) + SEMICOLON;
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
      if (IF_FALSE === undefined)
        throw new SyntaxError('If expects three arguments, but you provided fewer.');
      if (EMPTY !== undefined)
        throw new SyntaxError('If expects three arguments, but provided more');

    };

    var translate = function () {
      validate();
      return OPEN_IF + JKT_TRANSLATE(IF_BOOL) + CLOSE_IF + 
             RETURN + JKT_TRANSLATE(IF_TRUE) + SEMICOLON + OPEN_ELSE + 
             RETURN + JKT_TRANSLATE(IF_FALSE) + SEMICOLON + CLOSE_BODY;
    };

    return translate();

  };

  var JKT_COND = function (expression) {

    var COND_DECL = expression[0];
    var COND_EXPS = expression[1];
    var EMPTY     = expression[2];

    var validate = function () {

      // Are there a proper number of arguments?
      if (COND_EXPS === undefined)
        throw new SyntaxError('Cond expects one argument, but you provided none.');
      if (EMPTY !== undefined) 
        throw new SyntaxError('Cond expects one argument, but you provided more.');

      _.each(COND_EXPS, function (index, COND_EXP){
        // Are there a proper number of arguments?
        if (COND_EXP.length !== 2)
          throw new SyntaxError('Cond statements expect two arguments, but you provided ' + COND_EXP.length + '.');
      }); 

    };

    var translate = function () {
      validate();
      return _.reduce(COND_EXPS, function (memo, COND_EXP) {
        if (_.first(COND_EXPS) === 'else')
          return memo + OPEN_ELSE + JKT_TRANSLATE(COND_EXP[1]) + SEMICOLON + CLOSE_BODY;
        else if (memo === '')
          return memo + OPEN_IF + JKT_TRANSLATE(COND_EXP[1]) + CLOSE_IF + JKT_TRANSLATE(COND_EXP[2]) + SEMICOLON + CLOSE_BODY;
        else
          return memo + OPEN_ELSE_IF + JKT_TRANSLATE(COND_EXP[1]) + CLOSE_IF + JKT_TRANSLATE(COND_EXP[2]) + SEMICOLON + CLOSE_BODY;
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
      if (PROC_DECL === 'eql_proc')
        return binary_operation('===', PROC_BODY);
      else if (PROC_DECL === 'neql_proc')
        return binary_operation('!==', _.flatten(PROC_BODY));
      else if (PROC_DECL === 'or')
        return binary_operation('||', PROC_BODY);
      else if (PROC_DECL === 'and')
        return binary_operation('&&', PROC_BODY);
      else if (PROC_DECL === 'add_proc')
        return binary_operation('+', PROC_BODY);
      else if (PROC_DECL === 'mlt_proc')
        return binary_operation('*', PROC_BODY);
      else if (PROC_DECL === 'sub_proc')
        return binary_operation('-', PROC_BODY);
      else if (PROC_DECL === 'div_proc')
        return binary_operation('/', PROC_BODY);
      else if (PROC_DECL === 'div_proc')
        return binary_operation('%', PROC_BODY);
      else if (PROC_DECL === 'gt_proc')
        return binary_operation('>', PROC_BODY);
      else if (PROC_DECL === 'gte_proc')
        return binary_operation('>=', PROC_BODY);
      else if (PROC_DECL === 'lt_proc')
        return binary_operation('<', PROC_BODY);
      else if (PROC_DECL === 'lte_proc')
        return binary_operation('<=', PROC_BODY);
      else if (PROC_DECL === '_bool')
      	return PROC_BODY.push('null') && JKT_PROCEDURE(['neql_proc', PROC_BODY])
	    else if (PROC_DECL === 'list')
        return OPEN_BRACKET + _.map(PROC_BODY, JKT_TRANSLATE).join() + CLOSE_BRACKET;
      else if (PROC_DECL === 'vector_set')
        return JKT_TRANSLATE(PROC_BODY[0]) + OPEN_BRACKET + JKT_TRANSLATE(PROC_BODY[1]) + CLOSE_BRACKET + SINGLE_EQUAL + JKT_TRANSLATE(PROC_BODY[2]) + SEMICOLON;
      else if (PROC_DECL === 'vector_ref')
        return JKT_TRANSLATE(PROC_BODY[0]) + OPEN_BRACKET + JKT_TRANSLATE(PROC_BODY[1]) + CLOSE_BRACKET;
      else if (PROC_DECL === 'not')
        if (_.first(_.first(PROC_BODY)) === 'eql_proc')
          return JKT_PROCEDURE(['neql_proc', _.first(_.rest(_.first(PROC_BODY)))]);
        else
          return OPEN_NOT + JKT_TRANSLATE(_.first(PROC_BODY)) + CLOSE_CALL;
      else
        return PROC_DECL + '(' + _.map(PROC_BODY, JKT_TRANSLATE).join() + ')';
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

