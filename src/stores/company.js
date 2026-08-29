import http from '@/utils/http';
import { defineStore } from 'pinia';
import { fileUtils } from 'generic-module';
import storesUtils from '@/utils/stores';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';
import { useScheduleItemStore } from '@/stores/scheduleItem';
import { useServiceStore } from '@/stores/service';
import { useTransportStore } from '@/stores/transport';
import { useCollectionPointStore } from '@/stores/collectionPoint';
import { useCustomerGroupStore } from '@/stores/customerGroup';
import { useCustomerRuleStore } from '@/stores/customerRule';
import { useGeographicZoneStore } from '@/stores/geographicZone';
import { useLogStore } from '@/stores/log';
import { useDashboardStore } from '@/stores/dashboard';
import { useRaeProductStore } from '@/stores/raeProduct';
import { useRaeProductGroupStore } from '@/stores/raeProductGroup';
import { useRaeDisposalStore } from '@/stores/raeDisposal';
import { useRaeCarrierStore } from '@/stores/raeCarrier';
import { useRaeCollectionCenterStore } from '@/stores/raeCollectionCenter';
import { useAdministrationUserStore } from '@/stores/administrationUser';

// Resetta tutti gli store tenant-dipendenti impostando ready=false.
// Va chiamata ogni volta che il super admin cambia company, così i dati
// vengono ricaricati dal backend col token aggiornato.
const resetTenantStores = () => {
  const tenantStores = [
    useOrderStore(),
    useScheduleStore(),
    useScheduleItemStore(),
    useServiceStore(),
    useTransportStore(),
    useCollectionPointStore(),
    useCustomerGroupStore(),
    useCustomerRuleStore(),
    useGeographicZoneStore(),
    useLogStore(),
    useDashboardStore(),
    useRaeProductStore(),
    useRaeProductGroupStore(),
    useRaeDisposalStore(),
    useRaeCarrierStore(),
    useRaeCollectionCenterStore(),
    useAdministrationUserStore(),
  ];
  for (const store of tenantStores) {
    if ('ready' in store) store.ready = false;
    if ('list' in store) store.list = [];
  }
};


export const useCompanyStore = defineStore('company', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    // Dati legali stampati nei PDF. tax_code e logo sono opzionali; i campi
    // rae_ li rende obbligatori il backend solo quando il modulo RAEE è acceso.
    legalBody() {
      return {
        legal_name: this.element.legal_name,
        vat_number: this.element.vat_number,
        tax_code: this.element.tax_code || null,
        address: this.element.address,
        city: this.element.city,
        rae_registration: this.element.rae_registration || null,
        rae_grouping_place: this.element.rae_grouping_place || null,
      };
    },
    createElement(func) {
      // uploadRequest anche senza logo: il backend legge sempre il body dal
      // campo 'data' del FormData, e il file (se scelto) viaggia a parte.
      http.uploadRequest(
        'company',
        'POST',
        {
          body: {
            name: this.element.name,
            rae: this.element.rae || false,
            admin_nickname: this.element.adminNickname,
            admin_password: this.element.adminPassword,
            ...this.legalBody(),
          },
          files: { logo: this.element.logo },
          extensions: fileUtils.imageExtensions,
        },
        func
      );
    },
    updateElement(func) {
      http.uploadRequest(
        `company/${this.element.id}`,
        'PUT',
        {
          body: {
            name: this.element.name,
            rae: this.element.rae || false,
            ...this.legalBody(),
          },
          files: { logo: this.element.logo },
          extensions: fileUtils.imageExtensions,
        },
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
          if (data.status == 'ok') {
            useUserStore().company = data.company;
            // Invalida tutti gli store tenant-dipendenti: i dati della company
            // precedente non devono essere mostrati nella nuova. Impostando
            // ready=false la prossima getStoreList li ricaricherà dal backend
            // col token aggiornato che porta il nuovo company_id.
            resetTenantStores();
          }
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
