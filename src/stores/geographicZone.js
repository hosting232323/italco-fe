import http from '@/utils/http';
import { defineStore } from 'pinia';

export const useGeographicZoneStore = defineStore('geographicZone', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    createElement(router, func) {
      http.postRequest(
        'geograpich-zone',
        this.element,
        func,
        'POST',
        router
      );
    },
    initList(router) {
      http.getRequest(
        'geograpich-zone',
        {},
        this.setList,
        'GET',
        router
      );
    },
    deleteElement(element, router, func) {
      http.getRequest(
        `geograpich-zone/${element.id}`,
        {},
        func,
        'DELETE',
        router
      );
    },
    setList(data) {
      this.list = data.customer_groups;
      this.ready = true;
    }
  }
});
