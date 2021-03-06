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

Service to accept date input and return a moment object in the users timezone.
*/

(function () {

	"use strict";

	angular.module("rc.services")
		.service("rcDateHandler", ["$locale", DateHandlerManager]);

	function DateHandlerManager($locale) {

		var self = this;

		moment.locale($locale.MOMENT.locale);

		self.fromDB = function(dbDate, notUTC) {

			if (moment(dbDate).isValid()) {
				if (notUTC) {
					return moment(dbDate);
				} else {
					return moment.utc(dbDate);
				}
			}
			debug.log("Moment date " + dbDate + " was not valid");
			return null;
		};

		self.fromDBtoLocal = function(dbDate, timeZone) {

			if (moment(dbDate).isValid()) {

				// Strip out the characters which are upsetting the date extraction
				try {
					dbDate = dbDate.replace('Z', '').replace('T', ' ');
					return moment.tz(dbDate, timeZone);
				} catch (ex) {
					debug.error(ex);
					debug.error("Moment date " + dbDate + " was not valid");
				}
			} else {
				debug.error("Moment date " + dbDate + " was not valid");
				return null;
			}

		};

		self.fromDate = function(uiDate) {

			if (moment(uiDate).isValid()) {
				return moment(uiDate);
			}
			return null;

		};

		self.getUIDate = function(momentParameter) {

			if (momentParameter) {

				if (typeof momentParameter === 'object')
					return moment(momentParameter);
				else if (typeof momentParameter === 'string')
					if (moment(momentParameter).isValid()) {
						return moment(momentParameter);
					} else {
						return moment().format(momentParameter);
					}
				else if (momentParameter)
					return moment(momentParameter);
			}
			return moment();
		};


		self.getUIStartOfDay = function() {
			return self.getUIDate().startOf('day');
		}

		self.getUIStartOfScheduleDay = function(momentParameter) {
			if (momentParameter) {
				return moment.utc(momentParameter).startOf('day').add(6, 'hours');
			} else {
				return moment.utc().startOf('day').add(6, 'hours');
			}
		}

		// Differences
		self.diffMins = function(moment1, moment2) {

			var startTime;
			var endTime;

			if (moment2) {
				startTime = moment1;
				endTime = moment2;
				return Math.floor(moment.duration(moment1.diff(moment2)).asMinutes());
			} else {
				startTime = moment();
				endTime = moment1;
				return Math.floor(moment.duration(moment().diff(moment1)).asMinutes());
			}
		};
	}

})();
