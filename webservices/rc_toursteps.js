/*
 __  __          _____ _                 _    _____ _
|  \/  |        / ____| |               | |  / ____(_)
| \  / |_   _  | |    | | ___  _   _  __| | | |     _ _ __   ___ _ __ ___   __ _
| |\/| | | | | | |    | |/ _ \| | | |/ _` | | |    | | '_ \ / _ \ '_ ` _ \ / _` |
| |  | | |_| | | |____| | (_) | |_| | (_| | | |____| | | | |  __/ | | | | | (_| |
|_|  |_|\__, |  \_____|_|\___/ \__,_|\__,_|  \_____|_|_| |_|\___|_| |_| |_|\__,_|
         __/ |
        |___/

Webservice exposure for the back office tour_steps functions
*/
exports.getTourSteps = function(connection, callback, requestData) {
    var query = connection.query("CALL get_tour_steps(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.setTourSteps = function(connection, callback, requestData) {
    var query = connection.query("CALL set_tour_steps(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.delTourSteps = function(connection, callback, requestData) {
    var query = connection.query("CALL del_tour_steps(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getTourStepsList = function(connection, callback, requestData) {
    var query = connection.query("CALL get_tour_steps_list(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.getTourStepsRecent = function(connection, callback, requestData) {
    var query = connection.query("CALL get_tour_steps_recent(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
exports.searchTourSteps = function(connection, callback, requestData) {
    var query = connection.query("CALL search_tour_steps(?);", [JSON.stringify(requestData)], callback);
console.log(query.sql);
}
