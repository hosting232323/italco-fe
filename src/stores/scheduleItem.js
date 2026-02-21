import http from '@/utils/http';
import { defineStore } from 'pinia';
import storeUtils from '@/utils/stores';

export const useScheduleItemStore = defineStore('schedule', {
  state: () => ({
    list: [],
    element: {},
    ready: false
  }),
  actions: {
    updateElement(router, func) {
      http.postRequest(
        `schedule/${this.element.id}`,
        storeUtils.exclude_keys(this.element, EXCLUDED_KEYS),
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
      )
    },
    setList(data) {
      this.list = data.schedule_items;
      this.ready = true;
    }
  }
});
