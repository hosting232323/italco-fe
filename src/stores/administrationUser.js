import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';
import { encryptPassword } from 'generic-module';

const iv = import.meta.env.VITE_IV;
const secretKey = import.meta.env.VITE_SECRET_KEY;

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
        { body: {
          ...this.element,
          password: encryptPassword(this.element.password, secretKey, iv)
        } },
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
