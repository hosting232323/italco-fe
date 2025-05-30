import http from '@/utils/http';
import { defineStore } from 'pinia';

export const useTransportStore = defineStore('transport', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    createElement(router, func) {
      http.postRequest(
        'transport',
        this.element,
        func,
        'POST',
        router
      );
    },
    updateElement(router, func) {
      http.postRequest(
        `transport/${this.element.id}`,
        Object.fromEntries(
          Object.entries(this.element).filter(([key]) => !['created_at', 'updated_at'].includes(key))
        ),
        func,
        'PUT',
        router
      );
    },
    initList(router) {
      http.getRequest(
        'transport',
        {},
        this.setList,
        'GET',
        router
      );
    },
    deleteElement(element, router, func) {
      http.getRequest(
        `transport/${element.id}`,
        {},
        func,
        'DELETE',
        router
      );
    },
    setList(data) {
      this.list = data.transports;
      this.ready = true;
    }
  }
});
