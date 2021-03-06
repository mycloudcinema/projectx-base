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

Auto generated entity for tour_steps
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("TourSteps", ["rcDateHandler", TourStepsFactory])
		.factory("TourStepsManager", ["EntityManager", "TourSteps", TourStepsManagerFactory]);

	function TourStepsFactory(rcDateHandler) {

		function TourSteps(data) {

			this.tour_step_id = data.tour_step_id || (function () {
				// This function should be applied to any field that has the 'Not null' constraint in the DB.
				throw new Error("Could not create instance without tour_step_id", data);
			})();
			this.cinema_id = data.cinema_id || 0;
			this.cinema_name = data.cinema_name || null;
			this.tour_language = data.tour_language || null;
			this.tour_language_name = data.tour_language_name || null;
			this.tour_step_page = data.tour_step_page || null;
			this.tour_step_order = data.tour_step_order || 0;
			this.tour_step_element = data.tour_step_element || null;
			this.tour_step_title = data.tour_step_title || null;
			this.tour_step_details = data.tour_step_details || null;
			this.tour_step_placement = data.tour_step_placement || null;
			this.tour_step_options = data.tour_step_options || null;

			// Set the audit values for the record
			setAuditValues(this, data, rcDateHandler, 'tour_step_id');

		}

		return TourSteps;

	}

	function TourStepsManagerFactory(EntityManager, TourSteps) {

		function TourStepsManager() {
		}

		TourStepsManager.prototype = Object.create(EntityManager.prototype);
		TourStepsManager.prototype.constructor = TourStepsManager;

		TourStepsManager.prototype._pool = {};
		TourStepsManager.prototype._retrieveInstance = function (data, update) {
			var instance;
			if (this._pool.hasOwnProperty(data.tour_step_id)) {
				if (update) {
					this._pool[data.tour_step_id] = new TourSteps(data);
				}
				instance = this._pool[data.tour_step_id];
			} else {
				instance = new TourSteps(data);
				this._pool[data.tour_step_id] = instance;
			}
			return instance;
		};

		TourStepsManager.prototype.webservices = {};
		TourStepsManager.prototype.webservices.action_set = "base/rc_toursteps/setTourSteps";
		TourStepsManager.prototype.webservices.action_recent = "base/rc_toursteps/getTourStepsRecent";
		TourStepsManager.prototype.webservices.action_getAll = "base/rc_toursteps/getTourStepsList";
		TourStepsManager.prototype.webservices.action_search = "base/rc_toursteps/searchTourSteps";
		TourStepsManager.prototype.webservices.action_get = "base/rc_toursteps/getTourSteps";
		TourStepsManager.prototype.webservices.action_del = "base/rc_toursteps/delTourSteps";
		TourStepsManager.prototype.id_field = "tour_step_id";

		return TourStepsManager;

	}

})(angular);
