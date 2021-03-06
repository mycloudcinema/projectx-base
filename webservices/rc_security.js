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

Webservice exposure for the security module functions
*/
exports.getUserRoles = function(connection, callback, requestData) {
	var query = connection.query("CALL get_security_userroles(?)", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.setUserRoleFunctionGroups = function(connection, callback, requestData) {
	var query = connection.query("CALL set_security_userrolefunctiongroups(?)", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.setFunctionGroupFunctions = function(connection, callback, requestData) {
	var query = connection.query("CALL set_security_functiongroupfunctions(?)", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
