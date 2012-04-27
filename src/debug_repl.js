#!/usr/bin/env node 
/**
 * Interactive interpreter for jacket.
 * Debug version.
 */
var _debug_js = function () {
	var fs         = require('fs'),
	    readline   = require('readline'),		
		beautify   = require('beautifyjs').js_beautify,
	    colors     = require('colors'),
	    compile    = require('./compile').compile,
	    preprocess = require('./source/preprocessor').preprocess,
	    parse      = require('./parser').parse,
	    translate  = require('./translator').translate,
	    wellness   = require('./wellness').wellness;

	var show_array = function (item) {
		var i, array_str;	

		if (_isArray(item)) {
			array_str = "[";
			for (i = 0; i < item.length; i += 1) 
				array_str += show_array(item[i]) + ", ";
			return beautify(array_str.slice(0, -2) + "]");
		}
		return item;
	};

	var show_preprocessed = function (preprocessed) {
		process.stdout.write("Preprocess:\n    ".green);
		console.log(preprocessed);
	};

	var show_parsed = function (parsed) {
		process.stdout.write("Parsed:\n    ".green);
		console.log(show_array(parsed).slice(6,-2));
	};

	var show_translated = function (translated) {
		process.stdout.write("Translated:\n    ".green);
		console.log(translated);
	};

	var show_evaluated = function (evaluated) {
		out = _isArray(evaluated) ? show_array(evaluated) : evaluated;
		process.stdout.write("Evaluated:\n    ".green);
		console.log(out);
	};
	
	var loop = function (built_ins, stdlib) {
		var code, lines, well, jacket, prefix, global_eval, 
			preprocessed, parsed, translated;
	
		global_eval = eval;
		global_eval(built_ins);
		global_eval(stdlib);

		console.log("stdlib.jkt loaded.");

		jacket = readline.createInterface(process.stdin, process.stdout);
		
		code = "";
	
		jacket.on('line', function (line) {
			code += line + " ";

			if (wellness(code)) { 
				preprocessed = preprocess(code);
				parsed       = parse(preprocessed);
				translated   = translate(parsed);

				show_preprocessed(preprocessed);
				show_parsed(parsed);
				show_translated(beautify(translated));
				show_evaluated(global_eval(translated));
				jacket.setPrompt("db > ");
				code = "";
			} else {
				jacket.setPrompt(". . . ");
			}
			jacket.prompt();
		});

		jacket.on('close', function () {
			console.log('\nGoodbye!');
			jacket.close();
			process.stdin.destroy();
		});

		prefix = "db > ";
		jacket.setPrompt(prefix.yellow, prefix.length);

		jacket.prompt();
	};

	var repl = function () {
		var built_ins, stdlib;
		console.log("#################");
		console.log("## jacket REPL ##");
		console.log("## v0.1        ##");
		console.log("#################");

		built_ins = fs.readFileSync('built_ins.js', 'utf8');
		stdlib    = fs.readFileSync('source/stdlib.js', 'utf8');

		loop(built_ins, stdlib);
	}();
}();
