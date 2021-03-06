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

Filter for handling moment dates
*/
(function (ng) {

	"use strict";

	ng.module("rc.directives").filter("moment", ["$locale", rcMoment]);

	function rcMoment($locale) {

		return function (input, format) {
			// If the input is a valid moment object
			if (input && moment.isMoment(input)) {
				try {
					// Set the moment locale or the format will not be correct
					input.locale($locale.id);
					// if (format === 'userMediumFormat') {
						// console.log(moment.locale(), input, $locale, format);
					// }
					return input.format($locale.MOMENT.DATETIME_FORMATS[format]);
				} catch (ex) {
					return input;
				}
			}
		}

	}

})(angular);
