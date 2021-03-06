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

Auto generated entity for email_messages
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("EmailMessages", ["rcWebservice", "rcDateHandler", EmailMessagesFactory])
		.factory("EmailMessagesManager", ["EntityManager", "EmailMessages", "rcWebservice", "dialogs", "$q", EmailMessagesManagerFactory]);

	function EmailMessagesFactory(rcWebservice, rcDateHandler) {

		function EmailMessages(data) {
			this.email_message_id = data.email_message_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without email_message_id", data);
			})();
			this.email_profile_id = data.email_profile_id || null;
			this.email_profile_name = data.email_profile_name || null;
			this.email_from = data.email_from || null;
			this.email_to = data.email_to || null;
			this.email_subject = data.email_subject || null;
			this.email_body = data.email_body || null;
			this.email_body_html = data.email_body_html || null;
			this.email_html_format = data.email_body_html ? true : false;
			this.email_priority = (data.email_priority == 1 ? true : false);
			this.date_added = rcDateHandler.fromDB(data.date_added);
			this.date_retry = rcDateHandler.fromDB(data.date_retry);
			this.date_sent = rcDateHandler.fromDB(data.date_sent);
			this.smtp_message_id = data.smtp_message_id || null;
			this.smtp_message_name = data.smtp_message_name || null;
			this.retry_count = data.retry_count || 0;
			this.retry_max = data.retry_max || 0;
			this.deleted = (data.deleted == 1 ? true : false);

			// Extracted from the email profile record
			this.smtp_address = data.smtp_address || null;
			this.smtp_port_number = data.smtp_port_number || null;
			this.smtp_login = data.smtp_login || null;
			this.smtp_password = data.smtp_password || null;

		}

		return EmailMessages;

	}

	function EmailMessagesManagerFactory(EntityManager, EmailMessages, rcWebservice, dialogs, $q) {

		function EmailMessagesManager() {
		}

		EmailMessagesManager.prototype = Object.create(EntityManager.prototype);
		EmailMessagesManager.prototype.constructor = EmailMessagesManager;
 		EmailMessagesManager.prototype._pool = {};
		EmailMessagesManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.email_message_id)) {
				if (update) {
					this._pool[data.email_message_id] = new EmailMessages(data);
				}
				instance = this._pool[data.email_message_id];
			} else {
				instance = new EmailMessages(data);
				this._pool[data.email_message_id] = instance;
			}
			return instance;
		};

		EmailMessages.prototype.resendMessage = function (emailMessage) {

			var deferred = $q.defer(), _this = this;

			emailMessage.retry_count = 0;
			emailMessage.deleted = false;
			emailMessage.date_sent = null;

			rcWebservice.post("base/rc_emailmessages/setEmailMessages", emailMessage).then(function (response) {
				dialogs.notify('$dict{email_messages}', '$dict{email_message_requeued}');
				deferred.resolve();
			}, deferred.reject);

			return deferred.promise;

		};

		EmailMessagesManager.prototype.webservices = {};
		EmailMessagesManager.prototype.webservices.action_set = "base/rc_emailmessages/setEmailMessages";
		EmailMessagesManager.prototype.webservices.action_recent = "base/rc_emailmessages/getEmailMessagesRecent";
		EmailMessagesManager.prototype.webservices.action_getAll = "base/rc_emailmessages/getEmailMessagesList";
		EmailMessagesManager.prototype.webservices.action_search = "base/rc_emailmessages/searchEmailMessages";
		EmailMessagesManager.prototype.webservices.action_get = "base/rc_emailmessages/getEmailMessages";
		EmailMessagesManager.prototype.webservices.action_del = "base/rc_emailmessages/delEmailMessages";
		EmailMessagesManager.prototype.id_field = "email_message_id";

		return EmailMessagesManager;
	}

})(angular);
