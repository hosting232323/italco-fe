import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import CustomerGroupPopUp from '@/components/administration/sellingPoints/CustomerGroupPopUp.vue';
import CustomerGroupPopUpForm from '@/components/administration/sellingPoints/CustomerGroupPopUpForm.vue';
import CustomerGroupPopUpTable from '@/components/administration/sellingPoints/CustomerGroupPopUpTable.vue';
import CustomerRuleForm from '@/components/administration/sellingPoints/CustomerRuleForm.vue';
import CustomerRuleTable from '@/components/administration/sellingPoints/CustomerRuleTable.vue';
import { useAdministrationUserStore } from '@/stores/administrationUser';
import { useCustomerGroupStore } from '@/stores/customerGroup';
import { useCustomerRuleStore } from '@/stores/customerRule';

import { createTestPinia, mountComponent } from '../../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

let pinia;

const withCustomers = () => {
  const users = useAdministrationUserStore();
  users.ready = true;
  users.list = [
    { id: 7, nickname: 'mario', role: 'Customer' },
    { id: 8, nickname: 'admin', role: 'Admin' }
  ];
};


beforeEach(() => {
  pinia = createTestPinia();
  withCustomers();
  window.innerWidth = 1280;
  vi.clearAllMocks();
});


describe('CustomerGroupPopUp', () => {
  let store;

  beforeEach(() => {
    store = useCustomerGroupStore();
    store.element = { id: 3, name: 'Gruppo Bari', users: [] };
  });

  it('intitola il popup sul gruppo aperto', () => {
    expect(mountComponent(CustomerGroupPopUp, { pinia }).text()).toContain('GDO: Gruppo Bari');
  });

  it('apre il form dal piu', async () => {
    const wrapper = mountComponent(CustomerGroupPopUp, { pinia });

    await wrapper.find('.mdi-plus').trigger('click');

    expect(wrapper.findComponent(CustomerGroupPopUpForm).exists()).toBe(true);
  });

  it('mostra la tabella solo con almeno un utente', () => {
    expect(mountComponent(CustomerGroupPopUp, { pinia }).findComponent(CustomerGroupPopUpTable).exists()).toBe(false);

    store.element.users = [{ id: 7, nickname: 'mario' }];

    expect(mountComponent(CustomerGroupPopUp, { pinia }).findComponent(CustomerGroupPopUpTable).exists()).toBe(true);
  });
});


describe('CustomerGroupPopUpForm', () => {
  let store;

  beforeEach(() => {
    store = useCustomerGroupStore();
    store.element = { id: 3, name: 'Gruppo Bari', users: [] };
  });

  it('propone solo i clienti', () => {
    const items = mountComponent(CustomerGroupPopUpForm, { pinia })
      .findComponent({ name: 'VAutocomplete' })
      .props('items');

    expect(items.map(({ nickname }) => nickname)).toEqual(['mario']);
  });

  it('non assegna nulla senza utente', async () => {
    const assignUser = vi.spyOn(store, 'assignUser');
    const wrapper = mountComponent(CustomerGroupPopUpForm, { pinia });

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(assignUser).not.toHaveBeenCalled();
  });

  it('assegna il cliente scelto e aggiorna il gruppo', async () => {
    const assignUser = vi.spyOn(store, 'assignUser').mockImplementation(() => {});
    const initList = vi.spyOn(store, 'initList').mockImplementation(() => {});
    const wrapper = mountComponent(CustomerGroupPopUpForm, { pinia });
    await wrapper.findComponent({ name: 'VAutocomplete' }).vm.$emit('update:modelValue', 7);

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(assignUser).toHaveBeenCalledWith(7, expect.any(Function));

    assignUser.mock.calls.at(-1)[1]({ status: 'ok', user: { id: 7, nickname: 'mario' } });

    expect(initList).toHaveBeenCalled();
    expect(store.element.users).toEqual([{ id: 7, nickname: 'mario' }]);
    expect(wrapper.emitted('closeForm')).toHaveLength(1);
  });
});


