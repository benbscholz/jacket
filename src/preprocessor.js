/**
 * _preprocess: string -> string
 *
 * Removes/transforms illegal characters ("?" to "_bool"), transforms 
 * primitive operations into function calls, and distinguishes strings
 * from symbols with the "_str" annotation. Extra whitespace, tabs, 
 * and newlines are also removed at this time. 
 */
var _preprocess = function (source) {
	
	var i, sstate, code = "";

	for (i = 0; i < source.length; i++) {
		switch (source[i]) {
			case '*':
				sstate = false;
				code += "mult_proc";
				break;
			case '+':
				sstate = false;
				code += "add_proc";
				break;
			case '-':
				sstate = false;
				code += "sub_proc";
				break;
			case '/':
				sstate = false;
				code += "div.proc";
				break;
			case '%':
				sstate = false;
				code += "mod_proc";
				break;
			case '<':
				sstate = false;
				if (source[i+1] == "=") {
					code += "lte_proc";
					i++;
				} else {
					code += "lt_proc";
				}
				break;
			case '>':
				sstate = false;
				if (source[i+1] == "=") {
					code += "gte_proc";
					i++;		
				} else {
					code += "gt_proc";
				}
				break;
			case '=':
				sstate = false;
				code += "eq_proc";
				break;
			case '?':
				sstate = false;
				code += "_bool";
				break;
			case '!':
				sstate = false;
				code += "_bang";
				break;
			case '"':
				sstate = false;
				code += "_str_";
				break;
			case "'":
				sstate = false;
				code += "(quote ";
				i++;
				break;
			case ' ':
				if (sstate == false) {
					sstate = true;
					code += source[i];
				} 
				break;		
			case '\n':
			case '\t':
				break;
			default:				
				sstate = false;
				code += source[i];
		}
	}

	return code;
};
