import http from '@/utils/http';
import { defineStore } from 'pinia';
import storeUtils from '@/utils/stores';
import scheduleUtils from '@/utils/schedule';

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
      Object.keys(this.filters).forEach(key => {
        if (!this.filters[key]) delete this.filters[key];
      });

      http.postRequest(
        'schedule/filter',
        {filters: scheduleUtils.formatFilters({ ...this.filters })},
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
