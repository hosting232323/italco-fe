import http from '@/utils/http';
import { defineStore } from 'pinia';

export const useOrderStore = defineStore('order', {
  state: () => ({
    element: {
      service: '',
      point_of_sale: ''
    },
    list: []
  }),
  actions: {
    createElement(func) {
      http.postRequest('order', this.element, func);
    },
    initList() {
      http.getRequest('order', {}, this.setList);
    },
    setList(data) {
      this.list = data.orders;
    }
  }
});
