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

Auto generated entity for media
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("Media", ["rcDateHandler", MediaFactory])
		.factory("MediaManager", ["EntityManager", "Media", "rcWebservice", "$q", MediaManagerFactory]);

	function MediaFactory(rcDateHandler) {

		function Media(data) {
			this.media_id = data.media_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without media_id", data);
			})();
			this.site_name = data.site_name || null;
			this.media_type_id = data.media_type_id || null;
			this.media_type_name = data.media_type_name || null;
			this.media_desc = data.media_desc || null;
			this.media_name = data.media_name || null;
			this.media_directory = data.media_directory || null;
			this.media_height = data.media_height || null;
			this.media_width = data.media_width || null;
			this.media_size = data.media_size || null;
			this.uploaded_by = data.uploaded_by || null;
			this.uploaded_by_name = data.uploaded_by_name || null;
			this.upload_date = rcDateHandler.fromDB(data.upload_date);
			this.valid_from = rcDateHandler.fromDB(data.valid_from);
			this.valid_until = rcDateHandler.fromDB(data.valid_until);
			this.last_updated = rcDateHandler.fromDB(data.last_updated);
			this.last_updated_by = data.last_updated_by || null;
			this.last_updated_by_name = data.last_updated_by_name || null;
			this.replication_id = data.replication_id || null;
			this.replication_source = data.replication_source || null;
			this.deleted = (data.deleted == 1 ? true : false);
		}

		return Media;

	}

	function MediaManagerFactory(EntityManager, Media, rcWebservice, $q) {

		function MediaManager() {
		}

		MediaManager.prototype = Object.create(EntityManager.prototype);
		MediaManager.prototype.constructor = MediaManager;

		MediaManager.prototype._pool = {};
		MediaManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.media_id)) {
				if (update) {
					this._pool[data.media_id] = new Media(data);
				}
				instance = this._pool[data.media_id];
			} else {
				instance = new Media(data);
				this._pool[data.media_id] = instance;
			}
			return instance;
		};
		MediaManager.prototype.getMediaByMediaType = function (media_type_id) {
			var deferred = $q.defer(), _this = this;
			rcWebservice.get(_this.webservices.action_getAll, {id: media_type_id}).then(function (response) {
				var entities = [];
				for (var i = 0; i < response.data.length; i++) {
					entities.push(_this._retrieveInstance(response.data[i], true));
				}
				deferred.resolve(entities);
			}, deferred.reject);
			return deferred.promise;
		};

		MediaManager.prototype.webservices = {};
		MediaManager.prototype.webservices.action_set = "base/rc_media/setMedia";
		MediaManager.prototype.webservices.action_recent = "base/rc_media/getMediaRecent";
		MediaManager.prototype.webservices.action_getAll = "base/rc_media/getMediaList";
		MediaManager.prototype.webservices.action_search = "base/rc_media/searchMedia";
		MediaManager.prototype.webservices.action_get = "base/rc_media/getMedia";
		MediaManager.prototype.webservices.action_del = "base/rc_media/delMedia";
		MediaManager.prototype.id_field = "media_id";

		return MediaManager;

	}

})(angular);
