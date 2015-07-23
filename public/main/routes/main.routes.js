'use strict';

angular.module('main').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.state('main', { 
			url :'/', 
			templateUrl: 'main/views/main.html'
		});
	}
]); 