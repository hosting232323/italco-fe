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
    createElement(router, func) {
      http.postRequest(
        'customer-group',
        this.element,
        func,
        'POST',
        router
      );
    },
    initList(router) {
      storesUtils.refreshList(this, (callback) => http.getRequest(
        'customer-group',
        {},
        callback,
        'GET',
        router
      ));
    },
    deleteElement(element, router, func) {
      http.getRequest(
        `customer-group/${element.id}`,
        {},
        func,
        'DELETE',
        router
      );
    },
    assignUser(userId, router, func, deassign = false) {
      http.postRequest(
        'customer-group/user',
        {
          user_id: userId,
          customer_group_id: deassign ? null : this.element.id
        },
        func,
        'PUT',
        router
      );
    },
    setList(data) {
      this.list = data.customer_groups;
      this.ready = true;
    }
  }
});
