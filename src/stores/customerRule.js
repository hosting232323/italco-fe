import http from '@/utils/http';
import { defineStore } from 'pinia';

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
      http.getRequest(
        'customer-rule',
        {},
        this.setList,
        'GET',
        router
      );
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
