import http from '@/utils/http';
import { defineStore } from 'pinia';
import storeUtils from '@/utils/stores';

const EXCLUDED_KEYS = [
  'created_at', 'updated_at', 'transport', 'orders'
];

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    list: [],
    element: {},
    filters: {},
    ready: false
  }),
  actions: {
    createElement(router, func) {
      http.postRequest(
        'schedule',
        storeUtils.exclude_keys(this.element, EXCLUDED_KEYS),
        func,
        'POST',
        router
      );
    },
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
      Object.keys(this.filters).forEach(key => {
        if (!this.filters[key]) delete this.filters[key];
      });

      http.postRequest(
        'schedule/filter',
        {filters: storeUtils.formatFilters({ ...this.filters }, 'Schedule.date')},
        this.setList,
        'POST',
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
