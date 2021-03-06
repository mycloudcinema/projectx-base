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

Auto generated entity for email_profiles
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("EmailProfiles", ["rcDateHandler", EmailProfilesFactory])
		.factory("EmailProfilesManager", ["EntityManager", "EmailProfiles", EmailProfilesManagerFactory]);

	function EmailProfilesFactory(rcDateHandler) {

		function EmailProfiles(data) {

			this.email_profile_id = data.email_profile_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without email_profile_id", data);
			})();
			this.email_profile_name = data.email_profile_name || null;
			this.smtp_address = data.smtp_address || null;
			this.smtp_port_number = data.smtp_port_number || null;
			this.smtp_login = data.smtp_login || null;
			this.smtp_password = data.smtp_password || null;
			this.active = (data.active == 1 ? true : false);

			// Set the audit values for the record
			setAuditValues(this, data, rcDateHandler, 'email_profile_id');

		}

		return EmailProfiles;

	}

	function EmailProfilesManagerFactory(EntityManager, EmailProfiles) {

		function EmailProfilesManager() {
		}

		EmailProfilesManager.prototype = Object.create(EntityManager.prototype);
		EmailProfilesManager.prototype.constructor = EmailProfilesManager;

		EmailProfilesManager.prototype._pool = {};
		EmailProfilesManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.email_profile_id)) {
				if (update) {
					this._pool[data.email_profile_id] = new EmailProfiles(data);
				}
				instance = this._pool[data.email_profile_id];
			} else {
				instance = new EmailProfiles(data);
				this._pool[data.email_profile_id] = instance;
			}
			return instance;
		};

		EmailProfilesManager.prototype.webservices = {};
		EmailProfilesManager.prototype.webservices.action_set = "base/rc_emailprofiles/setEmailProfiles";
		EmailProfilesManager.prototype.webservices.action_recent = "base/rc_emailprofiles/getEmailProfilesRecent";
		EmailProfilesManager.prototype.webservices.action_getAll = "base/rc_emailprofiles/getEmailProfilesList";
		EmailProfilesManager.prototype.webservices.action_search = "base/rc_emailprofiles/searchEmailProfiles";
		EmailProfilesManager.prototype.webservices.action_get = "base/rc_emailprofiles/getEmailProfiles";
		EmailProfilesManager.prototype.webservices.action_del = "base/rc_emailprofiles/delEmailProfiles";
		EmailProfilesManager.prototype.id_field = "email_profile_id";

		return EmailProfilesManager;

	}

})(angular);
