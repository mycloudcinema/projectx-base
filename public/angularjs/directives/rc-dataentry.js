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

DataEntry Directive for quickly implementing data maintenance pages
*/

(function(ng) {

	"use strict";

	ng.module('rc.directives')
		.directive('rcDataentry', ["TabManager", "Tab", "$timeout", "$locale", "ExportHandler", "dialogs", function(TabManager, Tab, $timeout, $locale, Export, dialogs) {

			return {

				restrict: "E",
				templateUrl: "/_templates/base/rc-dataentry",
				transclude: true,

				scope: {
					entityManager: "=",
					columns: "=",
					options: "=",
					exportOptions: "=",
					filterOptions: "=",
					templateAdd: "=",
					templateEdit: "=",
					templateView: "=",
					parentItem: "=",
					beforeEdit: "=",
					beforeView: "=",
					beforeSave: "=",
					afterTabOpen: "=",
					beforeTabOpen: "=",
					order: "="
				},

				link: function(scope, element, attrs, ctrl) {

					var DEFAULT_OPTIONS = {

						viewDisabled: false,
						editDisabled: false,
						deleteDisabled: false,
						cloneDisabled: true,
						hideHeader: false,
						exportEnabled: true,

						dropdownHidden: false,

						default_entity: {},
						close_add_new: true,
						start_add: false,

						multi_view: false,
						view_mode: 'list',

						exportOptions: {
							buttonLabelRecent: '$dict{export_to_csv}',
							buttonLabelSearch: '$dict{export_to_csv}'
						}

					};

					scope.dataEntryOptions = ng.extend(DEFAULT_OPTIONS, scope.options || {});

					scope.viewMode = scope.dataEntryOptions.view_mode;
					scope.toggleViewMode = function(viewMode) {
						this.viewMode = viewMode;
						scope.viewMode = viewMode;
					}

					scope.id = attrs.id;
					scope.new_entity = {};
					scope.last_selected = null;

					// Localisation options
					scope.currency_sign = $locale.NUMBER_FORMATS.CURRENCY_SYM;
					scope.date_options = {
						format: 'userMediumFormat'
					};

					// Save a reference to the parent scope
					scope.ctrl = scope.$parent;

					// Determine the active tab based on any options supplied by
					// the calling code.
					if (scope.dataEntryOptions.default_entity) {
						scope.default_entity = scope.dataEntryOptions.default_entity;
						scope.new_entity = ng.copy(scope.default_entity);
					}

					if (scope.dataEntryOptions.close_add_new) {
						scope.close_add_new = scope.dataEntryOptions.close_add_new;
					} else {
						scope.close_add_new = false;
					}

					if (scope.dataEntryOptions.start_add) {
						debug.log(`Setting current tab to 0`);
						scope.currentTab = 0;
						scope.tabOffset = 2;
					} else {
						if (scope.dataEntryOptions.add_hidden) {
							debug.log(`Setting current tab to 0`);
							scope.currentTab = 0;
							scope.tabOffset = 1;
						} else {
							debug.log(`Setting current tab to 1`);
							scope.currentTab = 1;
							scope.tabOffset = 2;
						}
					}
					scope.startupTab = scope.currentTab;

					// On a change of the options change the settings
					scope.$watch("options", function (value) {
						debug.log("DataEntry options changed", value);
						scope.dataEntryOptions = ng.extend(DEFAULT_OPTIONS, value || {});
						scope.default_entity = scope.dataEntryOptions.default_entity;
						scope.new_entity = ng.copy(scope.default_entity);
						debug.log("Default entity changed", scope.new_entity);
					});

					// Manage the different display styles in the software
					// NOTE: Search term is in a detached scope because of the ng-if
					// for the filter condition. So we use the this variable to work
					// with the parent scope.
					scope.displayStyle = 'recent';
					scope.showRecent = function() {
						this.searchTerm = '';
						scope.lastSearchTerm = null;
						scope.lastSearchObject = null;
						loadRecent(scope.parentItem ? scope.parentItem.id : null, false);
					}
					scope.showAll = function() {
						this.searchTerm = '';
						scope.lastSearchTerm = null;
						scope.lastSearchObject = null;
						loadRecent(scope.parentItem ? scope.parentItem.id : null, true);
					}

					scope.showMessage = function(message) {
						alert(message);
					}

					scope.refreshDataEntry = function(searchTerm) {
						if (scope.lastSearchObject != null && scope.lastSearchObject != {}) {
							scope.searchDataEntry(scope.lastSearchObject);
						} else if (searchTerm != null || scope.lastSearchTerm) {
							scope.searchDataEntry(searchTerm ? searchTerm : scope.lastSearchTerm);
						} else {
							loadRecent(scope.parentItem ? scope.parentItem.id : null, false);
						}
					};

					scope.clearFilter = function() {
						scope.lastSearchObject = null;
// debugger;
						scope.refreshDataEntry();
					}

					scope.$on('rc.dataentry.refresh', function() {
						debug.log('Forced a refresh');
// debugger;
						scope.refreshDataEntry(scope.lastSearchTerm);
					});

					scope.searchDataEntry = function(searchTerm) {
						// If the user hasn't entered a search term then we are just
						// going to switch back to the recent items list.
						if (!searchTerm) {
							scope.displayStyle = 'recent';
							scope.lastSearchTerm = null;
							scope.lastSearchObject = null;
							scope.refreshing = false;
							scope.searchList.rows = [];
						} else {

							scope.displayStyle = 'search';
							scope.searching = true;
							scope.entityManager.search({
								searchTerm: searchTerm
							}).then(function(data) {

								scope.searchList.rows = [];

								if (typeof searchTerm === 'object') {
									scope.lastSearchTerm = null;
									scope.lastSearchObject = searchTerm;
								} else {
									scope.lastSearchTerm = searchTerm;
									scope.lastSearchObject = null;
								}

								$timeout(function() {
									scope.searchList.rows = data;
									scope.searching = false;
									$timeout(function() {
										scope.refreshing = false;
									}, 100);
								}, 0);
							});
						}
					};

					scope.closeTab = function(event, tabIndex) {
						scope.tabs.splice(tabIndex, 1);
						manageTabClosing(tabIndex);
						event.stopPropagation();
						event.preventDefault();
					};

					scope.addNewEntity = function(entity) {

						scope.add_loading = true;

						if (scope.parentItem) {
							scope.new_entity[scope.parentItem.idField] = scope.parentItem.id;
						}

						scope.entityManager.set(scope.new_entity, true).then(function(response) {

							var newEntity = response;
							scope.add_loading = false;

							$timeout(function() {
								scope.refreshDataEntry();
								if (scope.close_add_new) {
									if (!scope.dataEntryOptions.editDisabled) {
										openTab(newEntity, true, true);
									} else if (!scope.dataEntryOptions.viewDisabled) {
										openTab(newEntity, false, true);
									}
								}
								if (scope.default_entity) {
									debug.log(`Setting the new entity to the default`, scope.default_entity);
									scope.new_entity = ng.copy(scope.default_entity);
								} else {
									debug.log(`Setting the new entity an empty object`);
									scope.new_entity = {};
								}
							});

						}, function(response) {
							scope.add_loading = false;
						});

					};

					scope.exportRecent = function(type) {
						const fileName = (document.title || 'rosetta_pos').replace(/ /g, '_').toLowerCase() + '_export';
						if (type === "csv") {
							Export.csv(fileName, scope.recentList.rows, scope.dataEntryOptions.exportColumns);
						} else if (type === "tsv") {
							Export.tsv(fileName, scope.recentList.rows, scope.dataEntryOptions.exportColumns);
						} else if (type === "xls") {
							Export.xls(fileName, scope.recentList.rows);
						} else if (type === "xml") {
							// TODO: Export xml
							Export.xml(fileName, scope.recentList.rows);
						} else if (type === "xlsx") {

						}
					}

					scope.exportSearch = function(type) {
						const fileName = (document.title || 'rosetta_pos').replace(/ /g, '_').toLowerCase() + '_export';
						if (type === "csv") {
							Export.csv(fileName, scope.searchList.rows);
						} else if (type === "tsv") {
							Export.tsv(fileName, scope.recentList.rows);
						} else if (type === "xls") {
							Export.xls(fileName, scope.recentList.rows);
						} else if (type === "xml") {
							// TODO: Export xml
							Export.xml(fileName, scope.searchList.rows);
						} else if (type === "xlsx") {

						}
					}

					// These two functions are used to enable row click edit/view
					// functionality in the rcTable directive.
					scope.rowClass = function() {
						if ((!scope.dataEntryOptions.viewDisabled || !scope.dataEntryOptions.editDisabled)) {
							return 'pointer';
						}
					}

					scope.rowClick = function(row, col) {
						debug.log('rowClick', row, col);
						// If the column doesn't implement a link then we will open
						// the entity record.
						if (!col || !col.link) {
							if (!scope.dataEntryOptions.editDisabled) {
								openTab(row, true, false);
							} else if (!scope.dataEntryOptions.viewDisabled) {
								openTab(row, false, false);
							}

						// If it has a link but there is no value in the column then we
						// open the entity record.
						} else if (!row[col.property]) {
							if (!scope.dataEntryOptions.editDisabled) {
								openTab(row, true, false);
							} else if (!scope.dataEntryOptions.viewDisabled) {
								openTab(row, false, false);
							}

						}
					}

					// If an ID value has been passed to us then we try and find a record
					// in the entity with this id. If one exists then we will open a new
					// tab with that record.
					if (getRequestParameter('id')) {
						scope.entityManager.get(getRequestParameter('id')).then(entity => {
							if (!scope.dataEntryOptions.editDisabled) {
								openTab(entity, true, false);
							} else if (!scope.dataEntryOptions.viewDisabled) {
								openTab(entity, false, false);
							}
							debug.log(`Setting current tab to ${(scope.tabs.length - 1) + scope.tabOffset}`);
							scope.currentTab = (scope.tabs.length - 1) + scope.tabOffset;
						})
					}

					function openTab(entity, editMode, refreshBeforeEdit) {

						// debug.log('openTab', entity);
						if (editMode && typeof scope.beforeEdit === 'function') {
							scope.beforeEdit(entity);
						};
						if (!editMode && typeof scope.beforeView === 'function') {
							scope.beforeView(entity);
						};

						for (var i = 0; i < scope.tabs.length; i++) {
							if (entity[attrs.idField] === scope.tabs[i].id) {
								if (refreshBeforeEdit) {
									scope.tabs[i].refresh();
								}
								debug.log(`Found an open tab, setting current tab to ${i + scope.tabOffset}`);
								scope.currentTab = i + scope.tabOffset;
								if (!editMode) {
									scope.tabs[i].editMode = false;
								} else {
									scope.tabs[i].edit();
								}
								return;
							}
						}

						var tab = new Tab({
							id: entity[attrs.idField],
							name: entity[attrs.nameField],
							editMode: editMode,
							active: false,
							entityManager: scope.entityManager,
							onrefresh: function() {
								scope.refreshing = true;
								scope.refreshDataEntry();
							},
							ondelete: handleTabDelete,
							parentItem: scope.parentItem,
							beforeEdit: scope.beforeEdit,
							beforeSave: scope.beforeSave,
							beforeView: scope.beforeView,
							beforeTabOpen: scope.beforeTabOpen,
						}, attrs.idField, attrs.nameField, scope);

						scope.tabs.push(tab);

						$timeout(function() {
							debug.log(`Setting current tab to ${(scope.tabs.length - 1) + scope.tabOffset}`);
							scope.currentTab = (scope.tabs.length - 1) + scope.tabOffset;
							// Rendering complex edit pages could block synchronous code execution to the point where
							// Angular change detection finishes before the data is loaded
							// By using $timeout, we force change detection at a later time.
							// 100ms delay is enough, 250ms and 500ms are there for future proofing the solution.
							$timeout(angular.noop, 100);
							$timeout(angular.noop, 250);
							$timeout(angular.noop, 500);
						}, 0);

						if (typeof scope.afterTabOpen === 'function') {
							scope.afterTabOpen(editMode, entity);
						};

					}

					function manageTabClosing(index) {
						if (scope.tabs.length > 0) {
							debug.log(`Setting current tab to ${(scope.tabs.length - 1) + scope.tabOffset}`);
							scope.currentTab = (scope.tabs.length - 1) + scope.tabOffset;
						} else {
							$timeout(function() {
								debug.log(`Setting current tab to ${scope.startupTab}`);
								scope.currentTab = scope.startupTab;
							});
						}
					}

					function loadRecent(parentId, allRecords) {

						scope.recentList.rows = [];
						scope.searchList.rows = [];

						if (allRecords) {
							scope.loadingAll = true;
							scope.entityManager.getAll(parentId).then(function(data) {
								scope.displayStyle = 'all';
								scope.recentList.rows = data;
								scope.loadingAll = false;
								$('#searchTerm').focus();
							}, function(data) {
								scope.loadingAll = false;
							});
						} else {
							scope.loadingRecent = true;
							scope.entityManager.recent(parentId).then(function(data) {
								scope.displayStyle = 'recent';
								scope.recentList.rows = data;
								scope.loadingRecent = false;
								$('#searchTerm').focus();
							}, function(data) {
								scope.loadingRecent = false;
							});
						}

					}

					function handleTabDelete(id) {
						for (var i = 0; i < scope.tabs.length; i++) {
							if (scope.tabs[i].id === id) {
								scope.tabs.splice(i, 1);
								manageTabClosing(i);
								break;
							}
						}
						scope.refreshDataEntry();
					}

					function deleteEntity(id) {
						dialogs.confirm("$dict{confirm_delete}", "$dict{confirm_delete_entity}").result.then(function(btn) {
							scope.entityManager.delete(id).then(function() {
								handleTabDelete(id);
							}, function() {
								//failure
							});
						}, function(btn) {});
					}

					function init() {

						// Setup the possible actions that can bee applied to a record
						// in this row.
						var recordViewTemplate = "<button class='btn btn-default' ng-click='col.view($event, row)'><i class='fa fa-info-circle'></i></button>";
						var recordEditTemplate = "<button class='btn btn-default' ng-click='col.edit($event, row)'><i class='fa fa-pencil'></i></button>";
						var recordDeleteTemplate = "<button class='btn btn-default' ng-click='col.del($event, row)' ng-disabled='row.delete_disabled'><i class='fa fa-trash'></i></button>";
						var recordCloneTemplate = "<button class='btn btn-default' ng-click='col.clone($event, row)'><i class='fa fa-clone'></i></button>";

						// If an external action creates a record we use this broadcast
						// message to providee them with a way to open the entry in a
						// tab after the add action has occurred.
						scope.$on("openTab", function(event, message) {
							if (message.tabId === scope.id) {
								if (!scope.dataEntryOptions.editDisabled) {
									openTab(message, true, true);
								} else if (!scope.dataEntryOptions.viewDisabled) {
									openTab(message, false, true);
								}
							}
						});

						var actionsDisabled = (scope.dataEntryOptions.viewDisabled && scope.dataEntryOptions.editDisabled && scope.dataEntryOptions.deleteDisabled && scope.dataEntryOptions.cloneDisabled);

						if (scope.dataEntryOptions.viewDisabled) {
							recordViewTemplate = "";
						}
						if (scope.dataEntryOptions.editDisabled) {
							recordEditTemplate = "";
						}
						if (scope.dataEntryOptions.deleteDisabled) {
							recordDeleteTemplate = "";
						}
						if (scope.dataEntryOptions.cloneDisabled) {
							recordCloneTemplate = "";
						}

						if (!actionsDisabled) {

							scope.columns.push({

								name: "$dict{actions}",
								heading_class: "text-center nowrap",
								class: "text-center nowrap",
								property: "",
								noSort: true,

								view: function($event, entity) {
									openTab(entity, false, false);
									$event.stopPropagation();
								},
								edit: function($event, entity) {
									openTab(entity, true, false);
									$event.stopPropagation();
								},
								del: function($event, entity) {
									deleteEntity(entity[attrs.idField]);
									$event.stopPropagation();
								},
								clone: function($event, entity) {

									// Clone the current entry and remove the id field
									// so that we will be creating a new item.
									scope.new_entity = ng.copy(entity);
									scope.new_entity[attrs.idField] = null;

									// Switch to the Add New tab for this entry.
									debug.log(`Setting current tab to 0`);
									scope.currentTab = 0;

									$event.stopPropagation();
								},

								template: "<div class='btn-group btn-group-xs'>" + recordCloneTemplate + recordViewTemplate + recordEditTemplate + recordDeleteTemplate + '</div>'

							});

						}

						scope.recentList = {
							group_by: {
								property: false
							},
							columns: scope.columns,
							rows: [],
							order: scope.order || [null, null]
						};
						scope.searchList = {
							group_by: {
								property: false
							},
							columns: scope.columns,
							rows: [],
							order: scope.order || [null, null]
						};
						scope.templateUrl = attrs.templateUrl;

						loadRecent(scope.parentItem ? scope.parentItem.id : null, false);

						scope.tabs = [];

					}
					init();
				}
			};
		}]);

	ng.module('rc.directives').factory('Tab', ["dialogs", function(dialogs) {

		function Tab(data, idField, nameField, scope, dialogs) {

			var self = this;

			self.set(data);
			self.idField = idField;
			self.nameField = nameField;

			scope.$on("refresh", function(event, message) {
				if (message === self.id) {
					self.refresh();
				}
			});
		}

		Tab.prototype = {

			id: null,
			name: null,
			loading: false,
			pinned: null,
			mode: null,
			editMode: null,
			entityManager: null,
			entity: null,
			edit_entity: null,
			onrefresh: null,
			ondelete: null,
			beforeTabOpen: null,

			set: function(data) {

				var self = this;

				self.id = data.id;
				self.name = data.name;
				self.pinned = data.pinned ? true : false;
				self.editMode = data.editMode ? true : false;
				self.entity = data.entity;
				self.entityManager = data.entityManager;
				self.loading = true;
				self.parentTab = data.parentItem;
				self.beforeEdit = data.beforeEdit;
				self.beforeView = data.beforeView;
				self.beforeSave = data.beforeSave;
				self.beforeTabOpen = data.beforeTabOpen;

				self.entityManager.get(self.id, true).then(function(response) {

					self.entity = response;
					self.loading = false;

					if (typeof self.beforeTabOpen === 'function') {
						self.beforeTabOpen(self.editMode, self.entity).then(function(entity) {
							self.entity = entity;
							if (self.editMode) {
								self.edit_entity = ng.copy(self.entity);
							}
						});
					} else {
						if (self.editMode) {
							self.edit_entity = ng.copy(self.entity);
						}
					};

				}, function(response) {
					self.loading = false;
				});
				self.onrefresh = data.onrefresh;
				self.ondelete = data.ondelete;
			},
			close: function(event, tabIndex) {
				event.stopPropagation();
			},
			pin: function(event) {
				this.pinned = true;
				event.stopPropagation();
			},
			unpin: function($event) {
				alert('Tab un-pinned');
				this.pined = false;
				event.stopPropagation();
			},
			refresh: function() {

				var self = this;
				// debug.log('Refresh');
				self.entityManager.get(this.id, true).then(function(response) {
					self.entity = response;
					self.loading = false;
					self.name = response[self.nameField];
					self.onrefresh();
					if (typeof self.beforeTabOpen === 'function') {
						self.beforeTabOpen(self.editMode, self.entity);
					}
					if (self.editMode) {
						self.edit_entity = ng.copy(self.entity);
					}
					if (typeof self.beforeView === 'function') {
						self.beforeView(self.entity);
					}

				}, function(response) {
					self.loading = false;
				});
			},
			// Exit out of edit mode and switch to view mode
			cancel: function() {
				this.editMode = false;
				if (typeof this.beforeView === 'function') {
					this.beforeView(this.entity);
				};
			},
			// Enter into edit mode
			edit: function() {
				if (typeof this.beforeEdit === 'function') {
					this.beforeEdit(this.entity);
				};
				this.edit_entity = angular.copy(this.entity);
				this.editMode = true;
				// debug.log('edit', this.entity, this.edit_entity)
			},
			// Save changes using webservices
			save: function() {

				var self = this;

				self.loading = true;

				if (self.parentTab && self.parentTab) {
					self.edit_entity[self.parentTab.idField] = self.parentTab.id;
				}

				debug.log("self.edit_entity", self.edit_entity);

				if (typeof self.beforeSave === 'function') {
					self.beforeSave(self.edit_entity, function(beforeSaveResponse) {
						if (beforeSaveResponse.resultCode === 0) {
							self.entityManager.set(beforeSaveResponse.editEntity).then(function(response) {
								debug.log("DATAENTRY TAB NAME", self.nameField, response[self.nameField], response);
								self.loading = false;
								self.entity = response;
								self.editMode = false;
								self.refresh();
							}, function(response) {
								self.loading = false;
								// TODO: do something if save fails.
							});
						} else {
							dialogs.notify("$dict{save_cancelled}", "$dict{save_cancelled_message}");
						}
					});
				} else {
					self.entityManager.set(self.edit_entity).then(function(response) {
						debug.log("DATAENTRY TAB NAME", self.nameField, response[self.nameField], response);
						self.loading = false;
						self.entity = response;
						self.editMode = false;
						self.refresh();
					}, function(response) {
						self.loading = false;
						// TODO: do something if save fails.
					});
				};

			},
			del: function() {

				var self = this;

				dialogs.confirm("$dict{confirm_delete}", "$dict{confirm_delete_entity}").result.then(function(btn) {
					self.entityManager.delete(self.id).then(function() {
						self.ondelete(self.id);
					}, function() {
						//failure
					});
				}, function(btn) {});
			},
			// Enter into view mode
			view: function() {
				if (typeof this.beforeView === 'function') {
					this.beforeView(this.entity);
				};

			}
		};
		return Tab;
	}]);

	ng.module('rc.directives').factory("TabManager", ["Tab", function(Tab) {
		var TabManager = {
			tabs: [],
			removeTab: function(tabs, index) {
				if (this.tabs.length >= index) {
					tabs.splice(index, 1);
				}
			},
			onTabsChange: null
		};
		TabManager.prototype = {};
		return TabManager;
	}]);

})(angular);

