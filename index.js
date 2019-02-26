window.cj = {
    support: false, // 是否支持自定义
    canUse: function(funcName){ // 方法是否可用
        return false
    }
};
(function () {
    if (window && (window.CrawlerJS || window.WebAppJS)) {
        window.CrawlerJS = window.CrawlerJS || window.WebAppJS;
        var cj = {
            support: true
        };

        // 打印日志
        var log = window.debug || window.console.log


        var ua = navigator.userAgent.toLowerCase();

        // 是否使用 WkWebview
        var useWkWebview = /wkwebview/.test(ua)
            && window.webkit
            && window.webkit.messageHandlers
            && window.webkit.messageHandlers.CrawlerJSCall;

        // 初始化 接口列表
        var wkApiList = '';
        if(useWkWebview){
            CrawlerJsBridge("init", {
                success: function(res){
                    wkApiList = res;
                    console.log(wkApiList);
                }
            })
        }
        /**
         * 爬虫JS桥
         * @param method
         * @param cfg
         * @constructor
         */
        function CrawlerJsBridge(method, cfg){
            if(useWkWebview){
                var message = {
                    "method": method,
                    "data": cfg
                }
                window.webkit.messageHandlers.CrawlerJSCall.postMessage(message);
            }
            else{
                if(CrawlerJS[method]){
                    if(cfg){
                        return CrawlerJS[method](jsonToStr(cfg));
                    }
                    else{
                        return CrawlerJS[method]();
                    }
                }
            }
            return null;
        }

        /**
         *  执行方法
         * @param method
         * @param config
         */
        function handler(method, config ) {
            if (config) {
                var successCallback = config.success || function () {
                    console.log(method + ' success');
                }
                var failCallbak = config.fail || function () {
                    console.log(method + ' error');
                }
                var callbackKey = 'after' + method.substring(0, 1).toUpperCase() + method.substring(1)
                window[callbackKey] = function (resText) {
                    var res = strToJson(resText);
                    if (toBoolean(res.success)) {
                        successCallback(res.data);
                    }
                    else {
                        failCallbak(res.msg);
                    }
                };
                delete config.success;
                delete config.fail;
                config.callback = callbackKey;
            }
            CrawlerJsBridge(method, config);
        };

        /**
         * 转成JSON
         * @param str
         * @returns {null}
         */
        function strToJson(str) {
            if (!str) {
                return null;
            }
            if (typeof str === 'string'){
                try {
                    return JSON.parse(str);
                }
                catch (e) {
                    log('strToJson:' + str)
                }
            }

            return str;
        }

        /**
         * JSON 转 String
         * @param json
         */
        function jsonToStr(json) {
            return JSON.stringify(json);
        }

        /**
         * 转Boolean
         * @param text
         * @returns {boolean}
         */
        function toBoolean(text) {
            if (text === true || text === 'true' || text === 1 || text === '1') {
                return true
            }
            return false;
        }

        /**
         * 转rgba
         * @param value
         * @returns {*}
         */
        function toRgba(value) {
            var sColor = value.toLowerCase().replace(/\s/g, '');
            //十六进制颜色值的正则表达式
            var hexReg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            var rgbReg = /^rgb\(\d+,\d+,\d+\)$/
            // 如果是16进制颜色
            if (sColor && hexReg.test(sColor)) {
                if (sColor.length === 4) {
                    var sColorNew = "#";
                    for (var i = 1; i < 4; i += 1) {
                        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                    }
                    sColor = sColorNew;
                }
                //处理六位的颜色值
                var sColorChange = [];
                for (var i = 1; i < 7; i += 2) {
                    sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                }
                return "rgba(" + sColorChange.join(",") + ",1)";
            }
            else if (sColor && rgbReg.test(sColor)) {
                return "rgba(" + sColor.replace('rgb(', '').replace(')', '') + ",1)";
            }

            return sColor;
        }

        /**
         * 登录
         */
        cj.login = function (config) {
            // 成功回调
            var successCallback = config.success || function () {
                console.log('login success');
            }

            // 失败回调
            var failCallbak = config.fail || function () {
                console.log('login error');
            }
            window.afterLogin = function (resText) {
                if(typeof resText === 'undefined'){
                    successCallback();
                }
                else{
                    var res = strToJson(resText);
                    if (toBoolean(res.success)) {
                        successCallback(res.data)
                    }
                    else {
                        failCallbak(res.msg)
                    }
                }

            };
            delete config.success;
            delete config.fail;
            config.callback = 'afterLogin';
            CrawlerJsBridge('login', config);
        };


        /**
         * 获取登录数据
         */
        cj.getLoginData = function (config) {
            // 成功回调
            var successCallback = config.success || function () {
                console.log('get login data success');
            }

            // 失败回调
            var failCallbak = config.fail || function () {
                console.log('get login data error');
            }
            window.afterGetLoginData = function (resText) {
                var res = strToJson(resText);
                if (toBoolean(res.success)) {
                    successCallback(res.data)
                }
                else {
                    failCallbak(res.msg)
                }
            };
            delete config.success;
            delete config.fail;
            config.callback = 'afterGetLoginData';
            CrawlerJsBridge('getLoginData', config);
        };

        /**
         * 获取Token
         */
        cj.getToken = function (config) {
            // 同步返回
            if(typeof config === 'undefined'){
                var resText = CrawlerJsBridge('getToken');
                return strToJson(resText);
            }

            /*** 异步返回 ***/
            // 成功回调
            var successCallback = config.success || function () {
                console.log('get token success');
            }

            // 失败回调
            var failCallbak = config.fail || function () {
                console.log('get token error');
            }
            window.afterGetToken = function (resText) {
                var res = strToJson(resText);
                if (toBoolean(res.success)) {
                    successCallback(res.data)
                }
                else {
                    failCallbak(res.msg)
                }
            };
            delete config.success;
            delete config.fail;
            config.callback = 'afterGetToken';
            CrawlerJsBridge('getToken', config);
        };

        /**
         * 刷新Token
         */
        cj.refreshToken = function (config) {
            // 成功回调
            var successCallback = config.success || function () {
                console.log('refresh token success');
            }

            // 失败回调
            var failCallbak = config.fail || function () {
                console.log('refresh token error');
            }
            window.afterRefreshToken = function (resText) {
                var res = strToJson(resText);
                if (toBoolean(res.success)) {
                    successCallback(res.data)
                }
                else {
                    failCallbak(res.msg)
                }
            };
            delete config.success;
            delete config.fail;
            config.callback = 'afterRefreshToken';
            CrawlerJsBridge('refreshToken', config);
        };

        /**
         * 选择分享
         * @param config
         */
        cj.chooseShare = function (config) {
            // 成功回调
            var successCallback = config.success || function () {
                console.log('share success');
            }
            // 失败回调
            var failCallbak = config.fail || function () {
                console.log('share error');
            }
            window.afterChooseShare = function (resText) {
                var response = strToJson(resText);
                if (toBoolean(response.success)) {
                    successCallback()
                }
                else {
                    failCallbak(res.msg)
                }
            };
            delete config.success;
            delete config.fail;
            config.callback = 'afterChooseShare';
            CrawlerJsBridge('chooseShare', config);
        }

        /**
         * 分享到指定平台
         * @param config
         */
        cj.share = function (config) {
            // 成功回调
            var successCallback = config.success || function () {
                console.log('share success');
            }
            // 失败回调
            var failCallbak = config.fail || function () {
                console.log('share error');
            }
            window.afterShare = function (resText) {
                var res = strToJson(resText);
                if (toBoolean(res.success)) {
                    successCallback()
                }
                else {
                    failCallbak(res.msg)
                }
            };
            delete config.success;
            delete config.fail;
            config.callback = 'afterShare';
            CrawlerJsBridge('share', config);
        };

        /**
         * 选择支付
         * @param config
         */
        cj.choosePay = function (config) {
            // 成功回调
            var successCallback = config.success || function () {
                console.log('choose pay success');
            }

            // 失败回调
            var failCallbak = config.fail || function () {
                console.log('choose pay error');
            }
            window.afterChoosePay = function (resText) {
                var res = strToJson(resText);
                if (toBoolean(res.success)) {
                    successCallback()
                }
                else {
                    failCallbak(res.msg)
                }
            };
            delete config.success;
            delete config.fail;
            config.callback = 'afterChoosePay';
            CrawlerJsBridge('choosePay', config);
        };

        /**
         * 指定平台支付
         * @param config
         */
        cj.pay = function (config) {
            // 成功回调
            var successCallback = config.success || function () {
                console.log('pay success');
            }
            // 失败回调
            var failCallbak = config.fail || function () {
                console.log('pay error');
            }
            window.afterPay = function (resText) {
                var res = strToJson(resText);
                if (toBoolean(res.success)) {
                    successCallback()
                }
                else {
                    failCallbak(res.msg)
                }
            };
            delete config.success;
            delete config.fail;
            config.callback = 'afterPay';
            CrawlerJsBridge('pay', config);
        };

        /**
         * 选择文件并上传
         * @param config
         */
        cj.chooseUpload = function (config) {
            // 成功回调
            var successCallback = config.success || function () {
                console.log('upload success');
            }

            // 失败回调
            var failCallbak = config.fail || function () {
                console.log('upload error');
            }

            window.afterUpload = function (resText) {
                var res = strToJson(resText);
                if (toBoolean(res.success)) {
                    successCallback(res.data)
                }
                else {
                    failCallbak(res.msg)
                }
            };
            delete config.success;
            delete config.fail;
            config.callback = 'afterUpload';
            CrawlerJsBridge('chooseUpload', config);
        }

        /**
         * 选择文件
         * @param config
         */
        cj.chooseFile = function (config) {
            // 成功回调
            var successCallback = config.success || function () {
                console.log('choose file success');
            }

            // 失败回调
            var failCallbak = config.fail || function () {
                console.log('choose file error');
            }

            window.afterChooseFile = function (resText) {
                var res = strToJson(resText);
                if (toBoolean(res.success)) {
                    successCallback(res.data)
                }
                else {
                    failCallbak(res.msg)
                }
            };
            delete config.success;
            delete config.fail;
            config.callback = 'afterChooseFile';

            CrawlerJsBridge('chooseFile', config);
        };

        /**
         * 日期选择
         * @param config
         */
        cj.datePicker = function (config) {
            var confirmCallback = config.confirm || function () {
                console.log('after datetime select');
            }

            window.afterDateSelect = function (resText) {
                var res = strToJson(resText);
                if (toBoolean(res.success)) {
                    confirmCallback(res.data)
                }
            };

            delete config.confirm;
            config.callback = 'afterDateSelect';
            if (config.color) {
                config.color = toRgba(config.color);
            }
            CrawlerJsBridge('datePicker', config);
        };

        /**
         * 时间选择
         * @param config
         */
        cj.datetimePicker = function (config) {
            var confirmCallback = config.confirm || function () {
                console.log('after datetime select');
            }
            window.afterDateTimeSelect = function (resText) {
                var res = strToJson(resText);
                if (toBoolean(res.success)) {
                    confirmCallback(res.data)
                }
            };

            delete config.confirm;
            config.callback = 'afterDateTimeSelect';
            if (config.color) {
                config.color = toRgba(config.color);
            }
            CrawlerJsBridge('datetimePicker', config);
        };

        /**
         * 区域选择
         * @param config
         */
        cj.regionPicker = function (config) {
            var confirmCallback = config.confirm || function () {
                console.log('after datetime select');
            }
            window.afterRegionSelect = function (resText) {
                var res = strToJson(resText);
                if (toBoolean(res.success)) {
                    confirmCallback(res.data)
                }
            };

            delete config.confirm;
            config.callback = 'afterRegionSelect';
            if (config.color) {
                config.color = toRgba(config.color);
            }
            CrawlerJsBridge('regionPicker', config);
        };

        /**
         * 通用picker
         * @param config
         */
        cj.picker = function (config) {
            var confirmCallback = config.confirm || function () {
                console.log('after picker select');
            }
            window.afterPickerSelect = function (resText) {
                var res = strToJson(resText);
                if (toBoolean(res.success)) {
                    confirmCallback(res.data)
                }
            };
            delete config.confirm;
            config.callback = 'afterPickerSelect';
            if (config.color) {
                config.color = toRgba(config.color);
            }
            CrawlerJsBridge('picker', config);
        };

        /**
         * 联动picker
         * @param config
         */
        cj.linkagePicker = function (config) {
            var confirmCallback = config.confirm || function () {
                console.log('after linkage select');
            }
            window.afterLinkagePickerSelect = function (resText) {
                var res = strToJson(resText);
                if (toBoolean(res.success)) {
                    confirmCallback(res.data)
                }
            };
            delete config.confirm;
            config.callback = 'afterLinkagePickerSelect';
            if (config.color) {
                config.color = toRgba(config.color);
            }
            CrawlerJsBridge('linkagePicker', config);
        };

        /**
         * 获取定位
         * @param config
         */
        cj.getLocation = function (config) {
            var successCallback = config.success || function () {
                console.log('location success');
            }
            // 失败回调
            var failCallbak = config.fail || function () {
                console.log('location error');
            }

            window.afterGetLocation = function (resText) {
                var res = strToJson(resText);
                if (toBoolean(res.success)) {
                    successCallback(res.data)
                }
                else {
                    failCallbak(res.msg)
                }
            };

            delete config.success;
            delete config.fail;
            config.callback = 'afterGetLocation';
            CrawlerJsBridge('getLocation', config);
        };

        /**
         * 扫二维码
         * @param config
         */
        cj.scanQRCode = function (config) {
            var successCallback = config.success || function () {
                console.log('scanQRcode success');
            }
            var failCallbak = config.fail || function () {
                console.log('scanQRcode error');
            }
            window.afterScan = function (resText) {
                var res = strToJson(resText);
                if (toBoolean(res.success)) {
                    successCallback(res.text || res.data);
                }
                else {
                    failCallbak(res.msg);
                }
            };
            delete config.success;
            delete config.fail;
            config.callback = 'afterScan';
            CrawlerJsBridge('scanQRCode', config);
        };

        /**
         * 设置剪切板数据
         * @param config
         */
        cj.setClipboardData = function (config) {
            var successCallback = config.success || function () {
                console.log('setClipboardData success');
            }
            var failCallbak = config.fail || function () {
                console.log('setClipboardData error');
            }
            window.afterSetClipboardData = function (resText) {
                var res = strToJson(resText);
                if (toBoolean(res.success)) {
                    successCallback();
                }
                else {
                    failCallbak(res.msg);
                }
            };
            delete config.success;
            delete config.fail;
            config.callback = 'afterSetClipboardData';
            CrawlerJsBridge('setClipboardData', config);
        };

        /**
         * 获取剪切板数据
         * @param config
         */
        cj.getClipboardData = function (config) {
            var successCallback = config.success || function () {
                console.log('setClipboardData success');
            }
            var failCallbak = config.fail || function () {
                console.log('setClipboardData error');
            }

            window.afterGetClipboardData = function (resText) {
                var res = strToJson(resText);
                if (res.success) {
                    successCallback(res.data);
                }
                else {
                    failCallbak(res.msg);
                }
            };
            delete config.success;
            delete config.fail;
            config.callback = 'afterGetClipboardData';
            CrawlerJsBridge('getClipboardData', config);
        };

        /**
         * 拨打电话
         * @param config
         */
        cj.makePhoneCall = function (config) {
            handler('makePhoneCall', config);
        };

        /**
         * 统计未读消息数量
         * @param config
         */
        cj.countUnreadMessage = function(config){
            handler('countUnreadMessage', config);
        };

        /**
         * 获取消息列表
         * @param config
         */
        cj.getMsgList = function(config) {
            handler('getMsgList', config);
        };

        /**
         * 阅读消息
         * @param config
         */
        cj.readMsg = function(config) {
            handler('readMsg', config);
        };

        /**
         * 更新消息
         * @param config
         */
        cj.updateMsg = function(config) {
            handler('updateMsg', config);
        };

        /**
         *  移除消息
         * @param config
         */
        cj.removeMsg = function(config) {
            handler('removeMsg', config);
        };

        /**
         * 跳转到消息管理
         */
        cj.navigateToMessage = function(){
            handler('navigateToMessage');
        };

        /**
         * 跳转到原生界面
         */
        cj.navigateToActivity = function(config){
            handler('navigateToActivity', config);
        };

        /**
         * 打开新webview
         * @param url
         */
        cj.open = function(config) {
            handler('open', config);
        };

        /**
         * 聊天
         * @param config
         */
        cj.chat = function(config) {
            handler('chat', config);
        }

        /**
         * 设置状态栏
         */
        cj.setStatusBar = function(config){
            if(config.color){
                if(typeof config.color == 'string'){
                    var color = config.color;
                    config.color = {
                        from: color,
                        to: color
                    }
                }
            }
            CrawlerJsBridge('setStatusBar', config);
        };

        /**
         * 屏幕横竖切换
         */
        cj.switchOrientation = function(config){
            var successCallback = config.success || function () {
                console.log('switchOrientation success');
            }

            window.afterSwitchOrientation = function (resText) {
                var res = strToJson(resText);
                if (res.success) {
                    successCallback();
                }
            };
            delete config.success;
            config.callback = 'afterSwitchOrientation';
            CrawlerJsBridge('switchOrientation', config);
        };

        /**
         * 回退
         */
        cj.back = function (config) {
            handler('back', config);
        };

        /**
         * 退出APP
         */
        cj.exit = function ( config ) {
           handler('exit', config);
        };

        /**
         * 登出
         */
        cj.logout = function ( config ) {
           handler('logout', config);
        };

        /**
         * 清除缓存
         */
        cj.clear = function (config) {
            handler('clear', config);
        };

        /**
         * 保存到相册
         * @param config
         */
        cj.saveImageToPhotosAlbum = function (config) {
            handler('saveImageToPhotosAlbum', config)
        };

        /**
         * 唤起方法
         * @param func
         * @param config
         */
        cj.call = function (func, config) {
            handler(func, config)
        }

        /**
         * 是否可用
         * @param funcName
         * @returns {boolean}
         */
        cj.canUse = function(funcName){
            if(useWkWebview){
                return wkApiList.indexOf(funcName) > -1;
            }
            return !!CrawlerJS[funcName]
        }
        window.cj = cj;
    }
})();

export default window.cj
