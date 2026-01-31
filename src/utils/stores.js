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


const formatFilters = (filters, key) => {
  if (filters[key + '_0'] && filters[key + '_1']) {
    filters[key + ''] = [filters[key + '_0'], filters[key + '_1']];
    delete filters[key + '_0'];
    delete filters[key + '_1'];
  }

  console.log(filters, key);
  return Object.keys(filters)
    .filter(key => filters[key] !== null)
    .map(key => {
      return {
        value: filters[key],
        model: key.split('.')[0],
        field: key.split('.')[1]
      };
    });
};


export default {
  getStoreList,
  exclude_keys,
  formatFilters
};
