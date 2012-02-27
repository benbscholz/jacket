/**
 * _pretty: string -> string
 *
 * Pretty print Javascript code.
 * Uses beaufity.js: https://github.com/einars/js-beautify
 */
var _pretty = function (source) {
	return js_beautify(source);
};
