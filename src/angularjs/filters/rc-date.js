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

This filter is used to format dates according to the users requirements as well
as providing a way to format dates acceptable for Excel when copy and pasting.
*/
(function (ng) {

	"use strict";

	ng.module("rc.directives").filter("rcDate", function ($locale) {

		return function (value, format) {

			var formatString = $locale.MOMENT.DATETIME_FORMATS.shortDate;

			// The format can be an object with settings that control how we will
			// format the value, otherwise we are just formatting the value based
			// on a defined number format, and if that isn't supplied then we are
			// returning the number itself.
			if (!value) {
				return '';
			} else {
				if (typeof format === 'object') {

					// If we are formatting for Excel then we return the date as YYYY-MM-DD
					// and Excel will handle the formatting.
					if (format.forExcel) {
						formatString = $locale.MOMENT.DATETIME_FORMATS.shortDate;
					} else {
						formatString = format.formatString || $locale.MOMENT.DATETIME_FORMATS.shortDate;
					}
					if (format.includeTime) {
						formatString += ' ' + $locale.MOMENT.DATETIME_FORMATS.shortTime;
					}
				}
				return moment(value).format(formatString);
			}
		};

 	});

})(angular);
