'use strict';

angular.module('users').controller('LoginController', ['$scope', '$rootScope', '$location', '$http', '$state',
    function($scope, $rootScope, $location, $http, $state) {

        $scope.user = {};

        $scope.errors = [];

        $scope.submit = function() {
            $http.post('/users/util/login', {
                username: $scope.user.username,
                password: $scope.user.password
            }).success(function(data) {
                $scope.errors = [];
                $rootScope.user = data;
                $state.go('main');
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