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

Webservice exposure for the back office print_definition_types functions
*/
exports.getPrintDefinitionTypes = function(connection, callback, requestData) {
    var query = connection.query("CALL get_print_definition_types(?);", [JSON.stringify(requestData)], callback);
}
exports.setPrintDefinitionTypes = function(connection, callback, requestData) {
    var query = connection.query("CALL set_print_definition_types(?);", [JSON.stringify(requestData)], callback);
}
exports.delPrintDefinitionTypes = function(connection, callback, requestData) {
    var query = connection.query("CALL del_print_definition_types(?);", [JSON.stringify(requestData)], callback);
}
exports.getPrintDefinitionTypesList = function(connection, callback, requestData) {
    var query = connection.query("CALL get_print_definition_types_list(?);", [JSON.stringify(requestData)], callback);
}
exports.getPrintDefinitionTypesRecent = function(connection, callback, requestData) {
    var query = connection.query("CALL get_print_definition_types_recent(?);", [JSON.stringify(requestData)], callback);
}
exports.searchPrintDefinitionTypes = function(connection, callback, requestData) {
    var query = connection.query("CALL search_print_definition_types(?);", [JSON.stringify(requestData)], callback);
}
