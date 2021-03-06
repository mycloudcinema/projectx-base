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

Webservice exposure for the back office location_status functions
*/
exports.getLocationStatus = function(connection, callback, requestData) {
    var query = connection.query("CALL get_location_status(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.setLocationStatus = function(connection, callback, requestData) {
    var query = connection.query("CALL set_location_status(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.delLocationStatus = function(connection, callback, requestData) {
    var query = connection.query("CALL del_location_status(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getLocationStatusList = function(connection, callback, requestData) {
    var query = connection.query("CALL get_location_status_list(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getLocationStatusRecent = function(connection, callback, requestData) {
    var query = connection.query("CALL get_location_status_recent(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.searchLocationStatus = function(connection, callback, requestData) {
    var query = connection.query("CALL search_location_status(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
