// Nome con cui un punto vendita compare in filtri e select: il nome della
// scheda, e il nickname per chi non ne ha ancora uno. Le esportazioni usano
// la Ragione Sociale, non questo.
const customerName = (user) => {
  return user?.customer_user_info?.name || user?.name || user?.nickname || '';
};

export default {
  customerName
};
