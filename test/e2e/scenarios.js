'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('App', function () {

    it('should redirect index.html to index.html#/phones', function () {
        browser.get('app/index.html');
        browser.getLocationAbsUrl().then(function (url) {
            expect(url).toEqual('/index');
        });
    });

    describe('log in view', function () {
        beforeEach(function () {
            browser.get('app/#/index');
        });

        it('should valid user inputs', function () {
            var email = element(by.model('userInfo.email'));

            email.sendKeys('wangjialong@126')
            expect(element.all(by.css('.glyphicon.glyphicon-ok.form-control-feedback')).first().isDisplayed()).toEqual(false);
            
            email.clear();
            
            email.sendKeys('wangjialong@126.com');
            expect(element.all(by.css('.glyphicon.glyphicon-ok.form-control-feedback')).first().isDisplayed()).toEqual(true);


            var pwd = element(by.model('userInfo.userPassword'));
            
            pwd.sendKeys('123');
            expect(element.all(by.css('.glyphicon.glyphicon-ok.form-control-feedback')).last().isDisplayed()).toEqual(false);

            pwd.clear();
            
            pwd.sendKeys('1234556');
            expect(element.all(by.css('.glyphicon.glyphicon-ok.form-control-feedback')).last().isDisplayed()).toEqual(true);



        });


        it('should render userPanel', function () {
            element(by.id('loginBtn')).click();

            browser.getLocationAbsUrl().then(function (url) {
                expect(url).toEqual('/userPanel');
            });
        });
        it('should render signUp view', function () {
            element(by.id('signUpBtn')).click();

            browser.getLocationAbsUrl().then(function (url) {
                expect(url).toEqual('/signUp');
            });
        });
    });

    describe('userPanel view', function () {
        beforeEach(function () {
            browser.get('app/#/userPanel');
        });

        it('should render log in view', function () {
            element(by.linkText('返回登陆页面')).click();

            browser.getLocationAbsUrl().then(function (url) {
                expect(url).toEqual('/index');
            });
        });

        it('should render related ngInclude', function () {
            var links = element.all(by.css('.menu .link'));

            links.get(0).click();

            expect(element(by.css('#innerPanel > div')).getAttribute('ng-controller')).toEqual('AddClassCtr');

            links.get(1).click();
            expect(element(by.css('#innerPanel > div')).getAttribute('ng-controller')).toEqual('lessonListCtr');

            links.get(2).click();
            expect(element(by.css('#innerPanel > div')).getAttribute('ng-controller')).toEqual('lessonListCtr');
        });

    });

    // 列表页面测试
    describe('lesson list view ', function () {
        beforeEach(function () {
            browser.get('app/#/userPanel');
            var links = element.all(by.css('.menu .link'));
            links.get(1).click();
        });

        it('should filter the lesson list as user input', function () {
            var phoneList = element.all(by.repeater('phone in phones'));
            var query = element(by.model('query'));

            //测试：列表页目前应该展示了20个手机
            expect(phoneList.count()).toBe(20);

            //测试：模拟输入nexus，列表页应该剩下1个手机信息
            query.sendKeys('nexus');
            expect(phoneList.count()).toBe(1);

            query.clear();
            query.sendKeys('motorola');
            expect(phoneList.count()).toBe(8);
        });

        it('should be possible to control phone order', function () {
            var phoneNameColumn = element.all(by.repeater('phone in phones').column('phone.name'));
            
            expect(phoneNameColumn.count()).toBe(20);
            
            var query = element(by.model('query'));

            function getNames() {
                return phoneNameColumn.map(function (elm) {
                    return elm.getText();
                });
            }

            query.sendKeys('tablet'); //let's narrow the dataset to make the test assertions shorter

            expect(getNames()).toEqual([
                "Motorola XOOM\u2122 with Wi-Fi",
                "MOTOROLA XOOM\u2122"
            ]);

            element(by.css('#orderProp > option[value="name"]')).click();

            expect(getNames()).toEqual([
                "MOTOROLA XOOM\u2122",
                "Motorola XOOM\u2122 with Wi-Fi"
            ]);
        });
    });
    
    //测试详情页面
    describe('lesson detail view', function() {
        beforeEach(function() {
            browser.get('app/#/userPanel');
            var links = element.all(by.css('.menu .link'));
            links.get(1).click();
            
            var query = element(by.model('query'));

            //测试：模拟输入nexus，列表页应该剩下1个手机信息
            query.sendKeys('nexus');
            
            var phones = element.all(by.css('.phones > .phone-listing > .btn-link'));
            phones.get(0).click();
        });

        it('should display nexus-s page', function() {
            expect(element(by.binding('phone.name')).getText()).toBe('Nexus S');
        });

        it('should display the first phone image as the main phone image', function() {
            expect(element(by.css('img.phone.active')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
        });

        it('should swap main image if a thumbnail image is clicked on', function() {
            element(by.css('.phone-thumbs li:nth-child(3) img')).click();
            expect(element(by.css('img.phone.active')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.2.jpg/);
            
            element(by.css('.phone-thumbs li:nth-child(2) img')).click();
            expect(element(by.css('img.phone.active')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.1.jpg/);
            
            element(by.css('.phone-thumbs li:nth-child(1) img')).click();
            expect(element(by.css('img.phone.active')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
        });
        
        //你自己去补充其它的测试...
    });

    describe('sign up view', function () {
        beforeEach(function () {
            browser.get('app/#/signUp');
        });

        it('should valid user inputs', function () {
            var email = element(by.model('userInfo.email'));
            
            email.sendKeys('wangjialong@126')
            expect(element.all(by.css('.glyphicon.glyphicon-ok.form-control-feedback')).first().isDisplayed()).toEqual(false);

            email.clear();

            email.sendKeys('wangjialong@126.com');
            expect(element.all(by.css('.glyphicon.glyphicon-ok.form-control-feedback')).first().isDisplayed()).toEqual(true);


            var pwd = element(by.model('userInfo.userPassword'));

            pwd.sendKeys('123');
            expect(element.all(by.css('.glyphicon.glyphicon-ok.form-control-feedback')).get(1).isDisplayed()).toEqual(false);

            pwd.clear();
            pwd.sendKeys('123456');
            expect(element.all(by.css('.glyphicon.glyphicon-ok.form-control-feedback')).get(1).isDisplayed()).toEqual(true);


            var confirmPwd = element(by.model('userInfo.confirmPassword'));

            confirmPwd.sendKeys('123');
            expect(element.all(by.css('.glyphicon.glyphicon-ok.form-control-feedback')).last().isDisplayed()).toEqual(false);

            confirmPwd.clear();
            confirmPwd.sendKeys('12345566');
            expect(element.all(by.css('.glyphicon.glyphicon-ok.form-control-feedback')).last().isDisplayed()).toEqual(false);

            confirmPwd.clear();
            confirmPwd.sendKeys('123456');
            expect(element.all(by.css('.glyphicon.glyphicon-ok.form-control-feedback')).last().isDisplayed()).toEqual(true);

        });

    });

});