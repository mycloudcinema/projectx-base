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

Site specific declarations for modules that are being used by all pages
*/
(function (ng) {

	ng.module("rc.external", ["ui.bootstrap"]);

	// Autofocus directive that will be used to set the focus on elements that
	// are created after the page load.
	ng.module("rc.directives")
		.directive('autofocus', function () {
			return {
				restrict: 'A',
				link: function (scope, element) {
					element[0].focus();
				}
			};
		});

})(angular);
