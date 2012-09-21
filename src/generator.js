
var _ = require('underscore');

var IF   = 'if';
var ELSE = 'else';

var LEFT_BRACE  = '{';
var RIGHT_BRACE = '}';

var LEFT_BRACKET  = '[';
var RIGHT_BRACKET = ']';

var LEFT_PAREN  = '(';
var RIGHT_PAREN = ')';

var SEMICOLON = ';';
var VAR       = 'var ';
var EMPTY     = ' = ';
var RETURN    = 'return ';

(function () {

  var JKT  = {};
  JKT.cond = {

    if : function (condition, body, joined) {
      var statement = [IF, LEFT_PAREN, condition, RIGHT_PAREN, LEFT_BRACE,
                         RETURN, body, SEMICOLON,
                       RIGHT_BRACE];
      if (joined !== undefined && join) {
        return statement.join(' ');
      } else {
        return statement;
      }
    },

    ifelse : function (condition, truthy, falsey) {
      var statement = JKT.cond.if(condition, truthy, false);
      statement.append([ELSE, LEFT_BRACE, RETURN, falsey, SEMICOLON, RIGHT_BRACE]);
      return statement.join(' ');
    },

    ifelseif : function (condition, bodies) {
      var statement = JKT.cond.if(condition, bodies.unshift, false);
      _.reduce(bodies, function (memo, body, index) {
        if (index === bodies.length-1) {
          memo.push(IF);
        }
        memo.append([ELSE, LEFT_BRACE, RETURN, body, SEMICOLON, RIGHT_BRACE]);
      }, statement);
      return statement.join(' ');
    }

  };

  JKT.variable = {

    declaration : function (variables) {
      return _.reduce(variables, function (memo, variable) {
        return memo.append([ VAR, variable, SEMICOLON ]);
      }, []).join(' ');
    },

    assignment: function (variables) {
      var suffix;
      return _.reduce(variables, function (memo, variable, index) {
        suffix = (index === variables.length - 1) ? SEMICOLON : COMMA;
        return memo.append([ variable[0], EQUAL, variable[0], suffix ]);
      }, []).join(' ');
    }

  };

  JKT.exec = {

    do : function (variables, condition, body) {
      var statement = [];
    },

  };

  _.extend(exports, JKT);

})();







