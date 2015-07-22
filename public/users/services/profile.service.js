
'use strict';

angular.module('users').factory('Profile', [ '$http',
	function($http) {
		return {
			get: function () {
				return $http.get('/users/me/profile');
			}
		};
	}
]);