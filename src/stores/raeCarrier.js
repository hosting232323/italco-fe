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
    createElement(router, func) {
      http.postRequest(
        'rae/carrier',
        this.element,
        func,
        'POST',
        router
      );
    },
    updateElement(router, func) {
      http.postRequest(
        `rae/carrier/${this.element.id}`,
        storesUtils.exclude_keys(this.element, ['created_at', 'updated_at', 'users']),
        func,
        'PUT',
        router
      );
    },
    deleteElement(element, router, func) {
      http.getRequest(
        `rae/carrier/${element.id}`,
        {},
        func,
        'DELETE',
        router
      );
    },
    initList(router) {
      http.getRequest(
        'rae/carrier',
        {},
        this.setList,
        'GET',
        router
      );
    },
    setList(data) {
      this.list = data.rae_carriers;
      this.ready = true;
    }
  }
});
