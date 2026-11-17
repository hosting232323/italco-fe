import { beforeEach, describe, expect, it, vi } from 'vitest';

import OrderInfoRow from '@/components/orders/OrderInfoRow.vue';
import { useUserStore } from '@/stores/user';

import { createTestPinia, mountComponent } from '../../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), downloadRequest: vi.fn() }
}));

const ORDER = {
  id: 24014,
  type: 'Delivery',
  status: 'Acquired',
  products: {},
  user: { id: 5, nickname: 'pv-bari', name: 'Negozio Bari', company_name: 'Negozio SRL' }
};

let pinia;

const mountRow = (item = ORDER) => mountComponent(OrderInfoRow, { pinia, props: { item } });


beforeEach(() => {
  pinia = createTestPinia();
});


describe('OrderInfoRow, punto vendita', () => {
  it.each(['Admin', 'Operator'])('mostra il nome del punto vendita al ruolo %s', (role) => {
    useUserStore().role = role;

    const text = mountRow().text();

    expect(text).toContain('Punto Vendita: Negozio Bari');
    expect(text).not.toContain('Negozio SRL');
  });

  it('ripiega sul nickname se il punto vendita non ha un nome', () => {
    useUserStore().role = 'Admin';

    expect(mountRow({ ...ORDER, user: { id: 5, nickname: 'pv-bari' } }).text()).toContain('Punto Vendita: pv-bari');
  });

  it('non lo mostra al punto vendita stesso', () => {
    useUserStore().role = 'Customer';

    expect(mountRow().text()).not.toContain('Punto Vendita');
  });
});
