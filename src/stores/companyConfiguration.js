import http from '@/utils/http';
import { defineStore } from 'pinia';
import { fileUtils } from 'generic-module';


// Anagrafica della propria attività, modificata dall'admin dalla pagina di
// configurazione. Non è una lista né un CRUD: c'è un solo elemento, quello
// della company della sessione.
export const useCompanyConfigurationStore = defineStore('companyConfiguration', {
  state: () => ({
    element: {},
    ready: false
  }),
  actions: {
    initData(func) {
      http.makeRequest('company/me', 'GET', {}, (data) => {
        if (data.status == 'ok') {
          this.element = data.company;
          this.ready = true;
        }
        if (func) func(data);
      });
    },
    updateElement(func) {
      // uploadRequest anche senza logo: il backend legge il body dal campo
      // 'data' del FormData, e il file (se scelto) viaggia a parte.
      http.uploadRequest(
        'company/me',
        'PUT',
        {
          body: {
            name: this.element.name,
            legal_name: this.element.legal_name,
            vat_number: this.element.vat_number,
            tax_code: this.element.tax_code || null,
            address: this.element.address,
            city: this.element.city,
            // Obbligatoria solo col modulo RAEE acceso: senza modulo non si manda.
            ...(this.element.rae ? { rae_registration: this.element.rae_registration } : {})
          },
          files: { logo: this.element.logo },
          extensions: fileUtils.imageExtensions
        },
        func
      );
    }
  }
});
