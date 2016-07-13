'use strict';

/* Controllers */

var userPanelController = angular.module('userPanelController', []);


/* Alert 控制器 */
userPanelController.controller('AlertCtr', function ($scope, $rootScope, $uibModal, $log) {
    $scope.alertMsg = $rootScope.alertMsg = '';

    $scope.animationsEnabled = true;

    $rootScope.open = function (size) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size
        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

userPanelController.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {


    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});


/* 登陆界面控制器 */
userPanelController.controller('logInController', ['$rootScope', '$scope', '$http', '$window', 'reqService', function ($rootScope, $scope, $http, $window, reqService) {
    //进入login界面，首先删除token
    delete $rootScope.token;

    $scope.user = {
        username: 'wangjialong',
        password: 'wangjialong'
    };
    $scope.message = '';
    $scope.submit = function () {



        reqService.logIn($scope.user)
            .success(function (data, status, headers, config) {
                //                console.log(data);
                $rootScope.token = data;
                console.log('token' + $rootScope.token);
                $window.location = '#/userPanel';
            })
            .error(function (data, status, headers, config) {
                // Erase the token if the user fails to log in
                delete $rootScope.token;

                // Handle login errors here
                $rootScope.alertMsg = '登陆失败，用户名或密码错误';
                $rootScope.open();
            });
    };
}]);

/* 注册界面控制器 */
userPanelController.controller('signUpCtr', ['$rootScope', '$scope','$window', 'reqService', function ($rootScope, $scope, $window, reqService) {

    $scope.user = {};

    $scope.submit = function () {
        reqService.register($scope.user)
            .success(function (data, status, headers, config) {
                //                console.log(data);
                var result = angular.fromJson(data);
                //add lesson success
                $rootScope.alertMsg = result.response_status.status;
                $rootScope.open();
                if(result.response_status.status_code == 1) {
                    $window.location = '#/index';
                }
            })
            .error(function (data, status, headers, config) {
                // Erase the token if the user fails to log in
                
            });
    };
}]);


/* 用户操作面板控制器 */
userPanelController.controller('btnPanelController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.isOpen = true;

    $scope.currentUrl = "tpls/addClass.html";

    $scope.setUrl = function (path, phone) {
        $scope.currentUrl = 'tpls/' + path;
        if (phone) {
            $rootScope.lesson = phone;
        }
    }
}]);

/* 添加课程控制器 */
userPanelController.controller('AddClassCtr', ['$rootScope', '$scope', 'reqService',
    function ($rootScope, $scope, reqService) {
        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[1];
        $scope.altInputFormats = ['M!/d!/yyyy'];
        $scope.popup1 = {
            opened: false
        };

        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        reqService.getOptions()
            .success(function (data, status, headers, config) {
                // add lesson success
                $scope.data = data;
            });

        console.log($scope.data);

        $scope.submit = function () {
            reqService.addLesson($scope.lesson)
                .success(function (data, status, headers, config) {
                    // add lesson success
                    var result = angular.fromJson(data);
                    //add lesson success
                    $rootScope.alertMsg = result.response_status.status;
                    $rootScope.open();
                })
                .error(function (data, status, headers, config) {
                    // add lesson failure
                    if (status === 401) {

                    }
                });
        };
}]);

