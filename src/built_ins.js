/**
 * Built-in functions for jacket.
 * Mathematical operators are transformed from symbols to strings by
 * the jacket compiler & interpreter.
 * ex: 
 *		'*' -> 'mult_proc'
 */

var _ = require('underscore');

var append = function (l, v) {
	if (_.isArray(l)) {
		l.push(v);
		return l;
	} else {
		return [l,v];
	}
};

var _typeof = function (a) {return typeof a;};
var _instanceof = function (a,b) {return a instanceof b;};
var car = function (a) {return a[0];};
var cdr = function (a) {return (a.length === 1) ? [] : _.rest(a);};
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
		return [a,b];
	}
};
var functionOf = function (o,f,a) { return o[f](a);};
var property = function (a,b) {return a[b];}; 
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
var blank = function () { return; };
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
