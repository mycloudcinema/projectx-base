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

Auto generated entity for email_attachments
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("EmailAttachments", ["rcDateHandler", EmailAttachmentsFactory])
		.factory("EmailAttachmentsManager", ["EntityManager", "EmailAttachments", EmailAttachmentsManagerFactory]);
	 
	function EmailAttachmentsFactory(rcDateHandler) {

		function EmailAttachments(data) {
			this.email_attachment_id = data.email_attachment_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without email_attachment_id", data);
			})();
			this.email_message_id = data.email_message_id || null;
			this.email_message_name = data.email_message_name || null;
			this.attachment_file_name = data.attachment_file_name || null;
			this.last_updated = rcDateHandler.fromDB(data.last_updated);
			this.last_updated_by = data.last_updated_by || null;
			this.last_updated_by_name = data.last_updated_by_name || null;
			this.replication_id = data.replication_id || null;
			this.replication_source = data.replication_source || null;
			this.deleted = (data.deleted == 1 ? true : false);
		}

		return EmailAttachments;

	}
	 
	function EmailAttachmentsManagerFactory(EntityManager, EmailAttachments) {

		function EmailAttachmentsManager() {
		}
		 
		EmailAttachmentsManager.prototype = Object.create(EntityManager.prototype);
		EmailAttachmentsManager.prototype.constructor = EmailAttachmentsManager;

		EmailAttachmentsManager.prototype._pool = {};
		EmailAttachmentsManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.email_attachment_id)) {
				if (update) {
					this._pool[data.email_attachment_id] = new EmailAttachments(data);
				}
				instance = this._pool[data.email_attachment_id];
			} else {
				instance = new EmailAttachments(data);
				this._pool[data.email_attachment_id] = instance;
			}
			return instance;
		};

		EmailAttachmentsManager.prototype.webservices = {};
		EmailAttachmentsManager.prototype.webservices.action_set = "base/rc_emailattachments/setEmailAttachments";
		EmailAttachmentsManager.prototype.webservices.action_recent = "base/rc_emailattachments/getEmailAttachmentsRecent";
		EmailAttachmentsManager.prototype.webservices.action_getAll = "base/rc_emailattachments/getEmailAttachmentsList";
		EmailAttachmentsManager.prototype.webservices.action_search = "base/rc_emailattachments/searchEmailAttachments";
		EmailAttachmentsManager.prototype.webservices.action_get = "base/rc_emailattachments/getEmailAttachments";
		EmailAttachmentsManager.prototype.webservices.action_del = "base/rc_emailattachments/delEmailAttachments";
		EmailAttachmentsManager.prototype.id_field = "email_attachment_id";

		return EmailAttachmentsManager;

	}

})(angular);

