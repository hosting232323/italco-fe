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
    ready: false,
    filtersSetting: {
      doubleDates: false,
      dateType: Object.keys(storesUtils.SCHEDULE_DATE_FILTER_TYPES)[0]
    }
  }),
  actions: {
    createElement(func) {
      http.makeRequest(
        'schedule',
        'POST',
        { body: storesUtils.exclude_keys(this.element, EXCLUDED_KEYS) },
        func
      );
    },
    updateElement(func) {
      http.makeRequest(
        `schedule/${this.element.id}`,
        'PUT',
        { body: storesUtils.exclude_keys(this.element, EXCLUDED_KEYS) },
        func
      );
    },
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'schedule/filter',
        'POST',
        { body: { filters: storesUtils.formatFilters(
          this.filters,
          storesUtils.SCHEDULE_DATE_FILTER_TYPES,
          'Schedule'
        ) } },
        callback
      ));
    },
    deleteElement(element, func) {
      http.makeRequest(
        `schedule/${element.id}`,
        'DELETE',
        {},
        func
      );
    },
    setList(data) {
      this.list = data.schedules;
      this.ready = true;
    }
  }
});
