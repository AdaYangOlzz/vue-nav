import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { RouterView } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'

const router = createRouter({
  // 路由模式
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/result/result.vue')
        },
        {
          path: '/submit',
          name: '提交任务',
          component: () => import('@/views/submit/submit.vue')
        },
        {
          path: '/install',
          name: '安装服务',
          component: () => import('@/views/install/install.vue')
        },
        {
          path: '/result',
          name: '查看结果',
          component: () => import('@/views/result/result.vue')
        }
        ,
        {
          path: '/service',
          name: '已装载服务',
          component: () => import('@/views/getService/getService.vue')
        }
      ]
    },
  ]
})
// const router = createRouter({
//   // 路由模式
//   history: createWebHashHistory(),
//   routes,
// })

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: AppLayout,
//       children: [
//         {
//           path: '',
//           name: 'home',
//           component: () => import('@/views/result/result.vue')
//         },
//         {
//           path: '/submit',
//           name: '提交',
//           component: () => import('@/views/submit/submit.vue')
//         }
//       ]
//     },
//     // {
//     //   path: '/about',
//     //   name: 'about',
//     //   // route level code-splitting
//     //   // this generates a separate chunk (About.[hash].js) for this route
//     //   // which is lazy-loaded when the route is visited.
//     //   component: () => import('../views/AboutView.vue')
//     // }
//   ]
// })

export default router
