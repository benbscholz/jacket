
var _ljsp = function () {
	
	var get_source = function (callback) {
		var request = new XMLHttpRequest();
		request.open("GET", get_script_path());
		request.onreadystatechange = function () {
			callback(request.responseText);
		};
		request.send(null);
	};
	
	var get_script_path = function () {
		var i,
			scripts = document.getElementsByTagName("script"),
			path,
			url;
		for (i = 0; i < scripts.length; i += 1) {
			if (scripts[i].type === "language/jacket") {
				path = scripts[i].src;
			}
		}
		return path;
	};

	get_source(function (x) {
		var body = document.getElementsByTagName("body")[0],
			parsed = _parse(_preprocess(x)), 
			i,
			p;
		console.log(parsed);
		if (document.getElementsByTagName("p").length !== 0) {
			return;
		}
		for (i = 0; i < parsed.length; i += 1) {
			p = document.createElement("p");
			p.innerHTML = _translate(parsed[i]);
			p.style.fontFamily = "Menlo";
			body.appendChild(p);
		}
	});	

}();
