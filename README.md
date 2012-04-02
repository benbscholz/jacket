##jacket
####compiles a subset of Scheme to Javascript

###what is jacket?

Jacket is a compiler and interactive interpreter for a subset of Scheme. Written in Javascript, it allows the execution of jacket source files through a web 
browser or from the command line.

###jacket in the browser

To use jacket in a web browser, include a jacket source file using a script tag
with the language property set to `language/jacket`:

	<script src="lib/stdlib.jkt" type="language/jacket"></script>

Include the jacket compiler:
		
	<script src="jacket.min.js"></script>

Your jacket script will automatically compile and execute when the page loads.

###jacket interpreter

The jacket interpreter is built on top of `Spidermonkey 1.8.5`. Install
Spidermonkey with homebrew `brew install spidermonkey`, or your favorite package
manager.

Run the interpreter from the `src/` directory:

	./repl.js

To exit the interpreter, evaluate `(quit)`.

The Javascript evaluated in the interpreter is same as the output of the
compilation in the browser. Any differences in behavior are likely a result of
discrepencies between the Spidermonkey backend and other Javascript
environments.

###jacket standard library

A jacket script can call any Javascript function. There are a number of built-in
functions which can be found in `src/built_ins.js`. 

###jacket compilation

Jacket compilation is a 3 step process.
	
	1) Preprocessing: Removal of illegal characters & symbol/string distinction.
	2) Parsing:       Transform the jacket script into a syntax tree.
	3) Translation:   Generate appropriate Javascript code from the syntax tree.

Jacket also includes a balanced parentheses checker `_wellness`. It uses
[beautify.js](https://github.com/einars/js-beautify) as a pretty-printer,
`_pretty`.

###jacket translation examples

fib.jkt:
	(define (fib n)
		(if (< n 2)
			n
			(+ (fib (- n 1)) (fib (- n 2)))))

fib.js:
	var fib = function(n) {
		if (lt_proc(n, 2)) {
			return n;
		} else {
			return add_proc(fib(sub_proc(n, 1)), fib(sub_proc(n, 2)));
		}
	};
###jacket: to do

Jacket currently provides minimal functionality; there are still plenty of
issues to iron out. 

`translator.js` - Fix code generation bugs. 

`wellness.js`   - Add useful error messages.

`repl.js`       - Implement history for interactive interpreter.

`tests.js`      - Write test for code generation.

###license
jacket is MIT licensed.

	Copyright (C) 2012 Ben Brooks Scholz 

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to 
	deal in the Software without restriction, including without limitation the 
	rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
	sell copies of the Software, and to permit persons to whom the Software is 
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in 
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
	IN THE SOFTWARE.

###acknowledgments
Jacket was inspired by Peter Norvig's [lispy](http://norvig.com/lispy.html).
