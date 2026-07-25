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
    updateElement(func) {
      http.makeRequest(
        `schedule/${this.element.id}`,
        'PUT',
        { body: {} },
        func
      );
    },
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'schedule/delivery',
        'GET',
        {},
        callback
      ));
    },
    setList(data) {
      this.list = data.schedule_items;
      this.ready = true;
    }
  }
});
