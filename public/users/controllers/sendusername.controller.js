'use strict';

angular.module('users').controller('SendUsernameController', ['$scope', '$location', '$http',
    function($scope, $location, $http) {

        $scope.user = {};
        $scope.errors = [];
        $scope.success= false;

        $scope.submit = function() {
            $http.post('/users/util/sendusername', {
                email: $scope.user.email,
            }).success(function(response) {
                $scope.errors = [];
                $scope.success=true;
            }).error(function(data, status, headers, config) {
                $scope.user = {};
                $scope.success = false;
                handleError($scope, data, status, headers, config);
                $scope.form.$setPristine();
                $scope.form.$setUntouched();
            });
        };
    }
]);