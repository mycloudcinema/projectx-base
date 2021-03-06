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

Display a number in a user readable form or Bytes, Kb etc
*/
(function (ng) {

	"use strict";

	ng.module("rc.directives").filter("rcBytes", function () {
		return function (bytes, precision) {
			if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
			if (typeof precision === 'undefined') precision = 1;
			var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
			return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
		};
	});

})(angular);
