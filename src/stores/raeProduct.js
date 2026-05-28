import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

export const useRaeProductStore = defineStore('raeProduct', {
  state: () => ({
    list: [],
    element: {},
    filters: {},
    ready: false,
    filtersSetting: {
      doubleDates: false,
      dateType: Object.keys(storesUtils.RAE_PRODUCT_DATE_FILTER_TYPES)[0]
    }
  }),
  actions: {
    initList(router) {
      http.postRequest(
        'rae/product/filter',
        {filters: storesUtils.formatFilters(
          this.filters,
          storesUtils.RAE_PRODUCT_DATE_FILTER_TYPES,
          'Order'
        )},
        this.setList,
        'POST',
        router
      );
    },
    updateElement(router, func) {
      http.postRequest(
        `rae/product/${this.element.id}`,
        {status: this.element.status},
        func,
        'PUT',
        router
      );
    },
    setList(data) {
      this.list = data.rae_products;
      this.ready = true;
    }
  }
});
