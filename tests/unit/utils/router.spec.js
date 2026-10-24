import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { h } from 'vue';


vi.mock('@/layouts/DefaultLayout.vue', () => ({ default: { render: () => h('div') } }));
vi.mock('@/views/DashboardPage.vue', () => ({ default: { render: () => h('div') } }));
vi.mock('@/views/OrdersPage.vue', () => ({ default: { render: () => h('div') } }));


describe('router guard', () => {
  let router;
  let userStore;

  beforeEach(async () => {
    setActivePinia(createPinia());
    const { useUserStore } = await import('@/stores/user');
    userStore = useUserStore();
    router = (await import('@/plugins/router')).default;
  });

  it('manda i clienti da Dashboard a Ordini', async () => {
    userStore.$patch({ role: 'Customer', userId: 3 });

    await router.push('/dashboard');

    expect(router.currentRoute.value.name).toBe('Ordini');
  });

  it('lascia la dashboard a admin e operatori', async () => {
    userStore.$patch({ role: 'Operator', userId: 4 });

    await router.push('/dashboard');

    expect(router.currentRoute.value.name).toBe('Dashboard');
  });

  describe('configurazione', () => {
    // Il router e' un singleton: senza una rotta di partenza diversa, un push
    // verso la stessa rotta della prova precedente non rieseguirebbe la guard.
    beforeEach(async () => {
      userStore.$patch({ role: 'Customer', userId: 1 });
      await router.push('/orders');
    });

    it('raggiungibile dall admin della propria attivita', async () => {
      userStore.$patch({ role: 'Admin', userId: 5, company: { id: 1 } });

      await router.push('/configuration');

      expect(router.currentRoute.value.name).toBe('Configurazione');
    });

    it('raggiungibile dal super admin che opera su una company', async () => {
      userStore.$patch({ role: 'Super Admin', userId: 2, company: { id: 1 } });

      await router.push('/configuration');

      expect(router.currentRoute.value.name).toBe('Configurazione');
    });

    it('riporta alla dashboard chi non è admin', async () => {
      userStore.$patch({ role: 'Operator', userId: 6, company: { id: 1 } });

      await router.push('/configuration');

      expect(router.currentRoute.value.name).toBe('Dashboard');
    });
  });
});
