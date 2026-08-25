import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import logoutModule from '@/utils/logout';
import { useOrderStore } from '@/stores/order';
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
