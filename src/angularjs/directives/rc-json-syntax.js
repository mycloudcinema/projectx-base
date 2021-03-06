/*
  ____                     _
 |  _ \ ___ _ __ ___   ___| | __
 | |_) / _ \ '_ ` _ \ / _ \ |/ /
 |  _ <  __/ | | | | |  __/   <
 |_| \_\___|_| |_| |_|\___|_|\_\

   ____                      _ _   _
  / ___|___  _ __  ___ _   _| | |_(_)_ __   __ _
 | |   / _ \| '_ \/ __| | | | | __| | '_ \ / _` |
 | |__| (_) | | | \__ \ |_| | | |_| | | | | (_| |
  \____\___/|_| |_|___/\__,_|_|\__|_|_| |_|\__, |
                                            |___/

Allow an element to convered to a formatted JSON object suitable for viewing.
*/

(function (ng) {

	"use strict";

	ng.module("rc.directives")
		.directive("rcJsonSyntax", ["$compile", rcJsonSyntax]);

	function rcJsonSyntax($compile) {

		return {
			restrict:		"E",
			transclude:		true,
			replace:		true,
			template:		function(elem, attr) {
				return "<pre class='{{class}}'>{{syntax}}></pre>";
			},
			scope:{
				class:		"@",
				json:		"="
			},

			link: function (scope, element, attrs, ctrl) {

				scope.$watch("json", function (value) {

					try {

						if (typeof scope.json === 'string') {
							scope.syntax = syntaxHighlight(JSON.stringify(JSON.parse(scope.json), undefined, 2));
						} else if (typeof scope.json === 'object') {
							scope.syntax = syntaxHighlight(JSON.stringify(scope.json, undefined, 2));
						} else if (typeof scope.json === undefined) {
							scope.syntax = {};
						}

					} catch (ex) {
						console.log('Invalid JSON provided', ex);
					}

				});

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
			}
		};
	}

})(angular);
