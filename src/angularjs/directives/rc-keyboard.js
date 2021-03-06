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

 Onscreen keyboard linked directly to an input element.
 */
(function (ng) {

	"use strict";

	ng.module("rc.directives")
		.directive("rcKeyboard", [rcKeyboard]);

	function rcKeyboard() {

		return {
			restrict:	"E",
			scope:		false,
			template:	'<div class="row"><div class="col-xs-12"><input type="text"/></div><div class="col-xs-12"><h1>Keyboard Inserted Here<h1></div></div>',
			link: function (scope, element, attrs, ctrl) {

			}
		};
	}

})(angular);
