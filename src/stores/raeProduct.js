import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

export const useRaeProductStore = defineStore('raeProduct', {
  state: () => ({
    list: [],
    filters: {},
    ready: false,
    filtersSetting: {
      doubleDates: false,
      dateType: Object.keys(storesUtils.RAE_PRODUCT_FILTER_TYPES)[0]
    }
  }),
  actions: {
    initList(router) {
      http.postRequest(
        'rae/product/filter',
        {filters: storesUtils.formatFilters(
          this.filters,
          storesUtils.ORDER_DATE_FILTER_TYPES,
          'Order'
        )},
        this.setList,
        'POST',
        router
      );
    },
    deleteElement(element, router, func) {
      http.getRequest(
        `rae/product/${element.id}`,
        {},
        func,
        'DELETE',
        router
      );
    },
    setList(data) {
      this.list = data.rae_products;
      this.ready = true;
    }
  }
});
