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
    updateElementWithFormData(router, func) {
      const content = {
        data: JSON.stringify(storesUtils.exclude_keys(this.element, ['document']))
      };

      if (this.element.document)
        content.document = this.element.document.selectedFile;

      http.formDataRequest(
        `rae/product/${this.element.id}`,
        content,
        func,
        'PUT',
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
