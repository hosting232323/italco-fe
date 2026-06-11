import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

export const useScheduleItemStore = defineStore('scheduleItem', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    showForm: false
  }),
  actions: {
    updateElement(router, func) {
      http.postRequest(
        `schedule/${this.element.id}`,
        {},
        func,
        'PUT',
        router
      );
    },
    initList(router) {
      storesUtils.refreshList(this, (callback) => http.getRequest(
        'schedule/delivery',
        {},
        callback,
        'GET',
        router
      ));
    },
    setList(data) {
      this.list = data.schedule_items;
      this.ready = true;
    }
  }
});
