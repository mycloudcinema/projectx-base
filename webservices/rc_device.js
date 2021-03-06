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

Webservice exposure for the back office device functions
*/
exports.getDevice = function(connection, callback, requestData) {
    var query = connection.query("CALL get_device(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.setDevice = function(connection, callback, requestData) {
    var query = connection.query("CALL set_device(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.delDevice = function(connection, callback, requestData) {
    var query = connection.query("CALL del_device(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getDeviceList = function(connection, callback, requestData) {
    var query = connection.query("CALL get_device_list(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getDeviceRecent = function(connection, callback, requestData) {
    var query = connection.query("CALL get_device_recent(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.searchDevice = function(connection, callback, requestData) {
    var query = connection.query("CALL search_device(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}


exports.getDeviceNew = function(connection, callback, requestData) {
	var query = connection.query("CALL get_device_new(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getPrintersList = function(connection, callback, requestData) {
	var query = connection.query("CALL get_device_list_printers(?);", [JSON.stringify(requestData)], callback);
}
exports.getDeviceListPos = function(connection, callback, requestData) {
	var query = connection.query("CALL get_device_list_pos(?);", [JSON.stringify(requestData)], callback);
}
exports.getDeviceWorking = function(connection, callback, requestData) {
	var query = connection.query("CALL get_device_working(?);", [JSON.stringify(requestData)], callback);
}
