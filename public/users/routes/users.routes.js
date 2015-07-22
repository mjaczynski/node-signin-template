'use strict';

angular.module('users').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.when('/login', {
			templateUrl: 'users/views/login.html'
		}).when('/register', {
			templateUrl: 'users/views/register.html'
		}).when('/profile', {
			templateUrl: 'users/views/profile.html'
		}).when('/sendreset', {
			templateUrl: 'users/views/sendreset.html'
		}).when('/reset', {
			templateUrl: 'users/views/reset.html'
		}).when('/sendusername', {
			templateUrl: 'users/views/sendusername.html'
		}).when('/changepassword', {
			templateUrl: 'users/views/changepassword.html'
		});
	}
]); 