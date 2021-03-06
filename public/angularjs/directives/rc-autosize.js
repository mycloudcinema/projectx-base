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

 Allow an element to convered to a span that will be sized automatically based
 on a set number of sizing options.
*/

(function (ng) {

	"use strict";

	ng.module("rc.directives")
		.directive("rcAutoSize", [rcAutoSize]);

	function rcAutoSize() {

		return {
			restrict:		"E",
			transclude:		true,
			replace:		true,
			template:		"<span class='{{class}}' style='{{style}}'>{{text}}</span>",
			scope:{
				class:		"@",
				text:		"="
			},
			link: function (scope, element, attrs, ctrl) {

				scope.$watch("text", function (value) {

					// Check to see if the supplied options can be used to determine the
					// font size to be used. If not then we just use the text unmodified.
					try {
						var sizeOptions = JSON.parse(attrs.options);

						// Find the appropriate font size to use based on the text length
						var textLength = scope.text.length;

						var autoSizeStyle = "";

						sizeOptions.forEach(function(sizeOption) {
							if (textLength >= sizeOption.len) {
								autoSizeStyle = "font-size: " + sizeOption.size + ";";
							}
						})
						scope.style = autoSizeStyle;

					} catch (ex) {
						console.log('Invalid autosize options provided', ex);
					}
				});

			}
		};
	}

})(angular);
