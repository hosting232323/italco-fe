import http from '@/utils/http';
import { defineStore } from 'pinia';
import storeUtils from '@/utils/stores';

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    list: [],
    element: {},
    ready: false
  }),
  actions: {
    createElement(router, func) {
      http.postRequest(
        'schedule',
        this.element,
        func,
        'POST',
        router
      );
    },
    updateElement(router, func) {
      http.postRequest(
        `schedule/${this.element.id}`,
        storeUtils.exclude_keys(this.element, ['created_at', 'updated_at']),
        func,
        'PUT',
        router
      );
    },
    initList(router) {
      http.getRequest(
        'schedule',
        {},
        this.setList,
        'GET',
        router
      );
    },
    deleteElement(element, router, func) {
      http.getRequest(
        `schedule/${element.id}`,
        {},
        func,
        'DELETE',
        router
      );
    },
    setList(data) {
      this.list = data.schedules;
      this.ready = true;
    }
  }
});
