
var trans = function (x) {
	return _translate(_parse(_preprocess(x)));
};

module("translator.js");
	
test("if code generation", function () {
	expect(8);
	equal(trans("(if (= 1 2) a b)"), 
		  "if (eq_proc(1,2)) {return a;} else {return b;}",
		  "if statement code generation");
	equal(trans("(cond ((= 1 2) a) ((= x y) b) (else c))"),
		  "if (eq_proc(1,2)) {return a;} else if (eq_proc(x,y)) {return b;} else {return c;}",
		  "cond statement code generation");
	equal(trans("(begin (define a 3) (set! b a) b)"),
		  "function () {var a = 3;b = a;return b;}();",
		  "begin statement code generation");
	equal(trans("(define a 3)"),
		  "var a = 3;",
		  "define variable code generation");
	equal(trans("(define (sqr x) (* x x))"),
		  "var sqr = function (x) {return mult_proc(x,x);};",
		  "define function code generation");
	equal(trans("(lambda (x) (* x x))"),
		  "function (x) {return mult_proc(x,x);}",
		  "lambda code generation");
	equal(trans("'(1 2 3 4)"),
		  "[1,2,3,4]",
		  "quote list code generation");
	equal(trans("(+ 1 2)"),
		  "add_proc(1,2)",
		  "function call code generation");
});
