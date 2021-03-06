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

 Generic Filter plug-in to be attached to an Angular application
 and provide filtering services.
 */
(function (ng) {

	"use strict";

	function debounce(func, wait, immediate) {
		var timeout;
		return function () {
			var context = this, args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate)
					func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow)
				func.apply(context, args);
		};
	}

	ng.module("rcFilter", ["rcFilter.templates"])
			.directive("rcFilter", [rcFilterDirective])
			.controller("rcFilterController", ["$attrs", rcFilterController]);

	function rcFilterDirective() {

		return {
			restrict:		"EA",
			templateUrl:	"/_templates/base/rc-filter",
			replace:		true,
			scope: {
				onFilter:		"=",
				onSearch:		"=",
				onRefresh:		"=",
				onShowRecent:	"=",
				onShowAll:		"=",
				options:		"=filterOptions"
			},
			link: function (scope, element, attrs, ctrl) {

				debug.log(element.width());

				ctrl.dropdown_width = element.width(); // Set up the initial width of the element

				var defaults = {
					maxWidth:				scope.options.maxWidth ? scope.options.maxWidth : 800,
					minWidth:				scope.options.minWidth ? scope.options.minWidth : 800,
					maxHeight:				scope.options.maxHeight ? scope.options.maxHeight : 450,
					defaultInvalidMessage:	"Invalid input",
					dropUp:					false,
					btnFilter:				"Filter"
				};

				scope.handleKeypress = function (event) {
					if (event.keyCode === 13 || event.which === 13) {
						// Enter pressed
						if (typeof ctrl.options.onSearch === "function") {
							ctrl.options.onSearch(ctrl.main);
						}
					}
				};

				ctrl.options = scope.options;
				ctrl.options.btnFilter = scope.options.btnFilter ? scope.options.btnFilter : defaults.btnFilter;
				ctrl.options.btnClose = scope.options.btnClose ? scope.options.btnClose : defaults.btnClose;
				ctrl.options.defaultInvalidMessage = defaults.defaultInvalidMessage;

				scope.dropUp = scope.options.dropUp ? scope.options.dropUp : defaults.dropUp;

				scope.filterBodyStyle = {
					'max-height': defaults.maxHeight + "px", 'overflow-y': "auto", 'overflow-x': "hidden"
				};

				var elementWidth = 0;

				window.addEventListener("resize", debounce(function () {
					setDropdownWidth(false);
				}, 400, false));

				function setDropdownWidth(first) {

					elementWidth = element.width();
					debug.log(elementWidth, first);
					if (elementWidth > defaults.maxWidth)
						ctrl.dropdown_width = defaults.maxWidth;
					else if (elementWidth < defaults.minWidth)
						ctrl.dropdown_width = defaults.minWidth;
					else
						ctrl.dropdown_width = elementWidth;

					if (!first) {
						scope.$apply();
					}
				}
				setDropdownWidth(true);

				scope.stopPropogation = function (event) {
					event.stopPropagation();
				};

				function loadFilterPresets(setDefault) {
					ctrl.options.filterPresets = [];
					if (scope.options.predefinedFilters) {
						for (var i = 0; i < scope.options.predefinedFilters.length; i++) {
							ctrl.options.filterPresets.push(scope.options.predefinedFilters[i]);
							if (setDefault && scope.options.predefinedFilters[i].default) {
								ctrl.selected_filter_preset = scope.options.predefinedFilters[i];
								ctrl.updateFilter(ctrl.selected_filter_preset, true);
							}
						}
					}
					if (scope.options.customFilters && scope.options.customFilters.length > 0) {
						ctrl.options.filterPresets.push({});
						for (var i = 0; i < scope.options.customFilters.length; i++) {
							ctrl.options.filterPresets.push(scope.options.customFilters[i]);
						}
					}
				}
				loadFilterPresets(true);

				scope.saveAs = function (name) {
					if (!scope.options.customFilters) {
						scope.options.customFilters = [];
					}
					// Check wether the customFilters array contains a filter object with the same name
					var index = false;
					for (var i = 0; i < scope.options.customFilters.length; i++) {
						if (scope.options.customFilters[i].name === name) {
							index = i;
						}
					}
					if (index === false) {
						scope.options.customFilters.push({
							name: name,
							value: generateFilterObject(false)
						});
					} else {
						scope.options.customFilters[index].value = generateFilterObject(false);
					}
					scope.options.updateCustomFilters(scope.options.customFilters);

					loadFilterPresets();
				};

				scope.deleteCustomFilter = function (name, filter) {
					for (var i = 0; i < scope.options.customFilters.length; i++) {
						if (scope.options.customFilters[i].name === name) {
							scope.options.customFilters.splice(i, 1);
						}
					}
					loadFilterPresets();

					if (typeof scope.options.onDeleteCustomFilter === "function")
						scope.options.onDeleteCustomFilter(name, filter);
				};

				function generateFilterObject() {
					var filter_object = {};
					for (var i = 0; i < ctrl.options.filterSections.length; i++) {
						for (var j = 0; j < ctrl.options.filterSections[i].filters.length; j++) {
							var filterElement = ctrl.options.filterSections[i].filters[j];
							if (typeof filterElement.value !== "undefined") {
								filter_object[filterElement.filter_property] = filterElement.value;
							}
						}
					}
					return filter_object;
				}

				ctrl.doFilter = function () {
					var output_object = generateFilterObject();
					if (typeof scope.onFilter === "function") {
						scope.onFilter(output_object);
					} else {
						console.error("Property onFilter expected to be a function but got: " + typeof scope.onFilter);
					}

				};

				ctrl.doRefresh = function (searchText) {
					if (typeof scope.onRefresh === "function") {
						scope.onRefresh(searchText);
					} else {
						console.error("Property onRefresh expected to be a function but got: " + typeof scope.onRefresh);
					}
				};
				ctrl.doSearch = function (searchText) {
					scope.displayStyle = 'search';
					if (typeof scope.onSearch === "function") {
						scope.onSearch(searchText);
					} else {
						console.error("Property onSearch expected to be a function but got: " + typeof scope.onSearch);
					}

				};

				// Manage the different display styles in the software
				scope.displayStyle = 'recent';
				ctrl.doShowRecent = function() {
					scope.displayStyle = 'recent';
					this.searchTerm = null;
					if (typeof scope.onShowRecent === "function") {
						scope.onShowRecent();
					} else {
						console.error("Property onShowRecent expected to be a function but got: " + typeof scope.onShowRecent);
					}
				}
				ctrl.doShowAll = function() {
					scope.displayStyle = 'all';
					this.searchTerm = null;
					if (typeof scope.onShowAll === "function") {
						scope.onShowAll();
					} else {
						console.error("Property onShowAll expected to be a function but got: " + typeof scope.onShowAll);
					}
				}

				scope.closeDropdown = function () {
					$("body").trigger("click");
				};
				scope.getTemplateUrl = function (filterElement) {
					return "rcfilter/" + filterElement.type + ".tpl.html";
				};
			},
			controller: "rcFilterController",
			controllerAs: "filter"
		};
	}

	function rcFilterController($attrs) {

		var self = this;

		self.updateFilter = function (data, init) {
			self.newFilterName = data.name;
			for (var i = 0; i < self.options.filterSections.length; i++) {
				for (var j = 0; j < self.options.filterSections[i].filters.length; j++) {
					var filterElement = self.options.filterSections[i].filters[j];
					// For each filter element we have to go throgh the new filters properties and assign the value found there
					if (typeof data.value[filterElement.filter_property] !== "undefined") {
						filterElement.value = data.value[filterElement.filter_property];
					} else {
						filterElement.value = undefined;
					}
				}
			}
			if (!init)
				self.doFilter();

		};

		self.clearFilter = function () {
			for (var i = 0; i < self.options.filterSections.length; i++) {
				for (var j = 0; j < self.options.filterSections[i].filters.length; j++) {
					var filterElement = self.options.filterSections[i].filters[j];
					// For each filter element we have to go through the new filters properties and assign the value found there
					delete filterElement.value;
				}
			}
		};
	}

	// Individual filter templates
	ng.module('rcFilter.templates', []).run(['$templateCache', function ($templateCache) {
		$templateCache.put('rcfilter/text.tpl.html', '<label ng-bind="filterElement.label"></label> <span class="text-danger" ng-if="filterForm[filterElement.filter_property].$invalid" ng-bind="filterElement.invalid_message ? filterElement.invalid_message : filter.options.defaultInvalidMessage"></span> <input type="text" name="{{filterElement.filter_property}}" class="form-control input-sm" placeholder="{{filterElement.placeholder}}" ng-pattern="filterElement.pattern ? filterElement.pattern : \'\'" ng-model="filterElement.value"/>');
		$templateCache.put('rcfilter/checkbox.tpl.html', '<label ng-bind="filterElement.label"></label> <span class="text-danger" ng-if="filterForm[filterElement.filter_property].$invalid" ng-bind="filterElement.invalid_message ? filterElement.invalid_message : filter.options.defaultInvalidMessage"></span> <input type="checkbox" name="{{filterElement.filter_property}}" class="form-control input-sm" ng-model="filterElement.value"/>');
		$templateCache.put('rcfilter/number.tpl.html', '<label ng-bind="filterElement.label"></label> <span class="text-danger" ng-if="filterForm[filterElement.filter_property].$invalid" ng-bind="filterElement.invalid_message ? filterElement.invalid_message : filter.options.defaultInvalidMessage"></span> <input type="number" name="{{filterElement.filter_property}}" min="{{filterElement.min ? filterElement.min : 0}}" placeholder="{{filterElement.placeholder}}" max="{{filterElement.max ? filterElement.max : 1000000}}" class="form-control input-sm" ng-model="filterElement.value">');
		$templateCache.put('rcfilter/dateinline.tpl.html', '<div rc-datepicker-inline ng-model="filterElement.value" show-today="true" options="filterElement.options"></div>');
		$templateCache.put('rcfilter/date.tpl.html', '<div rc-datepicker ng-model="filterElement.value" show-today="true" options="filterElement.options"></div>');
		$templateCache.put('rcfilter/select.tpl.html', '<label ng-bind="filterElement.label"></label> <button type="button" placeholder="{{filterElement.placeholder}}" container="body" animation="am-flip-x" class="btn btn-default btn-sm" style="width:100%" ng-model="filterElement.value" bs-options="option.value as option.label for option in filterElement.options" bs-select><span class="caret"></span></button>');
		$templateCache.put('rcfilter/multiselect.tpl.html', '<label ng-bind="filterElement.label"></label> <button type="button" container="body" ng-init="filterElement.value = []" placeholder="{{filterElement.placeholder}}" class="btn btn-default btn-sm" style="width:100%" ng-model="filterElement.value" data-multiple="1" data-animation="am-flip-x" bs-options="option.value as option.label for option in filterElement.options" bs-select><span class="caret"></span></button>');
	}]);

})(angular);
