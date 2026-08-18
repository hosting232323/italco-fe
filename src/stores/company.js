import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';
import { useUserStore } from '@/stores/user';

export const useCompanyStore = defineStore('company', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    createElement(func) {
      http.makeRequest(
        'company',
        'POST',
        { body: { name: this.element.name } },
        func
      );
    },
    updateElement(func) {
      http.makeRequest(
        `company/${this.element.id}`,
        'PUT',
        { body: { name: this.element.name } },
        func
      );
    },
    selectElement(company, func) {
      // Il backend riemette il token con la company scelta e il client http lo
      // raccoglie da solo (new_token): qui resta da aggiornare solo la parte
      // visibile, cioè su quale company stiamo operando.
      http.makeRequest(
        'company/select',
        'POST',
        { body: { company_id: company ? company.id : null } },
        (data) => {
          if (data.status == 'ok')
            useUserStore().company = data.company;
          if (func) func(data);
        }
      );
    },
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'company',
        'GET',
        {},
        callback
      ));
    },
    setList(data) {
      this.list = data.companies;
      this.ready = true;
    }
  }
});
