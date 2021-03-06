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

Webservice exposure for the back office location functions
*/
exports.getLocation = function(connection, callback, requestData) {
    var query = connection.query("CALL get_location(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.setLocation = function(connection, callback, requestData) {
    var query = connection.query("CALL set_location(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.delLocation = function(connection, callback, requestData) {
    var query = connection.query("CALL del_location(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getLocationList = function(connection, callback, requestData) {
    var query = connection.query("CALL get_location_list(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getLocationRecent = function(connection, callback, requestData) {
    var query = connection.query("CALL get_location_recent(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.searchLocation = function(connection, callback, requestData) {
    var query = connection.query("CALL search_location(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
