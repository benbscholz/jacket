/**
 * Built-in functions for jacket.
 * Mathematical operators are transformed from symbols to strings by
 * the jacket compiler & interpreter.
 * ex: 
 *		'*' -> 'mult_proc'
 */
var add_proc = function () {
	var i,
		val = 0;
	for (i = 0; i < arguments.length; i += 1) {
		val += arguments[i];
	}
	return val;
};

var mult_proc = function () {
	var i,
		val = 1;
	for (i = 0; i < arguments.length; i += 1) {
		val *= arguments[i];
	}
	return val;
};

var sub_proc = function () {
	var i,
		val = arguments[0];
	for (i = 1; i < arguments.length; i += 1) {
		val -= arguments[i];
	}	
	return val;
};

var div_proc = function () {
	var i,
		val = arguments[0];
	for (i = 1; i < arguments.length; i += 1) {
		val /= arguments[i];
	}	
	return val;
};

var list = function () {
	var args = [],
		i,
		j,
		l,
		prev,
		temp;
	for (i = 0; i < arguments.length; i += 1) {
		args[i] = arguments[i];
	}
	l = [];
	prev = [];
	temp = [];
	for (i = args.length-1; i >= 0; i -= 1) {
		l = [args[i], prev];
		prev = l;
		temp = [];
		for (j = 0; j < prev.length; j += 1) {
			temp[j] = prev[j];
		}
		prev = temp;
	}
	return l;
};

var vector_set = function (v, p, val) {
	var a = v;
	a[p] = val;
	return a;
};

var mod_proc = function (a,b) {return a%b;};
var lt_proc = function (a,b) {return a<b;};
var gt_proc = function (a,b) {return a>b;};
var lte_proc = function (a,b) {return a<=b;};
var gte_proc = function (a,b) {return a>=b;};
var eq_proc = function (a,b) {return a===b;};
var car = function (a) {return a[0];};
var cdr = function (a) {return a[1];};
var cons = function (a,b) {return [a,b];};
var empty_bool = function (a) {return (a instanceof Array && a.length === 0);};
var list_bool = function (a) {return (a instanceof Array && a.length === 2);};
var equal_bool = function (a,b) {return a==b;};
var positive_bool = function (a) {return a>0;};
var negative_bool = function (a) {return a<0;	};
var zero_bool = function (a) {return a===0;};
var even_bool = function (a) {return (a%2)===0;};
var odd_bool = function (a) {return !is_even(a);};
var length = function (a) {return a.length;};
var make_vector = function (a) {return [a];};
var vector_ref = function (v, p) {return v[p];};
var vector_append = function (a, b) {return a.concat(b);};
var empty = [];
var not = function (a) { return !a; };
var abs = Math.abs;
var acos = Math.acos;
var asin = Math.asin;
var atan = Math.atan;
var ceiling = Math.ceil;
var cos = Math.cos;
var exp = Math.exp;
var floor = Math.floor;
var log = Math.log;
var max = Math.max;
var min = Math.min;
var pow = Math.pow;
var random = Math.random;
var round = Math.round;
var sin = Math.sin;
var sqr = function (a) { return a*a; };
var sqrt = Math.sqrt;
var tan = Math.tan;
