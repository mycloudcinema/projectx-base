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

Table Directive for creating a Table automatically from a JSON object. Provides
the following functions:

- Automatic column sorting
- Drag and drop column ordering
- Grouping of data
- Ability to save and restore the column order (you must write your own storage logic)
*/

(function (ng) {

	'use strict';

	function isJqueryEventDataTransfer() {
		return window.jQuery && (-1 === window.jQuery.event.props.indexOf('dataTransfer'));
	}

	if (isJqueryEventDataTransfer()) {
		window.jQuery.event.props.push('dataTransfer');
	}

	var module = ng.module('lrDragNDrop', []);

	module.service('lrDragStore', ['$document', function (document) {

		var store = {};

		this.hold = function hold(key, item, collectionFrom, safe) {
			store[key] = {
				item: item,
				collection: collectionFrom,
				safe: safe === true
			};
		};

		this.get = function (namespace) {
			var
				modelItem = store[namespace], itemIndex;

			if (modelItem) {
				itemIndex = modelItem.collection.indexOf(modelItem.item);
				return modelItem.safe === true ? modelItem.item : modelItem.collection.splice(itemIndex, 1)[0];
			} else {
				return null;
			}
		};

		this.clean = function clean() {
			store = {};
		};

		this.isHolding = function (namespace) {
			return store[namespace] !== undefined;
		};

		document.bind('dragend', this.clean);
	}]);

	module.service('lrDragHelper', function () {
		var th = this;

		th.parseRepeater = function (scope, attr) {
			var
				repeatExpression = attr.ngRepeat,
				match;

			if (!repeatExpression) {
				throw Error('this directive must be used with ngRepeat directive');
			}
			match = repeatExpression.match(/^(.*\sin).(\S*)/);
			if (!match) {
				throw Error("Expected ngRepeat in form of '_item_ in _collection_' but got '" +
				repeatExpression + "'.");
			}

			return scope.$eval(match[2]);
		};

		th.lrDragSrcDirective = function (store, safe) {
			return function compileFunc(el, iattr) {
				iattr.$set('draggable', true);
				return function linkFunc(scope, element, attr) {
					var
						collection,
						key = (safe === true ? attr.lrDragSrcSafe : attr.lrDragSrc) || 'temp';

					if (attr.lrDragData) {
						scope.$watch(attr.lrDragData, function (newValue) {
							collection = newValue;
						});
					} else {
						collection = th.parseRepeater(scope, attr);
					}

					element.bind('dragstart', function (evt) {
						store.hold(key, collection[scope.$index], collection, safe);
						if (angular.isDefined(evt.dataTransfer)) {
							evt.dataTransfer.setData('text/html', null); //FF/jQuery fix
						}
					});
				};
			};
		};
	});

	module.directive('lrDragSrc', ['lrDragStore', 'lrDragHelper', function (store, dragHelper) {
		return{
			compile: dragHelper.lrDragSrcDirective(store)
		};
	}]);

	module.directive('lrDragSrcSafe', ['lrDragStore', 'lrDragHelper', function (store, dragHelper) {
		return{
			compile: dragHelper.lrDragSrcDirective(store, true)
		};
	}]);

	module.directive('lrDropTarget', ['lrDragStore', 'lrDragHelper', '$parse', function (store, dragHelper, $parse) {
		return {
			link: function (scope, element, attr) {

				var
					collection,
					key = attr.lrDropTarget || 'temp',
					classCache = null;

				function isAfter(x, y) {
					//check if below or over the diagonal of the box element
					return (element[0].offsetHeight - x * element[0].offsetHeight / element[0].offsetWidth) < y;
				}

				function resetStyle() {
					if (classCache !== null) {
						element.removeClass(classCache);
						classCache = null;
					}
				}

				if (attr.lrDragData) {
					scope.$watch(attr.lrDragData, function (newValue) {
						collection = newValue;
					});
				} else {
					collection = dragHelper.parseRepeater(scope, attr);
				}

				element.bind('drop', function (evt) {
					var
						collectionCopy = ng.copy(collection),
						item = store.get(key),
						dropIndex, i, l;
					if (item !== null) {
						dropIndex = scope.$index;
						dropIndex = isAfter(evt.offsetX, evt.offsetY) ? dropIndex + 1 : dropIndex;
						//srcCollection=targetCollection => we may need to apply a correction
						if (collectionCopy.length > collection.length) {
							for (i = 0, l = Math.min(dropIndex, collection.length - 1); i <= l; i++) {
								if (!ng.equals(collectionCopy[i], collection[i])) {
									dropIndex = dropIndex - 1;
									break;
								}
							}
						}
						scope.$apply(function () {
							collection.splice(dropIndex, 0, item);
							var fn = $parse(attr.lrDropSuccess) || ng.noop;
							fn(scope, {e: evt, item: item, collection: collection});
						});
						evt.preventDefault();
						resetStyle();
						store.clean();
					}
				});

				element.bind('dragleave', resetStyle);

				element.bind('dragover', function (evt) {
					var className;
					if (store.isHolding(key)) {
						className = isAfter(evt.offsetX, evt.offsetY) ? 'lr-drop-target-after' : 'lr-drop-target-before';
						if (classCache !== className && classCache !== null) {
							element.removeClass(classCache);
						}
						if (classCache !== className) {
							element.addClass(className);
						}
						classCache = className;
					}
					evt.preventDefault();
				});
			}
		};
	}]);
})(angular);

