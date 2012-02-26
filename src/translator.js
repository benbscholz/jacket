/**
 * _translate: array -> string
 *
 * Translate the syntax tree into Javascript code.
 *
 * ["define", "a", 12] ---> "var a = 12;"
 * ["set!", "a", 13]   ---> "a = 13;"
 * ["lambda", ["x"], ["*", 3, 4]] ---> "function (x) {return mult_proc(3,4);}"
 * 
 *
 */
var _translate = function (x) {

	var build_cond = function (x) {
		var begin = "",
			i;
		for (i = 1; i < x.length; i += 1) {
			if (i === x.length-1 && x[i][0] === "else") {
				begin += form_else(x[i][1]);
			} else if (i === 1) {
				begin += form_if(x[i]);
			} else {
				begin += " else " + form_if(x[i].slice(0,2));
			}
		}
		return begin;
	};
	
	var build_if = function (x) {
		return form_if([x[1],x[2]]) + form_else(x[3]);
	};
	
	var form_if = function (x) {
		return "if (" + trans(x[0]) + ") {return " + trans(x[1]) + ";}";
	};
	
	var form_else = function (x) {
		return " else {return " + trans(x) + ";}";
	};
	
	var build_set = function (x) {
		return x[1] + " = " + trans(x[2]);
	};
	
	var build_begin = function (x) {
		var i, code;
		code = "function () {";
		for (i = 1; i < x.length; i += 1) {
			if (i === x.length-1) {
				code += "return " + trans(x[i]);
			} else {
				code += trans(x[i]) + ";";
			}
		}	
		code += ";}();";
		return code;
	};
	
	var build_define = function (x) {
		var code;
		if (x[1] instanceof Array) {
			code = "var " + x[1][0] + " = ";
			code += build_lambda([,x[1].slice(1, x[1].length), x[2]]);
		} else {
			code = "var " + x[1] + " = " + trans(x[2]);
		}
		return code + ";";
	};
	
	var build_lambda = function (x) {
		return "function (" + build_parameters(x[1]) +") {"+ trans(x[2]) + ";}";
	};
	
	var build_procedure = function (x) {
		return x[0] + "(" + build_parameters(x.slice(1, x.length)) + ")";
	};
	
	var build_parameters = function (x) {
		var code = [],
			i;
		for (i = 0; i < x.length; i += 1) {
			code.push(trans(x[i]));
		}
		return code.join();
	};
	
	var is_zero_depth = function (x) {
		var i;
		for (i = 0; i < x.length; i += 1) {
			if (!(typeof x[i] === "string" || 
				  typeof x[i] === "number" || 
				  typeof x[i] === "boolean")) {
				return false;
			}
		}	
		return true;
	};
	
	var trans = function (x) {
		var code = "";
		if (typeof x === "string" || !(x instanceof Array)) {
			return x;
		} else if (x[0] === "quote") {
			return "\"" + x[1] + "\";";
		} else if (x[0] === "if") {
			return build_if(x);
		} else if (x[0] === "cond") {
			return build_cond(x);
		} else if (x[0] === "set!") {
			return build_set(x);
		} else if (x[0] === "define") {
			return build_define(x);
		} else if (x[0] === "lambda") {
			return build_lambda(x);
		} else if (x[0] === "begin") {
			return build_begin(x);
		} else {
			return build_procedure(x);
		}
	};

	var _isArray = function (item) {
        if (item && typeof item === 'object' && item.constructor === Array)
            return true;
        else if (Object.prototype.toString.call(item) == '[object Array]')
            return true;
        else
            return false;
    };
	
	if (_isArray(x)) {
		var i, out = "";
		for (i = 0; i < x.length; i++) {
			out += trans(x[i]);
		}
		return out;
	} else {
		return trans(x);
	}
};

