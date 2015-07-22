'use strict';

angular.module('users').controller('LoginController', ['$scope', '$rootScope', '$routeParams', '$location', '$http',
    function($scope, $rootScope, $routeParams, $location, $http) {

        $scope.user = {};

        $scope.errors = [];

        $scope.submit = function() {
            $http.post('/users/util/login', {
                username: $scope.user.username,
                password: $scope.user.password
            }).success(function(data) {
                $scope.errors = [];
                $rootScope.user = data;
                $location.url('/');
            }).error(function(data, status, headers, config) {
                if (status==401){
                    $scope.errors = [{
                        msg: 'Username or password invalid, please retry'
                    }]
                } else {
                    handleError($scope, data, status, headers, config);
                }
                $scope.user = {};
                $scope.form.$setPristine();
                $scope.form.$setUntouched();
            })
        };
    }
]);