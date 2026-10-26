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

  it('impedisce ai clienti di aprire le pagine di pianificazione via URL', async () => {
    userStore.$patch({ role: 'Customer', userId: 3 });

    await router.push('/planning/automatic');

    expect(router.currentRoute.value.name).toBe('Ordini');
  });

  it('permette agli operatori di aprire la pianificazione', async () => {
    userStore.$patch({ role: 'Operator', userId: 4 });

    await router.push('/planning/automatic');

    expect(router.currentRoute.value.name).toBe('Pianificazione');
  });
});
