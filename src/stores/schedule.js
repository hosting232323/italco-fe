import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

const EXCLUDED_KEYS = [
  'created_at', 'updated_at', 'transport', 'orders', 'schedulation'
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
        storesUtils.exclude_keys(this.element, EXCLUDED_KEYS),
        func,
        'POST',
        router
      );
    },
    updateElement(router, func) {
      http.postRequest(
        `schedule/${this.element.id}`,
        storesUtils.exclude_keys(this.element, EXCLUDED_KEYS),
        func,
        'PUT',
        router
      );
    },
    initList(router) {
      http.postRequest(
        'schedule/filter',
        {filters: storesUtils.formatFilters({ ...this.filters },
          storesUtils.SCHEDULE_DATE_FILTER_TYPES, 'Schedule')},
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
      this.filters = {};
    }
  }
});
