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

Angular DateTime Picker based on the Bootstrap 3 DateTime picker
*/
(function (ng) {

	"use strict";

	ng.module("rc.directives")
		.directive("rcDatepickerIcon", ["rcDateHandler", "$locale", rcDatepickerIcon]);

	function rcDatepickerIcon(rcDateHandler, $locale) {

		return {

			restrict: "E",
			template: '<button class="btn btn-default"><input type="hidden"><i class="fa fa-calendar"></i></button>',
			// template: "<div class='input-group date' id='datetimepicker10'><input type='hidden' class='form-control' /><span class='input-group-addon'><span class='fa fa-calendar'></span></span></div>",
			scope: {
				minDate: "=",
				maxDate: "=",
				viewMode: "=",
				showToday: "=",
				ngModel: "=",
				rcChange: "=",
				options: "=",
				placeholder: "@"
			},

			link: function (scope, element, attrs, ctrl) {

				var $element = $(element), datepicker;
				var localeData = moment().locale($locale.id).localeData();
				var datetimeMode = "datetime" in attrs;
				scope.required = attrs.required;

				scope.safeApply = function (fn) {
					var phase = this.$root.$$phase;
					if (phase === "$apply" || phase === "$digest") {
						if (fn && typeof fn === 'function') {
							fn();
						}
					} else {
						this.$apply(fn);
					}
				};

				// $element.addClass("rc-input form-control");

				// if (scope.required && (scope.ngModel === undefined)) {
					// $element.addClass("focus");
				// }

				// $element.on("focus", "input", function () {
					// $element.addClass("focus");
				// });
				// $element.on("blur", "input", function () {
					// if (!scope.required || !(scope.ngModel === undefined)) {
						// $element.removeClass("focus");
					// } else if (scope.required && !(scope.ngModel === undefined)) {
						// $element.addClass("focus");
					// }
				// });

				if (!$locale.MOMENT) {
					console.error("The current locale does not have formats for moment. Falling back to moment defaults.");
				}

				datepicker = $element.find("input").datetimepicker({

					locale: (scope.options && scope.options.locale) ? moment.locale(scope.options.locale) : moment.locale($locale.MOMENT.locale),

					// Accepts shortDate, shortDateTime, longDate, longDatetime (or anything that is defined in the current locale's locale file)
					format: (scope.options && scope.options.format) ? $locale.MOMENT.DATETIME_FORMATS[scope.options.format] : $locale.MOMENT.DATETIME_FORMATS.shortDate,
					viewMode: (scope.options && scope.options.viewMode) ? scope.options.viewMode : "days",
					showTodayButton: (scope.options && scope.options.showTodayButton) ? scope.options.showTodayButton : true,
					sideBySide: (scope.options && scope.options.sideBySide) ? scope.options.sideBySide : false,
					useCurrent: (scope.options && scope.options.useCurrent) ? scope.options.useCurrent : false,

					icons: {
						time: 'fa fa-clock-o',
						date: 'fa fa-calendar',
						up: 'fa fa-chevron-up',
						down: 'fa fa-chevron-down',
						previous: 'fa fa-chevron-left',
						next: 'fa fa-chevron-right',
						today: 'fa fa-crosshairs',
						clear: 'fa fa-trash',
						close: 'fa fa-remove'
					}
				});

				datepicker.on("dp.change", function (event) {
					//debug.log("DP.CHANGE", event);
					if (event.date) {
						var d = rcDateHandler.getUIDate(event.date);
//debug.log("DP.CHANGE", d, d.format("YYYY-MM-DD"));
						scope.ngModel = d;
					} else {
						scope.ngModel = null;
					}
					scope.safeApply();

					if (typeof scope.rcChange === "function") {
						scope.rcChange();
					}
				});

				// Watcher that watching the minDate property
				scope.$watch("minDate", function (value) {
					if (typeof value !== "undefined") {
						try {
							datepicker.data("DateTimePicker").minDate(new moment(value));
						} catch (ex) {
							console.error("Could not set minDate", value, ex);
						}
					}
				});
				// Watcher that watching the maxDate property
				scope.$watch("maxDate", function (value) {
					if (typeof value !== "undefined") {
						try {
							datepicker.data("DateTimePicker").maxDate(new moment(value));
						} catch (ex) {
							console.error("Could not set maxDate", value, ex);
						}
					}
				});

				// var inside_change = false;
				//var outside change = false;
				scope.$watch("ngModel", function (newValue, oldValue) {
// debug.log(newValue === oldValue, newValue, oldValue);
					// If the new value is not a moment object, then set the date to null.
					if (newValue === null || typeof newValue === "undefined" || !newValue._isAMomentObject) {
						datepicker.data("DateTimePicker").date(null);
					} else {
						if (!newValue.isSame(oldValue)) {
							// Code for detecting model clear from outside
							datepicker.data("DateTimePicker").date(newValue);
						}
					}

					if (moment.isMoment(newValue) && moment.isMoment(oldValue) && newValue.isSame(oldValue)) {
						if (!moment.isMoment(datepicker.data("DateTimePicker").date() || (moment.isMoment(datepicker.data("DateTimePicker").date()) && !newValue.isSame(datepicker.data("DateTimePicker").date())))) {
							datepicker.data("DateTimePicker").date(newValue);
						}
					}
				});
			}
		}
	}
})(angular);
