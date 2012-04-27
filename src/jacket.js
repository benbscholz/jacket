#!/usr/bin/env node

/**
 * Compiler for jacket.
 * Usage:
 *	./compile.js program.jkt
 */

var compile_to_file = function () {
	var fs          = require('fs');
	var built_ins   = fs.readFileSync('built_ins.js', 'utf8');
	var stdlib      = fs.readFileSync('source/stdlib.js', 'utf8');
	var global_eval = eval;
	
	var preprocess  = require('./preprocessor').preprocess;
	var parse       = require('./parser').parse;
	var translate   = require('./translator').translate;
	var well        = require('./wellness').wellness;
	var beautify    = require('beautifyjs');
	
	global_eval(built_ins);
	global_eval(stdlib);

	var source_folder_path = process.argv[1].split('/').slice(0, -1).join('/');
	var output_folder_path = source_folder_path + "/source";
	var source_file_path = source_folder_path + "/" + process.argv[2];
	var source_file_name = process.argv[2].split('/').pop(); 
	var output_file_path = output_folder_path + "/" + 
						 source_file_name.split('.').slice(0,-1).join('.') + '.js';

	var source = fs.readFileSync(source_file_path, 'utf8');	
	var compiled;
	
	compiled = beautify.js_beautify(translate(parse(preprocess(source))));
	fs.mkdir(output_folder_path, function () {
		fs.writeFile(output_file_path, compiled, function (e) {
			if (e) throw e;
			console.log("Successfully compiled.");
		});
	});	
}();

