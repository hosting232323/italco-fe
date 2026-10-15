import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

export const useLogStore = defineStore('log', {
  state: () => ({
    list: [],
    filters: {},
    ready: false,
    activePopUp: false,
    selectedLog: false,
    filtersSetting: {
      doubleDates: false,
      dateType: Object.keys(storesUtils.LOG_DATE_FILTER_TYPES)[0]
    }
  }),
  actions: {
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'log/filter',
        'POST',
        { body: { filters: storesUtils.formatFilters(
          this.filters,
          storesUtils.LOG_DATE_FILTER_TYPES,
          'Log'
        ) } },
        callback
      ));
    },
    setList(data) {
      this.list = data.logs;
      this.ready = true;
    }
  }
});
