import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import http from '@/utils/http';
import storesUtils from '@/utils/stores';
import { useAdministrationUserStore } from '@/stores/administrationUser';
import { useCustomerGroupStore } from '@/stores/customerGroup';
import { useCustomerRuleStore } from '@/stores/customerRule';
import { useDashboardStore } from '@/stores/dashboard';
import { useGeographicZoneStore } from '@/stores/geographicZone';
import { useLogStore } from '@/stores/log';
import { useOrderStore } from '@/stores/order';
import { useRaeDisposalStore } from '@/stores/raeDisposal';
import { useRaeProductStore } from '@/stores/raeProduct';
import { useScheduleItemStore } from '@/stores/scheduleItem';
import { useScheduleStore } from '@/stores/schedule';
import { useServiceStore } from '@/stores/service';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

const lastRequest = () => http.makeRequest.mock.calls.at(-1);
const lastUpload = () => http.uploadRequest.mock.calls.at(-1);

const flushList = (store) => {
  store.initList();
  vi.advanceTimersByTime(50);
  return lastRequest();
};


beforeEach(() => {
  setActivePinia(createPinia());
  vi.useFakeTimers();
  vi.clearAllMocks();
});

afterEach(() => vi.useRealTimers());


describe('administrationUser store', () => {
  it('non manda mai la password in chiaro', () => {
    const store = useAdministrationUserStore();
    store.element = { nickname: 'mario', password: 'segreta', role: 'Customer' };

    store.createElement(vi.fn());

    const [url, method, payload] = lastRequest();
    expect([url, method]).toEqual(['user', 'POST']);
    expect(payload.body.nickname).toBe('mario');
    expect(payload.body.password).not.toBe('segreta');
    expect(payload.body.password).toBeTruthy();
  });

  it('cancella senza forzare per default', () => {
    const store = useAdministrationUserStore();

    store.deleteElement(false, { id: 9 }, vi.fn());

    const [url, method, payload] = lastRequest();
    expect([url, method]).toEqual(['user/9', 'DELETE']);
    expect(payload.params).toEqual({});
  });

  it('passa il flag force quando richiesto', () => {
    const store = useAdministrationUserStore();

    store.deleteElement(true, { id: 9 }, vi.fn());

    expect(lastRequest()[2].params).toEqual({ force: true });
  });
});


describe('customerGroup store', () => {
  it('assegna un cliente al gruppo corrente', () => {
    const store = useCustomerGroupStore();
    store.element = { id: 3 };

    store.assignUser(7, vi.fn());

    const [url, method, payload] = lastRequest();
    expect([url, method]).toEqual(['customer-group/user', 'PUT']);
    expect(payload.body).toEqual({ user_id: 7, customer_group_id: 3 });
  });

  it('sgancia il cliente azzerando il gruppo', () => {
    const store = useCustomerGroupStore();
    store.element = { id: 3 };

    store.assignUser(7, vi.fn(), true);

    expect(lastRequest()[2].body).toEqual({ user_id: 7, customer_group_id: null });
  });
});


describe('customerRule store', () => {
  it('cancella piu regole in una sola richiesta', () => {
    const store = useCustomerRuleStore();
    const func = vi.fn();

    store.deleteElements([1, 2, 3], func);

    const [url, method, payload, callback] = lastRequest();
    expect([url, method]).toEqual(['customer-rule', 'DELETE']);
    expect(payload.body).toEqual({ ids: [1, 2, 3] });
    expect(callback).toBe(func);
  });
});


describe('dashboard store', () => {
  it('parte vuota e non in caricamento', () => {
    const store = useDashboardStore();

    expect(store.ready).toBe(false);
    expect(store.loading).toBe(false);
    expect(store.analytics.orders_by_status).toEqual([]);
  });

  it('chiede le analytics nell-intervallo scelto', () => {
    const store = useDashboardStore();
    store.filters = { start: '2026-09-01', end: '2026-09-30' };

    store.load();

    const [url, method, payload] = lastRequest();
    expect([url, method]).toEqual(['dashboard/analytics', 'POST']);
    expect(payload.body).toEqual({ start: '2026-09-01', end: '2026-09-30' });
    expect(store.loading).toBe(true);
  });

  it('salva i dati e chiude il caricamento', () => {
    const store = useDashboardStore();
    store.load();

    lastRequest()[3]({ analytics: { kpis: { orders: 10 } } });

    expect(store.analytics).toEqual({ kpis: { orders: 10 } });
    expect(store.ready).toBe(true);
    expect(store.loading).toBe(false);
  });
});


