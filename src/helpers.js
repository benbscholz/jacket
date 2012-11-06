
var _ = require('underscore');
var util = require('util');

var helpers = {
	
  opTransform : function (op) {
  
    return {
      '+'  : '+'
    , '*'  : '*'
    , '/'  : '/'
    , '-'  : '-'
    , '%'  : '%'
    , '<'  : '<'
    , '>'  : '>'
    , '<=' : '<='
    , '>=' : '>=' 
    , '='  : '==='
    , 'or' : '||'
    , 'and': '&&'
  , 'neql':'!=='
    }[op];
    
  },
  
  print: function () {
    console.log.apply(this, _.map(arguments, function (arg) {
      return util.inspect(arg, false, 100);
    }));
  },
  
  isStatement: function (node) {
    return node.type === 'IfExpression' ||
           node.type === 'CondExpression';
  },

  peekProcedure: function (node) {
    return (node.value[0] === undefined) ?
           undefined
         : node.value[0].value;
  },
  
  map: function (elem, fn) {
    return _.map(elem, function (elem) {
      return fn(elem);
    });
  }

};
	
_.extend(exports, helpers);