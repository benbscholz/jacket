
exports.quote_indices = function (source) {
	var i, last, indices = [];
	for (i = 0; i < source.length; i += 1) {
		if (source.charCodeAt(i) == 39) {
			if (indices[indices.length-1] === (i-1)) 
				indices.pop();
			else 
				indices.push(i);
		}
	}
	return indices;
};

exports.is_in_quote = function (index, indices) {
	var i;
	for (i = 0; i < indices.length-1; i += 2) {
		if (index > indices[i] && index < indices[i+1])
			return true;
	}
	return false;
};

exports.preprocess = function (source) {
	
	var i, space_state, code = '', indices = exports.quote_indices(source);

	for (i = 0; i < source.length; i += 1) {
		if (exports.is_in_quote(i, indices)) {
			code += source[i];
			continue;
		}
		switch (source[i]) {
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

exports.is_array = function (item) {
	if (item && typeof item === 'object' && item.constructor === Array)
		return true;
	else if (Object.prototype.toString.call(item) === '[object Array]')
		return true;
	return false;
};




