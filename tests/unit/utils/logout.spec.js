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

  it('azzera i dati dell-utente', () => {
    const userStore = useUserStore();
    userStore.$patch({ token: 'jwt-di-test', role: 'Admin', userId: 7 });

    logoutModule.logout({ push: vi.fn() });

    expect(userStore.token).toBe('');
    expect(userStore.role).toBe('');
    expect(userStore.userId).toBe(0);
  });

  it('svuota anche le liste caricate', () => {
    const orderStore = useOrderStore();
    const transportStore = useTransportStore();
    orderStore.setList({ orders: [{ id: 1 }] });
    transportStore.setList({ transports: [{ id: 1 }] });

    logoutModule.logout({ push: vi.fn() });

    expect(orderStore.list).toEqual([]);
    expect(orderStore.ready).toBe(false);
    expect(transportStore.list).toEqual([]);
  });

  it('riporta alla pagina iniziale', () => {
    const router = { push: vi.fn() };

    logoutModule.logout(router);

    expect(router.push).toHaveBeenCalledWith('/');
  });
});
