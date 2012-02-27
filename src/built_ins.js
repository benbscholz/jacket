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
		i;
	for (i = 0; i < arguments.length; i += 1) {
		args.push(arguments[i]);
	}
	args.push([]);
	return args;
};

var vector_set = function (v, p, val) {
	var a = v;
	a[p] = val;
	return a;
};

var _isArray = function (item) {
	if (item && typeof item === 'object' && item.constructor === Array)
		return true;
	else if (Object.prototype.toString.call(item) == '[object Array]')
		return true;
	else
		return false;
};	

var mod_proc = function (a,b) {return a%b;};
var lt_proc = function (a,b) {return a<b;};
var gt_proc = function (a,b) {return a>b;};
var lte_proc = function (a,b) {return a<=b;};
var gte_proc = function (a,b) {return a>=b;};
var eq_proc = function (a,b) {return a===b;};
var car = function (a) {return a[0];};
var cdr = function (a) {return a.slice(1,a.length);};
var first = car;
var rest = cdr;
var cons = function (a,b) {
	var isa, isb;
	isa = _isArray(a);
	isb = _isArray(b);
	if (isa && isb) {
		return a.concat(b);
	} else if (isa) {
		return a.push(b);
	} else if (isb) {
		return b.push(a);
	} else {
		return [a,b,[]];
	}
};
var empty_bool = function (a) {return (a instanceof Array && a.length === 0);};
var list_bool = function (a) {return _isArray(a) && a[-1] === [];};
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
var add1 = function (a) { return a+1; };
var sub1 = function (a) { return a-1; };
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
