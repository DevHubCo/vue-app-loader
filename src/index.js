import Vue from 'vue'
import _ from 'lodash'

export default {
  start: (apps) => {
    $(() => {
      _.each($('app'), (element) => {
        let appName = $(element).attr('name')
        let targetApp = apps[_.upperFirst(_.camelCase(appName))]
        new Vue(targetApp).$mount(element)
      })
    })
  }
}
