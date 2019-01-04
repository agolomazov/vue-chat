import Vue from 'vue'
import VueHead from 'vue-head'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase/app'
import auth from 'firebase/auth'

const config = {
  apiKey: "AIzaSyCkq2hbPUFJvWepAcBh3hC67P9YmHzCfcE",
  authDomain: "vueslack-d656a.firebaseapp.com",
  databaseURL: "https://vueslack-d656a.firebaseio.com",
  projectId: "vueslack-d656a",
  storageBucket: "vueslack-d656a.appspot.com",
  messagingSenderId: "123638240110"
};

firebase.initializeApp(config);
window.firebase = firebase;

Vue.use(VueHead);

const unsubscribe = firebase.auth().onAuthStateChanged(user => {
  store.dispatch('setUser', user);

  Vue.config.productionTip = false

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')

  unsubscribe();
});
