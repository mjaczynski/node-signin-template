'use strict';

angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.state('login', { 
			url :'/login', 
			templateUrl: 'users/views/login.html'
		}).state('register', {
			url :'/register',
			templateUrl: 'users/views/register.html'
		}).state('profile', { 
			url :'/profile', 
			templateUrl: 'users/views/profile.html'
		}).state('sendreset', { 
			url :'/sendreset', 
			templateUrl: 'users/views/sendreset.html'
		}).state('reset', { 
			url :'/reset/:key', 
			templateUrl: 'users/views/reset.html'
		}).state('sendusername', { 
			url :'/sendusername', 
			templateUrl: 'users/views/sendusername.html'
		}).state('changepassword',{ 
			url :'/changepassword', 
			templateUrl: 'users/views/changepassword.html'
		});
	}
]); 