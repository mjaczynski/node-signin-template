'use strict';

var mainApplicationModuleName = 'signin';

var mainApplicationModule = angular.module(mainApplicationModuleName, ['ngRoute','ngMessages','users']);

// Configure the hashbang URLs using the $locationProvider services 
mainApplicationModule.config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

// in case an API to the server returns 401 Unauthenticated, redirect to /login
mainApplicationModule.config(['$httpProvider',
	function($httpProvider) {
		$httpProvider.interceptors.push(function ($q, $location) {
			return {
				'responseError': function (response) {
					if (response.status===401) {
						console.log("Received 401, redirecting to login page")
						$location.path('/login');
					}
					return $q.reject(response);
				}
			};
		});
	}
]);

mainApplicationModule.run(['$rootScope',function($rootScope) {
		$rootScope.user=window.user;
	}
]);

// Fix Facebook's OAuth bug
if (window.location.hash === '#_=_') window.location.hash = '#!';

// Manually bootstrap the AngularJS application
angular.element(document).ready(function() {
	angular.bootstrap(document, [mainApplicationModuleName]);
});


var handleError = function ($scope, data, status, headers, config) {
	if (data && Array.isArray(data)) {
		$scope.errors = data;
	} else {
		var msg ;
		if (status==0){
			msg = "Server down or unreachable"
		} else if (status >=500){
			msg = "Internal server error ("+status+")";
		} else if (status >=400 && status <500){
			msg = "Invalid data ("+status+")";
		} else {
			msg = "Server error ("+status+")";
		}
		$scope.errors = [{msg: msg}];
	}
}