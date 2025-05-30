import { storeToRefs } from 'pinia';

const getStoreList = (store, router) => {
  const { list, ready } = storeToRefs(store);
  if (!ready.value) store.initList(router);
  return list;
};

export default {
  getStoreList
};
