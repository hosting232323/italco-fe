import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

export const useCustomerRuleStore = defineStore('customerRule', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    createElement(router, func) {
      http.postRequest(
        'customer-rule',
        this.element,
        func,
        'POST',
        router
      );
    },
    initList(router) {
      storesUtils.refreshList(this, (callback) => http.getRequest(
        'customer-rule',
        {},
        callback,
        'GET',
        router
      ));
    },
    deleteElements(ids, router, func) {
      http.postRequest(
        'customer-rule',
        {ids: ids},
        func,
        'DELETE',
        router
      );
    },
    setList(data) {
      this.list = data.customer_rules;
      this.ready = true;
    }
  }
});
