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

Auto generated entity for account_statement
*/

(function (ng) {

	"use strict";

	ng.module("rc.entities")
		.factory("TourManager", ["TourStepsManager", TourManagerFactory]);

	function TourManagerFactory(TourStepsManager) {

		function TourManager() {
		}

		TourManager.prototype.constructor = TourManager;

		TourManager.prototype.startTour = function (tourStepsPage) {

			new TourStepsManager().getAll(tourStepsPage).then(function(tourSteps) {

				if (tourSteps && tourSteps.length > 0) {

					tourSteps = tourSteps.map(function(tourStep) {
						return {
							element:	tourStep.tour_step_element,
							title:		tourStep.tour_step_title,
							content:	tourStep.tour_step_details,
							placement:	tourStep.tour_step_placement
						};
					})

					var tour = new Tour({
						steps:			tourSteps
					});

					// Initialize the tour
					tour.init();

					// Start the tour
					tour.start();
				}

			})

		};

		return TourManager;

	}

})(angular);