describe('CustomerGroupPopUpTable', () => {
  let store;

  beforeEach(() => {
    store = useCustomerGroupStore();
    store.element = {
      id: 3,
      name: 'Gruppo Bari',
      users: [{ id: 7, nickname: 'mario' }, { id: 8, nickname: 'anna' }]
    };
  });

  it('mostra una riga per utente', () => {
    expect(mountComponent(CustomerGroupPopUpTable, { pinia }).findAll('tbody tr')).toHaveLength(2);
  });

  it('sgancia l-utente dal gruppo', async () => {
    const assignUser = vi.spyOn(store, 'assignUser').mockImplementation(() => {});
    const initList = vi.spyOn(store, 'initList').mockImplementation(() => {});
    const wrapper = mountComponent(CustomerGroupPopUpTable, { pinia });

    await wrapper.findAll('tbody tr')[0].find('.mdi-delete').trigger('click');

    expect(assignUser).toHaveBeenCalledWith(7, expect.any(Function), true);

    assignUser.mock.calls.at(-1)[1]();

    expect(initList).toHaveBeenCalled();
    expect(store.element.users.map(({ id }) => id)).toEqual([8]);
  });
});


describe('CustomerRuleForm', () => {
  let store;

  beforeEach(() => {
    store = useCustomerRuleStore();
    store.activeForm = true;
    store.element = {};
  });

  it('resta chiuso finche non lo si apre', () => {
    store.activeForm = false;

    expect(mountComponent(CustomerRuleForm, { pinia }).find('form').exists()).toBe(false);
  });

  it('propone solo i clienti', () => {
    const items = mountComponent(CustomerRuleForm, { pinia })
      .findComponent({ name: 'VAutocomplete' })
      .props('items');

    expect(items.map(({ nickname }) => nickname)).toEqual(['mario']);
  });

  it('non crea nulla con il form vuoto', async () => {
    const createElement = vi.spyOn(store, 'createElement');
    const wrapper = mountComponent(CustomerRuleForm, { pinia });

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(createElement).not.toHaveBeenCalled();
  });

  it('crea la regola e richiude il form', async () => {
    const createElement = vi.spyOn(store, 'createElement').mockImplementation(() => {});
    const initList = vi.spyOn(store, 'initList').mockImplementation(() => {});
    store.element = { day_of_week: 0, max_orders: 5, user_id: 7 };
    const wrapper = mountComponent(CustomerRuleForm, { pinia });

    await wrapper.find('form').trigger('submit');
    await flushPromises();
    createElement.mock.calls.at(-1)[0]({ status: 'ok' });

    expect(initList).toHaveBeenCalled();
    expect(store.element).toEqual({});
    expect(store.activeForm).toBe(false);
  });
});


describe('CustomerRuleTable', () => {
  const righe = [
    { id: 1, nickname: 'mario', rules: [{ id: 10, day_of_week: 0, max_orders: 5 }, { id: 11, day_of_week: 6, max_orders: 2 }] }
  ];

  it('mostra lo scheletro finche la lista non e pronta', () => {
    useCustomerRuleStore().ready = false;

    expect(mountComponent(CustomerRuleTable, { pinia }).find('.v-skeleton-loader').exists()).toBe(true);
  });

  it('elenca le regole per giorno', () => {
    const store = useCustomerRuleStore();
    store.ready = true;
    store.list = righe;

    const testo = mountComponent(CustomerRuleTable, { pinia }).find('tbody tr').text();

    expect(testo).toContain('Lunedì');
    expect(testo).toContain('Domenica');
  });

  it('cancella tutte le regole dell-utente in un colpo', async () => {
    const store = useCustomerRuleStore();
    store.ready = true;
    store.list = righe;
    const deleteElements = vi.spyOn(store, 'deleteElements').mockImplementation(() => {});
    const initList = vi.spyOn(store, 'initList').mockImplementation(() => {});
    const wrapper = mountComponent(CustomerRuleTable, { pinia });

    await wrapper.find('.mdi-delete').trigger('click');

    expect(deleteElements).toHaveBeenCalledWith([10, 11], expect.any(Function));

    deleteElements.mock.calls.at(-1)[1]();

    expect(initList).toHaveBeenCalled();
  });
});
