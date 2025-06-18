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
        'geographic-zone',
        this.element,
        func,
        'POST',
        router
      );
    },
    initList(router) {
      http.getRequest(
        'geographic-zone',
        {},
        this.setList,
        'GET',
        router
      );
    },
    deleteElement(element, router, func) {
      http.getRequest(
        `geographic-zone/${element.id}`,
        {},
        func,
        'DELETE',
        router
      );
    },
    setList(data) {
      this.list = data.geographic_zones;
      this.ready = true;
    }
  }
});
