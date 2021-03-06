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

Auto generated entity for media_types
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("MediaTypes", ["rcDateHandler", MediaTypesFactory])
		.factory("MediaTypesManager", ["EntityManager", "MediaTypes", MediaTypesManagerFactory]);

	function MediaTypesFactory(rcDateHandler) {

		function MediaTypes(data) {

			this.media_type_id = data.media_type_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without media_type_id", data);
			})();
			this.dictionary_key = data.dictionary_key || null;
			this.media_type_name = data.media_type_name || null;

			// Set the audit values for the record
			setAuditValues(this, data, rcDateHandler, 'media_type_id');

		}

		return MediaTypes;

	}

	function MediaTypesManagerFactory(EntityManager, MediaTypes) {

		function MediaTypesManager() {
		}

		MediaTypesManager.prototype = Object.create(EntityManager.prototype);
		MediaTypesManager.prototype.constructor = MediaTypesManager;

		MediaTypesManager.prototype._pool = {};
		MediaTypesManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.media_type_id)) {
				if (update) {
					this._pool[data.media_type_id] = new MediaTypes(data);
				}
				instance = this._pool[data.media_type_id];
			} else {
				instance = new MediaTypes(data);
				this._pool[data.media_type_id] = instance;
			}
			return instance;
		};

		MediaTypesManager.prototype.webservices = {};
		MediaTypesManager.prototype.webservices.action_set = "base/rc_mediatypes/setMediaTypes";
		MediaTypesManager.prototype.webservices.action_recent = "base/rc_mediatypes/getMediaTypesRecent";
		MediaTypesManager.prototype.webservices.action_getAll = "base/rc_mediatypes/getMediaTypesList";
		MediaTypesManager.prototype.webservices.action_search = "base/rc_mediatypes/searchMediaTypes";
		MediaTypesManager.prototype.webservices.action_get = "base/rc_mediatypes/getMediaTypes";
		MediaTypesManager.prototype.webservices.action_del = "base/rc_mediatypes/delMediaTypes";
		MediaTypesManager.prototype.id_field = "media_type_id";

		return MediaTypesManager;

	}

})(angular);
