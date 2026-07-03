import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

export const useTransportStore = defineStore('transport', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    createElement(func) {
      http.makeRequest(
        'transport',
        'POST',
        { body: this.element },
        func
      );
    },
    updateElement(func) {
      http.makeRequest(
        `transport/${this.element.id}`,
        'PUT',
        { body: storesUtils.exclude_keys(this.element, ['created_at', 'updated_at']) },
        func
      );
    },
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'transport',
        'GET',
        {},
        callback
      ));
    },
    deleteElement(element, func) {
      http.makeRequest(
        `transport/${element.id}`,
        'DELETE',
        {},
        func
      );
    },
    setList(data) {
      this.list = data.transports;
      this.ready = true;
    }
  }
});
