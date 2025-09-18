import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/Login.vue')
      },
      {
        path: 'order/:orderId',
        name: 'OrderStatus',
        component: () => import('@/views/OrderStatus.vue'),
        props: true,
      },
      {
        path: 'privacy',
        name: 'Privacy Policy',
        component: () => import('@/views/PrivacyPolicy.vue')
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: 'services',
        name: 'Servizi',
        component: () => import('@/views/administration/Services.vue')
      },
      {
        path: 'users',
        name: 'Utenti',
        component: () => import('@/views/administration/Users.vue')
      },
      {
        path: 'customer-points',
        name: 'Punti Vendita',
        component: () => import('@/views/administration/CustomerPoints.vue')
      },
      {
        path: 'transports',
        name: 'Veicoli',
        component: () => import('@/views/administration/Transports.vue')
      },
      {
        path: 'schedules',
        name: 'Borderò',
        component: () => import('@/views/operator/Schedules.vue')
      },
      {
        path: 'collection-points',
        name: 'Punti di ritiro',
        component: () => import('@/views/customer/CollectionPoints.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, savedPosition) {
    if (to.hash)
      return {
        el: to.hash,
        behavior: 'smooth'
      };
    else if (savedPosition)
      return savedPosition;
    else
      return { left: 0, top: 0 };
  }
});

export default router;
