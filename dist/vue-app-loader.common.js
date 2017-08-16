/**
  * vue-app-loader v0.0.8
  * (c) 2017 Jimmy Fan
  * @license MIT
  */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(require('vue'));
var _ = _interopDefault(require('lodash'));

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

module.exports = index;
