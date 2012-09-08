/**
 * wellness: string -> boolean
 *
 * Returns true if the parentheses are matched and balanced,
 * false otherwise.
 */
exports.wellness = function (source) {

	var well = function (s) {
		var i, parens = [], prev_len, curr_len, paren_str;
		for (i = 0; i < s.length; i++) {
			if (s[i] == '(' || s[i] == ')') 
				parens.push(s[i]);
		}
		for (i = 0; i < parens.length; i++) {
			if (s[i] + s[i+1] == "()")
				parens = parens.slice(0, i) + parens.slice(i+2, -1);
		}
		paren_str = parens.join('');
		curr_len = paren_str.length;
		while (curr_len > 0) {
			if (curr_len == prev_len) {
				return false;
			}
			paren_str = paren_str.replace(/\(\)/g, '');	
			prev_len = curr_len;
			curr_len = paren_str.length;
		}
		return true;
	}; 

	return well(source);
};
