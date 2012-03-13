#!/usr/bin/env js
/**
 * Interactive interpreter for jacket.
 * Debug version.
 */
var _debug_js = function () {

	var compile = function (source) {
		return _translate(_parse(_preprocess(source)));
	};

	var show_preprocessed = function (preprocessed) {
		putstr("Preprocess:\n\t");
		print(preprocessed);
	};

	var show_parsed = function (parsed) {
		putstr("Parsed:\n\t");
		print(_show_array(parsed));
	};

	var show_translated = function (translated) {
		putstr("Translated:\n\t");
		print(translated);
	};

	var show_evaluated = function (evaluated) {
		out = _is_array(evaluated) ? _show_array(evaluated) : evaluated;
		putstr("Evaluated:\n\t");
		print(out);
	};

	var repl = function () {
		var line, lines, wellness;

		load("preprocessor.js");
		load("parser.js");
		load("translator.js");
		load("built_ins.js");
		load("pretty.js");
		load("wellness.js");

		print("#################");
		print("## jacket REPL ##");
		print("## v0.1        ##");
		print("#################");

		eval(compile(read("../lib/stdlib.jkt")));
		print("stdlib.jkt loaded");

		while (true) {
			putstr("db > ");
			line = readline();
			lines = line;
			wellness = _wellness(lines);

			while (!wellness) {
				putstr("... ");
				line = readline();
				lines += line;
				wellness = _wellness(lines);
			}

			pr = _preprocess(lines);
			pa = _parse(pr);
		 	tr = _pretty(_translate(pa));

			show_preprocessed(pr);
			show_parsed(pa);
			show_translated(tr);
			show_evaluated(eval(tr));
		}
	}();

}();
