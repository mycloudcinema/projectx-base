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

	ng.module("rc.directives").directive("rcDatepicker", ["rcDateHandler", "$locale", rcDatepicker]);

	function rcDatepicker(rcDateHandler, $locale) {

		return {

			restrict: "E",
			template: '<div class="text-container"><div style="position: absolute;right: 24px;top: 11px;"><i class="fa fa-calendar"></i></div><input type="text" class="" placeholder="{{placeholder}}"/><div class="focus"><div></div></div></div>',
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

				$element.addClass("rc-input form-control");

				if (scope.required && (scope.ngModel === undefined)) {
					$element.addClass("focus");
				}

				$element.on("focus", "input", function () {
					$element.addClass("focus");
				});
				$element.on("blur", "input", function () {
					if (!scope.required || !(scope.ngModel === undefined)) {
						$element.removeClass("focus");
					} else if (scope.required && !(scope.ngModel === undefined)) {
						$element.addClass("focus");
					}
				});

				if (!$locale.MOMENT) {
					console.error("The current locale does not have formats for moment. Falling back to moment defaults.");
				}
console.log('DP Directive', scope.minDate);

				datepicker = $element.find("input").datetimepicker({

					locale:				(scope.options && scope.options.locale) ? moment.locale(scope.options.locale) : moment.locale($locale.MOMENT.locale),

					// Accepts shortDate, shortDateTime, longDate, longDatetime (or anything that is defined in the current locale's locale file)
					format:				(scope.options && scope.options.format) ? $locale.MOMENT.DATETIME_FORMATS[scope.options.format] : $locale.MOMENT.DATETIME_FORMATS.shortDate,
					viewMode:			(scope.options && scope.options.viewMode) ? scope.options.viewMode : "days",
					showTodayButton:	(scope.options && scope.options.showTodayButton) ? scope.options.showTodayButton : true,
					sideBySide:			(scope.options && scope.options.sideBySide) ? scope.options.sideBySide : false,
					useCurrent:			(scope.options && scope.options.useCurrent) ? scope.options.useCurrent : false,
					maxDate:			scope.maxDate,
					minDate:			scope.minDate,

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

// console.log("DP.CHANGE", event, event.date);
					if (event.date) {
						var d = rcDateHandler.getUIDate(event.date.format("YYYY-MM-DD"));
// console.log("DP.CHANGE ngModel", d, d.format("YYYY-MM-DD"));
						scope.ngModel = d;
					} else {
						scope.ngModel = null;
					}

					scope.safeApply();

					if (typeof scope.rcChange === "function") {
						scope.rcChange();
					}
				});

				// var inside_change = false;
				// var outside change = false;
				scope.$watch("ngModel", function (newValue, oldValue) {
// console.log('scope.$watch(ngModel)', newValue, oldValue)
// debug.log(newValue === oldValue, newValue, oldValue);
					// If the new value is not a moment object, then set the date to null.
					if (newValue === null || typeof newValue === "undefined" || !newValue._isAMomentObject) {
// console.log('scope.$watch(ngModel): newValue null')
						datepicker.data("DateTimePicker").date(null);
					} else {
						if (!newValue.isSame(oldValue)) {
// console.log('scope.$watch(ngModel): newValue changed')
							// Code for detecting model clear from outside
							datepicker.data("DateTimePicker").date(newValue);
						}
					}

					if (moment.isMoment(newValue) && moment.isMoment(oldValue) && newValue.isSame(oldValue)) {
// console.log('scope.$watch(ngModel): newValue isMoment')
						if (!moment.isMoment(datepicker.data("DateTimePicker").date() || (moment.isMoment(datepicker.data("DateTimePicker").date()) && !newValue.isSame(datepicker.data("DateTimePicker").date())))) {
// console.log('scope.$watch(ngModel): Date Change')
							datepicker.data("DateTimePicker").date(newValue);
						}
					}
				});

				// Watcher that watching the minDate property
				scope.$watch("minDate", function (value) {
					if (typeof value !== "undefined") {
						try {
							datepicker.data("DateTimePicker").minDate(new moment(value));
console.log('scope.$watch(minDate)', value, datepicker.data("DateTimePicker").minDate())
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
console.log('scope.$watch(maxDate)', value, datepicker.data("DateTimePicker").maxDate())
						} catch (ex) {
							console.error("Could not set maxDate", value, ex);
						}
					}
				});
			}
		}
	}
})(angular);
