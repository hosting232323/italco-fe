import http from '@/utils/http';
import { defineStore } from 'pinia';

export const useProductStore = defineStore('product', {
  state: () => ({
    element: {},
    list: [],
    activeForm: false
  }),
  actions: {
    createElement(router, func) {
      http.postRequest(
        'product',
        this.element,
        func,
        'POST',
        router
      );
    },
    updateElement(router, func) {
      http.postRequest(
        `product/${this.element.id}`,
        Object.fromEntries(
          Object.entries(this.element).filter(([key]) => !['created_at', 'updated_at', 'users'].includes(key))
        ),
        func,
        'PUT',
        router
      );
    },
    initList(router) {
      http.getRequest(
        'product',
        {},
        this.setList,
        'GET',
        router
      );
    },
    deleteElement(element, router, func) {
      http.getRequest(
        `product/${element.id}`,
        {},
        func,
        'DELETE',
        router
      );
    },
    setList(data) {
      this.list = data.products;
    }
  }
});
