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

Directive for managing the security settings for user roles.
*/
(function (ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap", "angular.filter", "rcTable"]);

	ng.module("rc")
		.controller("EditFunctionGroupController", ["rcWebservice", EditFunctionGroupController])
		.controller("SecurityController", ["FunctionsManager", "FunctionGroupsManager", "FunctionGroupFunctionsManager", "UserRolesManager", "rcWebservice", "dialogs", "$rootScope", "$uibModal", "$q", SecurityController]);

	function SecurityController(FunctionsManager, FunctionGroupsManager, FunctionGroupFunctionsManager, UserRolesManager, rcWebservice, dialogs, $rootScope, $uibModal, $q) {

		var functionsManager = new FunctionsManager();
		var functionGroupsManager = new FunctionGroupsManager();
		var functionGroupFunctionsManager = new FunctionGroupFunctionsManager();
		var userRolesManager = new UserRolesManager();

		var self = this;

		self.reloadSecurity = function () {
			dialogs.confirm('$dict{confirm_reload}', '$dict{security_reload_desc}').result.then(function (result) {
				// At the moment we cannot detect if the reload was successfull or not, so just call the webservice.
				self.saveUserRoleFunctiongroups().then(function () {
					rcWebservice.get('security/reload', {}, {});
				}, angular.noop);
			}, angular.noop);
		};

		self.mouseIsDown = false;

		self.mousedown = function () {
			self.mouseIsDown = true;
		};
		self.mouseup = function () {
			self.mouseIsDown = false;
		};

		self.newFunctionGroup = function () {
			self.selectFunctionGroup({
				function_group_id:			0,
				function_group_name:		null,
				function_group_category:	null,
				not_for_replication:		false,
				editable:					true
			}, true);
		};

		self.viewFunctionGroup = function (function_group) {
			self.selectFunctionGroup(function_group, false);
		}
		self.editFunctionGroup = function (function_group) {
			self.selectFunctionGroup(function_group, true);
		}

		self.selectFunctionGroup = function (function_group, edit_mode) {

			var modalInstance;
			var functiongroup_functions;

			if (function_group.function_group_id === 0) { // New function group
				functiongroup_functions = [];
				loadFunctions();
			} else { // Edit function Group
				functionGroupFunctionsManager.getFunctionsByFunctionGroup(function_group.function_group_id).then(function (functionList) {
					functiongroup_functions = functionList;
					// Load all functions for use in the typeahead
					loadFunctions();
				}, function () { // Failure
				});
			}

			function loadFunctions() {

				functionsManager.getAll().then(function (functionsList) {

					modalInstance = $uibModal.open({

						animation: true,
						templateUrl: '/_templates/base/rc-edit-function-group',
						size: "lg",

						controller: function ($scope) {

							$scope.close = function () {
								modalInstance.close();
							};
							$scope.selectAll = function (fns) {
								for (var i = 0; i < fns.length; i++) {
									var fn = fns[i];
									if (!$scope.alreadyAdded(fn)) {
										$scope.functiongroup_functions.push(fn);
									}
								}
							};
							$scope.add = function (fn) {
								$scope.functiongroup_functions.push(fn);
							};
							$scope.select = function () {
								var fn = {
									function_name: null,
									function_id: 0,
									newItem: false
								};
								if (typeof $scope.selected === "string") { // New function
									fn.function_name = $scope.selected;
									fn.newItem = true;
								} else { // Existing function
									for (var i = 0; i < functiongroup_functions.length; i++) {
										if (functiongroup_functions[i].function_name === $scope.selected) {
											return;
										}
									}
									fn.function_name = $scope.selected.function_name;
									fn.function_id = $scope.selected.function_id;
								}
								$scope.functiongroup_functions.push(fn);
								$scope.selected = "";
							};

							$scope.remove = function (index) {
								dialogs.confirm("$dict{confirm_delete}", "$dict{confirm_delete_entity}").result.then(function (btn) {
									$scope.functiongroup_functions.splice(index, 1);
									console.log(`Remaining functions ${$scope.functiongroup_functions.length}`);
								}, function (btn) {
								});
							};

							$scope.save = function () {

								var loadingPanel = dialogs.wait(undefined, undefined, 0);
								var postData = [];

								for (var i = 0; i < $scope.functiongroup_functions.length; i++) {
									postData.push($scope.functiongroup_functions[i].function_name);
								}

								rcWebservice.post("base/rc_security/setFunctionGroupFunctions", [{
									function_group_id: function_group.function_group_id,
									function_group_name: $scope.function_group.function_group_name,
									function_group_category: $scope.function_group.function_group_category,
									not_for_replication: $scope.function_group.not_for_replication,
									editable: $scope.function_group.editable,
									functions: postData
								}]).then(function (response) {
									$rootScope.$broadcast('dialogs.wait.complete');
									modalInstance.close();
									var id = response.data[0].function_group_id;
									// If there was no error with the ws call, we have to insert the new / update the existing function group
									if (function_group.function_group_id === 0) {
										var newFunctionGroupItem = {
											function_group_category: $scope.function_group.function_group_category,
											function_group_id: id,
											function_group_name: $scope.function_group.function_group_name,
											not_for_replication: $scope.function_group.not_for_replication,
											editable: $scope.function_group.editable
										};
										for (var i = 0; i < self.roles.length; i++) {
											newFunctionGroupItem[self.roles[i].user_role_id] = false;
										}
										self.data.rows.push(newFunctionGroupItem);
									} else {
										for (var i = 0; i < self.data.rows.length; i++) {
											var obj = self.data.rows[i];
											if (obj.function_group_id === function_group.function_group_id) {
												obj.function_group_name = $scope.function_group.function_group_name;
												obj.function_group_category = $scope.function_group.function_group_category;
												obj.not_for_replication = $scope.function_group.not_for_replication;
												obj.editable = $scope.function_group.editable;
												break;
											}
										}
									}
								}, function (reason) {
									loadingPanel.close();
								});
							};
							$scope.function_group = ng.copy(function_group);
							$scope.functions = functionsList;
							$scope.functiongroup_functions = functiongroup_functions;
							$scope.edit_mode = edit_mode || false;

							$scope.alreadyAdded = function (fn) {
								if ($scope.functiongroup_functions && fn) {
									for (var i = 0; i < $scope.functiongroup_functions.length; i++) {
										if ($scope.functiongroup_functions[i].function_name === fn.function_name) {
											return true;
										}
									}
								}
								return false;
							};
						}
					});
				}, function () {
				});
			}
		};

		self.saveUserRoleFunctiongroups = function () {

			var deferred = $q.defer();
			var dialog = dialogs.wait(undefined, undefined, 0);
			var postData = [];

			for (var i = 0; i < self.data.rows.length; i++) {
				var tmp = {
					function_group_id: self.data.rows[i].function_group_id,
					user_roles: []
				};
				for (var j = 0; j < self.roles.length; j++) {
					self.data.rows[i][self.roles[j].user_role_id] && tmp.user_roles.push(self.roles[j].user_role_id);
				}
				postData.push(tmp);
			}
			rcWebservice.post("base/rc_security/setUserRoleFunctionGroups", postData).then(function (response) {
				debug.log(response);
				$rootScope.$broadcast('dialogs.wait.complete');
				deferred.resolve();
			}, deferred.reject);

			return deferred.promise;
		};

		self.addNewFunction = function (function_name) {

			var deferred = $q.defer();
			var postData = {
				function_id: 0,
				function_name: function_name
			};

			functionsManager.set(postData).then(function () {
			}, function (reason) {
			});

			return deferred.promise;
		};

		userRolesManager.getAll().then(function (userRolesList) {

			self.roles = userRolesList;

			function getUserRoleById(id) {
				for (var i = 0; i < self.roles.length; i++)
					if (self.roles[i].user_role_id == id) return self.roles[i];
			}

			functionGroupsManager.getAll().then(function (functionGroupList) {

				// Sort everything by Category Name
				self.functionGroups = functionGroupList.sort(function(a, b) {
					return a.function_group_category == b.function_group_category ? 0 : +(a.function_group_category > b.function_group_category) || -1;
				});

				var rows = [];
				var columns = [
					{
						name:		"Function category",
						heading_class:	"",
						cell_class:	"",
						property:	"function_group_category",
						width:		10,
						template:	false
					},
					{
						name:		"Function group",
						property:	"function_group_name",
						edit:		self.editFunctionGroup,
						view:		self.viewFunctionGroup,
						template: `<span ng-bind="row.function_group_name"></span>
									<div class="btn-group btn-group-xs pull-right">
										<button class="btn btn-default" ng-click="col.view(row);"><i class="fa fa-search"></i></button>
										<button class="btn btn-default" ng-click="col.edit(row);" ng-if="row.editable"><i class="fa fa-pencil"></i></button>
										<button class="btn btn-default" ng-click="col.deleteGroup(row.function_group_id)" ng-if="row.editable"><i class="fa fa-times-circle"></i></button>
									</div>`,
						width: 20,
						deleteGroup: function (id) {
							dialogs.confirm("$dict{confirm_delete}", "$dict{confirm_function_group_delete}").result.then(function (btn) {
								rcWebservice.get("base/rc_functiongroups/delFunctionGroups", { id: id }).then(function (response) {
									for (var i = 0; i < self.data.rows.length; i++) {
										var obj = self.data.rows[i];
										if (obj.function_group_id === id) {
											self.data.rows.splice(i, 1);
											return;
										}
									}
								}, function (reason) {
								});
							}, function (btn) {
							});
						}
					}
				];

				let firstThrough = true;
				self.functionGroups.forEach(group => {

					var item = {
						function_group_category:	group.function_group_category,
						function_group_name:		group.function_group_name,
						function_group_id:			group.function_group_id,
						not_for_replication:		group.not_for_replication,
						editable:					group.editable
					};

					self.roles.forEach(function(role) {

						if (role.function_group_ids) {
							item[role.user_role_id] = (role.function_group_ids
								// The function group ids are coming back as comma separated text, so we have to convert it to an array
								.split(',')
								// Now we have an array of numerical strings, so we have to convert them to Numbers so indexOf can use them
								.map(function (id) { return parseInt(id) })
								// If the current function groups' id is in the user role's funtion group id list then it is selected :)
								.indexOf(item.function_group_id) !== -1)
						} else {
							item[role.user_role_id] = false;
						}

					})
					rows.push(item);

					// if (i === 0) { // Set the columns array
					// On the first pass we set the columns array
					if (firstThrough) {

						firstThrough = false;

						for (var key in item) {

							if (!isNaN(parseInt(key))) {
								columns.push({
									name:		getUserRoleById(key).user_role_name,
									property:	key,
									noSort:		true,
									class:		"no-padding",
									template:	"<div class='text-center' ng-class='{highlighted:row[col.property]}' ng-mouseenter='$parent.$parent.$parent.$parent.$parent.security.mouseIsDown && (row[col.property] = !row[col.property]);' ng-click='row[col.property] = !row[col.property]' style='width:100%; height: 100%; cursor: pointer;'><i class='fa' ng-click='row[col.property] = !row[col.property];$event.stopPropagation();' ng-class='{\"fa-check\":row[col.property],\"fa-times\":!row[col.property]}'></i></div>",
									width:		5
								});
							}

						}

					}

				});

				self.data = {
					rows:		rows,
					columns:	columns,
					group_by:	{property: 'function_group_category', template: false},
					limit:		1000,
					limits:		[100, 1000]
				};

				self.test = function () {
					self.data.group_by.property = false;
				};

			}, function (reason) {
				debug.log(reason);
			});

		}, function (reason) {
			debug.log(reason);
		});

	}

	function EditFunctionGroupController(rcWebservice, rcDialog) {
	}

	$(document).ready(function () {
		setPageTitle("$dict{title_security_manager}", "menuSecurityCore", "menuSecurityManager");
	});

})(angular);
