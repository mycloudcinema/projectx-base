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

Service to read input from a barcode scanner and pass that information to
the underlying software for processing.
*/

(function () {

	"use strict";

	angular.module("rc.services").service("rcScanner", ["$rootScope", "rcDevice", ScannerManager]);

	function ScannerManager($rootScope, rcDevice) {

		var self = this;
		var scanSpeed = (rcDevice.device && rcDevice.device.config && rcDevice.device.config.barcode_scan_speed) ? rcDevice.device.config.barcode_scan_speed : 225;

		// This method gets called when a scan is complete.
		self.onScan = null;

		// Indicates if we want to limit input only to EAN barcodes
		self.eanOnly = false;

		// The result of the scan
		var result = "";

		// Variable for tracking the timeout function to be able to cancel it when needed
		var timeout;

		// Setup a timeout that will fire if the elapsed time expires. This allows
		// us to differentiate between very fast keypresses and a barcode being
		// scanned. If you are having issues with keypresses being interpreted as
		// barcode scans then lower the timeout value slighty.
		function startResetTimer(timeOut) {
			timeout = setTimeout(function () {
				result = "";
			}, timeOut);
		}

		// Register the listener
		document.addEventListener("keypress", handleKeypress);

		function handleKeypress(event) {

			// Enter pressed. The scanner finished scanning a barcode
			if (event.keyCode === 13) {

				// Reset the timeout
				clearTimeout(timeout);

				// If we received at least 3 characters then we will process the
				// barcode.
				if (result.length > 3) {

					// TODO: Find a more elegant solution to this problem.
					// HACK: The Czech keyboard has the numbers inverted so you have to
					//		 press the shift key to use numbers. We just check for a string
					//		 containing Czech characters and if we find one we invert it
					//		 back again.
					var CZECH = '+ěščřžýáíé';
					var NUMS = '1234567890';
					var translate = [];

					for (var x = 0; x < result.length; x++) {
						if (CZECH.indexOf(result[x]) !== -1)
							translate.push(NUMS[CZECH.indexOf(result[x])]);
						else
							translate.push(result[x]);
					}
					result = translate.join('');

					// Verify that we have a valid code and if we do then we raise
					// the event in the consuming software.
					if (self.eanOnly) {
						if (isEAN(result)) {
							self.onScan(event, result);
						}
					} else {
						self.onScan(event, result);
					}

					// Clear the result
					result = "";

					$rootScope.$digest();
				}

			} else {
				startResetTimer(scanSpeed);
				result += String.fromCharCode(event.charCode);
			}
		}
		function isEAN(code) {
			var reg = new RegExp("^[0-9]*$");
			return (reg.test(code) && code.length > 7 && code.length < 14);
		}
	}

})();
