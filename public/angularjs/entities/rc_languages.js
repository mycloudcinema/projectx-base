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

Auto generated entity for languages
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("Languages", ["rcDateHandler", LanguagesFactory])
		.factory("LanguagesManager", ["EntityManager", "Languages", "rcWebservice", "$q", LanguagesManagerFactory]);

	function LanguagesFactory(rcDateHandler) {

		function Languages(data) {

			this.language = data.language || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without language", data);
			})();
			this.dictionary_key = data.dictionary_key || null;
			this.language_name = data.language_name || null;
			try {
				this.language_name_list = JSON.parse(data.language_name_list);
			} catch (ex) {
				this.language_name_list = {};
			}

			// Set the audit values for the record
			setAuditValues(this, data, rcDateHandler, 'language');

		}

		return Languages;

	}

	function LanguagesManagerFactory(EntityManager, Languages, rcWebservice, $q) {

		function LanguagesManager() {
		}

		LanguagesManager.prototype = Object.create(EntityManager.prototype);
		LanguagesManager.prototype.constructor = LanguagesManager;
		LanguagesManager.prototype._pool = {};
		LanguagesManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.language)) {
				if (update) {
					this._pool[data.language] = new Languages(data);
				}
				instance = this._pool[data.language];
			} else {
				instance = new Languages(data);
				this._pool[data.language] = instance;
			}
			return instance;
		};

		// Languages are added by the user who supplies the key field value so we
		// need to override the standard entity logic.
		LanguagesManager.prototype.set = function (data, newEntity) {
			var deferred = $q.defer(), _this = this;
			// If the webservice action is not defined, then this function could not work at all.
			if (_this.webservices.action_set === null) {
				throw new Error("The set function is not implemented on this entity", _this.webservices);
			}
			var postData = {};
			for (var key in data) {
				if (data[key] !== null) {
					postData[key] = ng.copy(data[key]);
				}
			}
			rcWebservice.post(_this.webservices.action_set, postData, {privilegeElevation: this._privilegeElevation, authorisationMessage: this._authorisationMessage}).then(function (response) {
				// The set functions in the DB are returning the updated entity if the update was successful. So we have to update the _pool as well
				deferred.resolve(_this._retrieveInstance(response.data[0], true));
				// since deferred.reject is a function that takes exactly one argument there is no need to define an anonymous function to call deferred.reject(); --> less code and it's faster
			}, deferred.reject);
			return deferred.promise;
		};

		LanguagesManager.prototype.getSupported = function (extended) {
			var deferred = $q.defer(), _this = this;
			rcWebservice.get(_this.webservices.action_getAll).then(function (response) {
				if (extended) {
					deferred.resolve(response.data.map(language => {
						return {
							language:		language.language.toLowerCase(),
							language_name:	language.language_name
						}
					}));
				} else {
					var supportedLanguages = {}
					response.data.forEach(function(language) {
						supportedLanguages[language.language] = true
					})
					deferred.resolve(supportedLanguages);
				}
			}, deferred.reject);
			return deferred.promise;
		};

		LanguagesManager.prototype.webservices = {};
		LanguagesManager.prototype.webservices.action_set = "base/rc_languages/setLanguages";
		LanguagesManager.prototype.webservices.action_recent = "base/rc_languages/getLanguagesRecent";
		LanguagesManager.prototype.webservices.action_getAll = "base/rc_languages/getLanguagesList";
		LanguagesManager.prototype.webservices.action_search = "base/rc_languages/searchLanguages";
		LanguagesManager.prototype.webservices.action_get = "base/rc_languages/getLanguages";
		LanguagesManager.prototype.webservices.action_del = "base/rc_languages/delLanguages";
		LanguagesManager.prototype.id_field = "language";

		return LanguagesManager;

	}

})(angular);