/* 班级列表控制器 */
userPanelController.controller('lessonListCtr', ['$rootScope', '$scope', 'reqService',
    function ($rootScope, $scope, reqService) {
        $scope.lessons = [];
        $scope.loadList = function () {

            reqService.lessonList()
                .success(function (data, status, headers, config) {
                    // add lesson success
                    var result = angular.fromJson(data);
                    //add lesson success
                    if (result.response_status.status_code == 1) {
                        $scope.lessons = result.lessonList;
                        console.log('lesson list');
                    }
                })
                .error(function (data, status, headers, config) {

                });
        }

        $scope.loadList();
        $scope.orderProp = 'deadline';

        $scope.del_lesson_list = [];
        $scope.delNull = true;

        $scope.addDelList = function (id) {
            console.log('add del list');
            var flag = true;
            for (var i = 0; i < $scope.del_lesson_list.length; i++) {
                if ($scope.del_lesson_list[i] == id) {
                    $scope.del_lesson_list.splice(i, 1);
                    flag = false;
                }
            }
            if (flag)
                $scope.del_lesson_list.push(id);
            if ($scope.del_lesson_list.length > 0) {
                $scope.delNull = false;
            } else {
                $scope.delNull = true;
            }
            console.log($scope.del_lesson_list);
        }

        $scope.delLessons = function () {
            reqService.delLessonList({
                    'del_lesson_list': $scope.del_lesson_list
                })
                .success(function (data, status, headers, config) {
                    var result = angular.fromJson(data);
                    //add lesson success
                    $rootScope.alertMsg = result.response_status.status;
                    $rootScope.open();
                    $scope.loadList();
                })
                .error(function (data, status, headers, config) {

                });;
        }

    }
]);

/* 被删除的班级控制器 */
userPanelController.controller('deletedLessonCtr', ['$rootScope', '$scope', 'reqService',
    function ($rootScope, $scope, reqService) {
        $scope.lessons = [];
        $scope.loadList = function () {

            reqService.deletedLessonList()
                .success(function (data, status, headers, config) {
                    // add lesson success
                    var result = angular.fromJson(data);
                    //add lesson success
                    if (result.response_status.status_code == 1) {
                        $scope.lessons = result.lessonList;
                        console.log('lesson list');
                    }
                })
                .error(function (data, status, headers, config) {

                });
        }

        $scope.loadList();
        $scope.orderProp = 'deadline';

        $scope.del_lesson_list = [];
        $scope.delNull = true;

        $scope.addDelList = function (id) {
            console.log('add del list');
            var flag = true;
            for (var i = 0; i < $scope.del_lesson_list.length; i++) {
                if ($scope.del_lesson_list[i] == id) {
                    $scope.del_lesson_list.splice(i, 1);
                    flag = false;
                }
            }
            if (flag)
                $scope.del_lesson_list.push(id);
            if ($scope.del_lesson_list.length > 0) {
                $scope.delNull = false;
            } else {
                $scope.delNull = true;
            }
            console.log($scope.del_lesson_list);
        }

        $scope.delLessons = function () {
            reqService.recoverLessonList({
                    'del_lesson_list': $scope.del_lesson_list
                })
                .success(function (data, status, headers, config) {
                    var result = angular.fromJson(data);
                    //add lesson success
                    $rootScope.alertMsg = result.response_status.status;
                    $rootScope.open();
                    $scope.loadList();
                })
                .error(function (data, status, headers, config) {

                });;
        }

    }
]);


userPanelController.controller('LessonDetailCtrl', ['$scope', '$rootScope', 'reqService',
    function ($scope, $rootScope, reqService) {

        $scope.lesson = $rootScope.lesson;

        console.log($scope.lesson);

        function setDate() {
            var str = $scope.lesson.deadline;
            var arr = str.split('-');
            $scope.lesson.deadline = new Date(arr[0], arr[1]-1, arr[2]);
        }

        setDate();

        reqService.getOptions()
            .success(function (data, status, headers, config) {
                var result = angular.fromJson(data);
                //add lesson success
                $scope.data = result;
            })
            .error(function (data, status, headers, config) {

            });

        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            startingDay: 1
        };
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[1];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };


        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        $scope.submit = function () {
            console.log($scope.lesson.deadline);
            reqService.updateLesson($scope.lesson)
                .success(function (data, status, headers, config) {
                    // add lesson success
                    var result = angular.fromJson(data);
                    //add lesson success
                    $rootScope.alertMsg = result.response_status.status;
                    $rootScope.open();
                })
                .error(function (data, status, headers, config) {});
        }

    }
]);


