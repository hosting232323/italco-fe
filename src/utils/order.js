// Property icon is used in @/views/OrderStatus
const LABELS = [
  {
    value: 'Pending',
    title: 'In Attesa',
    icon: 'mdi-timer-sand'
  },
  {
    value: 'In Progress',
    title: 'In Consegna',
    color: 'blue',
    icon: 'mdi-progress-clock'
  },
  {
    value: 'On Board',
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
    value: 'Completed',
    title: 'Completato',
    color: 'green',
    icon: 'mdi-check-circle-outline'
  },
  {
    value: 'Cancelled',
    title: 'Non Completato',
    color: 'red'
  },
  {
    value: 'To Reschedule',
    title: 'Da Riprogrammare',
    color: 'orange'
  },
  {
    value: 'Rescheduled',
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
