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

Auto generated entity for mailing_lists
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("MailingLists", ["rcDateHandler", MailingListsFactory])
		.factory("MailingListsManager", ["EntityManager", "MailingLists", MailingListsManagerFactory]);

	function MailingListsFactory(rcDateHandler) {

		function MailingLists(data) {

			this.mailing_list_id = data.mailing_list_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without mailing_list_id", data);
			})();
			this.mailing_list_name = data.mailing_list_name || null;
			this.active = (data.active == 1 ? true : false);

			// Set the audit values for the record
			setAuditValues(this, data, rcDateHandler, 'mailing_list_id');

		}

		return MailingLists;

	}

	function MailingListsManagerFactory(EntityManager, MailingLists) {

		function MailingListsManager() {
		}

		MailingListsManager.prototype = Object.create(EntityManager.prototype);
		MailingListsManager.prototype.constructor = MailingListsManager;

		MailingListsManager.prototype._pool = {};
		MailingListsManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.mailing_list_id)) {
				if (update) {
					this._pool[data.mailing_list_id] = new MailingLists(data);
				}
				instance = this._pool[data.mailing_list_id];
			} else {
				instance = new MailingLists(data);
				this._pool[data.mailing_list_id] = instance;
			}
			return instance;
		};

		MailingListsManager.prototype.webservices = {};
		MailingListsManager.prototype.webservices.action_set = "base/rc_mailinglists/setMailingLists";
		MailingListsManager.prototype.webservices.action_recent = "base/rc_mailinglists/getMailingListsRecent";
		MailingListsManager.prototype.webservices.action_getAll = "base/rc_mailinglists/getMailingListsList";
		MailingListsManager.prototype.webservices.action_search = "base/rc_mailinglists/searchMailingLists";
		MailingListsManager.prototype.webservices.action_get = "base/rc_mailinglists/getMailingLists";
		MailingListsManager.prototype.webservices.action_del = "base/rc_mailinglists/delMailingLists";
		MailingListsManager.prototype.id_field = "mailing_list_id";

		return MailingListsManager;

	}

})(angular);
