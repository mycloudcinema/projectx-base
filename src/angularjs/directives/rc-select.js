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

 Angular Directive for linking a select with a webservice
 */

(function (ng) {

	"use strict";

	ng.module("rc.directives")
		.directive("typeaheadFocus", [typeaheadFocus])
		.directive("rcSelect", ["rcWebservice", rcSelect]);

	function typeaheadFocus() {
		return {
			require: 'ngModel',
			link: function (scope, element, attr, ngModel) {

				//trigger the popup on 'click' because 'focus'
				//is also triggered after the item selection
				element.bind('click', function () {

					var viewValue = ngModel.$viewValue;

					//restore to null value so that the typeahead can detect a change
					if (ngModel.$viewValue == ' ') {
						ngModel.$setViewValue(null);
					}

					//force trigger the popup
					ngModel.$setViewValue(' ');

					//set the actual value in case there was already a value in the input
					ngModel.$setViewValue(viewValue || ' ');
				});

				//compare function that treats the empty space as a match
				scope.emptyOrMatch = function (actual, expected) {
					if (expected == ' ') {
						return true;
					}
					return actual.indexOf(expected) > -1;
				};
			}
		};
	};

	function rcSelect(rcWebservice) {

		return {

			restrict:	"EA",
			require:	"ngModel",
			replace:	false,

			// Workaround for angular select[ngOptions]. There is a chance that the options are loaded before the ngModel is set. This breaks the UI-element.
			// I had to put an ngIf on the select element to prevent the directive from execution until the options are loaded
			template:	`<div class='text-container rc-select' ng-class='{"rc-select-prefixed": iconPrefix}'>
							<span class='rc-select-prefix' ng-if='iconPrefix'><i class='fa {{iconPrefix}}'></i></span>
							<select ng-if='options' class='form-control' ng-disabled='!options' ng-options='($parent.value ? o[$parent.value] : o) as o[$parent.label] for o in options | orderBy: $parent.label' ng-model='$parent.ngModel' ng-keyup='resetSelect($event)'></select>
							<span class='rc-select-clear' ng-click='clearControl()' ng-if="!required && (ngModel || ngModel == 0)"><i class='fa fa-times-circle'></i></span>
							<span class='rc-select-suffix'><i class='fa fa-chevron-down'></i></span>
							<div class='focus'>
								<div></div>
							</div>
						</div>`,
			scope: {
				ngModel:	"=",
				ngChange:	"=",
				parentId:	"="
			},

			link: function (scope, element, attrs, ngModel) {

				var $element = $(element);

				if (typeof attrs.webservice !== "string" && typeof attrs.source === 'undefined') throw new Error("[rcSelect] Expected a string as the webservice attribute, but got " + typeof attrs.webservice + ".");
				if (typeof attrs.value !== "string") throw new Error("[rcSelect] Expected a string as the value attribute, but got " + typeof attrs.webservice + ".");
				if (typeof attrs.label !== "string") throw new Error("[rcSelect] Expected a string as the label attribute, but got " + typeof attrs.webservice + ".");

				scope.value = attrs.value;
				scope.label = attrs.label;
				scope.required = attrs.required;
				scope.prefix = attrs.prefix !== undefined ? attrs.prefix : "/webservices/";
				scope.userest = attrs.userest || false;
				scope.source = attrs.source !== undefined ? attrs.source : null;

				// Check to see if the Select can have empty values
				if (attrs.allowEmpty) {
					scope.allowEmpty = true;
				}

				scope.clearControl = function() {
					scope.ngModel = undefined;
				}

				// If the user hits the delete key or backspace button then we
				// reset the input to null. This allows rcSelect elements which
				// can have a null by default to be easily reset.
				scope.resetSelect = function(event) {
					if (event.keyCode === 8 || event.keyCode === 46) {
						scope.ngModel = undefined;
					}
				}

				scope.loadSelect = function() {

					if (scope.source !== null) {

						try {
							scope.options = JSON.parse(scope.source);

							scope.$watch("ngModel", function (newValue) {
								if (scope.ngChange) {
									// console.log('Calling rcSelect.ngChange', newValue);
									scope.ngChange(newValue);
								}
							});

						} catch (ex) {
							throw new Error("[rcSelect] Expected a JSON array as the source attribute, but got " + typeof scope.source + ".");
						}

					} else {

						rcWebservice.prefix = scope.prefix;
						rcWebservice.get(attrs.webservice, {parent: scope.parentId}, {use_rest: scope.userest}).then(function (response) {

							// Sort the array by the display value
							var data = response.data || response;
							scope.options = data.sort(function(a, b){
								return a[scope.label] == b[scope.label] ? 0 : +(a[scope.label] > b[scope.label]) || -1;
							});

							// If the Select can have empty values then we add a new value
							// to the front of the array to allow the user to null the value.
							// NOTE: For this to work you also need to be sure that the SP
							//		 in the DB will also accept a null and not convert it
							//		 to an empty string.
							if (scope.allowEmpty) {
								scope.options.unshift({
									value: null,
									label: ''
								});
							}

							scope.$watch("ngModel", function (newValue) {
								if (scope.ngChange) {
									// console.log('Calling rcSelect.ngChange', newValue);
									scope.ngChange(newValue);
								}
							});

						}, function () { // Request failed. rcWebservice displays an error dialog.
							console.error("Failed to load options for rcSelect. The input field will be disabled.");
							scope.options = null;
						});

					}

				}
				scope.loadSelect();

				// Watch for a change in the parent id and force a reload when
				// the data changes.
				scope.$watch("parentId", function (value) {
					// console.log('Change in Parent Id', value, scope.parentId);
					if (value !== scope.lastNgModel) {
						scope.ngLastModel = value;
						scope.ngModel = null;
						scope.loadSelect();
					}
				});

				// Add any necessary classes based on the attributes
				if (scope.required && (scope.ngModel === undefined)) {
					$(element).addClass("focus");
				}

				$(element).addClass("rc-input");

				$(element).on("focus", "select", function () {
					$(element).addClass("focus");
				});

				$(element).on("blur", "select", function () {
					if (!scope.required || !(scope.ngModel === undefined)) {
						$(element).removeClass("focus");
					} else if (scope.required && !(scope.ngModel === undefined)) {
						$(element).addClass("focus");
					}
				});
			}
		};
	}
})(angular);
