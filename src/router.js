import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('./pages/Home.vue')
  },
  {
    path: '/:ukey',
    component: () => import('./pages/Redirect.vue')
  }
]

export default createRouter({
  routes,
  history: createWebHistory()
})
