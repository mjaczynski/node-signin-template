'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$routeParams', '$location', '$http',
    function($scope, $routeParams, $location, $http) {

        $scope.user = {};
        $scope.errors =[];
        $scope.success = false;

        $scope.submit = function() {
            var params = $location.search();
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