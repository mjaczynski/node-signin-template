'use strict';

angular.module('users').controller('ProfileController', ['$scope', '$rootScope', '$location', '$http', 'Profile',
    function($scope, $rootScope, $location, $http, Profile) {

        $scope.user = {};
        $scope.errors = [];
        $scope.initialized=false;

        Profile.get().then(function (profile){
            console.log(profile.data);
            $scope.user=profile.data;
            $scope.user.cemail=$scope.user.email;
            $scope.initialized=true;
        });

        $scope.submit = function() {
            $http.post('/users/me/profile', {
                firstname : $scope.user.firstname,
                lastname : $scope.user.lastname,
                email : $scope.user.email$
            }).success(function(response) {
                $scope.errors = [];
                $rootScope.user = $scope.user;
            }).error(function(error) {
                $scope.errors = error;
            });
        };
    }
]);