import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)
Vue.config.productionTip = false

Vue.$cookies.config('365d')

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
