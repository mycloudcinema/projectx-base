(function (ng) {
	/**
	 * A filter used for setting the start index of a collection in ngRepeat
	 * NOTE: Recommended for relatively small datasets (<= 100)
 	 */
	ng.module('rc.filters').filter('rcPager', function () {
		return function (input, currentPage, pageSize) {
			if (input) {
				return input.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
			}
		}
	});
})(angular);