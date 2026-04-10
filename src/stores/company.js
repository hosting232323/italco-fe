import http from '@/utils/http';
import { defineStore } from 'pinia';

export const useCompanyStore = defineStore('comany', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    showPopUp: false,
  }),
  actions: {
    updateElement(router, func) {
      http.postRequest(
        `schedule/${this.element.id}`,
        {},
        func,
        'PUT',
        router
      );
    },
    initList(router) {
      http.getRequest(
        'company',
        {},
        this.setList,
        'GET',
        router
      );
    },
    setList(data) {
      this.list = data.companies;
      this.ready = true;
    }
  }
});
