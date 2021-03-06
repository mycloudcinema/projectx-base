/*
 __  __          _____ _                 _    _____ _
|  \/  |        / ____| |               | |  / ____(_)
| \  / |_   _  | |    | | ___  _   _  __| | | |     _ _ __   ___ _ __ ___   __ _
| |\/| | | | | | |    | |/ _ \| | | |/ _` | | |    | | '_ \ / _ \ '_ ` _ \ / _` |
| |  | | |_| | | |____| | (_) | |_| | (_| | | |____| | | | |  __/ | | | | | (_| |
|_|  |_|\__, |  \_____|_|\___/ \__,_|\__,_|  \_____|_|_| |_|\___|_| |_| |_|\__,_|
         __/ |
        |___/

Service to manage the loading and storing of user preferences in local storage.
*/

(function () {

	"use strict";

	angular.module("rc.services")
		.service("rcUserPreferences", [rcUserPreferences]);

	var storage;

	function rcUserPreferences() {

		var self = this;

		// Feature detect + local reference
		var fail;
		var uid;
		try {
			uid = new Date;
			(storage = window.localStorage).setItem(uid, uid);
			fail = storage.getItem(uid) != uid;
			storage.removeItem(uid);
			fail && (storage = false);
		} catch (exception) {}
	}

	// Look in local storage to see if we already have an entry. If we don't
	// then we return the default values (or an empty object).
	rcUserPreferences.prototype.getPreferences = function (keyId, defaultValues) {

		var userPreferences;

		if (storage) {
			userPreferences = JSON.parse(storage.getItem(keyId));
			if (!userPreferences) {
				userPreferences = defaultValues || {};
			}
			storage.setItem(keyId, JSON.stringify(userPreferences));
		} else {
			userPreferences = defaultValues || {};
		};

		return userPreferences;
	};

	// If applicable then save the users preferences to local storage.
	rcUserPreferences.prototype.setPreferences = function (keyId, userPreferences) {
		if (storage) {
			storage.setItem(keyId, JSON.stringify(userPreferences));
		}
	};

})();