(function (ng) {

	"use strict";

	if (!ng) throw new Error("Angular is not defined. Make sure that its inserted and its before the remek-table script");

    ng.module("rcTable", ["lrDragNDrop"])
		.directive("rcTable", [rcTableDirective])
		.directive("cell", [cellDirective])
		.directive('bindHtmlCompile', ['$compile', function ($compile) {
			return {
				restrict: 'A',
				link: function (scope, element, attrs) {
					scope.$watch(function () {
						return scope.$eval(attrs.bindHtmlCompile);
					}, function (value) {
						element.html(value);
						$compile(element.contents())(scope);
					});
				}
			};
		}]).directive('slideToggle', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attr) {
				var slideDuration = 400;
				var slideElement = attr.slideToggle;

				// Watch for when the value bound to isOpen changes
				// When it changes trigger a slideToggle
				element.bind("click", function(){
					angular.element(document.getElementById(slideElement)).toggleClass("hidden");
				});
			}
		};
	}).filter('rcLimitTo', function() {
		return function(input, limit, begin) {
			return input.slice(begin, begin + limit);
		};
	}).filter("ceil", function(){
		return function(input){
			return Math.ceil(input);
		};
	}).filter("floor", function(){
		return function(input){
			return Math.floor(input);
		};
	});

	function rcTableDirective() {

		return {
			restrict: "E",
			transclude: true,
			replace: true,
			templateUrl: "/_templates/base/rc-table",
			scope: {
				data:			"=collection",
				controls:		"=controls",
				viewMode:		"=",
				functions:		"=functions",
				rowClass:		"=",
				rowClick:		"="
			},

			link: function (scope, elem, attrs, ctrl) {

				scope.viewMode = scope.viewMode || 'list';

				scope.data.group_by = scope.data.group_by || {property:false, template:false};

				if (Array.isArray(scope.data.order)) {
					scope.firstOrderItem = scope.data.order[0];
					scope.secondOrderItem = scope.data.order[1];
				} else {
					scope.firstOrderItem = null;
					scope.secondOrderItem = null;
				}

				scope.order = [scope.firstOrderItem, scope.secondOrderItem];
				scope.data.limit = scope.data.limit || 10;
				scope.data.limits = scope.data.limits || [10, 25, 50, 100];
				scope.data.activeRows = scope.data.rows.sort(dynamicSortMultiple(scope.order)).slice(0, scope.data.limit);

				if (!scope.data.order) {
					scope.data.order = [];
				}

				scope.limitIndex = 0;
				scope.controls = {
					setLimit:function(limit){
						scope.data.limit = limit;
						scope.data.activeRows = scope.data.rows.slice(scope.limitIndex, scope.limitIndex + scope.data.limit);
					},
					first:function(){
						scope.limitIndex = 0;
						scope.data.activeRows = scope.data.rows.slice(scope.limitIndex, scope.limitIndex + scope.data.limit);
					},
					previous:function(){
						scope.limitIndex -= scope.data.limit;
						scope.data.activeRows = scope.data.rows.slice(scope.limitIndex, scope.limitIndex + scope.data.limit);
					},
					next:function(){
						scope.limitIndex += scope.data.limit;
						scope.data.activeRows = scope.data.rows.slice(scope.limitIndex, scope.limitIndex + scope.data.limit);
					},
					last:function(){
						scope.limitIndex = Math.floor(scope.data.rows.length / scope.data.limit) * scope.data.limit;
						scope.data.activeRows = scope.data.rows.slice(scope.limitIndex, scope.limitIndex + scope.data.limit);
					}
				};

				window.addEventListener("dragend", function(e){
					if(e.srcElement.classList.contains("remek-table-group-header")) {
						scope.data.group_by.property = false;
						scope.$apply();
					}
				}, false);

				scope.applySort = function(col, $event){
					if (!col.noSort) {
						if ($event.altKey) {
								scope.data.group_by.property = col.property;
						} else {
							if ($event.shiftKey){ //Secondary sort
								if (!(col.property === scope.firstOrderItem || col.property === "-" + scope.firstOrderItem)) {
									// Only apply the secondary order property when its not the same as the first one
									if (scope.secondOrderItem !== col.property){
										scope.secondOrderItem = col.property;
									}
									else if (scope.secondOrderItem === col.property) {
										scope.secondOrderItem = "-" + col.property;
									}
									else if (scope.firstOrderItem === "-" + col.property) {
										scope.secondOrderItem = col.property;
									}
								}
							} else { //Primary sort
								scope.secondOrderItem = null;
								if (scope.firstOrderItem !== col.property){
									scope.firstOrderItem = col.property;
									scope.data.primary_sort = col.property;
								} else if (scope.firstOrderItem === col.property) {
									scope.firstOrderItem = "-" + col.property;
									scope.data.primary_sort = "-" + col.property;
								} else if (scope.firstOrderItem === "-" + col.property) {
									scope.firstOrderItem = col.property;
									scope.data.primary_sort = col.property;
								}
							}
							scope.order = [scope.firstOrderItem, scope.secondOrderItem];
							scope.data.activeRows = scope.data.rows.sort(dynamicSortMultiple(scope.order)).slice(scope.limitIndex, scope.limitIndex + scope.data.limit);
						}
					}
				};
				scope.$watch("data.columns", function() {
					for	(var i = 0; i < scope.data.columns.length; i++) {
						scope.data.columns[i].template = scope.data.columns[i].template ? scope.data.columns[i].template : "{{row[col.property]}}";
					}
				});
				scope.$watch("data.rows", function() {
					scope.noOfPages = Math.ceil(scope.data.rows.length / scope.data.limit);
					var tmp = scope.noOfPages - Math.floor(scope.limitIndex / scope.data.limit);
					scope.data.activeRows = scope.data.rows.slice(scope.limitIndex, scope.limitIndex + scope.data.limit);
				});
				scope.$watch("data.rows.length", function() {
					scope.noOfPages = Math.ceil(scope.data.rows.length / scope.data.limit);
					var tmp = scope.noOfPages - Math.floor(scope.limitIndex / scope.data.limit);
					scope.data.activeRows = scope.data.rows.slice(scope.limitIndex, scope.limitIndex + scope.data.limit);
					// var tmp = scope.noOfPages - Math.floor(scope.limitIndex / scope.data.limit + 1);
				});
				scope.$watch("data.limit", function() {
					scope.noOfPages = Math.ceil(scope.data.rows.length / scope.data.limit);
					var tmp = scope.noOfPages - Math.floor(scope.limitIndex / scope.data.limit);
					// var tmp = scope.noOfPages - Math.floor(scope.limitIndex / scope.data.limit + 1);
				});
				scope.$watch("viewMode", function() {
					console.log('View mode changed', scope.viewMode);
				});
				scope.currentPage = function(){
				};
			},
			controller: function($scope) {
				this.functions = $scope.functions;
			},
			controllerAs: 'table'
		};
	}

	function cellDirective() {
		return {
			restrict: "E",
			transclude: true,
			replace: true,
			scope: true,
			require: "^rcTable",
			template: "<td ng-include=''>{{data}}</td>",
			link: function (scope, elem, attrs, ctrl) {
				var dataProperty = attrs.property ? attrs.property : (function () {
					throw new Error("Attribute 'property' is required on element <cell>")
				})();
				var isCustom = attrs.custom ? true : false;
				scope.data = scope.$parent.$parent.row[dataProperty];
			}
		};
	}

	function dynamicSort(property) {
		var sortOrder = 1;
		if(property[0] === "-") {
			sortOrder = -1;
			property = property.substr(1);
		}
		return function (a,b) {
			if (a[property] && b[property]) {
				var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
			} else {
				if (a[property]) {
					result = 1;
				} else {
					if (b[property]) {
						result = -1;
					} else {
						result = 0;
					}
				}
			}
			return result * sortOrder;
		}
	}

	function dynamicSortMultiple() {

		var props = [];
		arguments[0].forEach(function(element) {
			if (element) {
				props.push(element);
			}
		});
		return function (obj1, obj2) {
			var i = 0, result = 0, numberOfProperties = props.length;
			/* try getting a different result from 0 (equal)
			 * as long as we have extra properties to compare
			 */
			while(result === 0 && i < numberOfProperties) {
				result = dynamicSort(props[i])(obj1, obj2);
				i++;
			}
			return result;
		}
	}

})(angular);
