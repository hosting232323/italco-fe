import http from '@/utils/http';
import { defineStore } from 'pinia';

export const useAdministrationUserStore = defineStore('administrationUser', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    createElement(router, func) {
      http.postRequest(
        'user',
        this.element,
        func,
        'POST',
        router
      );
    },
    initList(router) {
      http.getRequest(
        'user',
        {},
        this.setList,
        'GET',
        router
      );
    },
    deleteElement(force, element, router, func) {
      const args = {};
      if (force) args.force = force;

      http.getRequest(
        `user/${element.id}`,
        args,
        func,
        'DELETE',
        router
      );
    },
    setList(data) {
      this.list = data.users;
      this.ready = true;
    }
  }
});
