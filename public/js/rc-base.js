var DEBUG = (window.location.hostname == 'localhost' || window.location.hostname == 'pos.dev.uniquedigitalcinema.com');

var debug = {
	log: function () {
		DEBUG && console.log.apply(this, arguments);
	},
	warn: function(){
		DEBUG && console.warn.apply(this, arguments);
	},
	info: function(){
		DEBUG && console.info.apply(this, arguments);
	},
	error: function(){
		DEBUG && console.error.apply(this, arguments);
	}
};

function syntaxHighlight(json) {

	if (typeof json != 'string') {
		json = JSON.stringify(json, undefined, 2);
	}

	json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

	return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
		var cls = 'number';
		if (/^"/.test(match)) {
			if (/:$/.test(match)) {
				cls = 'key';
			} else {
				cls = 'string';
			}
		} else if (/true|false/.test(match)) {
			cls = 'boolean';
		} else if (/null/.test(match)) {
			cls = 'null';
		}
		return '<span class="' + cls + '">' + match + '</span>';
	});

}

/**
 * Try parse a string as JSON. If JSON.parse fails returns a default value.
 * @param {string} str JSON string to parse
 * @param {any} def Default value to return when JSON.parse fails
 */
function JSONTryParse(str, def) {
	try {
		let value = JSON.parse(str);
		// Handle non-exception-throwing cases:
		// Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
		// but... JSON.parse(null) returns null, and typeof null === "object",
		// so we must check for that, too. Thankfully, null is falsey, so this suffices:
		if (value && typeof value === "object") {
			return value;
		} else {
			return def;
		}
	} catch (e) {
		return def;
	}
}

function saveToStorage(storageKey, storageValue) {
	if (localStorage) {
		localStorage.setItem(storageKey, storageValue);
	}
}
function getFromStorage(storageKey) {
	if (localStorage) {
		return localStorage.getItem(storageKey);
	}
}

function getRequestParameter(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
