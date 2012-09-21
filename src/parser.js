/**
 * _parse: string -> array
 *
 * Parses the jacket source code into a syntax tree.
 *
 *    (map (lambda (x) (first x)) ls) --->
 *      ["map", ["lambda", ["x"], ["first", "x"]], "ls"]
 */

var _ = require('underscore');

exports.parse = function (source) {
  
  function tokenType (token) {
    return token[0];
  }

  function tokenValue (token) {
    return token[1];
  }

  function tokenLine (token) {
    return token[2];
  }

  function parse (tokens) {
    var i, expression, token;
    var expressions = [];

    if (tokens.length === 0) return;

    token = tokens.shift();
    switch (tokenType(token)) {
      case 'OPEN_PARENTHESIS':
        expression = [];
        while (tokenType(tokens[0]) !== 'CLOSE_PARENTHESIS') {
          expression.push(parse(tokens));
        }
        tokens.shift();
        return expression;
      case 'CLOSE_PARENTHESIS':
        throw new SyntaxError('Unexpected \')\' on line ' + tokenTime(token) + '.');
      default:
        return token;
    }

    return parsed;
  }

  return parse(source);
};














