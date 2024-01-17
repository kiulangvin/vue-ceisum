import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import SnowView from '../views/SnowView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/BeginAnimation',
      name: 'BeginAnimation',
      component: () => import('../views/BeginAnimation.vue')
    },
    {
      path: '/SpliteView',
      name: 'SpliteView',
      component: () => import('../views/SpliteView.vue')
    },
    {
      path: '/3dMap_2dMap',
      name: '3dMap_2dMap',
      component: () => import('../views/3dMap_2dMap.vue')
    }
  ]
})

export default router
