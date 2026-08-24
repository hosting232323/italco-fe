import { beforeEach, describe, expect, it } from 'vitest';

import { createTestPinia } from '../../helpers/mount';
import { useUserStore } from '@/stores/user';
import rae from '@/utils/rae';


beforeEach(() => createTestPinia());


describe('filterCloneProducts', () => {
  it('con il modulo attivo conserva i prodotti normali e i RAEE annullati', () => {
    useUserStore().company = { rae: true };
    const products = {
      normal: { services: [] },
      annulled: {
        rae_product: { status: 'Annulled' }
      },
      emitted: {
        rae_product: { status: 'Emitted' }
      }
    };

    expect(rae.filterCloneProducts(products)).toEqual({
      normal: products.normal,
      annulled: products.annulled
    });
  });

  it('con il modulo spento esclude anche i RAEE annullati', () => {
    useUserStore().company = { rae: false };
    const products = {
      normal: { services: [] },
      annulled: { rae_product: { status: 'Annulled' } }
    };

    expect(rae.filterCloneProducts(products)).toEqual({ normal: products.normal });
  });
});
