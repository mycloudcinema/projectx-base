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

Auto generated entity for dictionary
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("Dictionary", [DictionaryFactory])
		.factory("DictionaryManager", ["EntityManager", "Dictionary", "rcWebservice", "$http", "$q", DictionaryManagerFactory]);

	function DictionaryFactory() {

		function Dictionary(data) {

			this.dictionary_id = data.dictionary_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without dictionary_id", data);
			})();
			this.site_name = data.site_name || null;
			this.dictionary_language = data.dictionary_language || null;
			this.dictionary_key = data.dictionary_key || null;
			this.dictionary_category = data.dictionary_category || null;
			this.dictionary_data = data.dictionary_data || null;
			this.needs_update = (data.needs_update == 1 ? true : false);
			this.dont_translate = (data.dont_translate == 1 ? true : false);
			this.date_added = data.date_added || null;
			this.last_updated = data.last_updated || null;
			this.deleted = (data.deleted == 1 ? true : false);
		}

		return Dictionary;

	}

	function DictionaryManagerFactory(EntityManager, Dictionary, rcWebservice, $http, $q) {

		function DictionaryManager() {
		}

		DictionaryManager.prototype = Object.create(EntityManager.prototype);
		DictionaryManager.prototype.constructor = DictionaryManager;
		DictionaryManager.prototype._pool = {};
		DictionaryManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.dictionary_id)) {
				if (update) {
					this._pool[data.dictionary_id] = new Dictionary(data);
				}
				instance = this._pool[data.dictionary_id];
			} else {
				instance = new Dictionary(data);
				this._pool[data.dictionary_id] = instance;
			}
			return instance;
		};

		DictionaryManager.prototype.reloadDictionary = function () {
			var deferred = $q.defer(), _this = this;
			rcWebservice.get(_this.webservices.action_reloadDictionary, {}).then(function (response) {
				// Check to see if there are any linked sites and if there are
				// then force the reload on those dictionaries too.
				const linkedSites = '$setting{linked_sites}'.split(',');
				console.log('linkedSites', linkedSites);
				linkedSites.forEach(function (site) {
					var thisDictionaryURL = (site + '/webservices/dictionary/_reload');
					console.log('site', site, thisDictionaryURL);
					$http({
						method:	'GET',
						url:	thisDictionaryURL
					});
				})
				deferred.resolve();
			}, deferred.reject);
			return deferred.promise;
		};

		DictionaryManager.prototype.getDictionaryByCategory = function (dictionary_category) {
			var deferred = $q.defer(), _this = this;
			rcWebservice.get(_this.webservices.action_getDictionaryByCategory, {dictionary_category: dictionary_category}).then(function (response) {
				deferred.resolve(response.data);
			}, deferred.reject);
			return deferred.promise;
		};

		DictionaryManager.prototype.getDictionaryNeedsUpdate = function () {
			var deferred = $q.defer(), _this = this;
			rcWebservice.get(_this.webservices.action_getDictionaryNeedsUpdate).then(function (response) {
				deferred.resolve(response.data);
			}, deferred.reject);
			return deferred.promise;
		};

		DictionaryManager.prototype.getDictionaryCategories = function (dictionary_category) {
			var deferred = $q.defer(), _this = this;
			rcWebservice.get(_this.webservices.action_getDictionaryCategories).then(function (response) {
				deferred.resolve(response.data);
			}, deferred.reject);
			return deferred.promise;
		};

		DictionaryManager.prototype.setDictionaryItem = function (data) {
			var deferred = $q.defer(), _this = this;
			var postData = {};
			for (var key in data) {
				if (data[key] !== null) {
					postData[key] = ng.copy(data[key]);
				}
			}
			rcWebservice.post(_this.webservices.action_setDictionaryItem, postData).then(function (response) {
				deferred.resolve(_this._retrieveInstance(response.data[0], true));
			}, deferred.reject);
			return deferred.promise;
		};

		DictionaryManager.prototype.webservices = {};
		DictionaryManager.prototype.webservices.action_set = "base/rc_dictionary/setDictionary";
		DictionaryManager.prototype.webservices.action_setDictionaryItem = "base/rc_dictionary/setDictionaryItem";
		DictionaryManager.prototype.webservices.action_recent = "base/rc_dictionary/getDictionaryRecent";
		DictionaryManager.prototype.webservices.action_getAll = "base/rc_dictionary/getDictionaryList";
		DictionaryManager.prototype.webservices.action_search = "base/rc_dictionary/searchDictionary";
		DictionaryManager.prototype.webservices.action_get = "base/rc_dictionary/getDictionary";
		DictionaryManager.prototype.webservices.action_getDictionaryByCategory = "base/rc_dictionary/getDictionaryByCategory";
		DictionaryManager.prototype.webservices.action_getDictionaryNeedsUpdate = "base/rc_dictionary/getDictionaryNeedsUpdate";
		DictionaryManager.prototype.webservices.action_getDictionaryCategories = "base/rc_dictionary/getDictionaryCategories";
		DictionaryManager.prototype.webservices.action_del = "base/rc_dictionary/delDictionary";
		DictionaryManager.prototype.webservices.action_reloadDictionary = "dictionary/_reload";
		DictionaryManager.prototype.id_field = "dictionary_id";

		return DictionaryManager;
	}
})(angular);
