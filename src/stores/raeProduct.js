import http from '@/utils/http';
import { defineStore } from 'pinia';

export const useRaeProductGroupStore = defineStore('raeProductGroup', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    initList(router) {
      http.getRequest(
        'rae/product',
        {},
        this.setList,
        'GET',
        router
      );
    },
    setList(data) {
      this.list = data.rae_products;
      this.ready = true;
    }
  }
});
