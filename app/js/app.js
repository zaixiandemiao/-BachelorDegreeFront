'use strict';

/* App Module */

var routerApp = angular.module('routerApp', [
  'ngRoute',
  'ngAnimate',
  'angular-loading-bar',
    'ui.bootstrap',
  'mmsAnimations',

  'userPanelController',
  'sideBarDirective',
  'mmsFilters',
  'mmsServices'
]);

/**
 * 配置路由。
 */
routerApp.config(['$routeProvider', '$httpProvider', 
                  function($routeProvider, $httpProvider) {
    
//    $httpProvider.defaults.headers.common.Authorization ='Bearer ' + $window.sessionStorage.token;
//    $httpProvider.defaults.headers.post.withCredentials = true;
    
    //将auth拦截器 注入到$httpProvider, 使得每次向外请求时发送token
    $httpProvider.interceptors.push('authInterceptor');
    //实现跨域访问cookie
    
    $routeProvider
    .when('/index',{
        templateUrl : 'tpls/loginForm.html'    
    }).when('/userPanel', {
        templateUrl : 'tpls/userPanel.html'
    }).when('/signUp', {
        templateUrl : 'tpls/signUp.html'
    }).when('/lessons/:phoneId', {
        templateUrl : 'tpls/lessonDetail.html',
        controller : 'PhoneDetailCtrl'
    }).otherwise({
        redirectTo: '/index'
    });
    
}]);
