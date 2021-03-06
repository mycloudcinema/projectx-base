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

Display a number of minutes in a defined format. Used to format times for the Show
Viewer, Box Office and ticket collection software.
*/
(function (ng) {

	"use strict";

	ng.module("rc.directives")
		.filter("rcTime", ["$locale", rcTime]);

	function rcTime($locale) {

		return function (minutes, format, decimal_times) {

			var portionWeeks,
			 	portionDays,
				portionHours,
				portionMinutes;

			if (isNaN(minutes)) return '-';

			if (typeof format === 'undefined') format = "time";

			if (minutes > 10080) {
				portionWeeks = Math.floor(minutes / 10080);
				minutes = minutes - (portionWeeks * 10080);
			}
			if (minutes > 1440) {
				portionDays = Math.floor(minutes / 1440);
				minutes = minutes - (portionDays * 1440);
			}
			if (minutes > 60) {
				portionHours = Math.floor(minutes / 60);
				minutes = minutes - (portionHours * 60);
			}
			portionMinutes = minutes;

			switch (format) {
				case 'minsandtext':
					if (!portionHours || portionHours === 0) {
						return portionMinutes + ' $dict{minutes}';
					} else {
						return portionHours + ':' + pad(portionMinutes, 2);
					}
					break;
				case 'hoursminandtext':
					if (portionHours && portionHours !== 0) {
						return portionHours + ' $dict{hours} ' + portionMinutes + ' $dict{minutes}';
					} else {
						return portionMinutes + ' $dict{minutes}';
					}
					break;
				case 'full':
					if (portionWeeks) {
						if (portionWeeks === 1)
							return '$dict{week_pre} ' + portionWeeks + ' $dict{week_post}';
						else
							return '$dict{weeks_pre} ' + portionWeeks + ' $dict{weeks_post}';
					}
					if (portionDays) {
						if (portionDays === 1)
							return '$dict{day_pre} ' + portionDays + ' $dict{day_post}';
						else
							return '$dict{days_pre} ' + portionDays + ' $dict{days_post}';
					}
					if (portionHours) {
						if (portionHours === 1)
							return '$dict{hour_pre} ' + portionHours + ' $dict{hour_post}';
						else
							return '$dict{hours_pre} ' + portionHours + ' $dict{hours_post}';
					}
					if (portionMinutes) {
						if (portionMinutes === 1)
							return '$dict{minute_pre} ' + portionMinutes + ' $dict{minute_post}';
						else
							return '$dict{minutes_pre} ' + portionMinutes + ' $dict{minutes_post}';
					}
					break;
				default:
					if (decimal_times) {
						portionHours = portionHours || 0;
						if (portionDays) {
							portionHours += (portionDays || 0) * 24
						}
						if (portionWeeks) {
							portionHours += (portionWeeks || 0) * 168
						}

						return (portionHours || 0) + $locale.NUMBER_FORMATS.DECIMAL_SEP + pad(Math.round((portionMinutes / 60) * 100), 2);
						break;
					} else {
						portionHours = portionHours || 0;
						if (portionDays) {
							portionHours += (portionDays || 0) * 24
						}
						if (portionWeeks) {
							portionHours += (portionWeeks || 0) * 168
						}

						return (portionHours || 0) + ':' + pad(portionMinutes, 2);
						break;
					}
			}
		};
	};

	function pad(n, width, z) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}

})(angular);
