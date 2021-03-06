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

Displays a countdown timer and then fires the defined action when the timeout
has expired. This is not an accurate timeout clock, it is firing "approximately"
every second.
 */
(function (ng) {

	"use strict";

	ng.module("rc.directives")
		.directive("rcTimeoutClock", ["$locale", "$timeout", rcTimeoutClock]);

	function rcTimeoutClock($locale, $timeout) {

		return {
			restrict:	"E",
			replace:	true,
			template:	"<span class='{{class}}'>{{prefix}} {{displayText}} {{suffix}}</span>",
			scope:		 {
				prefix:			"@",
				suffix:			"@",
				timerExpired:	"=",
				value:			'='
			},
			link: function (scope, element, attrs, ctrl) {

				var warningZone = attrs.warningZone || 30;

				scope.countdown = ng.copy(scope.value);

				function updateClock() {

					// Set the display for the clock
					var portionMinutes = 0,
						portionSeconds;

					portionSeconds = ng.copy(scope.countdown);

					if (isNaN(portionSeconds)) {
						scope.displayText = '00:00';
					} else {

						if (portionSeconds > 60) {
							portionMinutes = Math.floor(portionSeconds / 60);
							portionSeconds = portionSeconds - (portionMinutes * 60);
						}
						scope.displayText = pad(portionMinutes, 2) + ':' + pad(portionSeconds, 2);

					}

					// When we get to within the warning zone we can change the class
					if (scope.countdown <= warningZone) {
						scope.class = "warning";
					} else {
						scope.class = "normal";
					}

					// Determine how many seconds until the start of the next minute
					// and then create a timer that will fire after that many seconds
					if (scope.countdown == 0) {
						if (typeof scope.timerExpired == 'function') {
							scope.timerExpired();
						}
					} else {
						$timeout(function() {
							scope.countdown--;
							updateClock();
						}, 1000)
					}

				}

				scope.$watch("value", function (value) {
					// console.log('Value changed', value);
					if (value) {
						var triggerClock = true;
						if (scope.countdown > 0) {
							triggerClock = false;
						}

						scope.countdown = ng.copy(value);

						if (triggerClock) {
							updateClock();
						}
					}
				}, true);

				if (scope.countdown) {
					updateClock();
				}
			}
		};
	}

	function pad(n, width, z) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}

})(angular);
