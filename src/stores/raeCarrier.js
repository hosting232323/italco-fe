import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

export const useRaeCarrierStore = defineStore('raeCarrier', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false,
  }),
  actions: {
    createElement(func) {
      http.makeRequest(
        'rae/carrier',
        'POST',
        { body: this.element },
        func
      );
    },
    updateElement(func) {
      http.makeRequest(
        `rae/carrier/${this.element.id}`,
        'PUT',
        { body: storesUtils.exclude_keys(this.element, ['created_at', 'updated_at', 'users']) },
        func
      );
    },
    deleteElement(element, func) {
      http.makeRequest(
        `rae/carrier/${element.id}`,
        'DELETE',
        {},
        func
      );
    },
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'rae/carrier',
        'GET',
        {},
        callback
      ));
    },
    setList(data) {
      this.list = data.rae_carriers;
      this.ready = true;
    }
  }
});
