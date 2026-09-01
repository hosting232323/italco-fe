import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import logoutModule from '@/utils/logout';
import { useCompanyStore } from '@/stores/company';
import { useDashboardStore } from '@/stores/dashboard';
import { useOrderStore } from '@/stores/order';
import { useRaeProductStore } from '@/stores/raeProduct';
import { useTransportStore } from '@/stores/transport';
import { useUserStore } from '@/stores/user';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));


describe('logout', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('azzera i dati dell-utente', async () => {
    const userStore = useUserStore();
    userStore.$patch({ token: 'jwt-di-test', role: 'Admin', userId: 7 });

    await logoutModule.logout({ push: vi.fn() });

    expect(userStore.token).toBe('');
    expect(userStore.role).toBe('');
    expect(userStore.userId).toBe(0);
  });

  it('svuota anche le liste caricate', async () => {
    const orderStore = useOrderStore();
    const transportStore = useTransportStore();
    orderStore.setList({ orders: [{ id: 1 }] });
    transportStore.setList({ transports: [{ id: 1 }] });

    await logoutModule.logout({ push: vi.fn() });

    expect(orderStore.list).toEqual([]);
    expect(orderStore.ready).toBe(false);
    expect(transportStore.list).toEqual([]);
  });

  it('non lascia in memoria le analitiche dell-attivita- precedente', async () => {
    // Il login successivo avviene nella stessa scheda, quindi negli stessi
    // store: se la dashboard resta 'ready' non richiede piu' niente al backend
    // e mostra all-admin di un-attivita- i numeri di un-altra.
    const dashboardStore = useDashboardStore();
    dashboardStore.analytics = { ...dashboardStore.analytics, kpis: { total_orders: 42 } };
    dashboardStore.filters = { start: '2026-01-01', end: '2026-01-31' };
    dashboardStore.ready = true;

    await logoutModule.logout({ push: vi.fn() });

    expect(dashboardStore.ready).toBe(false);
    expect(dashboardStore.analytics.kpis).toEqual({});
    expect(dashboardStore.filters).toEqual({ start: null, end: null });
  });

  it('svuota anche gli store rimasti fuori dalla vecchia lista', async () => {
    const raeProductStore = useRaeProductStore();
    const companyStore = useCompanyStore();
    raeProductStore.setList({ rae_products: [{ id: 1 }] });
    companyStore.setList({ companies: [{ id: 1 }] });

    await logoutModule.logout({ push: vi.fn() });

    expect(raeProductStore.list).toEqual([]);
    expect(raeProductStore.ready).toBe(false);
    expect(companyStore.list).toEqual([]);
    expect(companyStore.ready).toBe(false);
  });

  it('si disconnette lo stesso se fetch non e disponibile', async () => {
    vi.stubGlobal('fetch', undefined);
    const router = { push: vi.fn() };

    await logoutModule.logout(router);

    expect(router.push).toHaveBeenCalledWith('/');
  });

  it('si disconnette lo stesso se la revoca solleva subito', async () => {
    vi.stubGlobal('fetch', () => { throw new Error('rete assente'); });
    const router = { push: vi.fn() };

    await logoutModule.logout(router);

    expect(router.push).toHaveBeenCalledWith('/');
  });

  it('riporta alla pagina iniziale', async () => {
    const router = { push: vi.fn() };

    await logoutModule.logout(router);

    expect(router.push).toHaveBeenCalledWith('/');
  });
});
