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

 Service to control the accessing of webservices in the back office
 */

 (function (ng) {

	"use strict";

	ng.module("rc.external", ["ui.bootstrap"]);

	ng.module("rc.services", ["ngSanitize", "dialogs.main", "rc.keybr"])
		.service("rcWebservice", ["FayeChannel", "$rootScope", "$http", "$q", "dialogs", WebserviceHandler])
		.controller('DialogLoginController', ["$scope", "$uibModalInstance", DialogLoginController]);

	ng.module("rc.services").controller('ManagerAuthorisationController', function($scope, $uibModalInstance, data) {
// console.log(data);
		//-- Variables --//
		$scope.login = {username : '', password: ''};
		$scope.message = data.message;
		$scope.onscreenKeyboard = data.onscreenKeyboard;
		$scope.language = data.language || "$language{}";

		//-- Methods --//
		$scope.cancel = function() {
			$uibModalInstance.dismiss();
		};
		$scope.login = function() {

			$scope.loggingOn = true;

			$.post("/webservices/authorisationrequests/managerLogin", {
				password:					sjcl.codec.hex.fromBits(sjcl.hash.sha512.hash($scope.login.password)),
				user_name:					$scope.login.username,
				authorisation_request_id:	data.authorisation_request_id,
			}, function (response) {
				if (response && response.resultCode === 0) {
					$uibModalInstance.close(response);
				} else {
					if (response.resultCode === 3) {
						$scope.loginError = "$dict{incorrect_manager_authorisation}";
					} else if (response.resultCode === 4) {
						$scope.loginError = "$dict{user_cannot_authorise}";
					} else {
						$scope.loginError = "$dict{general_authorisation_error}";
					}
					$scope.loggingOn = false;
					$scope.$apply();
				}
			});

		};
		$scope.hitEnter = function(evt) {
			if (ng.equals(evt.keyCode,13))
			$scope.save();
		};
	});

	function DialogLoginController($scope, $uibModalInstance, data) {

		//-- Variables --//
		$scope.login = {username : '', password: ''};

		//-- Methods --//
		$scope.cancel = function(){
			window.location.href = '/';
		};
		$scope.login = function(){

			$.post("/login", {
				password: sjcl.codec.hex.fromBits(sjcl.hash.sha512.hash($scope.login.password)),
				username: $scope.login.username
			}, function (response) {
				if (response && response.resultCode === 0) {
					$uibModalInstance.close(response);
				} else {
					$scope.loginError = "$dict{incorrect_username_password}";
					$scope.$apply();
				}
			});
		};
		$scope.hitEnter = function(evt){
			if(ng.equals(evt.keyCode,13) && !(ng.equals($scope.username,null) || ng.equals($scope.username,'')))
				$scope.save();
		};
	}

	function WebserviceHandler(FayeChannel, $rootScope, $http, $q, dialogs) {

		var self = this;
		var requestOptions;

		self.prefix = "/webservices/";

		// Allow the calling software to override the prefix. This needs to be
		// set of each call as it is reverted to prevent the rest of the software
		// from crashing.
		self.setPrefix = function(prefix) {
			self.prefix = prefix;
		}

		self.get = function (action, params, options, previousDeferred) {

			debug.log('webservice get handler called');

			var _action = action,
				_params = params,
				_options = options;

			var storage;
			var customMessageHandling = false;
			var privilegeElevation = false;
			var authorisationMessage = '';
			var allowRelogin = false;

			// In order to handle user login retries we will use any supplied promise
			// otherwise we create a new one.
			var deferred = previousDeferred || $q.defer();

			if (typeof options !== "undefined") {
				storage = options.storage;
				customMessageHandling = options.customMessages ? options.customMessages : false;
				privilegeElevation = options.privilegeElevation ? options.privilegeElevation : false;
				authorisationMessage = options.authorisationMessage ? options.authorisationMessage : '';
			}

			var storageData;

			if (typeof storage === "string" && (storageData = handleStorageRead(storage, action)) !== null) {
				deferred.resolve({data: storageData});
			} else {

				if (self.prefix !== "/webservices/") {
					requestOptions = {withCredentials: true};
				} else {
					requestOptions = {};
				}

				var requestUrl = self.prefix + action + serialize(params) + timeStamp(true);
				debug.info(requestUrl);

				// Reset the prefix to prevent subsequent calls from being overridden
				self.prefix = "/webservices/";

				$http.get(requestUrl, requestOptions).success(function (wsResponse, status, headers, config) {

					if (options && options.use_rest) {
						deferred.resolve(wsResponse);
					} else {

						switch (wsResponse.resultCode) {
							case 0:
								deferred.resolve(wsResponse);
								if (typeof storage === "string")
									handleStorageSave(storage, action, wsResponse.data);
								break;

							// User has no access to this function
							case 888:

								// If the function is subject to privilege elevation
								// then request management authorisation for the action.
// console.log('privilegeElevation', privilegeElevation);
								if (privilegeElevation) {

									debug.error("User has no access to this function - Requesting elevation", wsResponse);
// console.log('requestUrl', requestUrl);
									// Inject the users original request into the
									// authorisation requests table
									var payload = {
										requested_action:		action,
										authorisaton_message:	authorisationMessage,
										privilegeElevation:		privilegeElevation
									};

									$http.post('/webservices/authorisationrequests/addAuthorisationRequest', payload, requestOptions).success(function (wsResponse) {
// console.log('Authorisation Request', wsResponse);

										// Extract the authorisation request id
										var authorisationRequestId = wsResponse.data[0].authorisation_request_id;
// console.log('Authorisation Request Id', authorisationRequestId);

										if (privilegeElevation == 'inline') {

// console.log('Privilege elevation is requested for inline authorisation.');
// console.log('authorisationMessage', authorisationMessage);
											var managerAuthorisationInstance = dialogs.create('/_templates/base/manager_authorisation', 'ManagerAuthorisationController', {
												message:					authorisationMessage,
												authorisation_request_id:	authorisationRequestId,
												// onscreen_keyboard:			self.device.config.onscreen_keyboard,
												onscreenKeyboard:			true,
												language:					'$language{}'
											}, { keyboard: true, backdrop: 'static' });

											// After the dialog opened, set focus on the input field
											managerAuthorisationInstance.opened.then(function(){
											})

											managerAuthorisationInstance.result.then(function(input) {
// console.log('Approving authorisation.');

												// Inject the authorisation code back into the payload. The framework will
												// validate this when the request is resent to the server.
												requestUrl += '&arid=' + authorisationRequestId;
// console.log('requestUrl', requestUrl);
												// Now post the request back to the server and let the framework validate that the
												// request has not been tampered with.
												$http.get(requestUrl, requestOptions).success(function (wsResponse) {

													switch (wsResponse.resultCode) {
														case 0:
// console.log('Authorisation granted', wsResponse);
															deferred.resolve(wsResponse);
															break;
														default:
// console.log('Authorisation rejected', wsResponse);
															deferred.reject(wsResponse);
													}

												});

											}, function() {
												// The user closed the dialog without entering data/
// console.log('Rejecting authorisation.');
												deferred.reject(wsResponse);
											});

										} else if (privilegeElevation == 'remote') {

										// Now broadcast a message to any authorised
										// users that a user has requested management
										// authorisation.
// console.log("Waiting for a response on server $setting{faye_server}");
// console.log("Waiting for a response on channel /authorisation_response/" + authorisationRequestId);

											var fayeCommPrivilegeElevation = new FayeChannel("$setting{faye_server}", "/authorisation_response/" + authorisationRequestId, function(fayeMessage) {
// console.log('Authorisation response', fayeMessage);
												if (fayeMessage.authorised) {
// console.log('Authorisation approved');

													// Inject the authorisation code back
													// into the payload. The framework will
													// validate this when the request is
													// resent to the server.
													requestUrl += '&arid=' + authorisationRequestId;
// console.log('requestUrl', requestUrl);

													// Now post the request back to the server
													// and let the framework validate that the
													// request has not been tampered with.
													$http.get(requestUrl, requestOptions).success(function (wsResponse) {

														switch (wsResponse.resultCode) {
															case 0:
// console.log('Authorisation granted', wsResponse);
																deferred.resolve(wsResponse);
																break;
															default:
// console.log('Authorisation rejected', wsResponse);
																deferred.reject(wsResponse);
														}

													});

												} else {
// console.log('Authorisation rejected', wsResponse);
													// Authorisation rejected
													deferred.reject(wsResponse);
												}
											});
										}

									}).error(function (data) {
										// Authorisation Request Error
										deferred.reject(wsResponse);
									});

								} else {

									debug.error("User has no access to this function", wsResponse);
									deferred.reject(wsResponse);
									if (!customMessageHandling)
										dialogs.error('$dict{webservice_error}', wsResponse.data);

								}
								break;

							// User is not logged in
							case 999:
								if (!customMessageHandling)
									if (!allowRelogin) {
										window.location = '/logout';
									} else {
										self.popupLogin(function(response) {
											if (response.resultCode === 0) {
												self.get(_action, _params, _options, deferred);
											} else {
												deferred.reject(wsResponse);
											}
										});
									} else {

									}
								break;
							default:
								debug.error("An error occured while executing the webservice call", wsResponse);
								deferred.reject(wsResponse);
								if (!customMessageHandling)
									dialogs.error('$dict{webservice_error}', wsResponse.data);
								break;
						}
					}
				}).error(function (data, status, headers, config) {
					if (customMessageHandling) {
						deferred.reject(data);
					} else {
						if (options && options.use_rest && data.error_message) {
							deferred.reject(data);
							dialogs.error('$dict{webservice_error}', data.error_message);
						} else {
							self.popupNetworkError(function () {
								self.get(_action, _params, _options, deferred);
							});
						}
					}
				});

			}
			return deferred.promise;
		};

		self.post = function (action, payload, options, previousDeferred) {

			debug.log('webservice post handler called');

			var _action = action,
				_payload = payload,
				_options = options;

			var storage;
			var customMessageHandling = false;
			var privilegeElevation = false;
			var authorisationMessage = '';
			var deferred = previousDeferred || $q.defer();
			var allowRelogin = false;

			if (typeof options !== "undefined") {
				storage = options.storage;
				customMessageHandling = options.customMessages ? options.customMessages : false;
				privilegeElevation = options.privilegeElevation ? options.privilegeElevation : false;
				authorisationMessage = options.authorisationMessage ? options.authorisationMessage : '';
			}

			if (typeof storage === "string") {
				var storageData = handleStorageRead(storage, action);
				if (storageData) {
					deferred.resolve(storageData);
				} else {
					deferred.reject();
				}
			}

			var requestUrl = self.prefix + _action + timeStamp(false);

			if (self.prefix !== "/webservices/") {
				requestOptions = {withCredentials: true};
			} else {
				requestOptions = {};
			}

			// Reset the prefix to prevent subsequent calls from being overridden
			self.prefix = "/webservices/";

			$http.post(requestUrl, payload, requestOptions).success(function (wsResponse) {

				if (options && options.use_rest) {
					deferred.resolve(wsResponse);
				} else {

					switch (wsResponse.resultCode) {
						case 0:
							deferred.resolve(wsResponse);
							if (typeof storage === "string")
								handleStorageSave(storage, action, wsResponse.data);
							break;
						// User has no access to this function
						case 888:

							// If the function is subject to privilege elevation
							// then request management authorisation for the action.
// console.log('privilegeElevation', privilegeElevation);
							if (privilegeElevation) {

								debug.error("User has no access to this function - Requesting elevation", wsResponse);
// console.log('requestUrl', requestUrl);
								// Inject the users original request into the
								// authorisation requests table
								payload.requested_action		= action;
								payload.authorisaton_message	= authorisationMessage;
								payload.privilegeElevation		= privilegeElevation;

								$http.post('/webservices/authorisationrequests/addAuthorisationRequest', payload, requestOptions).success(function (wsResponse) {
// console.log('Authorisation Request', wsResponse);

									// Extract the authorisation request id
									var authorisationRequestId = wsResponse.data[0].authorisation_request_id;
// console.log('Authorisation Request Id', authorisationRequestId);

									if (privilegeElevation == 'inline') {

// console.log('Privilege elevation is requested for inline authorisation.');
// console.log('authorisationMessage', authorisationMessage);
										var managerAuthorisationInstance = dialogs.create('/_templates/base/manager_authorisation', 'ManagerAuthorisationController', {
											message:					authorisationMessage,
											authorisation_request_id:	authorisationRequestId,
											// onscreen_keyboard:			self.device.config.onscreen_keyboard,
											onscreenKeyboard:			true,
											language:					'$language{}'
										}, { keyboard: true, backdrop: 'static' });

										// After the dialog opened, set focus on the input field
										managerAuthorisationInstance.opened.then(function(){
										})

										managerAuthorisationInstance.result.then(function(input) {
// console.log('Approving authorisation.');

											// Inject the authorisation code back into the payload. The framework will
											// validate this when the request is resent to the server.
											payload.arid = authorisationRequestId;
// console.log('Modified payload', payload);
											// Now post the request back to the server and let the framework validate that the
											// request has not been tampered with.
											$http.post(requestUrl, payload, requestOptions).success(function (wsResponse) {

												switch (wsResponse.resultCode) {
													case 0:
// console.log('Authorisation granted', wsResponse);
														deferred.resolve(wsResponse);
														break;
													default:
// console.log('Authorisation rejected', wsResponse);
														deferred.reject(wsResponse);
												}

											});

										}, function() {
											// The user closed the dialog without entering data/
// console.log('Rejecting authorisation.');
											deferred.reject(wsResponse);
										});

									} else if (privilegeElevation == 'remote') {

									// Now broadcast a message to any authorised
									// users that a user has requested management
									// authorisation.
// console.log("Waiting for a response on server $setting{faye_server}");
// console.log("Waiting for a response on channel /authorisation_response/" + authorisationRequestId);

										var fayeCommPrivilegeElevation = new FayeChannel("$setting{faye_server}", "/authorisation_response/" + authorisationRequestId, function(fayeMessage) {
// console.log('Authorisation response', fayeMessage);
											if (fayeMessage.authorised) {
// console.log('Authorisation approved');

												// Inject the authorisation code back into the payload. The framework will
												// validate this when the request is resent to the server.
												payload.arid = authorisationRequestId;
// console.log('requestUrl', requestUrl);

												// Now post the request back to the server
												// and let the framework validate that the
												// request has not been tampered with.
												$http.post(requestUrl, payload, requestOptions).success(function (wsResponse) {

													switch (wsResponse.resultCode) {
														case 0:
// console.log('Authorisation granted', wsResponse);
															deferred.resolve(wsResponse);
															break;
														default:
// console.log('Authorisation rejected', wsResponse);
															deferred.reject(wsResponse);
													}

												});

											} else {
// console.log('Authorisation rejected', wsResponse);
												// Authorisation rejected
												deferred.reject(wsResponse);
											}
										});
									}

								}).error(function (data) {
									// Authorisation Request Error
									deferred.reject(wsResponse);
								});

							} else {

								debug.error("User has no access to this function", wsResponse);
								deferred.reject(wsResponse);
								if (!customMessageHandling)
									dialogs.error('$dict{webservice_error}', wsResponse.data);

							}
							break;

						// User is not logged in
						case 999:
							if (!customMessageHandling)
								if (!allowRelogin) {
									window.location = '/logout';
								} else {
									self.popupLogin(function(response) {
										if (response.resultCode === 0) {
											self.get(_action, _payload, _options, deferred);
										} else {
											deferred.reject(wsResponse);
										}
									});
								}
							break;

						default:
							debug.error("An error occured while executing the webservice call", wsResponse);
							deferred.reject(wsResponse);
							if (!customMessageHandling)
								dialogs.error('$dict{webservice_error}', JSON.stringify(wsResponse.data));
							break;
					}
				}

			}).error(function (data) {
				if (!customMessageHandling) {
					if (options && options.use_rest && data.error_message) {
						deferred.reject(data);
						dialogs.error('$dict{webservice_error}', data.error_message);
					} else {
						self.popupNetworkError(function () {
							self.get(_action, _payload, _options, deferred);
						});
					}
				}
			});
			return deferred.promise;
		};

		 self.popupLogin = function(callback) {
			 dialogs.create('/_templates/base/dialog_login', 'DialogLoginController', {}, {backdrop: 'static'}).result.then(function(response) {
				 callback(response);
			 }, function() {
			 });
		 };

		 self.popupNetworkError = function(callback) {
			 dialogs.error('$dict{network_error}', "$dict{network_error_desc}").result.then(function() {
				 callback();
			 }, function() {
			 });
		 };

		 function handleStorageSave(storage, key, data) {
			 if (storage.toUpperCase() === "LOCAL") {
				 localStorage.setItem(key, JSON.stringify(data));
			 } else { // SESSION
				 sessionStorage.setItem(key, JSON.stringify(data));
			 }
		 }

		 function handleStorageRead(storage, key) {
			 var storageData;
			 if (storage.toUpperCase() === "LOCAL") {
				 if (typeof (storageData = localStorage.getItem(key)) !== "undefined")
				 	return JSON.parse(storageData);
				 else
				 	return false;
			 } else { // Session
				 if (typeof (storageData = sessionStorage.getItem(key)) !== "undefined")
				 	return JSON.parse(storageData);
				 else
				 	return false;
			 }
		 }

		 function serialize(obj) {
			 var str = [];
			 for (var p in obj)
			 if (obj.hasOwnProperty(p)) {
				 if (moment.isMoment(obj[p])) {
					 str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p].toISOString()));
				 } else if (typeof obj[p] === 'object') {
					 str.push(encodeURIComponent(p) + "=" + encodeURIComponent(JSON.stringify(obj[p])));
				 } else {
					 str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				 }
			 }
			 // if ($rootScope.device) {
				//  str.push(encodeURIComponent('device_id') + "=" + encodeURIComponent($rootScope.device.id));
			 // }
			 return "?" + str.join("&");
		 }

		 function timeStamp(hasParams) {
			 if (hasParams) {
				 return '&ts=' + Math.round(new Date().getTime() / 1000);
			 } else {
				 return '?ts=' + Math.round(new Date().getTime() / 1000);
			 }
		 }
	 }

 })(angular);
