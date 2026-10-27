import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import http from '@/utils/http';
import { useUserStore } from '@/stores/user';


const raw = vi.hoisted(() => ({ makeRequest: vi.fn(), uploadRequest: vi.fn() }));

vi.mock('generic-module', () => ({ createHttpClient: () => raw }));
vi.mock('@/plugins/router', () => ({ default: {} }));

// I client reali chiamano il callback come ultimo argomento: qui con la risposta decisa dal test.
const respondWith = (data) => (...args) => args.at(-1)(data);

describe('http, attivita bloccata', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it.each(['makeRequest', 'uploadRequest'])(
    '%s: una risposta company_blocked segna il blocco in sessione',
    (name) => {
      const user = useUserStore();
      user.role = 'Admin';
      user.company = { id: 3, name: 'Attivita' };
      raw[name].mockImplementation(respondWith({ status: 'company_blocked' }));
      const callback = vi.fn();

      http[name]('order', 'GET', {}, callback);

      expect(user.company).toEqual({ id: 3, name: 'Attivita', blocked: true });
      expect(user.companyBlocked).toBe(true);
      expect(callback).toHaveBeenCalledWith({ status: 'company_blocked' });
    }
  );

  it('le altre risposte passano senza toccare la sessione', () => {
    const user = useUserStore();
    user.company = { id: 3 };
    raw.makeRequest.mockImplementation(respondWith({ status: 'ok' }));

    http.makeRequest('order', 'GET', {});

    expect(user.company).toEqual({ id: 3 });
  });

  it('il super admin non risulta mai bloccato', () => {
    const user = useUserStore();
    user.role = 'Super Admin';
    user.company = { id: 3, blocked: true };

    expect(user.companyBlocked).toBe(false);
  });
});
