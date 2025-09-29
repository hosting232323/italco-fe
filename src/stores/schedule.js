import http from '@/utils/http';
import { defineStore } from 'pinia';

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
        Object.fromEntries(
          Object.entries(this.element).filter(([key]) => !['created_at', 'updated_at', 'users'].includes(key))
        ),
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
