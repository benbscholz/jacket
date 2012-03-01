/**
 * _pretty: string -> string
 *
 * Pretty print Javascript code.
 * Uses beaufity.js: https://github.com/einars/js-beautify
 */
var _pretty = function (source) {
	if (print && readline && read)
		load("beautify.js");
	return js_beautify(source);
};

var _show_array = function (arr) {
	var i, str = "[";
	if (arr.length === 0) 
		return "[]";
	for (i = 0;	i < arr.length; i += 1) {
		if (_is_array(arr[i])) {
			str += _show_array(arr[i]);
		} else {
			str += arr[i];
		}
		str += ", ";
	}
	return str.slice(0, str.length-2) + "]";
};
