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

Webservice exposure for the back office user_roles functions
*/
exports.getUserRoles = function(connnection, callback, requestData) {
	var query = connnection.query("CALL get_user_roles(?);", [JSON.stringify(requestData)], callback);
	console.log(query.sql);
}
exports.setUserRoles = function(connnection, callback, requestData) {
	var query = connnection.query("CALL set_user_roles(?);", [JSON.stringify(requestData)], callback);
	console.log(query.sql);
}
exports.delUserRoles = function(connnection, callback, requestData) {
	var query = connnection.query("CALL del_user_roles(?);", [JSON.stringify(requestData)], callback);
	console.log(query.sql);
}
exports.getUserRolesList = function(connnection, callback, requestData) {
	var query = connnection.query("CALL get_security_userroles(?);", [JSON.stringify(requestData)], callback);
	console.log(query.sql);
}
exports.getUserRolesRecent = function(connnection, callback, requestData) {
	var query = connnection.query("CALL get_user_roles_recent(?);", [JSON.stringify(requestData)], callback);
	console.log(query.sql);
}
exports.searchUserRoles = function(connnection, callback, requestData) {
	var query = connnection.query("CALL search_user_roles(?);", [JSON.stringify(requestData)], callback);
	console.log(query.sql);
}
