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
    createElement(func) {
      http.makeRequest(
        'geographic-zone',
        'POST',
        { body: this.element },
        func
      );
    },
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'geographic-zone',
        'GET',
        {},
        callback
      ));
    },
    deleteElement(element, func) {
      http.makeRequest(
        `geographic-zone/${element.id}`,
        'DELETE',
        {},
        func
      );
    },
    createEntity(data, entity, func) {
      http.makeRequest(
        `geographic-zone/${entity}`,
        'POST',
        { body: {
          ...data,
          zone_id: this.element.id
        } },
        func
      );
    },
    deleteEntity(data, entity, func) {
      http.makeRequest(
        `geographic-zone/${entity}/${data.id}`,
        'DELETE',
        {},
        func
      );
    },
    setList(data) {
      this.list = data.geographic_zones;
      this.ready = true;
    }
  }
});
