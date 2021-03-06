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

Auto generated entity for mailing_list_messages
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("MailingListMessages", ["rcDateHandler", MailingListMessagesFactory])
		.factory("MailingListMessagesManager", ["EntityManager", "MailingListMessages", MailingListMessagesManagerFactory]);

	function MailingListMessagesFactory(rcDateHandler) {

		function MailingListMessages(data) {

			this.mailing_list_message_id = data.mailing_list_message_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without mailing_list_message_id", data);
			})();
			this.mailing_list_id = data.mailing_list_id || null;
			this.mailing_list_name = data.mailing_list_name || null;
			this.mailing_list_member_id = data.mailing_list_member_id || null;
			this.mailing_list_member_name = data.mailing_list_member_name || null;
			this.email_message_id = data.email_message_id || null;
			this.email_message_name = data.email_message_name || null;
			this.message_status = (data.message_status == 1 ? true : false);

			// Set the audit values for the record
			setAuditValues(this, data, rcDateHandler, 'mailing_list_message_id');

		}

		return MailingListMessages;

	}

	function MailingListMessagesManagerFactory(EntityManager, MailingListMessages) {

		function MailingListMessagesManager() {
		}

		MailingListMessagesManager.prototype = Object.create(EntityManager.prototype);
		MailingListMessagesManager.prototype.constructor = MailingListMessagesManager;

		MailingListMessagesManager.prototype._pool = {};
		MailingListMessagesManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.mailing_list_message_id)) {
				if (update) {
					this._pool[data.mailing_list_message_id] = new MailingListMessages(data);
				}
				instance = this._pool[data.mailing_list_message_id];
			} else {
				instance = new MailingListMessages(data);
				this._pool[data.mailing_list_message_id] = instance;
			}
			return instance;
		};

		MailingListMessagesManager.prototype.webservices = {};
		MailingListMessagesManager.prototype.webservices.action_set = "base/rc_mailinglistmessages/setMailingListMessages";
		MailingListMessagesManager.prototype.webservices.action_recent = "base/rc_mailinglistmessages/getMailingListMessagesRecent";
		MailingListMessagesManager.prototype.webservices.action_getAll = "base/rc_mailinglistmessages/getMailingListMessagesList";
		MailingListMessagesManager.prototype.webservices.action_search = "base/rc_mailinglistmessages/searchMailingListMessages";
		MailingListMessagesManager.prototype.webservices.action_get = "base/rc_mailinglistmessages/getMailingListMessages";
		MailingListMessagesManager.prototype.webservices.action_del = "base/rc_mailinglistmessages/delMailingListMessages";
		MailingListMessagesManager.prototype.id_field = "mailing_list_message_id";

		return MailingListMessagesManager;

	}

})(angular);
