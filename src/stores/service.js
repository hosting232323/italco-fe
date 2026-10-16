import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

export const useServiceStore = defineStore('service', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    innerElement: {},
    activeForm: false,
    activePopUpForm: false
  }),
  actions: {
    createElement(func) {
      http.makeRequest(
        'service',
        'POST',
        { body: this.element },
        func
      );
    },
    updateElement(func) {
      http.makeRequest(
        `service/${this.element.id}`,
        'PUT',
        { body: storesUtils.exclude_keys(this.element, ['created_at', 'updated_at', 'users']) },
        func
      );
    },
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'service',
        'GET',
        {},
        callback
      ));
    },
    deleteElement(element, func) {
      http.makeRequest(
        `service/${element.id}`,
        'DELETE',
        {},
        func
      );
    },
    createServiceUserRelationships(object, func) {
      http.makeRequest(
        'service/customer',
        'POST',
        { body: {
          ...object,
          service_id: this.element.id
        } },
        func
      );
    },
    updateServiceUserRelationships(object, func) {
      http.makeRequest(
        `service/customer/${object.id}`,
        'PUT',
        { body: storesUtils.exclude_keys(object, ['created_at', 'updated_at']) },
        func
      );
    },
    deleteServiceUserRelationships(object, func) {
      http.makeRequest(
        `service/customer/${object.id}`,
        'DELETE',
        {},
        func
      );
    },
    setList(data) {
      this.list = data.services;
      this.ready = true;
      if (this.activePopUpForm) {
        this.element = data.services.find(service => service.id === this.element.id);
        this.activePopUpForm = false;
        this.innerElement = {};
      }
    }
  }
});
