#!/usr/bin/env node

// Jacket command line tool.
//
// jacket
//        -v --version
//        -h --help
//        -c --compile
//        -d --debug
//

var _      = require('underscore');
var fs     = require('fs');
var utils  = require('util');
var argv   = require('optimist').argv;
var annotate = require('./annotate').annotate;
var jacket = require('./jacket');
var escodegen = require('escodegen');

function showVersion () {
  console.log('Jacket version ' + jacket.version);
}

function showHelp () {
  console.log('jacket');
  console.log('       -v --version');
  console.log('       -h --help');
  console.log('  [-x] -c --compile');
  console.log('       -d --debug');
}

function compileFile (filename, exec) {
  var opts = {
    exec: exec
  , filename: filename
  };
  
  var fn   = filename.slice(0, filename.indexOf('.'))+'.js';
  var jkt  = fs.readFileSync(filename, 'utf8');
  var js   = jacket.compile(jkt, opts);
  
  fs.writeFileSync(fn, js, 'utf8');
}

function debugFile(filename) {
  var source = fs.readFileSync(filename, 'utf8');
  console.log('\n++ Parsed ++\n');
  var parsed = jacket.parsed(source, filename);
  console.log(utils.inspect(parsed, false, 100));
  console.log('\n++ Annotated ++\n');
  var annot = annotate(parsed);
  console.log(utils.inspect(annot, false, 100));
  console.log('\n++ Translated ++\n');
  var trans = jacket.translated(annot);
  console.log(utils.inspect(trans, false, 100));
  console.log('\n++ Compiled ++\n');
  console.log(escodegen.generate(trans));
}

function command() {
  if (argv.h)
    return showHelp();
  if (argv.v)
    return showVersion();
  if (argv.c)
    return compileFile(argv.c, !!argv.x);
  if (argv.d)
    return debugFile(argv.d);
 
  console.log('Error: Option not recognized.');
}

command();
