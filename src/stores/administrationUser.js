import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

export const useAdministrationUserStore = defineStore('administrationUser', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    createElement(func) {
      http.makeRequest(
        'user',
        'POST',
        { body: { ...this.element } },
        func
      );
    },
    updateElement(func) {
      const body = { email: this.element.email };
      if (this.element.password) body.password = this.element.password;

      http.makeRequest(
        `user/${this.element.id}`,
        'PUT',
        { body },
        func
      );
    },
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'user',
        'GET',
        {},
        callback
      ));
    },
    deleteElement(force, element, func) {
      const args = {};
      if (force) args.force = force;

      http.makeRequest(
        `user/${element.id}`,
        'DELETE',
        { params: args },
        func
      );
    },
    setList(data) {
      this.list = data.users;
      this.ready = true;
    }
  }
});
