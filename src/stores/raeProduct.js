import http from '@/utils/http';
import { defineStore } from 'pinia';
import { fileUtils } from 'generic-module';
import storesUtils from '@/utils/stores';
import rae from '@/utils/rae';

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
      // Attività senza modulo RAEE: nessuna lista da chiedere, ma ready va
      // messo lo stesso o getStoreList continuerebbe a richiamare initList.
      if (!rae.isEnabled()) {
        this.list = [];
        this.ready = true;
        return;
      }

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
      http.uploadRequest(
        `rae/product/${this.element.id}`,
        'PUT',
        {
          body: storesUtils.exclude_keys(this.element, ['document']),
          files: { document: this.element.document },
          extensions: fileUtils.pdfExtensions
        },
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
