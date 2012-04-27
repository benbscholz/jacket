#!/usr/bin/env node 
/**
 * Interactive interepter for jacket.
 *
 */
var _repl = function () {
	var line, lines, wellness;

	load("preprocessor.js");
	load("parser.js");
	load("translator.js");
	load("built_ins.js");	
	load("wellness.js");

	var lib = _translate(_parse(_preprocess(read("../lib/stdlib.jkt"))));
	eval(lib);
	print("stdlib.jkt loaded.");

	print("#################");
	print("## jacket REPL ##");
	print("## v0.1        ##"); 
	print("#################");

	while (1) {
		putstr("> ");
		line = readline();
		lines = line;
		wellness = _wellness(line);

		while (!wellness) {
			putstr("... ");
			line = readline();
			lines += line;
			wellness = _wellness(lines);
		}

		out = _translate(_parse(_preprocess(lines)));

		if (out[out.length-1] == '\n') 
			putstr(eval(out));
		else
			print(eval(out));
	}	

}();
