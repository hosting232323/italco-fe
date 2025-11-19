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


export default {
  getStoreList,
  exclude_keys
};
