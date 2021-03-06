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

Service to provide an inactivity timer to perform actions when the user is idle.
*/
(function (ng) {

	"use strict";

	ng.module("rc.services").service("rcInactivity", ["$q", "$interval", InactivityHandler]);

	function InactivityHandler($q, $interval) {

		var self = this;

		self.inactivityPeriod = 10000;
		self.callback = null;
		self.inactivityHandle = null;

		self.setInactivityTimer = function() {
			if (self.inactivityHandle) {
				$interval.cancel(self.inactivityHandle);
			}
			self.inactivityHandle = $interval(self.callback, self.inactivityPeriod);
		};
		self.resetInactivityTimer = function() {
			$interval.cancel(self.inactivityHandle);
			self.setInactivityTimer();
		};
		self.clearInactivityTimer = function() {
			$interval.cancel(self.inactivityHandle);
		};

		self.init = function(inactivityPeriod, callback) {

			if (inactivityPeriod < 10) {
				self.inactivityPeriod = 10000;
			} else {
				self.inactivityPeriod = (inactivityPeriod * 1000);
			}
			self.callback = callback;
			self.setInactivityTimer();

			window.addEventListener("mousemove", self.resetInactivityTimer, false);
			window.addEventListener("mousedown", self.resetInactivityTimer, false);
			window.addEventListener("keypress", self.resetInactivityTimer, false);
			window.addEventListener("mousewheel", self.resetInactivityTimer, false);
		};

	}

})(angular);
