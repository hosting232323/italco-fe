import http from '@/utils/http';
import { defineStore } from 'pinia';

export const useServiceStore = defineStore('service', {
  state: () => ({
    element: {},
    list: [],
    activeForm: false
  }),
  actions: {
    createElement(func) {
      http.postRequest('service', this.element, func);
    },
    updateElement(func) {
      http.postRequest(
        `service/${this.element.id}`,
        Object.fromEntries(
          Object.entries(this.element).filter(([key]) => !['created_at', 'updated_at', 'users'].includes(key))
        ),
        func,
        'PUT'
      );
    },
    initList(filter = {}) {
      http.getRequest('service', filter, this.setList);
    },
    setList(data) {
      this.list = data.services;
    },
    createServiceUserRelationships(object, func) {
      object.service_id = this.element.id;
      http.postRequest('service/customer', object, func);
    },
    deleteServiceUserRelationships(object, func) {
      http.getRequest(`service/customer/${object.id}`, {}, func, 'DELETE');
    }
  }
});
