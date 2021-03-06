"use strict";

(function(ng) {

	ng.module("rc.external", ["ui.bootstrap", "ui.grid", "ui.grid.edit", "ui.grid.cellNav"]);

	ng.module("rc")
		.controller("DictionaryController", ["DictionaryManager", "LanguagesManager", "rcWebservice", "dialogs", "$rootScope", "$uibModal", "$scope", DictionaryController]);

	function DictionaryController(DictionaryManager, LanguagesManager, rcWebservice, dialogs, $rootScope, $uibModal, $scope) {

		var self = this

		const dictionaryManager = new DictionaryManager()
		const languagesManager = new LanguagesManager()

		const gridOptions = {
			data:					[],
			enableFiltering:		true,
			minRowsToShow:			15,
			showGridFooter:			true,
			columnDefs: [
				{
					name:					'dictionary_key',
					displayName:			'$dict{dictionary_key}',
					enableCellEdit:			false,
					enableCellEditOnFocus:	false
				}
			]
		}

		self.init = function() {

			self.searching = false;

			// There are some properties that only get initialized once so we
			// set the basic grid options on initialization and then insert the
			// data during the load or search.
			self.gridOptions = gridOptions

			languagesManager.getAll().then(function(languages) {

				languages.forEach(function(language) {
					gridOptions.columnDefs.push({name: language.language, enableCellEditOnFocus: true, cellTooltip: true})
				})

				dictionaryManager.getDictionaryCategories().then(function(dictionaryCategories) {
					self.dictionaryCategories = dictionaryCategories
					self.dictionary_category = self.dictionaryCategories[0].dictionary_category
					self.loadDictionary()
				})
			})

		}
		self.init();

		function createObject(dictionaryItems) {

			// Get a list of the unique dictionary keys in the array
			gridOptions.data = dictionaryItems.filter(function (value, index, self) {
				return (self.findIndex(function (item) {
					return item.dictionary_key === value.dictionary_key;
				})) === index;
			}).map(function (item) {

				var temp = {
					dictionary_category:	item.dictionary_category,
					dictionary_key:			item.dictionary_key
				}
				dictionaryItems.filter(function (record) {
					return (record.dictionary_key === item.dictionary_key)
				}).forEach(function (item) {
					temp[item.dictionary_language] = item.dictionary_data
				})
				return temp
			})

			self.gridOptions = gridOptions
		}

		self.gridOptions.onRegisterApi = function(gridApi){
			//set gridApi on scope
			self.gridApi = gridApi
			gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
				// If the user changed the value then we ask the dictionary manager
				// to update it.
				if (newValue !== oldValue) {
					dictionaryManager.setDictionaryItem({
						dictionary_category:	rowEntity.dictionary_category,
						dictionary_key:			rowEntity.dictionary_key,
						dictionary_language:	colDef.name,
						dictionary_data:		newValue
					}).then(function(response) {
						//console.log('edited row id:' + rowEntity.dictionary_key + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue + ', Response: ' + response)
					})
				}
			});
		};

		self.loadDictionary = function() {
			dictionaryManager.getDictionaryByCategory(self.dictionary_category).then(function(dictionaryItems) {
				createObject(dictionaryItems)
			})
		}

		self.searchDictionary = function() {
			if (self.searchTerm !== '') {
				self.searching = true
				dictionaryManager.search({searchTerm: self.searchTerm}).then(function(dictionaryItems) {
					createObject(dictionaryItems)
					self.searching = false
				})
			} else {
				self.loadDictionary();
			}
		}

		self.getNeedsUpdate = function() {
			self.searching = true
			dictionaryManager.getDictionaryNeedsUpdate().then(function(dictionaryItems) {
				createObject(dictionaryItems)
				self.searching = false
			}, function(error) {
				self.searching = false
			})
		}

		self.reloadDictionary = function() {
			dictionaryManager.reloadDictionary().then(function() {
				dialogs.notify("$dict{dictionary_manager}", "$dict{dictionary_reloaded}");
			});
		}

		self.addEntry = function() {

			var modalInstance = $uibModal.open({

				animation:		true,
				templateUrl:	'/_templates/base/add-dictionary-entry',
				size:			"lg",

				controller: function ($scope) {

					$scope.dictionary_category = self.dictionary_category

					$scope.close = function () {
						modalInstance.close();
					};

					$scope.save = function () {

						var loadingPanel = dialogs.wait(undefined, undefined, 0);

						dictionaryManager.set({
							site_name:				'all',
							dictionary_id:			0,
							dictionary_category:	$scope.dictionary_category,
							dictionary_data:		$scope.dictionary_data,
							dictionary_key:			$scope.dictionary_key.toUpperCase(),
							dictionary_language:	'EN'
						}).then(function (response) {
							$rootScope.$broadcast('dialogs.wait.complete');
							modalInstance.close();
							self.dictionary_category = $scope.dictionary_category;
							self.loadDictionary();
						}, function (reason) {
							loadingPanel.close();
						});

					};

					setTimeout(function() {
						$('#dictionary_key').focus();
					}, 100)

				}
			});
		}
	};

	$(document).ready(function() {
		setPageTitle("$dict{dictionary_manager}", "menuApplicationCore", "menuDictionaryManager");
	});

})(angular);
