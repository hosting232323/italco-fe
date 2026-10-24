import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import http from '@/utils/http';
import { useCompanyConfigurationStore } from '@/stores/companyConfiguration';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

const LEGAL = { name: 'Attivita', legal_name: 'Attivita SRL', vat_number: '1', address: 'Via 1', city: 'Bari' };

describe('companyConfiguration store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('parte vuoto e non pronto', () => {
    const store = useCompanyConfigurationStore();

    expect(store.element).toEqual({});
    expect(store.ready).toBe(false);
  });

  it('carica la propria company', () => {
    const store = useCompanyConfigurationStore();
    const func = vi.fn();
    http.makeRequest.mockImplementationOnce((url, method, options, callback) =>
      callback({ status: 'ok', company: { id: 3, ...LEGAL } })
    );

    store.initData(func);

    expect(http.makeRequest.mock.calls.at(-1).slice(0, 2)).toEqual(['company/me', 'GET']);
    expect(store.element).toMatchObject({ id: 3, name: 'Attivita' });
    expect(store.ready).toBe(true);
    expect(func).toHaveBeenCalled();
  });

  it('se il caricamento fallisce resta non pronto', () => {
    const store = useCompanyConfigurationStore();
    http.makeRequest.mockImplementationOnce((url, method, options, callback) => callback({ status: 'ko' }));

    store.initData();

    expect(store.ready).toBe(false);
  });

  it('salva anagrafica e dati legali con codice fiscale e iscrizione nulli quando vuoti', () => {
    const store = useCompanyConfigurationStore();
    store.element = { id: 3, ...LEGAL, rae: false, logo: 'https://api/logo.png' };

    store.updateElement(vi.fn());

    const [url, method, options] = http.uploadRequest.mock.calls.at(-1);
    expect([url, method]).toEqual(['company/me', 'PUT']);
    expect(options.body).toEqual({ ...LEGAL, tax_code: null, rae_registration: null });
    expect(options.files).toHaveProperty('logo');
  });

  it('manda l-iscrizione all-Albo anche a modulo spento: serve per poterlo accendere', () => {
    const store = useCompanyConfigurationStore();
    store.element = { id: 3, ...LEGAL, rae: false, rae_registration: 'RD-1' };

    store.updateElement(vi.fn());

    expect(http.uploadRequest.mock.calls.at(-1)[2].body.rae_registration).toBe('RD-1');
  });
});
