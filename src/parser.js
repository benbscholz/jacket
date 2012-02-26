/**
 * _parse: string -> array
 *
 * Parses the jacket source code into a syntax tree.
 *
 *		(map (lambda (x) (first x)) ls) --->
 *			["map", ["lambda", ["x"], ["first", "x"]], "ls"]
 */
var _parse = function (source) {
	
	var tokenize = function (s) {
		var tokens = s.replace(/\(/g, ' ( ')
					  .replace(/\)/g, ' ) ')
					  .split(" ")
					  .filter(function (x) {return (x != '');});
		return tokens;
	};
	
	var atom = function (token) {
		if (String(Number(token)) !== "NaN") {
			return Number(token);
		} else {
			return token;
		}
	};
	
	var read_from = function (tokens) {
		var L,
			Ls = [],
			token,
			trimmed;
		if (tokens.length === 0) {
			return;
		}
		token = tokens.shift();
		if ('(' === token) {
			L = [];
			while (tokens[0] !== ')') {
				L.push(read_from(tokens));
			}
			tokens.shift();
			return L;
		} else if (')' === token) {
			throw new Error("Syntax Error: Unexpected )");
		} else {
			return atom(token);
		}
	};
	
	var read_exps = function (tokens) {
		var Ls = [],
			trimmed = tokens;
		while (trim_exp(trimmed) !== undefined) {
			Ls.push(read_from(trimmed));
		}
		return Ls;
	};
	
	var trim_exp = function (tokens) {
		var curr,
			i,
			depth = 0;
		for (i = 0; i < tokens.length; i += 1) {
			if (tokens[i] === "(") {
				depth += 1;
			} else if (tokens[i] === ")") {
				depth -= 1;
			} 
			if (depth === 0) {
				return tokens.slice(i+1, -1);
			}
		}	
	};

	return read_exps(tokenize(source));
};

