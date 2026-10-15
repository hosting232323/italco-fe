import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

export const useCustomerGroupStore = defineStore('customerGroup', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    createElement(func) {
      http.makeRequest(
        'customer-group',
        'POST',
        { body: this.element },
        func
      );
    },
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'customer-group',
        'GET',
        {},
        callback
      ));
    },
    deleteElement(element, func) {
      http.makeRequest(
        `customer-group/${element.id}`,
        'DELETE',
        {},
        func
      );
    },
    assignUser(userId, func, deassign = false) {
      http.makeRequest(
        'customer-group/user',
        'PUT',
        { body: {
          user_id: userId,
          customer_group_id: deassign ? null : this.element.id
        } },
        func
      );
    },
    setList(data) {
      this.list = data.customer_groups;
      this.ready = true;
    }
  }
});
