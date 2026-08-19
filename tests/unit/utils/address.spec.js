import { describe, expect, it } from 'vitest';

import caps from '@/assets/caps';
import address from '@/utils/address';


describe('getProvinces', () => {
  it('elenca le province presenti nei cap', () => {
    const province = address.getProvinces();

    expect(province).toEqual(Object.keys(caps));
    expect(province.length).toBeGreaterThan(0);
  });
});


describe('getCapItems', () => {
  it('produce voci con cap e citta con provincia', () => {
    const items = address.getCapItems();

    expect(items[0]).toEqual({ value: expect.any(String), title: expect.stringMatching(/.+\(.+\)$/) });
  });

  it('non ripete la stessa citta due volte', () => {
    const titoli = address.getCapItems().map(({ title }) => title);

    expect(new Set(titoli).size).toBe(titoli.length);
  });
});


describe('getCityByCap', () => {
  it('trova la citta dal cap', () => {
    const [provincia, comuni] = Object.entries(caps)[0];
    const [cap, info] = Object.entries(comuni)[0];

    expect(address.getCityByCap(cap)).toBe(`${info.name} (${provincia})`);
  });

  it('non restituisce nulla per un cap sconosciuto', () => {
    expect(address.getCityByCap('00000')).toBeUndefined();
  });
});
