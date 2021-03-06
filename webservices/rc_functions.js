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

 Webservice exposure for the back office functions functions
 */
function getFunctions(connnection, callback, requestData) {
    var query = connnection.query("CALL get_functions(?);", [JSON.stringify(requestData)], callback);
}
exports.getFunctions = getFunctions;
function setFunctions(connnection, callback, requestData) {
    var query = connnection.query("CALL set_functions(?);", [JSON.stringify(requestData)], callback);
}
exports.setFunctions = setFunctions;
function delFunctions(connnection, callback, requestData) {
    var query = connnection.query("CALL del_functions(?);", [JSON.stringify(requestData)], callback);
}
exports.delFunctions = delFunctions;
function getFunctionsList(connnection, callback, requestData) {
    var query = connnection.query("CALL get_functions_list(?);", [JSON.stringify(requestData)], callback);
}
exports.getFunctionsList = getFunctionsList;
function getFunctionsRecent(connnection, callback, requestData) {
    var query = connnection.query("CALL get_functions_recent(?);", [JSON.stringify(requestData)], callback);
}
exports.getFunctionsRecent = getFunctionsRecent;
function searchFunctions(connnection, callback, requestData) {
    var query = connnection.query("CALL search_functions(?);", [JSON.stringify(requestData)], callback);
}
exports.searchFunctions = searchFunctions;
