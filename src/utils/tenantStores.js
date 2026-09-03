import { useAdministrationUserStore } from '@/stores/administrationUser';
import { useCollectionPointStore } from '@/stores/collectionPoint';
import { useCustomerGroupStore } from '@/stores/customerGroup';
import { useCustomerRuleStore } from '@/stores/customerRule';
import { useDashboardStore } from '@/stores/dashboard';
import { useGeographicZoneStore } from '@/stores/geographicZone';
import { useLogStore } from '@/stores/log';
import { useOrderStore } from '@/stores/order';
import { useRaeCarrierStore } from '@/stores/raeCarrier';
import { useRaeCollectionCenterStore } from '@/stores/raeCollectionCenter';
import { useRaeDisposalStore } from '@/stores/raeDisposal';
import { useRaeProductGroupStore } from '@/stores/raeProductGroup';
import { useRaeProductStore } from '@/stores/raeProduct';
import { useScheduleStore } from '@/stores/schedule';
import { useServiceStore } from '@/stores/service';
import { useTransportStore } from '@/stores/transport';

// Store che contengono dati di una singola attivita'. Cambio company e logout
// sono lo stesso problema visto da due lati - il client non deve piu' poter
// mostrare i dati dell'attivita' precedente - e finche' le due liste stavano
// scritte a mano in due file diversi bastava aggiungere uno store per farle
// divergere: e' cosi' che la dashboard e' rimasta fuori dal logout.
const tenantStores = () => [
  useAdministrationUserStore(),
  useCollectionPointStore(),
  useCustomerGroupStore(),
  useCustomerRuleStore(),
  useDashboardStore(),
  useGeographicZoneStore(),
  useLogStore(),
  useOrderStore(),
  useRaeCarrierStore(),
  useRaeCollectionCenterStore(),
  useRaeDisposalStore(),
  useRaeProductGroupStore(),
  useRaeProductStore(),
  useScheduleStore(),
  useServiceStore(),
  useTransportStore()
];

// Cambio company del super admin: i dati vanno richiesti di nuovo col token
// aggiornato. ready=false basta, perche' la sessione resta la stessa e le
// pagine tengono nascosto il contenuto finche' la risposta non arriva.
const invalidate = () => {
  for (const store of tenantStores()) {
    if ('ready' in store) store.ready = false;
    if ('list' in store) store.list = [];
  }
};

// Logout: qui invalidare non basta. Chi entra dopo, nella stessa scheda, non
// deve trovare in memoria niente di chi c'era prima, nemmeno i dati che la
// pagina non rimostrerebbe da sola.
const reset = () => {
  for (const store of tenantStores()) store.$reset();
};

export default {
  invalidate,
  reset
};
