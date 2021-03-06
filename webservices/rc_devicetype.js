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

Webservice exposure for the back office device_type functions
*/
exports.getDeviceType = function(connection, callback, requestData) {
    var query = connection.query("CALL get_device_type(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.setDeviceType = function(connection, callback, requestData) {
    var query = connection.query("CALL set_device_type(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.delDeviceType = function(connection, callback, requestData) {
    var query = connection.query("CALL del_device_type(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getDeviceTypeList = function(connection, callback, requestData) {
    var query = connection.query("CALL get_device_type_list(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getDeviceTypeRecent = function(connection, callback, requestData) {
    var query = connection.query("CALL get_device_type_recent(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.searchDeviceType = function(connection, callback, requestData) {
    var query = connection.query("CALL search_device_type(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
