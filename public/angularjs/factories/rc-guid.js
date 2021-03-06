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

Factory class for generating Global unique identifiers as per rfc4122.
 */
 var GuidModule;
(function (GuidModule) {
	var rcGuid = (function () {
		function rcGuid() {
		}
		rcGuid.prototype.newGuid = function() {
			// http://www.ietf.org/rfc/rfc4122.txt
	 		var s = [];
	 		var hexDigits = "0123456789abcdef";
	 		for (var i = 0; i < 36; i++) {
	 			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	 		}
	 		s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
	 		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
	 		s[8] = s[13] = s[18] = s[23] = "-";
	 		return s.join("");
		};
		return rcGuid;
	})();
	GuidModule.rcGuid = rcGuid;
 })(GuidModule || (GuidModule = {}));

(function (ng) {
	"use strict";
	ng.module("rc.factories").factory("rcGuid", [function () {
		return GuidModule.rcGuid;
	}]);
})(angular, GuidModule);
