'use strict';

angular.module('users').controller('RegisterController', ['$scope', '$rootScope', '$routeParams', '$location', '$http',
    function($scope, $routeParams, $location, $http) {

        $scope.user = {};
        $scope.errors = [];

        $scope.submit = function() {
            $http.post('/users/util/register', {
                username: $scope.user.username,
                firstname : $scope.user.firstname,
                lastname : $scope.user.lastname,
                password: $scope.user.password,
                email : $scope.user.email
            }).success(function(response) {
                $scope.errors = [];
                $rootScope.user=$scope.user;
                $location.url('/');
            }).error(function(data, status, headers, config) {
                handleError($scope, data, status, headers, config);
            });
        };
    }
]);