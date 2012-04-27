/**
 * _parse: string -> array
 *
 * Parses the jacket source code into a syntax tree.
 *
 *		(map (lambda (x) (first x)) ls) --->
 *			["map", ["lambda", ["x"], ["first", "x"]], "ls"]
 */
exports.parse = function (source) {
	
	var quote_indices = require('./preprocessor').quote_indices;
	var is_in_quote   = require('./preprocessor').is_in_quote;
	
	var tokenize = function (s) {
		var tokens = split_source(s).filter(function (x) {return x !== '';})
									.map(function (x) {return x.trim();});
		return tokens;
	};

	 split_source = function (s) {
		var atom,
			current,
		    previous = 0,
			indices = quote_indices(s),
			split = [];
		for (current = 0; current < s.length; current += 1) {
			if (!is_in_quote(current, indices) && s[current] === ' ') {
				atom = s.slice(previous, current);
				split.push(atom);
				previous = current + 1;
			}	
		}
		return split;
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

