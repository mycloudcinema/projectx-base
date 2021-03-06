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

Auto generated entity for mailing_list_members
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("MailingListMembers", ["rcDateHandler", MailingListMembersFactory])
		.factory("MailingListMembersManager", ["EntityManager", "MailingListMembers", MailingListMembersManagerFactory]);
	 
	function MailingListMembersFactory(rcDateHandler) {

		function MailingListMembers(data) {
			this.mailing_list_member_id = data.mailing_list_member_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without mailing_list_member_id", data);
			})();
			this.email_address = data.email_address || null;
			this.active = (data.active == 1 ? true : false);
			this.last_updated = rcDateHandler.fromDB(data.last_updated);
			this.last_updated_by = data.last_updated_by || null;
			this.last_updated_by_name = data.last_updated_by_name || null;
			this.replication_id = data.replication_id || null;
			this.replication_source = data.replication_source || null;
			this.deleted = (data.deleted == 1 ? true : false);
		}

		return MailingListMembers;

	}
	 
	function MailingListMembersManagerFactory(EntityManager, MailingListMembers) {

		function MailingListMembersManager() {
		}
		 
		MailingListMembersManager.prototype = Object.create(EntityManager.prototype);
		MailingListMembersManager.prototype.constructor = MailingListMembersManager;

		MailingListMembersManager.prototype._pool = {};
		MailingListMembersManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.mailing_list_member_id)) {
				if (update) {
					this._pool[data.mailing_list_member_id] = new MailingListMembers(data);
				}
				instance = this._pool[data.mailing_list_member_id];
			} else {
				instance = new MailingListMembers(data);
				this._pool[data.mailing_list_member_id] = instance;
			}
			return instance;
		};

		MailingListMembersManager.prototype.webservices = {};
		MailingListMembersManager.prototype.webservices.action_set = "base/rc_mailinglistmembers/setMailingListMembers";
		MailingListMembersManager.prototype.webservices.action_recent = "base/rc_mailinglistmembers/getMailingListMembersRecent";
		MailingListMembersManager.prototype.webservices.action_getAll = "base/rc_mailinglistmembers/getMailingListMembersList";
		MailingListMembersManager.prototype.webservices.action_search = "base/rc_mailinglistmembers/searchMailingListMembers";
		MailingListMembersManager.prototype.webservices.action_get = "base/rc_mailinglistmembers/getMailingListMembers";
		MailingListMembersManager.prototype.webservices.action_del = "base/rc_mailinglistmembers/delMailingListMembers";
		MailingListMembersManager.prototype.id_field = "mailing_list_member_id";

		return MailingListMembersManager;

	}

})(angular);

