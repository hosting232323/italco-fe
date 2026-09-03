import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/LoginPage.vue')
      },
      {
        path: 'order/:orderId',
        name: 'OrderStatus',
        component: () => import('@/views/OrderStatus.vue'),
        props: true
      },
      {
        path: 'privacy',
        name: 'Privacy Policy',
        component: () => import('@/views/PrivacyPolicy.vue')
      },
      {
        path: 'download-app',
        name: 'Download App',
        component: () => import('@/views/DownloadDeliveryApp.vue')
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue')
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
        component: () => import('@/views/DashboardPage.vue')
      },
      {
        path: 'orders',
        name: 'Ordini',
        component: () => import('@/views/OrdersPage.vue')
      },
      {
        path: 'services',
        name: 'Servizi',
        component: () => import('@/views/administration/AdministrationServices.vue')
      },
      {
        path: 'users',
        name: 'Utenti',
        component: () => import('@/views/administration/AdministrationUsers.vue')
      },
      {
        path: 'customer-points',
        name: 'Punti Vendita',
        component: () => import('@/views/administration/AdministrationCustomerPoints.vue')
      },
      {
        path: 'delivery',
        name: 'Deliver',
        component: () => import('@/views/administration/AdministrationDelivery.vue')
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/administration/AdministrationLog.vue')
      },
      {
        path: 'schedules',
        name: 'Borderò',
        component: () => import('@/views/operator/OperatorSchedules.vue')
      },
      {
        path: 'collection-points',
        name: 'Punti di ritiro',
        component: () => import('@/views/customer/CollectionPoints.vue')
      },
      {
        path: 'rae-dashboard',
        name: 'Ritiri Raee',
        component: () => import('@/views/operator/RaeDashboard.vue')
      },
      {
        path: 'rae-product-groups',
        name: 'Raggruppamenti Raee',
        component: () => import('@/views/administration/RaeProductGroups.vue')
      },
      {
        path: 'rae-carrier',
        name: 'Trasportatori Raee',
        component: () => import('@/views/administration/RaeCarrier.vue')
      },
      {
        path: 'rae-collection-center',
        name: 'Centri di raccolta Raee',
        component: () => import('@/views/administration/RaeCollectionCenter.vue')
      },
      {
        path: 'rae-disposal',
        name: 'Smaltimenti Raee',
        component: () => import('@/views/operator/RaeDisposal.vue')
      },
      {
        path: 'companies',
        name: 'Company',
        component: () => import('@/views/administration/AdministrationCompanies.vue')
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

// Rotte raggiungibili senza sessione: fuori dal perimetro della guard.
const PUBLIC_ROUTES = ['Login', 'Privacy Policy', 'Download App', 'OrderStatus', 'NotFound'];

// Rotte del modulo RAEE: esistono solo per le attività che lo hanno acceso.
const RAE_ROUTES = [
  'Ritiri Raee',
  'Smaltimenti Raee',
  'Raggruppamenti Raee',
  'Trasportatori Raee',
  'Centri di raccolta Raee'
];


router.beforeEach((to) => {
  const userStore = useUserStore();
  const { role, company } = userStore;

  // Sessioni Delivery aperte da prima della rimozione della UI web: la
  // company web non offre più nulla per questo ruolo, quindi si chiude la
  // sessione e si manda alla stessa pagina del login.
  if (role == 'Delivery' && !PUBLIC_ROUTES.includes(to.name)) {
    userStore.$reset();
    return { name: 'Download App' };
  }

  // Il super admin non possiede dati propri: finché non sceglie una company
  // non c'è niente da mostrargli, e ogni altra rotta lo riporta alla scelta.
  if (role == 'Super Admin' && !company && to.name != 'Company' && !PUBLIC_ROUTES.includes(to.name))
    return { name: 'Company' };

  // Togliere le voci dal menù non basta: l'URL resta digitabile e i preferiti
  // pure. Chi ci arriva con il modulo spento torna alla dashboard.
  if (RAE_ROUTES.includes(to.name) && !company?.rae)
    return { name: 'Dashboard' };
});


export default router;
