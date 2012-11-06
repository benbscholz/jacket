#!/usr/bin/env node

/**
 * Compiler for jacket.
 *
 *
 */

var _          = require('underscore');
var escodegen  = require('escodegen');
var parser     = require('./parser');
var translator = require('./translator');
var $j         = require('./helpers');

var version = exports.version = '0.2.0';

var hash_bang  = '#!/usr/bin/env node\n\n';
var jkt_header = '// Generated by jacket '+ version +'\n';

exports.compile = function (code, opts) {
  var js_ast, js_code, header;
  
  js_ast  = translator.translate(parser.parse(code, opts.filename));
  js_code = escodegen.generate(js_ast);
  
  return opts.exec ? hash_bang + jkt_header + js_code : jkt_header + js_code;
};

exports.parsed = function (code, filename) {
  
  var message;
  
  try {
    return parser.parse(code);
  } catch (e) {
    message = handleError(e, code, filename);
    throw new Error(message);
  }
};

exports.translated = function (code) {
	return translator.translate(code);
};

var handleError = function (e, code, filename) {
  
  
  var lines = code.split('\n').slice(e.line-4, e.line+3);
  var fn = filename;
  fn = fn.slice(fn.lastIndexOf('/')+1, fn.length);
  var message = '' + fn + ": Fuck, man. Your code has an error!\n";
  
  _.each(lines, function (line, i) {
    var prefix = i === 3 ? ' > ' : '   ';
    prefix += e.line - 3 + i + '| ';
    message += prefix + ' ' + line + '\n';
  });
  
  return message;
  
};

