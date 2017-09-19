window.cj = {
  support: false // 是否支持自定义
};
(function(){
  if (window && window.CrawlerJS) {
    var CrawlerJS = window.CrawlerJS;
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
      try{
        return JSON.parse(str);
      }
      catch(e){
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
     * 登录
     */

    cj.login = function (){
      CrawlerJS.login();
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
      CrawlerJS.refreshToken();
    };

    /**
     * 选择分享
     * @param config
     */
    cj.chooseShare = function (config) {
      var successCallback = config.success || function(){
        console.log('share success');
      }
      var errorCallback = config.error || function (){
        console.log('share error');
      }
      window.afterShare = function (success){
        if (success === true || success === 1){
          successCallback()
        }
        else{
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
      var successCallback = config.success || function(){
        console.log('share success');
      }
      var errorCallback = config.error || function (){
        console.log('share error');
      }
      window.afterShare = function (success){
        if (success === true || success === 1){
          successCallback()
        }
        else{
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
      var successCallback = config.success || function(){
        console.log('pay success');
      }
      var errorCallback = config.error || function (){
        console.log('pay error');
      }
      window.afterPay = function (success){
        if (success === true || success === 1){
          successCallback()
        }
        else{
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
      var successCallback = config.success || function(){
        console.log('pay success');
      }
      var errorCallback = config.error || function (){
        console.log('pay error');
      }
      window.afterPay = function (success){
        if (success === true || success === 1){
          successCallback()
        }
        else{
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
      var successCallback = config.success || function(){
        console.log('upload success');
      }
      window.afterUpload = function (responseText){
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
      var successCallback = config.success || function(){
        console.log('choose success');
      }
      window.afterChooseFile = function (responseText){
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
      var confirmCallback = config.confirm || function(){
        console.log('after datetime select');
      }
      window.afterDateSelect = function (responseText){
        confirmCallback(strToJson(responseText))
      };
      delete config.confirm;
      config.callback = 'afterDateSelect';
      CrawlerJS.datePicker(jsonToStr(config));
    };

    /**
     * 时间选择
     * @param config
     */
    cj.datetimePicker = function (config) {
      var confirmCallback = config.confirm || function(){
        console.log('after datetime select');
      }
      window.afterDateTimeSelect = function (responseText){
        confirmCallback(strToJson(responseText))
      };
      delete config.confirm;
      config.callback = 'afterDateTimeSelect';
      CrawlerJS.datetimePicker(jsonToStr(config));
    };

    /**
     * 区域选择
     * @param config
     */
    cj.regionPicker = function (config) {
      var confirmCallback = config.confirm || function(){
        console.log('after datetime select');
      }
      window.afterRegionSelect = function (responseText){
        confirmCallback(strToJson(responseText))
      };
      delete config.confirm;
      config.callback = 'afterRegionSelect';
      CrawlerJS.regionPicker(jsonToStr(config));
    };

    /**
     * 通用picker
     * @param config
     */
    cj.picker = function (config) {
      var confirmCallback = config.confirm || function(){
        console.log('after picker select');
      }
      window.afterPickerSelect = function (responseText){
        confirmCallback(strToJson(responseText))
      };
      delete config.confirm;
      config.callback = 'afterPickerSelect';
      CrawlerJS.picker(jsonToStr(config));
    };

    /**
     * 联动picker
     * @param config
     */
    cj.linkagePicker = function (config) {
      var confirmCallback = config.confirm || function(){
        console.log('after linkage select');
      }
      window.afterLinkagePickerSelect = function (responseText){
        confirmCallback(strToJson(responseText))
      };
      delete config.confirm;
      config.callback = 'afterLinkagePickerSelect';
      CrawlerJS.linkagePicker(jsonToStr(config));
    };

    /**
     * 获取定位
     * @param config
     */
    cj.getLocation = function (config) {
      var successCallback = config.success || function(){
        console.log('location success');
      }
      window.onLocationSuccess = function (responseText){
        successCallback(strToJson(responseText))
      };
      delete config.success;
      config.callback = 'onLocationSuccess';
      CrawlerJS.linkagePicker(jsonToStr(config));
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

    window.cj = cj;
  }
})();

export default window.cj