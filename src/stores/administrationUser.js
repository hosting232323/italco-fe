import http from '@/utils/http';
import { defineStore } from 'pinia';

export const useAdministrationUserStore = defineStore('administrationUser', {
  state: () => ({
    element: {},
    list: [],
    activeForm: false
  }),
  actions: {
    createElement(func) {
      http.postRequest('user', this.element, func);
    },
    initList() {
      http.getRequest('user', {}, this.setList);
    },
    setList(data) {
      this.list = data.users;
    },
    deleteElement(element, func) {
      http.getRequest(`user/${element.email}`, {}, func, 'DELETE');
    }
  }
});
