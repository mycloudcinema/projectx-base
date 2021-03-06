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

Webservice exposure for the back office print_definition_formats functions
*/
exports.getPrintDefinitionFormats = function(connection, callback, requestData) {
    var query = connection.query("CALL get_print_definition_formats(?);", [JSON.stringify(requestData)], callback);
}
exports.setPrintDefinitionFormats = function(connection, callback, requestData) {
    var query = connection.query("CALL set_print_definition_formats(?);", [JSON.stringify(requestData)], callback);
}
exports.delPrintDefinitionFormats = function(connection, callback, requestData) {
    var query = connection.query("CALL del_print_definition_formats(?);", [JSON.stringify(requestData)], callback);
}
exports.getPrintDefinitionFormatsList = function(connection, callback, requestData) {
    var query = connection.query("CALL get_print_definition_formats_list(?);", [JSON.stringify(requestData)], callback);
}
exports.getPrintDefinitionFormatsRecent = function(connection, callback, requestData) {
    var query = connection.query("CALL get_print_definition_formats_recent(?);", [JSON.stringify(requestData)], callback);
}
exports.searchPrintDefinitionFormats = function(connection, callback, requestData) {
    var query = connection.query("CALL search_print_definition_formats(?);", [JSON.stringify(requestData)], callback);
}
