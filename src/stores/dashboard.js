import http from '@/utils/http';
import { defineStore } from 'pinia';

const EMPTY_ANALYTICS = {
  kpis: {},
  orders_by_status: [],
  orders_by_weekday: [],
  orders_over_time: [],
  top_customers: [],
  rae_by_status: [],
  rae_by_group: []
};

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    analytics: { ...EMPTY_ANALYTICS },
    filters: { start: null, end: null },
    ready: false,
    loading: false
  }),
  actions: {
    load() {
      this.loading = true;
      http.makeRequest(
        'dashboard/analytics',
        'POST',
        { body: { start: this.filters.start, end: this.filters.end } },
        (data) => {
          this.analytics = data.analytics;
          this.ready = true;
          this.loading = false;
        }
      );
    }
  }
});
