/**
  * vue-app-loader v0.0.5
  * (c) 2017 Jimmy Fan
  * @license MIT
  */
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

export default index;
