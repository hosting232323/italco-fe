import { storeToRefs } from 'pinia';


const getStoreList = (store, router) => {
  const { list, ready } = storeToRefs(store);
  if (!ready.value) store.initList(router);
  return list;
};


const exclude_keys = (obj, keys) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  );
};


const ORDER_DATE_FILTER_TYPES = {
  work_date: 'Data Work',
  booking_date: 'Data Booking',
  dpc: 'Data Prevista dal Cliente',
  drc: 'Data Richiesta dal Cliente',
  confirmation_date: 'Data di Conferma',
  completion_date: 'Data di Completamento',
  created_at: 'Data di Creazione',
  updated_at: 'Data di Ultima Modifica'
};


const SCHEDULE_DATE_FILTER_TYPES = {
  date: 'Data del Borderò',
  created_at: 'Data di Creazione',
  updated_at: 'Data di Ultima Modifica'
};


const LOG_DATE_FILTER_TYPES = {
  created_at: 'Data di Creazione'
};


const RAE_PRODUCT_FILTER_TYPES = {
  created_at: 'Data di Creazione',
  schedule_date: 'Data del Borderò'
}


const formatFilters = (filters, keys, element) => {
  const formattedKeys = Object.keys(keys).map(key => `${element}.${key}`);

  return Object.keys(filters)
    .filter(key => {
      if (formattedKeys.includes(key)) return filters[key][0];
      else return filters[key];
    })
    .map(key => {
      let value = null;
      if (!formattedKeys.includes(key))
        value = filters[key];
      else if (!filters[key][1])
        value = filters[key][0];
      else
        value = [filters[key][0], filters[key][1]];

      return {
        value,
        model: key.split('.')[0],
        field: key.split('.')[1]
      };
    });
};


export default {
  getStoreList,
  exclude_keys,
  formatFilters,
  ORDER_DATE_FILTER_TYPES,
  SCHEDULE_DATE_FILTER_TYPES,
  LOG_DATE_FILTER_TYPES,
  RAE_PRODUCT_FILTER_TYPES
};
