import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';

import BlockedCompany from '@/components/BlockedCompany.vue';
import http from '@/utils/http';
import { useUserStore } from '@/stores/user';
import { createTestPinia, createTestRouter, mountComponent } from '../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

const NONE = { status: 'none', active: false, current_period_end: null, cancel_at_period_end: false };
const ACTIVE = { ...NONE, status: 'active', active: true };
const PAST_DUE = { ...NONE, status: 'past_due' };

const BLOCKED = { id: 3, name: 'Attivita Test', blocked: true };

// Risponde come il backend: abbonamento corrente su /subscription, attivita su company/me.
const backend = ({ subscription = NONE, company = { ...BLOCKED, automatic_payment: true } } = {}) => {
  http.makeRequest.mockImplementation((url, method, options, func) => {
    if (url == 'subscription') func({ status: 'ok', price_cents: 4900, subscription });
    else if (url == 'subscription/sync') func({ status: 'ok', subscription });
    else if (url == 'company/me/status') func({ status: 'ok', company });
    else func({ status: 'ok', url: 'https://stripe.test/pay' });
  });
};

describe('BlockedCompany', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete window.location;
    window.location = { href: '' };
  });

  const setup = async ({ role = 'Admin', company = BLOCKED, query = '' } = {}) => {
    const pinia = createTestPinia();
    const user = useUserStore();
    user.role = role;
    user.company = company;
    const router = createTestRouter();
    await router.push(`/${query}`);
    const wrapper = mountComponent(BlockedCompany, { pinia, router });
    await flushPromises();
    return { wrapper, user };
  };

  const payButton = (wrapper) =>
    wrapper.findAll('button').find((button) => button.text().includes('Sblocca con il pagamento'));

  it.each(['Operator', 'Customer', 'Delivery'])(
    '%s vede il blocco e deve contattare l-amministratore di sistema',
    async (role) => {
      backend();
      const { wrapper } = await setup({ role, company: { ...BLOCKED, automatic_payment: true } });

      expect(wrapper.text()).toContain('Attività bloccata');
      expect(wrapper.text()).toContain('Contatta l\'amministratore di sistema');
      expect(payButton(wrapper)).toBeUndefined();
      expect(http.makeRequest.mock.calls.map((call) => call[0])).toEqual(['company/me/status']);
    }
  );

  it('un admin senza pagamento automatico vede solo il messaggio di blocco', async () => {
    backend({ company: { ...BLOCKED, automatic_payment: false } });
    const { wrapper } = await setup({ company: { ...BLOCKED, automatic_payment: false } });

    expect(wrapper.text()).toContain('Non puoi usare il gestionale');
    expect(payButton(wrapper)).toBeUndefined();
    expect(http.makeRequest.mock.calls.map((call) => call[0])).toEqual(['company/me/status']);
  });

  it('un admin con pagamento automatico senza abbonamento puo sbloccarsi pagando', async () => {
    backend();
    const { wrapper } = await setup({ company: { ...BLOCKED, automatic_payment: true } });

    expect(wrapper.text()).toContain('49,00');

    await payButton(wrapper).trigger('click');
    await flushPromises();

    expect(http.makeRequest.mock.calls.at(-1).slice(0, 2)).toEqual(['subscription/checkout', 'POST']);
    expect(window.location.href).toBe('https://stripe.test/pay');
  });

  it('con il pagamento in ritardo offre il portale, non un nuovo checkout', async () => {
    backend({ subscription: PAST_DUE });
    const { wrapper } = await setup({ company: { ...BLOCKED, automatic_payment: true } });

    expect(wrapper.text()).toContain('Aggiorna il pagamento');
    expect(payButton(wrapper)).toBeUndefined();
  });

  it('un admin che sta gia pagando vede solo il blocco: pagare non lo toglie', async () => {
    backend({ subscription: ACTIVE });
    const { wrapper } = await setup({ company: { ...BLOCKED, automatic_payment: true } });

    expect(wrapper.text()).toContain('Contatta l\'amministratore di sistema');
    expect(payButton(wrapper)).toBeUndefined();
  });

  it('dopo un reload rilegge l-attivita: se nel frattempo e stata sbloccata il blocco cade', async () => {
    backend({ company: { ...BLOCKED, blocked: false } });
    const { user } = await setup({ role: 'Operator' });

    expect(user.company.blocked).toBe(false);
    expect(user.companyBlocked).toBe(false);
  });

  it('al ritorno dal pagamento rilegge Stripe e l-attivita, e il blocco cade', async () => {
    backend({ subscription: ACTIVE, company: { ...BLOCKED, automatic_payment: true, blocked: false } });
    const { user } = await setup({ company: { ...BLOCKED, automatic_payment: true }, query: '?checkout=success' });

    const urls = http.makeRequest.mock.calls.map((call) => call[0]);
    expect(urls).toContain('subscription/sync');
    expect(urls).toContain('company/me/status');
    expect(user.company.blocked).toBe(false);
    expect(user.companyBlocked).toBe(false);
  });
});
