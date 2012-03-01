#!/usr/bin/env js
/**
 * Interactive interpreter for jacket.
 * This repl is useful for debugging since it prints
 * the preprocessed code, the parsed code, and the 
 * translated code to stdout. The translated code is
 * pretty printed by default.
 * 
 */
var _debug_repl = function () {
	var line, lines, wellness;

	load("preprocessor.js");
	load("parser.js");
	load("translator.js");
	load("built_ins.js");
	load("pretty.js");
	load("wellness.js");

	eval(_translate(_parse(_preprocess(read("../lib/stdlib.jkt")))));
	print("stdlib.jkt loaded.");

	print("#################");
	print("## jacket REPL ##");
	print("## v0.1        ##");
	print("#################");

	while (1) {
		putstr("> ");
		line = readline();
		lines = line;
		wellness = _wellness(lines);

		while (!wellness) {
			putstr("... ");
			line = readline();
			lines += line;
			wellness = _wellness(lines);
		}

		prepr = _preprocess(lines);
		parse = _parse(prepr);
		trans = _pretty(_translate(parse));

		putstr('\n\n');
		print("preprocessed:");
		putstr('\t');
		if (prepr[prepr.length-1] == '\n')
			putstr(prepr);
		else
			print(prepr);
		putstr('\n');

		print("parsed:");
		putstr('\t');
		if (parse[parse.length-1] == '\n')
			putstr(_show_array(parse));
		else
			print(_show_array(parse));
		putstr('\n');

		print("translated:");
		putstr("    ");
		if (trans[trans.length-1] == '\n')
			putstr(trans);
		else
			print(trans);	
		putstr('\n');

		print("evaluated:");
		putstr('\t');
		evaled = eval(trans);
		if (_is_array(evaled))
			out = _show_array(evaled);
		else
			out = evaled
		if (trans[trans.length-1] == '\n')
			putstr(out);
		else
			print(out);	
		putstr('\n');
	}

}();
