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

 Webservice exposure for the back office function_group_functions functions
 */
function getFunctionGroupFunctions(connnection, callback, requestData) {
    var query = connnection.query("CALL get_function_group_functions(?);", [JSON.stringify(requestData)], callback);
}
exports.getFunctionGroupFunctions = getFunctionGroupFunctions;
function setFunctionGroupFunctions(connnection, callback, requestData) {
    var query = connnection.query("CALL set_function_group_functions(?);", [JSON.stringify(requestData)], callback);
}
exports.setFunctionGroupFunctions = setFunctionGroupFunctions;
function delFunctionGroupFunctions(connnection, callback, requestData) {
    var query = connnection.query("CALL del_function_group_functions(?);", [JSON.stringify(requestData)], callback);
}
exports.delFunctionGroupFunctions = delFunctionGroupFunctions;
function getFunctionGroupFunctionsList(connnection, callback, requestData) {
    var query = connnection.query("CALL get_security_function_group_functions(?);", [JSON.stringify(requestData)], callback);
}
exports.getFunctionGroupFunctionsList = getFunctionGroupFunctionsList;
function getFunctionGroupFunctionsRecent(connnection, callback, requestData) {
    var query = connnection.query("CALL get_function_group_functions_recent(?);", [JSON.stringify(requestData)], callback);
}
exports.getFunctionGroupFunctionsRecent = getFunctionGroupFunctionsRecent;
function searchFunctionGroupFunctions(connnection, callback, requestData) {
    var query = connnection.query("CALL search_function_group_functions(?);", [JSON.stringify(requestData)], callback);
}
exports.searchFunctionGroupFunctions = searchFunctionGroupFunctions;
