import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

// A differenza degli altri store CRUD, questo non opera sulla company della
// sessione ma su quella scelta dal super admin dal bottone dedicato in
// Gestione Company (può non coincidere con quella su cui sta operando): non
// entra in tenantStores.js perché non è "dati della mia company". companyId
// vive nello store, non nei parametri delle azioni, così i componenti restano
// la stessa firma create/update/delete/initList(func) di ogni altro CRUD.
export const useCompanyRaeDisposalPlaceStore = defineStore('companyRaeDisposalPlace', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false,
    dialogOpen: false,
    companyId: null
  }),
  actions: {
    // Apre il popup di gestione per una company: azzera lo stato del form
    // interno (potrebbe essere rimasto aperto da una company precedente) e
    // richiede subito la lista, che è sempre di un'altra company potenzialmente.
    open(companyId) {
      this.companyId = companyId;
      this.dialogOpen = true;
      this.element = {};
      this.activeForm = false;
      this.ready = false;
      this.initList();
    },
    createElement(func) {
      http.makeRequest(
        `company/${this.companyId}/rae-disposal-place`,
        'POST',
        { body: this.element },
        func
      );
    },
    updateElement(func) {
      http.makeRequest(
        `company/${this.companyId}/rae-disposal-place/${this.element.id}`,
        'PUT',
        { body: storesUtils.exclude_keys(this.element, ['created_at', 'updated_at', 'company_id']) },
        func
      );
    },
    deleteElement(element, func) {
      http.makeRequest(
        `company/${this.companyId}/rae-disposal-place/${element.id}`,
        'DELETE',
        {},
        func
      );
    },
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        `company/${this.companyId}/rae-disposal-place`,
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
