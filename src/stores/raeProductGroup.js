import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

export const useRaeProductGroupStore = defineStore('raeProductGroup', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    createElement(router, func) {
      http.postRequest(
        'rae/product-group',
        this.element,
        func,
        'POST',
        router
      );
    },
    updateElement(router, func) {
      http.postRequest(
        `rae/product-group/${this.element.id}`,
        storesUtils.exclude_keys(this.element, ['created_at', 'updated_at']),
        func,
        'PUT',
        router
      );
    },
    initList(router) {
      http.getRequest(
        'rae/product-group',
        {},
        this.setList,
        'GET',
        router
      );
    },
    deleteElement(element, router, func) {
      http.getRequest(
        `rae/product-group/${element.id}`,
        {},
        func,
        'DELETE',
        router
      );
    },
    setList(data) {
      this.list = data.rae_product_groups;
      this.ready = true;
    }
  }
});
