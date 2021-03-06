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

Webservice exposure for the back office print_definitions functions
*/
exports.getPrintDefinitions = function(connection, callback, requestData) {
    var query = connection.query("CALL get_print_definitions(?);", [JSON.stringify(requestData)], callback);
}
exports.setPrintDefinitions = function(connection, callback, requestData) {
    var query = connection.query("CALL set_print_definitions(?);", [JSON.stringify(requestData)], callback);
}
exports.delPrintDefinitions = function(connection, callback, requestData) {
    var query = connection.query("CALL del_print_definitions(?);", [JSON.stringify(requestData)], callback);
}
exports.getPrintDefinitionsList = function(connection, callback, requestData) {
    var query = connection.query("CALL get_print_definitions_list(?);", [JSON.stringify(requestData)], callback);
}
exports.getPrintDefinitionsRecent = function(connection, callback, requestData) {
    var query = connection.query("CALL get_print_definitions_recent(?);", [JSON.stringify(requestData)], callback);
}
exports.searchPrintDefinitions = function(connection, callback, requestData) {
    var query = connection.query("CALL search_print_definitions(?);", [JSON.stringify(requestData)], callback);
}