function checkVisible(elm) {
	var $window = $(window),
		vpH = $window.height(), // Viewport Height
		st = $window.scrollTop(),
		$elm = $(elm),
		y = $elm.offset().top,
		elementHeight = $elm.height();
	return ((y < (vpH + st)) && (y > (st - elementHeight)));
}

/*
https://gist.github.com/RadoMark/fbd501b26e0c389c4135
*/
angular.module("rc.directives").directive('watchersToggler', ['$parse', '$timeout', function($parse, $timeout) {
	return {
		restrict: 'EA',
		scope: {
			toggler: '&watchersToggler',
			refreshSuspensionOn: '=refreshHideOn'
		},
		link: function($scope, element, attrs) {
			var watchers = {
				suspended: false
			};

			document.addEventListener("mousedown", function() {
				setTimeout(function() {

					const visible = checkVisible(element);
					debug.log("Toggle watchers", element.attr("tabid"), visible);

					if (!visible) {
						if (!watchers.suspended) {
							suspendFromRoot();
						}
					} else {
						if (watchers.suspended) {
							resumeFromRoot();
						}
					}

				}, 400);
			});

			// });

			$scope.$watch('refreshSuspensionOn', function(newVal, oldVal) {
				if (newVal !== oldVal) refreshSuspensionFromRoot()
			}, true);


			function suspendFromRoot() {
				if (!watchers.suspended) {
					$timeout(function() {
						suspendWatchers();
						watchers.suspended = true;
					})
				}
			}

			function refreshSuspensionFromRoot() {
				if (watchers.suspended) {
					$timeout(function() {
						suspendWatchers();
					})
				}
			}

			function resumeFromRoot() {
				if (watchers.suspended) {
					$timeout(function() {
						resumeWatchers();
						watchers.suspended = false;
					})
				}
			}

			function suspendWatchers() {
				iterateSiblings($scope, suspendScopeWatchers);
				iterateChildren($scope, suspendScopeWatchers);
			};

			function resumeWatchers() {
				iterateSiblings($scope, resumeScopeWatchers);
				iterateChildren($scope, resumeScopeWatchers);
			};

			var mockScopeWatch = function(scopeId) {
				return function(watchExp, listener, objectEquality, prettyPrintExpression) {
					watchers[scopeId].unshift({
						fn: angular.isFunction(listener) ? listener : angular.noop,
						last: void 0,
						get: $parse(watchExp),
						exp: prettyPrintExpression || watchExp,
						eq: !!objectEquality
					})
				}
			}

			function suspendScopeWatchers(scope) {
				if (!watchers[scope.$id]) {
					watchers[scope.$id] = scope.$$watchers || [];
					scope.$$watchers = [];
					scope.$watch = mockScopeWatch(scope.$id)
				}
			}

			function resumeScopeWatchers(scope) {
				if (watchers[scope.$id]) {
					scope.$$watchers = watchers[scope.$id];
					if (scope.hasOwnProperty('$watch')) delete scope.$watch;
					watchers[scope.$id] = false
				}
			}

			function iterateSiblings(scope, operationOnScope) {
				while (!!(scope = scope.$$nextSibling)) {
					operationOnScope(scope);
					iterateChildren(scope, operationOnScope);
				}
			}

			function iterateChildren(scope, operationOnScope) {
				while (!!(scope = scope.$$childHead)) {
					operationOnScope(scope);
					iterateSiblings(scope, operationOnScope);
				}
			}
		}
	}
}]);
