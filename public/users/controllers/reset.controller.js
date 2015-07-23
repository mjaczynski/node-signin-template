'use strict';

angular.module('users').controller('ResetController', ['$scope', '$location', '$http', '$stateParams',
    function($scope, $location, $http, $stateParams) {

        console.log("ResetController initialized");
        $scope.user = {};
        $scope.errors =[];
        $scope.success = false;

        $scope.submit = function() {
            $http.post('/users/util/reset', {
                password: $scope.user.password,
                key : $stateParams.key
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