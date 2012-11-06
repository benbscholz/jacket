
(function () {
  
  var _ = require('underscore');
  
  var wrapExpression = function (fn) {
    return function () {
      return arguments[arguments.length-1] === true ?
      {
        type: 'ExpressionStatement'
      , expression: fn.apply(this, [].slice.call(arguments, 0, arguments.length-1))
      }
      :
      fn.apply(this, arguments);
    };
  };
  
  var program
    = exports.program
    = function (body) {
    return {
      type: 'Program'
    , body: body
    }; 
  };
  
  var blockStatement 
    = exports.blockStatement 
    = function (body) {
    return {
      type: 'BlockStatement'
    , body: body
    };
  };
  
  var expressionStatement
    = exports.expressionStatement
    = function (expression) {
    return {
      type: 'ExpressionStatement'
    , expression: expression
    };
  };
  
  var ifStatement
    = exports.ifStatement
    = function (test, cons, alt) {
    return {
      type: 'IfStatement'
    , test: test
    , consequent: cons
    , alternate: alt
    };
  };
  
  var switchStatement
    = exports.switchStatement
    = function (disc, cases, isLexical) {
    return {
      type: 'SwitchStatement'
    , discriminant: disc
    , cases: cases
    , isLexical: isLexical
    };   
  };
  
  var forStatement 
    = exports.forStatement 
    = function (init, test, update, body) {
    return {
      type: 'ForStatement'
    , init: init
    , test: test
    , update: update
    , body: blockStatement(body)
    };
  };
  
  var breakStatement
    = exports.breakStatement
    = function () {
    return {
      type: 'BreakStatement'
    , label: null
    };
  };
  
  var returnStatement 
    = exports.returnStatement 
    = function (argument) {
    return {
      type: 'ReturnStatement' 
    , argument: argument
    };
  };
  
  var variableDeclaration 
    = exports.variableDeclaration 
    = function (kind, dtors) {
    return {
      type:  'VariableDeclaration'
    , declarations: dtors
    , kind: 'var'
    };
  };
  
  var variableDeclarator
    = exports.variableDeclarator
    = function (patt, init) {
    return {
      type: 'VariableDeclarator'
    , id: patt
    , init: init
    };
  };
  
  var unaryExpression
    = exports.unaryExpression
    = wrapExpression(function (op, arg) {
    return {
      type: 'UnaryExpression' 
    , operator: op
    , argument: arg
    };  
  });
  
  var binaryExpression
    = exports.binaryExpression
    = wrapExpression(function (op, left, right) {
    return {
      type: 'BinaryExpression'
    , operator: op
    , left: left
    , right: right 
    };   
  });
  
  var assignmentExpression
    = exports.assignmentExpression
    = wrapExpression(function (op, left, right) {
    return {
      type: 'AssignmentExpression'
    , operator: op
    , left: left
    , right: right
    };
  });
  
  var logicalExpression
    = exports.logicalExpression
    = wrapExpression(function (op, left, right) {
    return {
      type: 'LogicalExpression'
    , operator: op
    , left: left
    , right: right
    };
  });
  
  var callExpression
    = exports.callExpression
    = wrapExpression(function (proc, args) {
    return {
      type: 'CallExpression'
    , callee: proc
    , arguments: args 
    };  
  });
  
  var memberExpression 
    = exports.memberExpression 
    = wrapExpression(function (obj, prop, isComputed) {
    return {
      type: 'MemberExpression'
    , computed: isComputed
    , object: obj
    , property: prop
    }; 
  });
  
 var functionExpression 
    = exports.functionExpression 
    = wrapExpression(function (name, args, body, isGenerator) {
    return {
      type: 'FunctionExpression'
    , id: name
    , params: args
    , body: body
    , isGenerator: isGenerator
    };
  });
  
  var arrayExpression
    = exports.arrayExpression
    = wrapExpression(function (elts) {
    return {
      type: 'ArrayExpression'
    , elements: elts
    };  
  });
  
  var objectExpression
    = exports.objectExpression
    = wrapExpression(function (props) {
    return {
      type: 'ObjectExpression'  
    , properties: props
    };
  });
  
  var thisExpression 
    = exports.thisExpression 
    = function () {
    return {
      type: 'ThisExpression'
    };
  };
  
  var switchCase
    = exports.switchCase
    = function (test, cons) {
    return {
      type: 'SwitchCase'
    , test: test
    , consequent: cons
    };   
  };
  
  var identifier 
    = exports.identifier 
    = wrapExpression(function (name) {
    return {
      type: 'Identifier'
    , name: name 
    };
  });
  
  var literal 
    = exports.literal 
    = wrapExpression(function (value) {
    return {
      type: 'Literal'
    , value: value 
    };
  });
  
  var property 
    = exports.property 
    = function (key, value) {
    return {
      type: 'Property'
    , key: key
    , value: value
    , kind: 'init'
    };
  };
  
  exports.null = literal(null);
  exports.undefined = literal('undefined');
  
}());






