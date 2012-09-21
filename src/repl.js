#!/usr/bin/env node 
/**
 * Interactive interpreter for jacket.
 * Debug version.
 */
var _debug_js = function () {
	var fs         = require('fs'),
			_          = require('underscore'),
	    readline   = require('readline'),		
		  beautify   = require('beautifyjs').js_beautify,
	    colors     = require('colors'),
	    preprocess = require('./preprocessor').preprocess,
	    lex        = require('./lexer').lex,
	    parse      = require('./parser').parse,
	    translate  = require('./translator').translate;

	var show_array = function (item) {
		if (_.isArray(item)) {
			return beautify(_.map(item, function (elem, val) {
				if (val === 0)
					return "[" + show_array(elem);
				return show_array(elem);
			}).join(', ')) + "]";
		} else {
			return item;
		}
	};

	var show_lexed = function (source) {
		process.stdout.write("Lexed:\n".green);
		console.log(source);
	};

	var show_parsed = function (parsed) {
		process.stdout.write("Parsed:\n".green);
		console.log(parsed);
	};

	var show_translated = function (translated) {
		process.stdout.write("Translated:\n".green);
		console.log(translated);
	};

	var show_evaluated = function (evaluated) {
		out = _.isArray(evaluated) ? show_array(evaluated) : evaluated;
		process.stdout.write("Evaluated:\n".green);
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
				show_preprocessed(preprocessed);

				parsed       = parse(preprocessed);
				show_parsed(parsed);

				translated   = translate(parsed);
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

		built_ins = fs.readFileSync('built_ins.js');

		if (process.argv.length === 3) {
			var source = fs.readFileSync(process.argv[2], 'utf8');
			// var preprocessed = preprocess(source);
			var lexed        = lex(source);
			show_lexed(lexed);
			var parsed       = parse(lexed);
			show_parsed(parsed);
			// var translated   = translate(parsed);
			// show_translated(beautify(translated));
  		// show_evaluated(eval(translated));
		} else {
			loop(built_ins, stdlib);
		}
	}();
}();
