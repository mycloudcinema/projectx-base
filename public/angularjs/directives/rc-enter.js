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

Base Angular directives declaration
*/

(function (ng) {

	"use strict";

	ng.module("rc.directives").directive("rcEnter", [rcEnter]);

	function rcEnter() {
		return {
			restrict: "A",
			link: function (scope, element, attrs, ctrl) {
				element.bind("keydown keypress", function (event) {
					if (event.which === 13) {
						scope.$apply(function () {
							scope.$eval(attrs.rcEnter);
						});
						event.preventDefault();
					}
				});
			}
		};
	}
})
(angular);
