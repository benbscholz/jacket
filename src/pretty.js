/**
 * _pretty: string -> string
 *
 * Pretty print Javascript code.
 * This is largely incorrect.
 */
var _pretty = function (source) {

	var pretty_print = function (s, tabs) {
		var i, t = tabs + "    ";
		var code = ""
		for (i = 0; i < s.length; i++) {
			switch (s[i]) {
				case "{":
					code += s[i] + "\n" + t;
					break;
				case "}":
					code += tabs + s[i];
					break;
				case ";":
					code += s[i] + "\n" + tabs;
					break;
				default:
					code += s[i];
			}	
		}
		return code;
	};

	return pretty_print(source, "");
};
