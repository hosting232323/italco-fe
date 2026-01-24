import http from '@/utils/http';
import { defineStore } from 'pinia';
import storeUtils from '@/utils/stores';

export const useRaeProductStore = defineStore('raeProduct', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    createElement(router, func) {
      http.postRequest(
        'rae-product',
        this.element,
        func,
        'POST',
        router
      );
    },
    updateElement(router, func) {
      http.postRequest(
        `rae-product/${this.element.id}`,
        storeUtils.exclude_keys(this.element, ['created_at', 'updated_at']),
        func,
        'PUT',
        router
      );
    },
    initList(router) {
      http.getRequest(
        'rae-product',
        {},
        this.setList,
        'GET',
        router
      );
    },
    deleteElement(element, router, func) {
      http.getRequest(
        `rae-product/${element.id}`,
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
