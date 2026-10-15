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
    createElement(func) {
      http.makeRequest(
        'customer-rule',
        'POST',
        { body: this.element },
        func
      );
    },
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'customer-rule',
        'GET',
        {},
        callback
      ));
    },
    deleteElements(ids, func) {
      http.makeRequest(
        'customer-rule',
        'DELETE',
        { body: { ids: ids } },
        func
      );
    },
    setList(data) {
      this.list = data.customer_rules;
      this.ready = true;
    }
  }
});
