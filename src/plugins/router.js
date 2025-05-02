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
        path: 'privacy',
        name: 'Privacy Policy',
        component: () => import('@/views/PrivacyPolicy.vue')
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
        path: 'addressees',
        name: 'Anagrafiche',
        component: () => import('@/views/customer/Addressees.vue')
      },
      {
        path: 'orders',
        name: 'Ordini',
        component: () => import('@/views/customer/Orders.vue')
      },
      {
        path: 'collection-points',
        name: 'Punti di ritiro',
        component: () => import('@/views/customer/CollectionPoints.vue')
      },
      {
        path: 'products',
        name: 'Prodotti',
        component: () => import('@/views/customer/Products.vue')
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
