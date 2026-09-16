import { describe, expect, it, vi } from 'vitest';
import { h } from 'vue';

import LoginPage from '@/views/LoginPage.vue';
import { useCompanyStore } from '@/stores/company';
import { useDashboardStore } from '@/stores/dashboard';
import { useOrderStore } from '@/stores/order';
import { useUserStore } from '@/stores/user';
import { createTestPinia, createTestRouter, mountComponent } from '../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

vi.mock('generic-module', () => ({
  AuthManager: { name: 'AuthManager', emits: ['call-back'], render: () => h('div') }
}));


const page = { render: () => h('div') };
const routes = [
  { path: '/', name: 'Login', component: page },
  { path: '/dashboard', name: 'Dashboard', component: page },
  { path: '/orders', name: 'Ordini', component: page },
  { path: '/companies', name: 'Company', component: page },
  { path: '/download-app', name: 'Download App', component: page }
];

// Stato lasciato in memoria da un utente di un'altra attivita' nella stessa scheda.
const withPreviousTenant = () => {
  const pinia = createTestPinia();
  useOrderStore().setList({ orders: [{ id: 21291, company_id: 1 }] });
  useCompanyStore().setList({ companies: [{ id: 1 }] });
  const dashboardStore = useDashboardStore();
  dashboardStore.ready = true;
  return pinia;
};

const login = async (data) => {
  const pinia = withPreviousTenant();
  const router = createTestRouter(routes);
  const wrapper = mountComponent(LoginPage, { pinia, router });
  wrapper.findComponent({ name: 'AuthManager' }).vm.$emit('call-back', data);
  await router.isReady();
  return router;
};


describe('LoginPage', () => {
  it('svuota i dati dell-attivita- precedente prima di caricare il nuovo utente', async () => {
    await login({ role: 'Admin', user_id: '70', access_token: 'jwt', company: { id: 2 } });

    expect(useOrderStore().list).toEqual([]);
    expect(useOrderStore().ready).toBe(false);
    expect(useCompanyStore().list).toEqual([]);
    expect(useDashboardStore().ready).toBe(false);

    const userStore = useUserStore();
    expect(userStore.userId).toBe('70');
    expect(userStore.token).toBe('jwt');
    expect(userStore.company).toEqual({ id: 2 });
  });

  it('svuota i dati anche per il Delivery rimandato alla pagina dell-app', async () => {
    await login({ role: 'Delivery', user_id: '76', access_token: 'jwt', company: { id: 2 } });

    expect(useOrderStore().list).toEqual([]);
    expect(useCompanyStore().list).toEqual([]);
  });
});
