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

Service to provide a dialog to the application for communicating with the user
in a consistent manner.
*/
(function (ng) {
	
	"use strict";
	
	ng.module("rc.services").service("rcDialog", ["$modal", "$q", "$timeout", DialogHandler]);
	
	//<editor-fold defaultstate="collapsed" desc="Dialog handler">
	function DialogHandler($modal, $q, $timeout) {

		this.showLoading = function(){

			var instance = $modal.open({
				windowClass: "rc-dialog loading",
				backdrop: false,
				controller: function ($scope) {
					$scope.ok = function () {
						instance.close();
					};
				},
				template: "<i class='fa fa-refresh fa-spin'></i>",
				size: ""
			});
			return instance;
		};

		//<editor-fold defaultstate="collapsed" desc="Error dialog">
		this.error = function (message) {
			var deferred = $q.defer();
			var instance = $modal.open({
				windowClass: "rc-dialog error",
				backdrop: "static",
				controller: function ($scope) {
					$scope.message = message;

					$scope.ok = function () {
						deferred.resolve();
						instance.close();
					};
				},
				templateUrl: "/public/angular-templates/error_dialog.html",
				size: ""
			});
			return deferred.promise;
		};
		//</editor-fold>
		//
		//<editor-fold defaultstate="collapsed" desc="Prompt dialog">
		this.prompt = function (message) {
			var deferred = $q.defer();
			var result;
			var instance = $modal.open({
				windowClass: "rc-dialog prompt",
				backdrop: "static",
				controller: function ($scope, $modalInstance) {
					$scope.message = message;
					$scope.focus = true;

					$scope.ok = function () {
						$modalInstance.close(ng.copy($scope.text));
					};
					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				},
				templateUrl: "/public/angular-templates/prompt_dialog.html",
				size: "sm"
			}
			);
			instance.result.then(function (result) {
				deferred.resolve(result);
			}, deferred.reject);
			return deferred.promise;
		};
		//</editor-fold>
		//
		//<editor-fold defaultstate="collapsed" desc="Info">
		this.info = function (message, title) {
			var deferred = $q.defer();

			var instance = $modal.open({
				windowClass: "rc-dialog info",
				backdrop: true,
				keyboard:true,
				controller: function ($scope) {
					$scope.message = message;
					$scope.title = title ? title : false;
					$scope.ok = function () {
						deferred.resolve();
						instance.close();
					};
				},
				templateUrl: "/public/angular-templates/info_dialog.html",
				size: ""
			});

			return deferred.promise;
		};
		//</editor-fold>
		//
		//<editor-fold defaultstate="collapsed" desc="Confirm">
		this.confirm = function (message, message_body) {
			var deferred = $q.defer();
			var instance = $modal.open({
				windowClass: "rc-dialog confirm",
				backdrop: "static",
				controller: function ($scope, $modalInstance) {
					$scope.message = message;
					$scope.message_body = message_body;
					$scope.focus = true;

					$scope.ok = function () {
						$modalInstance.close();
					};
					$scope.cancel = function () {
						$modalInstance.dismiss('no');
					};
				},
				templateUrl: "/public/angular-templates/confirm_dialog.html",
				size: ""
			}
			);
			instance.result.then(function (result) {
				deferred.resolve(result);
			}, deferred.reject);
			return deferred.promise;
		};
		//</editor-fold>
		//
		//<editor-fold defaultstate="collapsed" desc="Login dialog">
		this.login = function () {
			var deferred = $q.defer();
			var instance = $modal.open({
				windowClass: "rc-dialog error",
				backdrop: "static",
				controller: function ($scope) {
					$scope.ok = function () {
						deferred.resolve();
						instance.close();
					};
				},
				templateUrl: "/public/angular-templates/login_dialog.html",
				size: "sm"
			});
			return deferred.promise;
		};
		//</editor-fold>
	}
//</editor-fold>
})(angular);
