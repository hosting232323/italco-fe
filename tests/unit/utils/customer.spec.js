import { describe, expect, it } from 'vitest';

import customer from '@/utils/customer';


describe('customerName', () => {
  it.each([
    [{ nickname: 'nick', customer_user_info: { name: 'Negozio Bari' } }, 'Negozio Bari'],
    [{ nickname: 'nick', name: 'Dal payload ordini' }, 'Dal payload ordini'],
    [{ nickname: 'nick', customer_user_info: { name: '' } }, 'nick'],
    [{ nickname: 'nick', customer_user_info: {} }, 'nick'],
    [{ nickname: 'nick' }, 'nick'],
    [null, ''],
  ])('%j -> %s', (user, expected) => {
    expect(customer.customerName(user)).toBe(expected);
  });
});
