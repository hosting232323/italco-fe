// Property icon is used in @/views/OrderStatus
const LABELS = [
  {
    value: 'New',
    title: 'In Attesa',
    icon: 'mdi-timer-sand'
  },
  {
    value: 'Confirmed',
    title: 'In Consegna',
    color: 'blue',
    icon: 'mdi-progress-clock'
  },
  {
    value: 'Booking',
    title: 'A Bordo',
    color: 'blue',
    icon: 'mdi-truck-delivery'
  },
  {
    value: 'At Warehouse',
    title: 'In Magazzino',
    color: 'orange'
  },
  {
    value: 'Delivered',
    title: 'Completato',
    color: 'green',
    icon: 'mdi-check-circle-outline'
  },
  {
    value: 'Not Delivered',
    title: 'Non Completato',
    color: 'red'
  },
  {
    value: 'To Reschedule',
    title: 'Da Riprogrammare',
    color: 'orange'
  },
  {
    value: 'Redelivery',
    title: 'Riprogrammato',
    color: 'green'
  }
];

const TYPES = [
  {
    title: 'Consegna',
    value: 'Delivery'
  },
  {
    title: 'Ritiro',
    value: 'Withdraw'
  },
  {
    title: 'Sostituzione',
    value: 'Replacement'
  },
  {
    title: 'Verifica',
    value: 'CHECK'
  }
];

export default {
  LABELS,
  TYPES
};
