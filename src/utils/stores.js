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
  work_date: {
    label: 'Data Work',
    entity: 'Order'
  },
  booking_date: {
    label: 'Data Booking',
    entity: 'Order'
  },
  dpc: {
    label: 'Data Prevista dal Cliente',
    entity: 'Order'
  },
  drc: {
    label: 'Data Richiesta dal Cliente',
    entity: 'Order'
  },
  confirmation_date: {
    label: 'Data di Conferma',
    entity: 'Order'
  },
  completion_date: {
    label: 'Data di Completamento',
    entity: 'Order'
  },
  created_at: {
    label: 'Data di Creazione',
    entity: 'Order'
  },
  updated_at: {
    label: 'Data di Ultima Modifica',
    entity: 'Order'
  }
};


const SCHEDULE_DATE_FILTER_TYPES = {
  date: {
    label: 'Data del Borderò',
    entity: 'Schedule'
  },
  created_at: {
    label: 'Data di Creazione',
    entity: 'Schedule'
  },
  updated_at: {
    label: 'Data di Ultima Modifica',
    entity: 'Schedule'
  }
};


const LOG_DATE_FILTER_TYPES = {
  created_at: {
    label: 'Data di Creazione',
    entity: 'Log'
  }
};


const RAE_PRODUCT_DATE_FILTER_TYPES = {
  created_at: {
    label: 'Data di Creazione',
    entity: 'RaeProduct'
  },
  date: {
    label: 'Data del Borderò',
    entity: 'Schedule'
  }
};


const formatFilters = (filters, dateFilterType) => {
  const formattedKeys = Object.keys(dateFilterType)
    .map(key => `${dateFilterType[key].entity}.${key}`);

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
  RAE_PRODUCT_DATE_FILTER_TYPES
};
