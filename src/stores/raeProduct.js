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
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'rae/product/filter',
        'POST',
        { body: { filters: storesUtils.formatFilters(
          this.filters,
          storesUtils.RAE_PRODUCT_DATE_FILTER_TYPES,
          'Order'
        ) } },
        callback
      ));
    },
    updateElementWithFormData(func) {
      const content = {
        data: JSON.stringify(storesUtils.exclude_keys(this.element, ['document']))
      };

      if (this.element.document)
        content.document = this.element.document.selectedFile;

      http.uploadRequest(
        `rae/product/${this.element.id}`,
        'PUT',
        { body: content },
        func
      );
    },
    deleteElement(element, func) {
      http.makeRequest(
        `rae/product/${element.id}`,
        'DELETE',
        {},
        func
      );
    },
    setList(data) {
      this.list = data.rae_products;
      this.ready = true;
    }
  }
});