userPanelController.controller('UserInfoCtrl', ['$scope', '$rootScope', 'reqService',
    function ($scope, $rootScope, reqService) {
        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            startingDay: 1
        };
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[2];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };


        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }


        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };

        $scope.user = {};

        reqService.userInfo()
            .success(function (data, status, headers, config) {
                var result = angular.fromJson(data);
                $scope.user = result.user_info;
            })
            .error(function (data, status, headers, config) {});

        $scope.submit = function () {
            reqService.userMofify($scope.user)
                .success(function (data, status, headers, config) {
                    // add lesson success
                    var result = angular.fromJson(data);
                    //add lesson success
                    $rootScope.alertMsg = result.response_status.status;
                    $rootScope.open();
                    delete $rootScope.token;
                })
                .error(function (data, status, headers, config) {});
        };
    }
]);


/* 报表列表控制器 */
userPanelController.controller('reportListCtr', ['$rootScope', '$scope', 'reqService',
    function ($rootScope, $scope, reqService) {
        $scope.lessons = [];
        reqService.getReportList()
            .success(function (data, status, headers, config) {
                // add lesson success
                var result = angular.fromJson(data);
                //add lesson success
                if (result.response_status.status_code == 1) {
                    $scope.lessons = result.report_list;
                    console.log('lesson list');
                }
            })
            .error(function (data, status, headers, config) {

            });

        $scope.orderProp = 'deadline';
    }
]);

/* 报表列表控制器 */
userPanelController.controller('reportInfoCtrl', ['$rootScope', '$scope', 'reqService',
    function ($rootScope, $scope, reqService) {
        $scope.lessons = [];
        reqService.getReportInfo({
                'lesson_id': $rootScope.lesson
            })
            .success(function (data, status, headers, config) {
                // add lesson success
                var result = angular.fromJson(data);
                //add lesson success
                if (result.response_status.status_code == 1) {
                    $scope.lessons = result.report_list;
                    console.log('lesson list');
                }
            })
            .error(function (data, status, headers, config) {

            });

        $scope.orderProp = 'deadline';
    }
]);

/* 添加正则表达式控制器 */
userPanelController.controller('AddOptionCtr', ['$rootScope', '$scope', 'reqService',
    function ($rootScope, $scope, reqService) {
        //特殊字符
        var specailChars = ['\\', '^', '$', '*', '+', '?', '{', '}', '.', '|'];
        //在字符串中的特殊字符前加\ 后返回
        function strNormalize(str) {
            var reStr = '';
            for (var i = 0; i < str.length; i++) {
                if (isSpecial(str.charAt(i))) {
                    reStr += '\\' + str.charAt(i);
                } else {
                    reStr += str.charAt(i);
                }
            }
            console.log('normalize' + reStr);
            return reStr;
        }

        function isSpecial(ch) {
            for (var i = 0; i < specailChars.length; i++) {
                if (ch === specailChars[i])
                    return true;
            }
            return false;
        }

        $scope.submit = function () {

            var pattern = '';
            for (var i = 0; i < $scope.panes.length; i++) {
                var pane = $scope.panes[i];
                if (pane.m1)
                    pattern += pane.m1;
                if (pane.m2)
                    pattern += '{' + pane.m2 + '}';
                if (pane.m3)
                    pattern += strNormalize(pane.m3);
            }
            console.log(pattern);
            $scope.addoption.pattern_info = '';
            if ($scope.addoption.pattern_type_id == 1 || $scope.addoption.pattern_type_id == 2)
                $scope.addoption.pattern_info += '^';
            $scope.addoption.pattern_info += pattern;

            if ($scope.addoption.pattern_type_id == 1 || $scope.addoption.pattern_type_id == 3)
                $scope.addoption.pattern_info += '$';

            reqService.addOption($scope.addoption)
                .success(function (data, status, headers, config) {
                    // add lesson success
                    var result = angular.fromJson(data);
                    $rootScope.alertMsg = result.response_status.status;
                    $rootScope.open();
                })
                .error(function (data, status, headers, config) {

                });

        }

}]);