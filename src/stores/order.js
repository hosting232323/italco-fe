import http from '@/utils/http';
import { defineStore } from 'pinia';

export const useOrderStore = defineStore('order', {
  state: () => ({
    element: {},
    list: [],
    activeForm: false
  }),
  actions: {
    createElement(router, func) {
      http.postRequest(
        'order',
        this.element,
        func,
        'POST',
        router
      );
    },
    updateElement(router, func) {
      http.postRequest(
        `order/${this.element.id}`,
        Object.fromEntries(
          Object.entries(this.element).filter(([key]) => !['created_at', 'updated_at'].includes(key))
        ),
        func,
        'PUT',
        router
      );
    },
    initList(router) {
      http.getRequest(
        'order',
        {},
        this.setList,
        'GET',
        router
      );
    },
    setList(data) {
      this.list = data.orders;
    }
  }
});
