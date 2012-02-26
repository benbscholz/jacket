#!/usr/bin/env js

load("qunit/qunit.js");

QUnit.init();
QUnit.config.blocking = false;
QUnit.config.autorun = true;
QUnit.config.updateRate = 0;
QUnit.log = function (t) {
	print(t.result ? "PASS: " + t.message : "FAIL: " + t.message);
	if (!t.result) {
		print("ACTUAL:   " + t.actual);
		print("EXPECTED: " + t.expected);
	}

};

load("../src/preprocessor.js");
load("../src/parser.js");
load("../src/translator.js");
load("tests/translator_test.js");
