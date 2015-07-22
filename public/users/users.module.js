
'use strict';

angular.module('users', [])
    .directive('matchValidator', function() {
        return {
            require: 'ngModel',
            link : function(scope, element, attrs, ngModel) {
                scope.$watch(function() {
                    return scope.$eval(attrs.matchValidator) === ngModel.$modelValue;
                }, function(currentValue) {
                    ngModel.$setValidity('match', currentValue);
                });
            }
        }
    })
    .directive('passwordCharactersValidator', function() {
        var PASSWORD_FORMATS = [
            /[^\w\s]+/, //special characters
            /[A-Z]+/, //uppercase letters
            /\w+/, //other letters
            /\d+/ //numbers
        ];

        return {
            require: 'ngModel',
            link : function(scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function(value) {
                    var status = true;
                    angular.forEach(PASSWORD_FORMATS, function(regex) {
                        status = status && regex.test(value);
                    });
                    ngModel.$setValidity('password-characters', status);
                    return value;
                });
            }
        }
    }).directive('usernameValidator', function($http, $q) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.username = function(modelValue, viewValue) {
                return $http({
                    method: 'GET',
                    url: '/users/util/validate',
                    params: {username: viewValue}
                }).then(
                    function(response) {
                        if (!response.status===200) {
                            return $q.reject();
                        }
                        return true;
                    }
                );
            };
        }
    };
});