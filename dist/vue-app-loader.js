/**
  * vue-app-loader v0.0.10
  * (c) 2017 Jimmy Fan
  * @license MIT
  */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue'), require('lodash')) :
	typeof define === 'function' && define.amd ? define(['vue', 'lodash'], factory) :
	(global.VueAppLoader = factory(global.Vue,global._));
}(this, (function (Vue,_) { 'use strict';

Vue = Vue && 'default' in Vue ? Vue['default'] : Vue;
_ = _ && 'default' in _ ? _['default'] : _;

var index = {
  start: function (apps) {
    $(function () {
      _.each($('app'), function (element) {
        var appName = $(element).attr('name');
        var targetApp = apps[_.upperFirst(_.camelCase(appName))];
        new Vue(targetApp).$mount(element);
      });
    });
  }
};

return index;

})));
