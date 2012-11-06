

var _  = require('underscore');
var $j = require('./helpers');

exports.annotate = function (ast) {
  
  var annotate_if = function (node) {
    
    return {
      type: 'IfExpression'
    , test: translate(node.value[1])
    , cons: translate(node.value[2])
    , alt:  translate(node.value[3])
    };
    
  };
  
  var annotate_cond = function (node) {
    
    return {
      type: 'CondExpression'
    , cases: _.map(_.rest(node.value), function (elem) {
        return $j.map(elem.value, translate);
      })
    };
    
  };
  
  var annotate_do = function (node) {
    var init = node.value[1].value[0].value;
    
    return {
      type: 'DoExpression'
    , init: [translate(init[0]), translate(init[1])]
    , test: translate(node.value[2].value[0])
    , step: translate(init[2])
    , body: translate(node.value[3])
    , end:  translate(node.value[2].value[1])
    };
    
  };
  
  var annotate_null = function (node) {
    
    return {
      type: 'NullCheck'
    , argument: translate(node.value[1])
    };
    
  };
  
  var annotate_define_variable = function (node) {
    
    return {
      type: 'DefineVariable'
    , id: translate(node.value[1])
    , value: translate(node.value[2])
    };
    
  };
  
  var annotate_define_inward = function (node) {
    
    return {
      type: 'DefineInward'
    , id: annotate_atom({
        type: 'Symbol'
      , value: _.rest(node.value[1].value).join('')
      })
    , value: translate(node.value[2])
    }; 
    
  };
  
  var annotate_define_function = function (node) {
    
    return {
      type: 'DefineFunction'
    , id:   translate(_.first(node.value[1].value))
    , args: $j.map(_.rest(node.value[1].value), translate)
    , body: translate(node.value[2])
    }; 
    
  };
  
  var annotate_define = function (node) {
    
    var type = node.value[1].type;
    var head = node.value[1].value[0];
    
    if (type === 'Expression')
      return annotate_define_function(node);
    else if (head === '>')
      return annotate_define_inward(node);
    else
      return annotate_define_variable(node);
    
  };
  
  var annotate_set = function (node) {
    
    return {
      type: 'SetExpression'
    , id: translate(node.value[1])
    , val: translate(node.value[2])
    }
    
  };
  
  var annotate_case = function (node) {
    
    return {
      type: 'CaseExpression'
    , test: translate(node.value[1])
    , cases: _.map(_.rest(_.rest(node.value)), function (elem) {
        var cases = $j.map(elem.value[0].value, translate);
        var ret   = translate(elem.value[1]);
        
        return [ cases, ret ];
      })
    };
    
  };
  
  var annotate_quote = function (node) {
    
    return {
      type: 'QuotedExpression'
    , argument: node.value[1]
    };
    
  };
  
  var annotate_begin = function (node) {
    
    return {
      type: 'BeginExpression'
    , exprs: $j.map(_.rest(node.value), translate)
    };
    
  };
  
  var annotate_lambda = function (node) {
    
    return {
      type: 'LambdaExpression'
    , args: _.map(node.value[1].value, translate)
    , body: translate(node.value[2])
    };
    
  };
  
  var annotate_let = function (node) {
    
    return {
      type: 'LetExpression'
    , vars: _.map(node.value[1].value, function (x) {
        return $j.map(x.value, translate);
      })
    , body: translate(node.value[2])
    };
    
  };
  
  var annotate_letstar = function (node) {
    
    return {
      type: 'LetStarExpression'
    , vars: _.map(node.value[1].value, function (x) {
        return $j.map(x.value, translate);
      })
    , body: translate(node.value[2])
    };
    
  };
  
  var annotate_letrec = function (node) {
    
    return {
      type: 'LetRecExpression'
    , vars: _.map(node.value[1].value, function (x) {
        return $j.map(x.value, translate);
      })
    , body: translate(node.value[2])
    };
    
  };
  
  var annotate_binary = function (node) {
    
    return {
      type: 'BinaryOperation'
    , op: translate(node.value[0])
    , args: $j.map(_.rest(node.value), translate)
    };
    
  };
  
  var annotate_logical = function (node) {
    
    return {
      type: 'LogicalOperation'
    , op: translate(node.value[0])
    , args: $j.map(_.rest(node.value), translate)
    };
    
  };
  
  var annotate_list = function (node) {
    
    return {
      type: 'ListObject'
    , elems: $j.map(_.rest(node.value), translate)
    };
    
  };
  
  var annotate_hash = function (node) {
    
    return {
      type: 'HashObject'
    , elems: _.map(_.rest(node.value), function (elem) {
        return $j.map(elem.value, translate);
      })
    };
    
  };
  
  var annotate_not = function (node) {
    
    return {
      type: 'NotExpression'
    , argument: translate(node.value[1])
    };
    
  };
  
  var annotate_nth = function (node) {
    
    return {
      type: 'NthExpression'
    , list: translate(node.value[1])
    , index: translate(node.value[2])
    };
    
  };
  
  var annotate_call = function (node) {
    
    var proc, args;
    
    if (node.value[0].value[0] !== '.') {
      proc = translate(node.value[0]);
      args = $j.map(_.rest(node.value), translate);
    } else {
      proc = translate({
        type: 'Symbol'
      , value: node.value[1].value.concat(node.value[0].value)
      });
      args = $j.map(_.rest(_.rest(node.value)), translate);
    }
    
    return {
      type: 'ProcedureCall'
    , proc: proc
    , args: args
    };
    
  };
  
  var annotate_display = function (node) {
    
    return {
      type: 'ProcedureCall'
    , proc: annotate_atom({type: 'Symbol', value: 'console.log'})
    , args: $j.map(_.rest(node.value), translate)
    };
    
  };
  
  var annotate_atom = function (node) {
    
    var value, i = String(node.value).indexOf('::');
    
    if (i === -1)
      value = node.value;
    else
      value = node.value.slice(0, i)+'.prototype.'+node.value.slice(i+2,node.value.length);
    
    return {
      type: 'Atom'
    , kind: node.type
    , value: value
    };
    
  };
  
  var translate = function (node) {
    
    // $j.print(node);
    
    switch (node.type) {
      
      case 'String': case 'Symbol': case 'Integer':
        return annotate_atom(node);
        
      case 'Expression':
        switch ($j.peekProcedure(node)) {
          
          case 'if':
            return annotate_if(node);
          case 'cond':
            return annotate_cond(node);
          case 'do':
            return annotate_do(node);
          case 'null?':
            return annotate_null(node);
          case 'define':
            return annotate_define(node);
          case 'set!':
            return annotate_set(node);
          case 'case':
            return annotate_case(node);
          case 'quote':
            return annotate_quote(node);
          case 'begin':
            return annotate_begin(node);
          case 'lambda':
            return annotate_lambda(node);
          case 'let':
            return annotate_let(node);
          case 'let*':
            return annotate_letstar(node);
          case 'letrec':
            return annotate_letrec(node);
          case '+': case '-': case '/':
          case '*': case '%': case '<':
          case '>': case '<=': case '>=': case '=':
            return annotate_binary(node);
          case 'or': case 'and':
            return annotate_logical(node);
          case 'list':
            return annotate_list(node);
          case 'hash':
            return annotate_hash(node);
          case 'not':
            return annotate_not(node);
          case 'nth':
            return annotate_nth(node);
          case 'display':
            return annotate_display(node);
          default:
            return annotate_call(node);
          
        }
        break;
      
      default:
        console.log("node", node);
        throw new Error('Invalid node type.');
    }
    
  };
  
  return _.map(ast, translate);
  
};