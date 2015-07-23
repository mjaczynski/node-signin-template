'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http',
    function($scope,  $http) {

        $scope.user = {};
        $scope.errors =[];
        $scope.success = false;

        $scope.submit = function() {
            $http.post('/users/me/password', {
                oldpassword: $scope.user.oldpassword,
                password: $scope.user.password,
            }).success(function(response) {
                $scope.errors = [];
                $scope.user = {};
                $scope.success = true;
                $scope.form.$setPristine();
                $scope.form.$setUntouched();
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