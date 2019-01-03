import Vue from 'vue'
import Router from 'vue-router'
import Chat from './pages/Chat'
Vue.use(Router)
import auth from 'firebase/auth';

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'chat',
      component: Chat,
      beforeEnter: (to, from, next) => {
        if (!firebase.auth().currentUser) {
          next('/login');
        } else {
          next();
        }
      } 
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */'./pages/Login.vue'),
      beforeEnter: (to, from, next) => {
        if (firebase.auth().currentUser) {
          next('/');
        } else {
          next();
        }
      } 
    }
  ]
})
