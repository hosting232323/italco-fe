import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

export const useLogStore = defineStore('log', {
  state: () => ({
    list: [],
    filters: {},
    ready: false,
    activePopUp: false,
    selectedLog: false
  }),
  actions: {
    initList(router) {
      Object.keys(this.filters).forEach(key => {
        if (!this.filters[key]) delete this.filters[key];
      });

      http.postRequest(
        'log',
        {filters: storesUtils.formatFilters({ ...this.filters }, 'Log.created_at')},
        this.setList,
        'POST',
        router
      );
    },
    setList(data) {
      this.list = data.logs;
      this.ready = true;
    }
  }
});
