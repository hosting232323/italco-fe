import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

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
      storesUtils.refreshList(this, (callback) => http.getRequest(
        'geographic-zone',
        {},
        callback,
        'GET',
        router
      ));
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
    createEntity(data, entity, router, func) {
      http.postRequest(
        `geographic-zone/${entity}`,
        {
          ...data,
          zone_id: this.element.id
        },
        func,
        'POST',
        router
      );
    },
    deleteEntity(data, entity, router, func) {
      http.getRequest(
        `geographic-zone/${entity}/${data.id}`,
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
