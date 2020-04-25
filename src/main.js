import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueTextAreaAutoSize from 'vue-textarea-autosize';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

Vue.config.productionTip = false;

const base = axios.create({
  baseURL: process.env.VUE_APP_API,
});
Vue.prototype.$http = base;

Vue.use(VueTextAreaAutoSize);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
