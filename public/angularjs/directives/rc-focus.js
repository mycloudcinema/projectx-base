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

 Cool focusing directive using an idea borrowed from Chris Harrington
 http://chrisharrington.github.io/demos/focus.html
 */

(function (ng) {

	"use strict";

	ng.module("rc.directives").directive("text", [focus]);

	function focus() {

		return {

			restrict: "E",
			// template: '<div class="text-container"><div class="icon" ng-show="icon">{{icon}}</div><input id="{{id}}" type="{{type}}" class="{{class}}" value="{{value}}" placeholder="{{placeholder}}" focus="{{focus}}" tabindex="{{tabindex}}" step="{{step}}" min="{{min}}" max="{{max}}" ng-disabled="rcDisabled" ng-model="ngModel"/><div class="focus"><div></div></div></div>',
			template: '<div class="text-container" ng-class="{\'input-group\': icon}"><input id="{{id}}" type="{{type}}" class="{{class}} form-control" value="{{value}}" placeholder="{{placeholder}}" focus="{{focus}}" tabindex="{{tabindex}}" step="{{step}}" min="{{min}}" max="{{max}}" ng-disabled="rcDisabled" ng-model="ngModel"/><span class="input-group-addon" ng-show="icon">{{icon}}</span><div class="focus"><div></div></div></div>',
			inputDisabled: "",
			scope: {
				id: "@rcId",
				name: "@",
				type: "@",
				icon: "@",
				class: "@",
				step: "@",
				min: "@",
				max: "@",
				pattern: "@",
				ngModel: "=",
				placeholder: "@",
				rcDisabled: "="
			},

			link: function (scope, element, attrs, ctrl) {

				$(element).addClass("rc-input");

				scope.required = (attrs.required === "");

				if (scope.required && (scope.ngModel === undefined || scope.ngModel === '')) {
					$(element).addClass("focus");
				}

				$(element).on("focus", "input", function () {
					$(element).addClass("focus");
				});
				$(element).on("blur", "input", function () {
					if (!scope.required || (!(scope.ngModel === undefined) && scope.ngModel !== '')) {
						$(element).removeClass("focus");
					} else if (scope.required && ((scope.ngModel === undefined) || scope.ngModel === '')) {
						$(element).addClass("focus");
					}
				});

				if (attrs.rcBlur && true) {
					$(element).on("blur", "input", function () {
						scope.$parent.$eval(attrs.rcBlur);
					})
				}

				if (attrs.rcChange && true) {
					scope.$parent.$watch(attrs.ngModel, function (val) {
						debug.log("change detected", val);
						scope.$parent.$eval(attrs.rcChange);
					})
				}
			}
		};
	}
})(angular);
