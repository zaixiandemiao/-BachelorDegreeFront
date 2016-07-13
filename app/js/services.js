'use strict';

/* Services */

var mmsServices = angular.module('mmsServices', ['ngResource']);

mmsServices.factory('Phone', ['$resource',
  function ($resource) {
        return $resource('phones/:phoneId.json', {}, {
            query: {
                method: 'GET',
                params: {
                    phoneId: 'phones'
                },
                isArray: true
            }
        });
  }]);

mmsServices.factory('reqService', ['$http', '$rootScope',
   function ($http, $rootScope) {
        var baseUrl = "http://localhost:8080/mms/";
        var doRequest = function (u, param) {
            return $http.post(baseUrl + u, param);
        };
        return {
            logIn: function (user) {
                return doRequest('authentication/login', user);
            },
            register: function(user) {
                return doRequest('authentication/register', user);  
            },
            addLesson: function (lesson) {
                return doRequest('secured/user/add_lesson', lesson);
            },
            updateLesson: function(lesson) {
                return doRequest('secured/user/modify_lesson', lesson);    
            },
            userInfo: function () {
                return doRequest('secured/user/get_user_info');
            },
            userMofify: function (user) {
                return doRequest('secured/user/modify', user);
            },
            lessonList: function () {
                return doRequest('secured/user/get_lesson_list');
            },
            deletedLessonList: function() {
                return doRequest('secured/user/deleted_lesson_list');
            },
            recoverLessonList: function(lessonList) {
                return doRequest('secured/user/recover_lesson_list', lessonList); 
            },
            delLessonList: function (lessonList) {
                return doRequest('secured/user/del_lesson_list', lessonList);
            },
            getOptions: function() {
                return doRequest('secured/user/get_options');
            },
            addOption: function(options) {
                return doRequest('secured/user/add_options', options);  
            },
            getReportList: function() {
                return doRequest('secured/user/get_report_list');
            },
            getReportInfo: function(lesson) {
                return doRequest('secured/user/get_report_info', lesson);
            }
        };
   }
]);


mmsServices.factory('authInterceptor', function ($rootScope, $q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            config.headers['accept'] = 'application/json';
            config.headers['Content-Type'] = 'application/json';
            if ($rootScope.token) {
                config.headers['Authorization'] = 'Bearer ' + $rootScope.token;
            }
            return config;
        },
        response: function (response) {
            return response || $q.when(response);
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                $rootScope.alertMsg = '登陆信息过期';
                $rootScope.open();
                $window.location = '#/index';
            }
            return $q.reject(rejection);
        }
    };
});