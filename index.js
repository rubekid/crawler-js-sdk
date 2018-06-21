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

        /**
         * 转成JSON
         * @param str
         * @returns {null}
         */
        function strToJson(str) {
            if (!str) {
                return null;
            }
            try {
                return JSON.parse(str);
            }
            catch (e) {
                console.log(e)
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

        cj.login = function (callback) {
            window.afterLogin = function (responseText) {
                callback(strToJson(responseText))
            };

            var config = {
               callback: 'afterLogin'
            };
            CrawlerJS.login(jsonToStr(config));
        };

        /**
         * 登出
         */
        cj.logout = function () {
            CrawlerJS.logout();
        };

        /**
         * 获取登录数据
         */
        cj.getLoginData = function () {
            var response = CrawlerJS.getLoginData();
            return strToJson(response);
        };

        /**
         * 获取Token
         */
        cj.getToken = function () {
            var response = CrawlerJS.getToken();
            return strToJson(response);
        };

        /**
         * 刷新Token
         */
        cj.refreshToken = function () {
            return CrawlerJS.refreshToken();
        };

        /**
         * 选择分享
         * @param config
         */
        cj.chooseShare = function (config) {
            var successCallback = config.success || function () {
                console.log('share success');
            }
            var errorCallback = config.error || function () {
                console.log('share error');
            }
            window.afterShare = function (responseText) {
                var response = strToJson(responseText);
                if (toBoolean(response.success) || toBoolean(responseText)) {
                    successCallback()
                }
                else {
                    errorCallback()
                }
            };
            delete config.success;
            delete config.error;
            config.callback = 'afterShare';
            CrawlerJS.chooseShare(jsonToStr(config))
        }

        /**
         * 分享到指定平台
         * @param config
         */
        cj.share = function (config) {
            var successCallback = config.success || function () {
                console.log('share success');
            }
            var errorCallback = config.error || function () {
                console.log('share error');
            }
            window.afterShare = function (responseText) {
                var response = strToJson(responseText);
                if (toBoolean(response.success) || toBoolean(responseText)) {
                    successCallback()
                }
                else {
                    errorCallback()
                }
            };
            delete config.success;
            delete config.error;
            config.callback = 'afterShare';
            CrawlerJS.share(jsonToStr(config))
        };

        /**
         * 选择支付
         * @param config
         */
        cj.choosePay = function (config) {
            var successCallback = config.success || function () {
                console.log('pay success');
            }
            var errorCallback = config.error || function () {
                console.log('pay error');
            }
            window.afterPay = function (responseText) {
                var response = strToJson(responseText);
                if (toBoolean(response.success) || toBoolean(responseText)) {
                    successCallback()
                }
                else {
                    errorCallback()
                }
            };
            delete config.success;
            delete config.error;
            config.callback = 'afterPay';
            CrawlerJS.choosePay(jsonToStr(config));
        };

        /**
         * 指定平台支付
         * @param config
         */
        cj.pay = function (config) {
            var successCallback = config.success || function () {
                console.log('pay success');
            }
            var errorCallback = config.error || function () {
                console.log('pay error');
            }
            window.afterPay = function (responseText) {
                var response = strToJson(responseText);
                if (toBoolean(response.success) || toBoolean(responseText)) {
                    successCallback()
                }
                else {
                    errorCallback()
                }
            };
            delete config.success;
            delete config.error;
            config.callback = 'afterPay';
            CrawlerJS.pay(jsonToStr(config));
        };

        /**
         * 选择文件并上传
         * @param config
         */
        cj.chooseUpload = function (config) {
            var successCallback = config.success || function () {
                console.log('upload success');
            }
            window.afterUpload = function (responseText) {
                successCallback(strToJson(responseText))
            };
            delete config.success;
            config.callback = 'afterUpload';
            CrawlerJS.chooseUpload(jsonToStr(config));
        }

        /**
         * 选择文件
         * @param config
         */
        cj.chooseFile = function (config) {
            var successCallback = config.success || function () {
                console.log('choose success');
            }
            window.afterChooseFile = function (responseText) {
                successCallback(strToJson(responseText))
            };
            delete config.success;
            config.callback = 'afterChooseFile';
            CrawlerJS.chooseFile(jsonToStr(config));
        };

        /**
         * 日期选择
         * @param config
         */
        cj.datePicker = function (config) {
            var confirmCallback = config.confirm || function () {
                console.log('after datetime select');
            }
            window.afterDateSelect = function (responseText) {
                confirmCallback(strToJson(responseText))
            };
            delete config.confirm;
            config.callback = 'afterDateSelect';
            if (config.color) {
                config.color = toRgba(config.color);
            }
            CrawlerJS.datePicker(jsonToStr(config));
        };

        /**
         * 时间选择
         * @param config
         */
        cj.datetimePicker = function (config) {
            var confirmCallback = config.confirm || function () {
                console.log('after datetime select');
            }
            window.afterDateTimeSelect = function (responseText) {
                confirmCallback(strToJson(responseText))
            };
            delete config.confirm;
            config.callback = 'afterDateTimeSelect';
            if (config.color) {
                config.color = toRgba(config.color);
            }
            CrawlerJS.datetimePicker(jsonToStr(config));
        };

        /**
         * 区域选择
         * @param config
         */
        cj.regionPicker = function (config) {
            var confirmCallback = config.confirm || function () {
                console.log('after datetime select');
            }
            window.afterRegionSelect = function (responseText) {
                confirmCallback(strToJson(responseText))
            };
            delete config.confirm;
            config.callback = 'afterRegionSelect';
            if (config.color) {
                config.color = toRgba(config.color);
            }
            CrawlerJS.regionPicker(jsonToStr(config));
        };

        /**
         * 通用picker
         * @param config
         */
        cj.picker = function (config) {
            var confirmCallback = config.confirm || function () {
                console.log('after picker select');
            }
            window.afterPickerSelect = function (responseText) {
                confirmCallback(strToJson(responseText))
            };
            delete config.confirm;
            config.callback = 'afterPickerSelect';
            if (config.color) {
                config.color = toRgba(config.color);
            }
            CrawlerJS.picker(jsonToStr(config));
        };

        /**
         * 联动picker
         * @param config
         */
        cj.linkagePicker = function (config) {
            var confirmCallback = config.confirm || function () {
                console.log('after linkage select');
            }
            window.afterLinkagePickerSelect = function (responseText) {
                confirmCallback(strToJson(responseText))
            };
            delete config.confirm;
            config.callback = 'afterLinkagePickerSelect';
            if (config.color) {
                config.color = toRgba(config.color);
            }
            CrawlerJS.linkagePicker(jsonToStr(config));
        };

        /**
         * 获取定位
         * @param config
         */
        cj.getLocation = function (config) {
            var successCallback = config.success || function () {
                console.log('location success');
            }
            window.onLocationSuccess = function (responseText) {
                successCallback(strToJson(responseText))
            };
            delete config.success;
            config.callback = 'onLocationSuccess';
            CrawlerJS.getLocation(jsonToStr(config));
        };

        /**
         * 扫二维码
         * @param config
         */
        cj.scanQRCode = function (config) {
            var successCallback = config.success || function () {
                console.log('pay success');
            }
            var errorCallback = config.error || function () {
                console.log('pay error');
            }
            window.afterScan = function (responseText) {
                var response = strToJson(responseText);
                if (response.success) {
                    successCallback(response.text);
                }
                else {
                    errorCallback();
                }
            };
            delete config.success;
            delete config.error;
            config.callback = 'afterScan';
            CrawlerJS.scanQRCode(jsonToStr(config));
        };

        /**
         * 设置剪切板数据
         * @param config
         */
        cj.setClipboardData = function (config) {
            var successCallback = config.success || function () {
                console.log('setClipboardData success');
            }
            var errorCallback = config.error || function () {
                console.log('setClipboardData error');
            }
            window.afterSetClipboardData = function (responseText) {
                var response = strToJson(responseText);
                if (toBoolean(response.success) || toBoolean(responseText)) {
                    successCallback();
                }
                else {
                    errorCallback();
                }
            };
            delete config.success;
            delete config.error;
            config.callback = 'afterSetClipboardData';
            CrawlerJS.setClipboardData(jsonToStr(config));
        };

        /**
         * 获取剪切板数据
         * @param config
         */
        cj.getClipboardData = function (config) {
            var successCallback = config.success || function () {
                console.log('setClipboardData success');
            }
            var errorCallback = config.error || function () {
                console.log('setClipboardData error');
            }

            window.afterGetClipboardData = function (responseText) {
                var response = strToJson(responseText);
                if (response.success) {
                    successCallback(response.text);
                }
                else {
                    errorCallback();
                }
            };
            delete config.success;
            delete config.error;
            config.callback = 'afterGetClipboardData';
            CrawlerJS.getClipboardData(jsonToStr(config));
        };

        /**
         * 拨打电话
         * @param config
         */
        cj.makePhoneCall = function (config) {
            CrawlerJS.makePhoneCall(jsonToStr(config));
        };

        /**
         * 统计未读消息数量
         * @param config
         */
        cj.countUnreadMessage = function(config){
            var successCallback = config.success || function () {
                console.log('countUnreadMessage success');
            }

            window.afterCountUnreadMessage = function (responseText) {
                var response = strToJson(responseText);
                if (response.success) {
                    successCallback(response.value);
                }
            };
            delete config.success;
            config.callback = 'afterCountUnreadMessage';
            CrawlerJS.countUnreadMessage(jsonToStr(config));
        };

        /**
         * 跳转到消息管理
         */
        cj.navigateToMessage = function(){
            CrawlerJS.navigateToMessage();
        };

        /**
         * 跳转到原生界面
         */
        cj.navigateToActivity = function(config){
            CrawlerJS.navigateToActivity(jsonToStr(config));
        };

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
            CrawlerJS.setStatusBar(jsonToStr(config));
        };

        /**
         * 回退
         */
        cj.back = function () {
            CrawlerJS.back();
        };

        /**
         * 退出APP
         */
        cj.exit = function () {
            CrawlerJS.exit();
        };

        /**
         * 是否可用
         * @param funcName
         * @returns {boolean}
         */
        cj.canUse = function(funcName){
            return !!CrawlerJS[funcName]
        }
        window.cj = cj;
    }
})();

export default window.cj
