import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

// A differenza degli altri store CRUD, questo non opera sulla company della
// sessione ma su quella che il super admin sta editando in Gestione Company
// (può non coincidere): ogni azione richiede companyId esplicito, e non entra
// in tenantStores.js perché non è "dati della mia company".
export const useCompanyRaeDisposalPlaceStore = defineStore('companyRaeDisposalPlace', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    createElement(companyId, func) {
      http.makeRequest(
        `company/${companyId}/rae-disposal-place`,
        'POST',
        { body: this.element },
        func
      );
    },
    updateElement(companyId, func) {
      http.makeRequest(
        `company/${companyId}/rae-disposal-place/${this.element.id}`,
        'PUT',
        { body: storesUtils.exclude_keys(this.element, ['created_at', 'updated_at', 'company_id']) },
        func
      );
    },
    deleteElement(companyId, element, func) {
      http.makeRequest(
        `company/${companyId}/rae-disposal-place/${element.id}`,
        'DELETE',
        {},
        func
      );
    },
    initList(companyId) {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        `company/${companyId}/rae-disposal-place`,
        'GET',
        {},
        callback
      ));
    },
    setList(data) {
      this.list = data.rae_disposal_places;
      this.ready = true;
    }
  }
});
