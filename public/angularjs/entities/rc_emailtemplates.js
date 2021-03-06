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

Auto generated entity for email_templates
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("EmailTemplates", ["rcDateHandler", EmailTemplatesFactory])
		.factory("EmailTemplatesManager", ["EntityManager", "EmailTemplates", EmailTemplatesManagerFactory]);

	function EmailTemplatesFactory(rcDateHandler) {

		function EmailTemplates(data) {

			this.email_template_id = data.email_template_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without email_template_id", data);
			})();
			this.event_type = data.event_type || null;
			this.language = data.language || null;
			this.language_name = data.language_name || null;
			this.subject = data.subject || null;
			this.template = data.template || null;
			this.bcc_addresses = data.bcc_addresses || null;

			// Set the audit values for the record
			setAuditValues(this, data, rcDateHandler, 'email_template_id');

		}

		return EmailTemplates;

	}

	function EmailTemplatesManagerFactory(EntityManager, EmailTemplates) {

		function EmailTemplatesManager() {
		}

		EmailTemplatesManager.prototype = Object.create(EntityManager.prototype);
		EmailTemplatesManager.prototype.constructor = EmailTemplatesManager;

		EmailTemplatesManager.prototype._pool = {};
		EmailTemplatesManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.email_template_id)) {
				if (update) {
					this._pool[data.email_template_id] = new EmailTemplates(data);
				}
				instance = this._pool[data.email_template_id];
			} else {
				instance = new EmailTemplates(data);
				this._pool[data.email_template_id] = instance;
			}
			return instance;
		};

		EmailTemplatesManager.prototype.webservices = {};
		EmailTemplatesManager.prototype.webservices.action_set = "base/rc_emailtemplates/setEmailTemplates";
		EmailTemplatesManager.prototype.webservices.action_recent = "base/rc_emailtemplates/getEmailTemplatesRecent";
		EmailTemplatesManager.prototype.webservices.action_getAll = "base/rc_emailtemplates/getEmailTemplatesList";
		EmailTemplatesManager.prototype.webservices.action_search = "base/rc_emailtemplates/searchEmailTemplates";
		EmailTemplatesManager.prototype.webservices.action_get = "base/rc_emailtemplates/getEmailTemplates";
		EmailTemplatesManager.prototype.webservices.action_del = "base/rc_emailtemplates/delEmailTemplates";
		EmailTemplatesManager.prototype.id_field = "email_template_id";

		return EmailTemplatesManager;

	}

})(angular);
