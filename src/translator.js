/**
 *
 * Translate the syntax tree into Javascript code.
 *
 */
var _     = require('underscore');
var utils = require('util');
var nodes = require('./nodes');
var annotate = require('./annotate').annotate;
var $j    = require('./helpers');

exports.translate = function (expressions) {
 
  var jkt_atom = function (node, statement) {
    return (node.kind === 'Symbol') ?
      nodes.identifier(node.value, statement)
    : nodes.literal(node.value, statement);
  };
  
  var applyBinaryOperator = function (op_str, args, bin, stmt) {
    var op   = $j.opTransform(op_str.value);
    var expr = bin ? nodes.binaryExpression : nodes.logicalExpression;
    
    return _.reduce(args.slice(2, args.length), function (xs, x, i) {
      return expr(op, xs, trans(x), stmt && (i === args.length-3));
    }, expr(op, trans(args[0]), trans(args[1])));
  };
  
  var jkt_binary_operation = function (node, statement) {
    return applyBinaryOperator(node.op, node.args, true, statement);
  };
  
  var jkt_logical_operation = function (node, statement) {
    return applyBinaryOperator(node.op, node.args, false, statement);
  };
  
  var jkt_list = function (node, stmt) {
    return nodes.arrayExpression($j.map(node.elems, trans), stmt);
  };
  
  var jkt_null = function (node, statement) {
    var arg   = trans(node.argument);
    
    var typeArg   = nodes.unaryExpression('typeof', arg);
    var isNull    = nodes.binaryExpression('===', arg, nodes.null);
    var typeUndef = nodes.binaryExpression('===', typeArg, nodes.undefined);
    
    var nullNode  = nodes.logicalExpression('||', typeUndef, isNull);
    
    return statement ? nodes.expressionStatement(nullNode) : nullNode;
  };
  
  var jkt_define_variable = function (node) {
    var ident = trans(node.id);
    var value = trans(node.value);
    
    var decl  = nodes.variableDeclarator(ident, value);
    
    return nodes.variableDeclaration('var', [decl]);
  };
  
  var jkt_define_function = function (node, stmt) {
    var iden = trans(node.id);
    var args = $j.map(node.args, trans);
    var body = trans(node.body);
    
    if (!$j.isStatement(node.body))
      body = nodes.returnStatement(body);
    body = nodes.blockStatement([body]);
    
    return nodes.functionExpression(iden, args, body, false, stmt);
  };
  
  var jkt_define_inward = function (node, stmt) {
    var prop  = trans(node.id);
    var obj   = trans(node.value);
    var value = nodes.memberExpression(obj, prop, true, false);
    var decl  = nodes.variableDeclarator(prop, value);
    
    return nodes.variableDeclaration('var', [decl]); 
  };

  var jkt_lambda = function (node, id, stmt) {
    var body, args = $j.map(node.args, trans);
    
    if ($j.isStatement(node.body))
      body = [ trans(node.body) ];
    else
      body = [ nodes.returnStatement(trans(node.body)) ];
      
    body = nodes.blockStatement(body);
      
    return nodes.functionExpression(id, args, body, false, stmt);
  };

  var jkt_let = function (node, stmt) {
    var args = _.map(node.vars, function (x) {
      return trans(x[0]);
    });
    var params = [nodes.thisExpression()].concat(
      _.map(node.vars, function (x) {
        return trans(x[1]);
      })
    );
    var body = nodes.blockStatement([nodes.returnStatement(trans(node.body))]);
    var func = nodes.functionExpression(null, args, body, false);
    var memb = nodes.memberExpression(func, nodes.identifier('call'));
    
    return nodes.callExpression(memb, params, stmt);
  };
  
  var jkt_letstar = function (node, stmt) {
   var vars = node.vars.reverse();
   
   var init_args = [ trans(vars[0][0]) ];
   var init_body = nodes.blockStatement([nodes.returnStatement(trans(node.body))]);
   var init_func = nodes.functionExpression(null, init_args, init_body, false);
   var init_memb = nodes.memberExpression(init_func, nodes.identifier('call'));
   var init_pars = [nodes.thisExpression()].concat(trans(vars[0][1]));
   var init_stmt = stmt && (_.rest(vars).length === 0);
   var init      = nodes.callExpression(init_memb, init_pars, init_stmt);
   
   return _.reduce(_.rest(vars), function (xs, x, i) {
     var main_args = [ trans(x[0]) ];
     var main_body = nodes.blockStatement([nodes.returnStatement(xs)]);
     var main_func = nodes.functionExpression(null, main_args, main_body, false);
     var main_memb = nodes.memberExpression(main_func, nodes.identifier('call'));
     var main_pars = [nodes.thisExpression()].concat(trans(x[1]));
     var main_stmt = stmt && (i === _.rest(vars).length-1);
     
     return nodes.callExpression(main_memb, main_pars, main_stmt);
   }, init);
   
  };
  
  var jkt_letrec = function (node, stmt) {
    
    var vars = node.vars.reverse();
    
    var init_args = [ trans(vars[0][0]) ];
    var init_body = nodes.blockStatement([nodes.returnStatement(trans(node.body))]);
    var init_func = nodes.functionExpression(null, init_args, init_body, false);
    var init_memb = nodes.memberExpression(init_func, nodes.identifier('call'));
    var init_lmba = jkt_lambda(vars[0][1], trans(vars[0][0]));
    var init_pars = [nodes.thisExpression()].concat(init_lmba);
    var init_stmt = stmt && (_.rest(vars).length === 0);
    var init      = nodes.callExpression(init_memb, init_pars, init_stmt);
    
    return _.reduce(_.rest(vars), function (xs, x, i) {
      var main_args = [ trans(x[0]) ];
      var main_body = nodes.blockStatement([nodes.returnStatement(xs)]);
      var main_func = nodes.functionExpression(null, main_args, main_body, false);
      var main_memb = nodes.memberExpression(main_func, nodes.identifier('call'));
      var main_pars = [nodes.thisExpression()].concat(trans(vars[0][0]));
      var main_stmt = stmt && (i === _.rest(vars).length - 1);
      
      return nodes.callExpression(main_memb, main_pars, main_stmt);
    }, init);
    
  };

  var jkt_hash = function (node, statement) {
    var props = _.map(node.elems, function (elem) {
      return nodes.property(trans(elem[0]), trans(elem[1]));
    });
    
    return nodes.objectExpression(props, statement);
  };

  var jkt_set = function (node, stmt) {
    var id = trans(node.id);
    var vl = trans(node.val);
    
    return nodes.assignmentExpression('=', id, vl , stmt);
    
  };

  var jkt_case = function (node, statement) {
    
    var test = trans(node.test);
    
    var cases = _.reduce(node.cases, function (xs, x, i) {
      var cs = _.map(x[0], function (e, j) {
        var ret, c = trans(e);
        
        if (j === x[0].length-1)
          ret = [ nodes.returnStatement(trans(x[1])) ];
        else
          ret = [];
        
        return nodes.switchCase(c, ret);
      });
      
      return xs.concat(cs);
    }, []);
    
    return nodes.switchStatement(test, cases);
    
  };
 
  var jkt_begin = function (node, statement) {
    var exprs = _.map(node.exprs, function (x, i) {
      if (i === node.exprs.length-1)
        return nodes.returnStatement(trans(x));
      else
        return nodes.expressionStatement(trans(x));
    });
    
    var block = nodes.blockStatement(exprs);
    var func  = nodes.functionExpression(null, [], block, false);
    var call  = nodes.memberExpression(func, nodes.identifier('call'));
    
    return nodes.callExpression(call, [nodes.thisExpression()], statement);
  };
  
  var jkt_do = function (node) {
    var id = trans(node.init[0]);
    
    var init = nodes.assignmentExpression('=', id, trans(node.init[1]));
    var test = nodes.unaryExpression('!', trans(node.test));
    var step = nodes.assignmentExpression('=', id, trans(node.step));
    var body = trans(node.body, true);
    
    return nodes.forStatement(init, test, step, [body]);
    
  };

  var jkt_if = function (node) {
    
    var test = trans(node.test);
    var cons = nodes.blockStatement([ nodes.returnStatement(trans(node.cons)) ]);
    var alt  = nodes.blockStatement([ nodes.returnStatement(trans(node.alt)) ]);
    
    return nodes.ifStatement(test, cons, alt);
    
  };

  var jkt_cond = function (node) {
    
    var cases = node.cases.reverse();
    var init  = nodes.blockStatement([nodes.returnStatement(trans(cases[0][1]))]);
    
    return _.reduce(_.rest(cases), function (xs, x, i) {
      var test = trans(x[0]);
      var cons = nodes.blockStatement([nodes.returnStatement(trans(x[1]))]);
      
      return nodes.ifStatement(test, cons, xs);
    }, init);
    
  };
   
  var jkt_not = function (node, statement) {
    return nodes.unaryExpression('!', trans(node.argument), statement);
  };
  
  var jkt_nth = function (node, statement) {
    
    var list = trans(node.list);
    var index = trans(node.index);
    
    return nodes.memberExpression(list, index, true, statement);
    
  };
  
  var jkt_procedure = function (node, statement) {
    var proc = trans(node.proc);
    var args = $j.map(node.args, trans);
    
    return nodes.callExpression(proc, args, statement);
  };
  
  var jkt_quoted = function (node, statement) {
    
    if (_.isArray(node.argument)) {
      return nodes.arrayExpression(_.map(node.argument, function (e) {
        if (_.isArray(e.argument))
          return jkt_quoted(e);
        else
          return jkt_atom(e);
      }), statement);
    } else {
      return jkt_atom(node.argument, statement);
    }
    
  };

	var trans = function (node, statement) {
    
    // $j.print("node", node);
    
    switch (node.type) {
      // Node is leaf (literal or symbol):
      // If statement is true, the atom will
      // be wrapped in an `ExpressionStatement`
      // node.
      case 'Atom':
        return jkt_atom(node, statement);
        
      // Node is a statement:
      case 'IfExpression':
        return jkt_if(node, statement);
      case 'CondExpression':
        return jkt_cond(node, statement);
      case 'DoExpression':
        return jkt_do(node, statement);
      case 'DefineVariable':
        return jkt_define_variable(node, statement);
      case 'DefineFunction':
        return jkt_define_function(node, statement);
      case 'DefineInward':
        return jkt_define_inward(node, statement);
      case 'SetExpression':
        return jkt_set(node, statement);
      case 'CaseExpression':
        return jkt_case(node, statement);
       
      // Node is quoted:
      case 'QuotedExpression':
        return jkt_quoted(node, statement);
        
      // Node is an expression
      // 
      // If statement is true, the generated
      // expression will be wrapped in an 
      // `ExpressionStatement` node.
      case 'LetExpression':
        return jkt_let(node, statement);
      case 'LetStarExpression':
        return jkt_letstar(node, statement);
      case 'LetRecExpression':
        return jkt_letrec(node, statement);
      case 'BeginExpression':
        return jkt_begin(node, statement);
      case 'LambdaExpression':
        return jkt_lambda(node, null, statement);
        
      case 'BinaryOperation':
        return jkt_binary_operation(node, statement);
      case 'LogicalOperation':
        return jkt_logical_operation(node, statement);
        
      case 'ListObject':
        return jkt_list(node, statement);
      case 'HashObject':
        return jkt_hash(node, statement);

      // Useful functions
      case 'NotExpression':
        return jkt_not(node, statement);
      case 'NthExpression':
        return jkt_nth(node, statement);
      case 'NullCheck':
        return jkt_null(node, statement);
 
      // Node is a standard procedure call
      case 'ProcedureCall':
        return jkt_procedure(node, statement); 
        
      default:
        $j.print(node);
        throw new Error('Unrecognized node.');
    }
    
	};
	
	return nodes.program(
    [{
      type: 'ExpressionStatement'
    , expression: nodes.callExpression(
        nodes.memberExpression(
          nodes.functionExpression(
            null
          , []
          , nodes.blockStatement(
              _.map(annotate(expressions), function (expr) {
                return trans(expr, true);
              })
            )
          , false
          )
        , nodes.identifier('call')
        )
      , [ nodes.thisExpression() ]
      )
    }]
	);
	
};

