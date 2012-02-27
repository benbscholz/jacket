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
			// '*' -> 'mult_proc'
			case '*':
				sstate = false;
				code += "mult_proc";
				break;
			// '+' -> 'add_proc'
			case '+':
				sstate = false;
				code += "add_proc";
				break;
			// '-' -> 'sub_proc'
			case '-':
				sstate = false;
				code += "sub_proc";
				break;
			// '/' -> 'div_proc'
			case '/':
				sstate = false;
				code += "div_proc";
				break;
			// '%' -> 'mod_proc'
			case '%':
				sstate = false;
				code += "mod_proc";
				break;
			// '<' -> 'lt_proc'
			// '<=' -> 'lte_proc'
			case '<':
				sstate = false;
				if (source[i+1] == "=") {
					code += "lte_proc";
					i++;
				} else {
					code += "lt_proc";
				}
				break;
			// '>' -> 'gt_proc'
			// '>=' -> 'gte_proc'
			case '>':
				sstate = false;
				if (source[i+1] == "=") {
					code += "gte_proc";
					i++;		
				} else {
					code += "gt_proc";
				}
				break;
			// '=' -> 'eq_proc'
			case '=':
				sstate = false;
				code += "eq_proc";
				break;
			// '?' -> '_bool'
			case '?':
				sstate = false;
				code += "_bool";
				break;
			// '!' -> '_bang'
			case '!':
				sstate = false;
				code += "_bang";
				break;
			// ignore lines beginning with ';'
			case ';':
				while (source[i] !== '\n' && i !== source.length-1) {
					i++;
				}
				break;
			// "apple" -> "_str_apple_str"
			case '"':
				sstate = false;
				code += "_str_";
				break;
			// '(1 2 3 4) -> (quote 1 2 3 4)
			// this behavior is incorrect
			case "'":
				sstate = false;
				code += "(quote ";
				i++;
				break;
			// remove spaces
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