describe('geographicZone store', () => {
  it('crea un-entita legata alla zona corrente', () => {
    const store = useGeographicZoneStore();
    store.element = { id: 4 };

    store.createEntity({ cap: '70020' }, 'cap', vi.fn());

    const [url, method, payload] = lastRequest();
    expect([url, method]).toEqual(['geographic-zone/cap', 'POST']);
    expect(payload.body).toEqual({ cap: '70020', zone_id: 4 });
  });

  it('cancella un-entita della zona', () => {
    const store = useGeographicZoneStore();

    store.deleteEntity({ id: 11 }, 'cap', vi.fn());

    expect(lastRequest().slice(0, 2)).toEqual(['geographic-zone/cap/11', 'DELETE']);
  });
});


describe('log store', () => {
  it('parte dal primo tipo di data disponibile', () => {
    const store = useLogStore();

    expect(store.filtersSetting.dateType).toBe(Object.keys(storesUtils.LOG_DATE_FILTER_TYPES)[0]);
    expect(store.filtersSetting.doubleDates).toBe(false);
  });

  it('chiede i log filtrati in post', () => {
    const store = useLogStore();
    store.filters = { 'Log.created_at': ['2026-09-01', null] };

    const [url, method, payload] = flushList(store);

    expect([url, method]).toEqual(['log/filter', 'POST']);
    expect(payload.body.filters).toEqual([{ value: '2026-09-01', model: 'Log', field: 'created_at' }]);
  });

  it('salva i log ricevuti', () => {
    const store = useLogStore();

    store.setList({ logs: [{ id: 1 }] });

    expect(store.list).toEqual([{ id: 1 }]);
    expect(store.ready).toBe(true);
  });
});


describe('order store', () => {
  const readOnly = {
    created_at: 'ieri',
    updated_at: 'oggi',
    delivery_group: {},
    services: [],
    user: {},
    dates_form: {},
    schedulation: {}
  };

  it('non rimanda i campi calcolati quando crea', () => {
    const store = useOrderStore();
    store.element = { addressee: 'Mario', ...readOnly };

    store.createElement(vi.fn());

    const [url, method, payload] = lastRequest();
    expect([url, method]).toEqual(['order', 'POST']);
    expect(payload.body).toEqual({ addressee: 'Mario' });
  });

  it('non rimanda i campi calcolati quando aggiorna', () => {
    const store = useOrderStore();
    store.element = { id: 7, addressee: 'Mario', ...readOnly };

    store.updateElement(vi.fn());

    expect(lastRequest()[0]).toBe('order/7');
    expect(lastRequest()[2].body).toEqual({ id: 7, addressee: 'Mario' });
  });

  it('manda foto e firma come upload separato', () => {
    const store = useOrderStore();
    const photos = [new File(['x'], 'foto.jpg', { type: 'image/jpeg' })];
    const signature = new File(['x'], 'firma.png', { type: 'image/png' });
    store.element = { id: 7, addressee: 'Mario', photos, signature, photo: 'vecchia' };

    store.updateElementWithFormData(vi.fn());

    const [url, method, payload] = lastUpload();
    expect([url, method]).toEqual(['order/7', 'PUT']);
    expect(payload.files).toEqual({ photos, signature });
    expect(payload.body).not.toHaveProperty('photos');
    expect(payload.body).not.toHaveProperty('signature');
    expect(payload.body).not.toHaveProperty('photo');
    expect(payload.extensions).toContain('jpg');
  });

  it('chiede gli ordini filtrati in post', () => {
    const store = useOrderStore();
    store.filters = { 'Order.status': 'Acquired' };

    const [url, method, payload] = flushList(store);

    expect([url, method]).toEqual(['order/filter', 'POST']);
    expect(payload.body.filters).toEqual([{ value: 'Acquired', model: 'Order', field: 'status' }]);
  });

  it('salva gli ordini ricevuti', () => {
    const store = useOrderStore();

    store.setList({ orders: [{ id: 1 }] });

    expect(store.list).toEqual([{ id: 1 }]);
    expect(store.ready).toBe(true);
  });
});


describe('raeDisposal store', () => {
  it('manda le due copie del fir come upload pdf', () => {
    const store = useRaeDisposalStore();
    const prima = new File(['x'], 'prima.pdf', { type: 'application/pdf' });
    const quarta = new File(['x'], 'quarta.pdf', { type: 'application/pdf' });
    store.element = { id: 3, date: '2026-09-01', first_copy_document_fir: prima, fourth_copy_document_fir: quarta };

    store.updateElementWithFormData(vi.fn());

    const [url, method, payload] = lastUpload();
    expect([url, method]).toEqual(['rae/disposal/3', 'PUT']);
    expect(payload.files).toEqual({ first_copy_document_fir: prima, fourth_copy_document_fir: quarta });
    expect(payload.body).toEqual({ id: 3, date: '2026-09-01' });
    expect(payload.extensions).toEqual(expect.arrayContaining(['pdf']));
  });
});


