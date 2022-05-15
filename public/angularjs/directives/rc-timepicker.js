(function () {
	'use strict';

	angular
		.module('rc.directives')
		.directive('rcTimepicker', rcTimepicker);

	const AM = "AM";
	const PM = "PM";

	rcTimepicker.$inject = ["$locale"];
	function rcTimepicker($locale) {
		// Usage:
		//
		// Creates:
		//
		var directive = {
			bindToController: true,
			controller: ControllerController,
			controllerAs: 'vm',
			link: link,
			restrict: 'E',
			template: `
		<div>
			<style>
.rc-timepicker-dropdown {
	position: relative;
	display: inline-block;
	width: 100%;
	border-collapse: collapse;
}

.dropdown-content {
/*
	    display: none;
    position: absolute;
    background-color: white;
    min-width: 160px;
    box-shadow: 1px 5px 8px rgba(102, 175, 233, 0.6);
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
	border: 1px solid #66afe9;
	border-top: 1px solid white;
	margin-top: -1px;
    padding: 12px;
    z-index: 1;
*/
	display: none;
	position: absolute;
	background-color: white;
	min-width: 160px;
	box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
	border-bottom-left-radius: 3px;
	border-bottom-right-radius: 3px;
	border: solid 1px transparent;
	padding: 12px;
	z-index: 1;
}


.time-input-block {
	text-align: center;
	float: left;
	width: 62px;
}
.time-input-block.wide {
	width: 82px;
}
.time-input-block .time-input {
	width: 100%;
	border: none;
	outline: none;
	display: block;
	float: left;
	text-align: center;
	font-size: 18px;
}
.time-input-block i.fa {
	display: block;
	float: left;
	width: 100%;
	padding: 2px;
	color: #00c9ff;
	cursor: pointer;
}
.time-input-block i.fa.disabled {
	color: #cacaca;
	cursor: default;
}
.time-input-colon {
	display: block;
	float: left;
	height: 100%;
	font-size: 20px;
	padding-top: 12px;
	padding-bottom: 14px;
}
.time-input-block .meridiem-selector {
	color: #cacaca;
	cursor: pointer;
}
.time-input-block .meridiem-selector.active {
	color: #000000;
	cursor: default;
}

.rc-timepicker-dropdown.dropdown-active .dropdown-content {
	display: block;
}
			</style>


	<input id="input" class="form-control" ng-class="{ error: invalid }" type="text" ng-change="displayValueChanged();" ng-model="displayValue" />

	<div class="dropdown-content" ng-mousedown="$event.preventDefault();">
		<div class="time-input-block wide" ng-if="enableDays">
			<i class="fa fa-fw fa-chevron-up" ng-click="setDays(1, $event);" ng-class="{ disabled: false }"></i>
			<input type="text" class="time-input" ng-model="days" min="0" disabled/>
			<i class="fa fa-fw fa-chevron-down" ng-click="isDaysValid(-1) && setDays(-1, $event);" ng-class="{ disabled: !isDaysValid(-1) }"></i>
		</div>
		<div class="time-input-block">
			<i class="fa fa-fw fa-chevron-up" ng-click="isHoursValid(1) && setHours(1, $event);" ng-class="{ disabled: !isHoursValid(1) }"></i>
			<input type="text" class="time-input" ng-model="hours" min="0" max="23" disabled/>
			<i class="fa fa-fw fa-chevron-down" ng-click="isHoursValid(-1) && setHours(-1, $event);" ng-class="{ disabled: !isHoursValid(-1) }"></i>
		</div>
		<div class="time-input-colon">:</div>
		<div class="time-input-block">
			<i class="fa fa-fw fa-chevron-up" ng-click="setMinutes(1, $event);" ng-class="{ disabled: minutes == 59 }"></i>
			<input type="text" class="time-input" ng-model="minutes" min="0" max="59" disabled/>
			<i class="fa fa-fw fa-chevron-down" ng-mousedown="setMinutes(-1, $event);" ng-class="{ disabled: minutes == 0 }"></i>
		</div>
		<div class="time-input-block" ng-if="!time24Format" style="width: 32px; vertical-align: middle; line-height: 29px;">
			<div class="meridiem-selector" ng-class="{ active: !postMeridiem }" ng-click="setPostMeridiem(false)">AM</div>
			<div class="meridiem-selector" ng-class="{ active: postMeridiem }" ng-click="setPostMeridiem(true)">PM</div>
		</div>
	</div>
			</div>`,
			replace: true,
			transclude: false,
			require: "^ngModel",
			scope: {
				format: "@"
			}
		};
		return directive;
		// <button class="btn btn-xs btn-default"><i class="fa fa-fw fa-chevron-up"></i></button>
		// <button class="btn btn-xs btn-default"><i class="fa fa-fw fa-chevron-down"></i></button>

		function link(scope, element, attrs, ngModel) {
			scope.enableDays = Object.keys(attrs).includes("days");
			// Default meridiem is AM. We will set this in $render later if there is a model value change
			scope.postMeridiem = false;
			// The default format is the 24 hour format
			scope.time24Format = true;
			// Try to get the time format from $locale
			try {
				scope.time24Format = $locale.DATETIME_FORMATS.shortTime.indexOf('a') === -1;
			} catch (error) {
				console.warn("There was an error reading $locale for time format. Defaulting to 24h format.");
				scope.time24Format = true;
			}
			// $locale settings can be overwritten by the 'format' attribute on the rc-timepicker element
			if (attrs.format === "12h") {
				scope.time24Format = false;
			} else if (attrs.format === "24h") {
				scope.time24Format = true;
			}
			// Find the input element in the compiled template
			const input = element.find("#input");
			// Add dropdown class to the root element
			element.addClass("rc-timepicker-dropdown");

			// Listen for focus and blur events to display/hide dropdown
			input.on("focus", function (event) {
				element.addClass("dropdown-active");
			});

			input.on("blur", function (event) {
				element.removeClass("dropdown-active");
			});

			function setDisplayValue() {
				let displayValue = "";
				if (scope.enableDays) {
					const days = parseInt(scope.days);

					if (days > 1) {
						displayValue += `${parseInt(scope.days)} $dict{timepicker_day_plural}, `;
					} else {
						displayValue += `${parseInt(scope.days)} $dict{timepicker_day_singular}, `;
					}
				}

				if (scope.time24Format) {
					// Render 24h format
					displayValue += `${scope.hours} : ${scope.minutes}`
				} else {
					displayValue += `${scope.hours} : ${scope.minutes} ${scope.postMeridiem ? PM : AM}`
					// Render 12h format
				}


				scope.displayValue = displayValue;
			}

			function setViewValue() {
				const days = parseInt(scope.days);
				let hours = parseInt(scope.hours);
				const minutes = parseInt(scope.minutes);

				if (!scope.time24Format) {
					if (scope.postMeridiem) {
						if (hours < 12) {
							hours += 12;
						}
					}
				}

				ngModel.$setViewValue((days * 1440) + (hours * 60) + minutes);

			}

			// Called when the model value is changed
			// Check validity and calculate view value here
			ngModel.$render = function () {

				const viewValue = ngModel.$viewValue;
				let value = parseInt(viewValue);

				// If the model value is not a valid number, set validity to false and stop further processing
				if (isNaN(value)) {
					ngModel.$setValidity('time', false);
					return;
				}
				// If the model value is outside bounds then set validity to false and stop further processing
				if (value < 0) {
					console.warn("Cannot render time as the model value is out of bounds. Expected value to be in range 0 -> 1439, but got " + value + ". Setting model value to 0.");
					ngModel.$setViewValue(0);
					value = 0;
				}
				// if (value >= 1440) {
				// 	console.warn("Cannot render time as the model value is out of bounds. Expected value to be in range 0 -> 1439, but got " + value + ". Setting model value to 1439.");
				// 	ngModel.$setViewValue(1439);
				// 	value = 1439;
				// }

				// Calculate hours and minutes from minutes
				const days = Math.floor(value / 1440);
				const hours = Math.floor((value % 1440) / 60);
				const minutes = value % 60;

				if (days > 1) {
					scope.days = `${days} $dict{timepicker_day_plural}`
				} else {
					scope.days = `${days} $dict{timepicker_day_singular}`
				}

				// If we're in 12h format, we have to check wether the model value is AM or PM and render the correct display string accordingly
				if (!scope.time24Format) {
					if (hours >= 12) {
						scope.postMeridiem = true;
					} else {
						scope.postMeridiem = false;
					}
					// Set display hours to the dividend of calculated hours divided by 12. This way we restrict the field to 12h format. The PM flag is already set.
					const tempHours = hours % 12;
					if (value >= 720 && value < 780) {
						scope.hours = "12";
					} else {
						scope.hours = tempHours.toString().padStart(2, '0');
					}
					scope.minutes = minutes.toString().padStart(2, '0');
					// scope.displayValue = `${scope.hours} : ${scope.minutes} ${scope.postMeridiem ? PM : AM}`
				} else {
					// In 24h mode we have an easy job:
					// Convert hours and minutes to left padded strings for the dropdown
					scope.hours = hours.toString().padStart(2, '0');
					scope.minutes = minutes.toString().padStart(2, '0');
					// Set the input field's value based on the dropdown values
					// scope.displayValue = `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')}`
				}
				setDisplayValue();
				setViewValue();
				// scope
			};

			scope.setDays = function (amount, $event) {
				// Prevent the dropdown from closing
				$event.preventDefault();
				$event.stopPropagation();
				// Get days as number
				let days = parseInt(scope.days);

				if (isNaN(days)) {
					days = 0;
				}
				if (isNaN(parseInt(scope.days))) {
					scope.days = "0 $dict{timepicker_day_singular}";
				}

				days += amount;

				if (days > 1) {
					scope.days = `${days} $dict{timepicker_day_plural}`
				} else {
					scope.days = `${days} $dict{timepicker_day_singular}`
				}


				setDisplayValue();
				setViewValue();
				// scope.displayValue = `${scope.days}, ${scope.hours} : ${scope.minutes}`;
				// ngModel.$setViewValue((days * 1440) + (parseInt(scope.hours) * 60) + parseInt(scope.minutes));
				// ngModel.$setValidity('time', true);
				// scope.invalid = false;


			}

			scope.setHours = function (amount, $event) {
				// Prevent the dropdown from closing
				$event.preventDefault();
				$event.stopPropagation();
				// Get hours as number
				let hours = parseInt(scope.hours);

				// If the model value is not a valid number, set validity to false and stop further processing
				if (isNaN(hours)) {
					hours = 0;
				}
				if (isNaN(parseInt(scope.minutes))) {
					scope.minutes = "00";
				}

				if (!scope.time24Format && scope.postMeridiem) {
					if (hours !== 12) {
						hours += 12;
					}
				}

				// Increase with the amount specified
				hours += amount;
				// Check wether the new value is still within bounds
				if (hours <= 23 && hours >= 0) {
					// Update dropdown display value
					// Update input field display value
					if (scope.time24Format) {
						scope.hours = hours.toString().padStart(2, '0');
						// scope.displayValue = `${scope.hours} : ${scope.minutes}`;
					} else {
						if (hours >= 12) {
							scope.postMeridiem = true;
							const tempHours = hours % 12;
							if (tempHours === 0) {
								hours = 12;
							} else {
								hours = tempHours;
							}
						} else {
							scope.postMeridiem = false;
							hours = hours % 12;
						}
						scope.hours = hours.toString().padStart(2, '0');
						// scope.displayValue = `${scope.hours} : ${scope.minutes} ${scope.postMeridiem ? PM : AM}`;
					}
					// Update model view value
					if (scope.postMeridiem) {
						if (hours !== 12) {
							hours += 12
						}
					}

					setDisplayValue();
					setViewValue();
					// ngModel.$setViewValue(hours * 60 + parseInt(scope.minutes));
					ngModel.$setValidity('time', true);
					scope.invalid = false;
				}
			}

			scope.setMinutes = function (amount, $event) {

				// Prevent the dropdown from closing
				$event.preventDefault();
				$event.stopPropagation();

				// Get minutes as number
				let minutes = parseInt(scope.minutes);

				// If the model value is not a valid number, set validity to false and stop further processing
				if (isNaN(minutes)) {
					minutes = 0;
				}
				if (isNaN(parseInt(scope.hours))) {
					scope.hours = "00";
				}

				// Increase with the amount specified
				minutes += amount;

				// Check wether the new value is still within bounds
				if (minutes <= 59 && minutes >= 0) {
					// Update dropdown display value
					scope.minutes = minutes.toString().padStart(2, '0');
					// Update input field display value
					setDisplayValue();
					// Update model view value
					setViewValue();
					ngModel.$setValidity('time', true);
					scope.invalid = false;
				}

			}

			scope.setPostMeridiem = function (value) {
				// Update display values
				scope.postMeridiem = value;
				// Update view value based on the new meridiem
				// Get hours as number
				let hours = parseInt(scope.hours);
				// In PM mode, hour cannot be grater than 11. If it is, we set it to 11.
				if (hours > 11 && value) {
					scope.hours = "11";
					hours = 11;
				}
				// In PM mode, hour cannot be smaller than 1. If it is, we set it to 1.
				if (hours < 1 && value) {
					scope.hours = "12";
					hours = 12;
				}
				if (!value) {
					if (hours > 11) {
						hours = 11;
						scope.hours = "11"
					}
				}
				// Set the input field's value
				// scope.displayValue = `${hours.toString().padStart(2, '0')} : ${scope.minutes} ${scope.postMeridiem ? PM : AM}`;
				setDisplayValue();

				// If we're in PM then add 12 hours to the raw value before updating the model value
				if (scope.postMeridiem && hours !== 12) {
					hours += 12;
				}
				// ngModel.$setViewValue(hours * 60 + parseInt(scope.minutes));
				setViewValue();
				// Set validity as we produce valid values here
				ngModel.$setValidity('time', true);
				scope.invalid = false;
			}

			scope.isDaysValid = function (value) {
				if (value > 0) {
					return true;
				} else {
					let days = parseInt(scope.days);

					if (isNaN(days)) {
						days = 0;
					}

					return days > 0;
				}
			}
			scope.isHoursValid = function (value) {

				let hours = parseInt(scope.hours);

				if (isNaN(hours)) {
					hours = 0;
				}

				// In 24h format, we only have to check wether the number is in the [0,23] range
				if (scope.time24Format) {
					if (value > 0) {
						return hours < 23;
					} else {
						return hours > 0;
					}
				} else {
					if (scope.postMeridiem) {
						if (value > 0) {
							return hours < 11 || hours === 12;
						}
					} else {
						if (value < 0) {
							return hours > 0;
						}
					}
					return true;
				}
			}

			/**
			 * Watch for user changes in the main input field
			 * Validate new value, set form error state and ngModel accordingly
			 */
			scope.displayValueChanged = function () {

				if (typeof scope.displayValue !== "string") {
					return;
				}

				// If the user has cleared the value then we need to reset the
				// hours and minutes settings and clear the model.
				if (scope.displayValue.length == 0) {
					scope.hours = null;
					scope.minutes = null;
					ngModel.$setViewValue(null);
					if (!attrs.required) {
						ngModel.$setValidity('time', true);
						return;
					}
				}

				if (scope.time24Format) {

					// Check the input string for time format. If the field starts with a valid time substring (whitespaces are ignored)
					const match = scope.displayValue.match(/^\s{0,}([0-2][0-9])\s{0,}\:\s{0,}([0-5][0-9])\s{0,}$/g);

					if (Array.isArray(match) && match.length > 0) {
						// Remove unnecessary white space characters and split the result at the : character
						const [hoursString, minutesString] = match[0].replace(/\s/g, '').split(':');
						// Convert possibly padded string values to integers, so we can update ngModel correctly
						const hours = parseInt(hoursString);
						const minutes = parseInt(minutesString);

						scope.hours = hours.toString().padStart(2, '0');
						scope.minutes = minutes.toString().padStart(2, '0');

						ngModel.$setViewValue(hours * 60 + minutes);

						ngModel.$setValidity('time', true);
						scope.invalid = false;

					} else {
						ngModel.$setValidity('time', false);
						scope.invalid = true;
					}

				} else {

					// Match number
					const match = scope.displayValue.match(/^\s{0,}([0-9]{0,2})\s{0,}\:\s{0,}([0-5][0-9])\s{0,}([a,A][m,M]|[p,P][m,M])$/g);
					debugger;
					if (match) {
						const fullMatch = match[0];
						// Remove whitespaces around the : character to produce an array where the first item is the time, the second is the meridiem marker
						const [time, meridiem] = fullMatch.replace(/\s{0,}\:\s{0,}/, ':').split(/\s/);

						const [hoursString, minutesString] = time.split(':');

						let hours = parseInt(hoursString);
						const minutes = parseInt(minutesString);

						if (meridiem.match(/([a,A][m,M])/g)) {
							scope.postMeridiem = false;
						} else if (meridiem.match(/[p,P][m,M]/g)) {
							scope.postMeridiem = true;
						} else {
							ngModel.$setValidity('time', false);
							return;
						}

						if (scope.postMeridiem) {
							if (hours >= 1 && hours <= 12) {
								ngModel.$setValidity('time', true);
								scope.invalid = false;
							} else {
								ngModel.$setValidity('time', false);
								scope.invalid = true;
								return;
							}
						} else {
							if (hours >= 0 && hours <= 11) {
								ngModel.$setValidity('time', true);
								scope.invalid = false;
							} else {
								ngModel.$setValidity('time', false);
								scope.invalid = true;
								return;
							}
						}

						scope.hours = hours.toString().padStart(2, '0');
						scope.minutes = minutes.toString().padStart(2, '0');

						if (scope.postMeridiem) {
							hours += 12;
						}

						ngModel.$setViewValue(hours * 60 + minutes);


					} else {
						ngModel.$setValidity('time', false);
						scope.invalid = true;
					}

				}

			}
		}
	}
	/* @ngInject */
	function ControllerController() {

	}
})();
