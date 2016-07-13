'use strict';

/* Directives */
angular
    .module('sideBarDirective', [])
    .directive('sidebar', sidebar)
    .directive('sidebarLink', sidebarLink)
    .directive('sidebarItem', sidebarItem)
    .directive('sidebarItemGroup', sidebarItemGroup)
    .directive('pwCheck', pwCheck)
    .directive('patternTabs', patternTabs)
    .directive('patternPane', patternPane);

function sidebar() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div class="ui inverted left vertical sidebar menu {{width}}" ' +
            'ng-transclude></div>',
        scope: {
            width: '@'
        }
    };
}

function sidebarItemGroup() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div class="item">' +
            '<div class="ui small inverted header">{{ title }}</div>' +
            '<div class="menu" ng-transclude></div>' +
            '</div>',
        scope: {
            title: '@'
        }
    };
}

function sidebarItem() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div class="item" ng-transclude></div>'
    };
}

function sidebarLink() {
    return {
        restrict: 'E',
        replace: true,
        template: '<a class="item" href="{{ href }}" ngClick = {{ngClick}}>' +
            '<span class="{{ icon }}" style="float: right;"></span>' +
            '{{ title }}' +
            '</a>',
        scope: {
            title: '@',
            icon: '@',
            href: '@'
        }
    };
}

/* 确认两次密码输入一致*/
function pwCheck() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val() === jQuery(firstPassword).val();
                    ctrl.$setValidity('pwmatch', v);
                });
            });
        }
    };
}

function patternTabs() {
    return {
        restrict: 'E',
        scope: {
            panes: '='
        },
        transclude: true,
        controller: function ($scope) {

            var panes = $scope.panes = [];

            $scope.addPane = function (isText) {
                var pane = {};
                pane.isText = isText;
                panes.push(pane);
                
                console.log(panes);
            }

            this.addPane = $scope.addPane;

        },
        template: '<div class="pattern-tabs"><div ng-transclude></div><pattern-pane ng-repeat="pane in panes" istext="{{pane.isText}}" model1="pane.m1" model2="pane.m2" model3="pane.m3"></pattern-pane><button class="btn btn-default btn-sm" ng-click="addPane(true)">添加特定字符串</button><button class="btn btn-default btn-sm" ng-click="addPane(false)">添加新匹配</button></div>'
    }
}

function patternPane() {
    return {
        restrict: 'E',
        require: '^patternTabs',
        scope:{
            istext: '@',
            model1: '=',
            model2: '=',
            model3: '=',
        },
        link: function (scope, elem, attrs, ctrl) {
            console.log(scope);
        },
        template: '<div ng-show="!{{istext}}" class="pattern-pane">                                     <input type="number" class="form-control" ng-model="model2">位                                       <select name="" id="" class="form-control" ng-model="model1">                                           <option value="[a-zA-Z]">字母</option>                                           <option value="[0-9]">数字</option>                                           <option value="[]">汉字</option>                                       </select></div><div ng-show="{{istext}}" class="pattern-pane">                   <input type="text"  class="form-control" ng-model="model3"></div>'
    }
}