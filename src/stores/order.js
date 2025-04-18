import http from '@/utils/http';
import { defineStore } from 'pinia';

export const useOrderStore = defineStore('order', {
  state: () => ({
    element: {},
    list: []
  }),
  actions: {
    createElement(func) {
      http.postRequest('order', this.element, func);
    },
    updateElement(func) {
      http.postRequest(
        `order/${this.element.id}`,
        Object.fromEntries(
          Object.entries(this.element).filter(([key]) => !['created_at', 'updated_at'].includes(key))
        ),
        func,
        'PUT'
      );
    },
    initList() {
      http.getRequest('order', {}, this.setList);
    },
    setList(data) {
      this.list = data.orders;
    }
  }
});
