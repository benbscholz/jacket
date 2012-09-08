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
  
  var tokenize = function (s) {
    return _.map(_.filter(split_source(s), function (x) {
      return x !== '';
    }), function (elem) {
      return elem.trim();
    });
  };

  var split_source = function (s) {
    var split = [],
        quote_state = false,
        begin, end;
    for (begin = 0, end = 0; end < s.length; end += 1) {
      if (!quote_state && s[end] === ' ') {
        split.push(s.slice(begin, end));
        begin = end + 1;
      } else if (s[end] === '"') {
        quote_state = !quote_state;
      }
    }
    return split;
  };

  var atom = function (token) {
    if (String(Number(token)) !== "NaN") {
      return Number(token);
    } else {
      return token;
    }
  };
  
  var read_from = function (tokens) {
    var exp, token, trimmed;
    if (tokens.length === 0) {
      return;
    }
    token = tokens.shift();
    if ('(' === token) {
      exp = [];
      while (tokens[0] !== ')') {
        exp.push(read_from(tokens));
      }
      tokens.shift();
      return exp;
    } else if (')' === token) {
      throw new Error("Syntax Error: Unexpected )");
    } else {
      return atom(token);
    }
  };
  
  var read_exps = function (tokens) {
    var exps = [];
    while (trim_exp(tokens) !== undefined) {
      exps.push(read_from(tokens));
    }
    return exps;
  };
  
  var trim_exp = function (tokens) {
    var i, depth = 0;
    for (i = 0; i < tokens.length; i += 1) {
      if (tokens[i] === "(") {
        depth += 1;
      } else if (tokens[i] === ")") {
        depth -= 1;
      } 
      if (depth === 0) {
        return tokens.slice(i+1, -1);
      }
    } 
  };

  return read_exps(tokenize(source));
};

