// preprocessor

exports.preprocess = function (source) {
	
	var i 
	  , quote_state = false 
		, space_state = false 
		, code = '';

	for (i = 0; i < source.length; i += 1) {
		if (quote_state && source[i] !== '"') {
			code += source[i];
			continue;
	  }
		switch (source[i]) {
			case '"':
				quote_state = !quote_state;
				code += '"'
				break;
			case '*':
				space_state = false;
				code += 'mlt_proc';
				break;
			case '/':
				space_state = false;
				code += 'div_proc';
				break;
			case '+':
				space_state = false;
				code += 'add_proc';
				break;
			case '-':
				space_state = false;
				if (source[i+1] === ' ')
					code += 'sub_proc';
				else
					code += '_';
				break;
			case '%':
				space_state = false;
				code += 'mod_proc';
				break;
			case '=':
				space_state = false;
				code += 'eql_proc';
				break;
			case '<':
				space_state = false;
				if (source[i+1] === '=') {
					code += 'lte_proc';
					i += 1;
				} else {
					code += 'lt_proc';
				}
				break;
			case '>':
				space_state = false;
				if (source[i+1] === '=') {
					code += 'gte_proc';
					i += 1;
				} else {
					code += 'gt_proc';
				}
				break;
			case '?':
				space_state = false;
				code += '_bool';
				break;
			case '!':
				space_state = false;
				code += '_bang';
				break;
			case ';':
				i = source.indexOf('\n', i);
				break;
			case '(':
				space_state = false;
				code += ' ( ';
				break;
			case ')':
				space_state = false;
				code += ' ) ';
				break;
			case '\t':
			case '\n':
				space_state = false;
				break;
			case ' ':
				if (!space_state) {
					space_state = true;
					code += ' ';
				}
				break;
			default:
				space_state = false;
				code += source[i];
		}
	}

	return code;
};
