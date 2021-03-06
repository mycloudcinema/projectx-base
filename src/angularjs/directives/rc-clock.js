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

 Directive that updates an onscreen clock without firing the digest loop
 on the controller.
 */
(function (ng) {

	"use strict";

	ng.module("rc.directives")
		.directive("rcClock", ["$locale", rcClock]);

	function rcClock($locale) {

		return {
			restrict:	"A",
			scope:		false,
			link: function (scope, element, attrs, ctrl) {

				var clockFormat = attrs.rcClock || $locale.MOMENT.DATETIME_FORMATS.shortTime;

				function updateClock() {

					// Set the display for the clock
					element.html(moment().format(clockFormat));

					// Determine how many seconds until the start of the next minute
					// and then create a timer that will fire after that many seconds
					var timerInterval = moment().diff(moment().add(1, 'minute'), 'seconds');
					setTimeout(function() {
						updateClock();
					}, timerInterval)

				}
				updateClock();
			}
		};
	}

})(angular);
