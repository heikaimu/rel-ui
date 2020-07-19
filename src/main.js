import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import RelUI from './rel-ui';
import VueLazyload from 'vue-lazyload';

Vue.use(ElementUI);
Vue.use(RelUI);

const LOADING_IMG = require('./assets/loading_w.png');
const ERROR_IMG = require('./assets/image_error.png');
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: ERROR_IMG,
  loading: LOADING_IMG,
  attempt: 1
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
