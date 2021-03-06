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

We have issues with formatting numbers for different locales and also need to
format numbers so they can be copy/pasted into Excel. This directive allows us
to use one directive to provide the different formats and also Excel formatting.
 */
(function (ng) {

	"use strict";

	ng.module("rc.directives").filter("rcAmount", function ($locale) {

		return function (value, format) {

			// The format can be an object with settings that control how we will
			// format the value, otherwise we are just formatting the value based
			// on a defined number format, and if that isn't supplied then we are
			// returning the number itself.
			if (typeof format === 'object') {

				var formattedAmount;
				var parts = (value || 0).toString().split(".");

				// If we are formatting for Excel then we return the value "as is"
				// and Excel will handle the formatting.
				if (format.forExcel) {
					if (format.decimalDigits && format.decimalDigits > 0) {
						var decimalValue = padRight(parts[1] || 0, format.decimalDigits).substring(0, format.decimalDigits);
						formattedAmount = padLeft(parts[0], format.padLength || 1) + $locale.NUMBER_FORMATS.DECIMAL_SEP + decimalValue;
					} else {
						formattedAmount = padLeft(parts[0], format.padLength || 1);
					}
				} else {
					if (format.decimalDigits && format.decimalDigits > 0) {
						var decimalValue = padRight(parts[1] || 0, format.decimalDigits).substring(0, format.decimalDigits);
						formattedAmount = padLeft(parts[0], format.padLength || 1).replace(/\B(?=(\d{3})+(?!\d))/g, $locale.NUMBER_FORMATS.GROUP_SEP) + $locale.NUMBER_FORMATS.DECIMAL_SEP + decimalValue;
					} else {
						formattedAmount = padLeft(parts[0], format.padLength || 1).replace(/\B(?=(\d{3})+(?!\d))/g, $locale.NUMBER_FORMATS.GROUP_SEP);
					}
					if (format.isCurrency) {
						if ($locale.NUMBER_FORMATS.SYM_IN_FRONT) {
							return $locale.NUMBER_FORMATS.CURRENCY_SYM + ' ' + formattedAmount;
						} else {
							return formattedAmount += ' ' + $locale.NUMBER_FORMATS.CURRENCY_SYM;
						}
					} else {
					}
				}
				return formattedAmount;

			} else {
				return value || 0;
			}
		};

 	});

	function padRight(value, width, padCharacter) {
		padCharacter = padCharacter || '0';
		value = value + '';
		return value.length >= width ? value : value + new Array(width - value.length + 1).join(padCharacter);
	}

	function padLeft(value, width, padCharacter) {
		padCharacter = padCharacter || '0';
		value = value + '';
		return value.length >= width ? value : new Array(width - value.length + 1).join(padCharacter) + value;
	}

})(angular);
