import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';

import CompanyForm from '@/components/administration/company/CompanyForm.vue';
import http from '@/utils/http';
import { useCompanyStore } from '@/stores/company';
import { createTestPinia, mountComponent } from '../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));


describe('CompanyForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('invia true quando il super admin attiva il modulo RAEE', async () => {
    const pinia = createTestPinia();
    const store = useCompanyStore();
    store.activeForm = true;
    store.element = { id: 7, name: 'Attivita senza RAEE', rae: false };
    const wrapper = mountComponent(CompanyForm, { pinia });

    const radios = wrapper.findAll('input[type="radio"]');
    expect(radios).toHaveLength(2);

    await radios[0].trigger('click');
    expect(store.element.rae).toBe(true);

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    const [url, method, payload] = http.makeRequest.mock.calls.at(-1);
    expect([url, method]).toEqual(['company/7', 'PUT']);
    expect(payload.body).toEqual({ name: 'Attivita senza RAEE', rae: true });
  });
});
