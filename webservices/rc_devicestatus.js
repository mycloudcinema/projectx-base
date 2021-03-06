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

Webservice exposure for the back office device_status functions
*/
exports.getDeviceStatus = function(connection, callback, requestData) {
    var query = connection.query("CALL get_device_status(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.setDeviceStatus = function(connection, callback, requestData) {
    var query = connection.query("CALL set_device_status(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.delDeviceStatus = function(connection, callback, requestData) {
    var query = connection.query("CALL del_device_status(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getDeviceStatusList = function(connection, callback, requestData) {
    var query = connection.query("CALL get_device_status_list(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getDeviceStatusRecent = function(connection, callback, requestData) {
    var query = connection.query("CALL get_device_status_recent(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.searchDeviceStatus = function(connection, callback, requestData) {
    var query = connection.query("CALL search_device_status(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
