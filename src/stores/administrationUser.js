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
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'user',
        'GET',
        {},
        callback
      ));
    },
    updateAutomaticPlanning(id, automaticPlanning, func) {
      http.makeRequest(
        `user/${id}`,
        'PUT',
        { body: { automatic_planning: automaticPlanning } },
        func
      );
    },
    resetPassword(id, password, func) {
      const body = password ? { password } : {};
      http.makeRequest(`user/${id}/password`, 'POST', { body }, func);
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