describe('raeProduct store', () => {
  it('manda il documento come upload pdf', () => {
    const store = useRaeProductStore();
    const document = new File(['x'], 'dtr.pdf', { type: 'application/pdf' });
    store.element = { id: 5, status: 'Emitted', document };

    store.updateElementWithFormData(vi.fn());

    const [url, method, payload] = lastUpload();
    expect([url, method]).toEqual(['rae/product/5', 'PUT']);
    expect(payload.files).toEqual({ document });
    expect(payload.body).not.toHaveProperty('document');
    expect(payload.extensions).toEqual(expect.arrayContaining(['pdf']));
  });

  it('chiede i prodotti rae filtrati in post', () => {
    const store = useRaeProductStore();
    store.filters = { 'RaeProduct.dtr_date': ['2026-09-01', '2026-09-30'] };

    const [url, method, payload] = flushList(store);

    expect([url, method]).toEqual(['rae/product/filter', 'POST']);
    expect(payload.body.filters).toEqual([
      { value: ['2026-09-01', '2026-09-30'], model: 'RaeProduct', field: 'dtr_date' }
    ]);
  });
});


describe('schedule store', () => {
  it('non rimanda i campi calcolati', () => {
    const store = useScheduleStore();
    store.element = {
      id: 3,
      date: '2026-09-01',
      created_at: 'ieri',
      updated_at: 'oggi',
      transport: {},
      orders: [],
      schedulation: {}
    };

    store.updateElement(vi.fn());

    expect(lastRequest()[2].body).toEqual({ id: 3, date: '2026-09-01' });
  });

  it('chiede i bordero filtrati in post', () => {
    const store = useScheduleStore();
    store.filters = { 'Schedule.date': ['2026-09-01', null] };

    const [url, method, payload] = flushList(store);

    expect([url, method]).toEqual(['schedule/filter', 'POST']);
    expect(payload.body.filters).toEqual([{ value: '2026-09-01', model: 'Schedule', field: 'date' }]);
  });
});


describe('scheduleItem store', () => {
  it('aggiorna con un corpo vuoto', () => {
    // Nota: updateElement e' rimasto uno stub, manda una PUT su schedule/<id>
    // senza alcun campo.
    const store = useScheduleItemStore();
    store.element = { id: 4, index: 2 };

    store.updateElement(vi.fn());

    const [url, method, payload] = lastRequest();
    expect([url, method]).toEqual(['schedule/4', 'PUT']);
    expect(payload.body).toEqual({});
  });
});


describe('service store', () => {
  it('collega un cliente al servizio corrente', () => {
    const store = useServiceStore();
    store.element = { id: 2 };

    store.createServiceUserRelationships({ user_id: 7, price: 10 }, vi.fn());

    const [url, method, payload] = lastRequest();
    expect([url, method]).toEqual(['service/customer', 'POST']);
    expect(payload.body).toEqual({ user_id: 7, price: 10, service_id: 2 });
  });

  it('aggiorna il legame con il cliente senza i campi di sola lettura', () => {
    const store = useServiceStore();

    store.updateServiceUserRelationships({ id: 5, price: 12, created_at: 'ieri', updated_at: 'oggi' }, vi.fn());

    const [url, method, payload] = lastRequest();
    expect([url, method]).toEqual(['service/customer/5', 'PUT']);
    expect(payload.body).toEqual({ id: 5, price: 12 });
  });

  it('scollega il cliente dal servizio', () => {
    const store = useServiceStore();

    store.deleteServiceUserRelationships({ id: 5 }, vi.fn());

    expect(lastRequest().slice(0, 2)).toEqual(['service/customer/5', 'DELETE']);
  });

  it('dopo il popup ricarica il servizio aperto', () => {
    const store = useServiceStore();
    store.element = { id: 2 };
    store.innerElement = { user_id: 7 };
    store.activePopUpForm = true;

    store.setList({ services: [{ id: 1, name: 'Uno' }, { id: 2, name: 'Due' }] });

    expect(store.element).toEqual({ id: 2, name: 'Due' });
    expect(store.activePopUpForm).toBe(false);
    expect(store.innerElement).toEqual({});
  });

  it('senza popup lascia intatto l-elemento selezionato', () => {
    const store = useServiceStore();
    store.element = { id: 2 };

    store.setList({ services: [{ id: 2, name: 'Due' }] });

    expect(store.element).toEqual({ id: 2 });
  });
});
