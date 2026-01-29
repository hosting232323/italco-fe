import http from '@/utils/http';
import { defineStore } from 'pinia';

export const useScheduleItemStore = defineStore('schedule', {
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
      http.getRequest(
        'schedule/delivery',
        {},
        this.setList,
        'GET',
        router
      );
    },
    setList(data) {
      this.list = data.schedule_items;
      this.ready = true;
    }
  }
});
