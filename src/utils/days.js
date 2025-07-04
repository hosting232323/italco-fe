const weekDays = [
  {
    title: 'Lunedì',
    value: 0
  },
  {
    title: 'Martedì',
    value: 1
  },
  {
    title: 'Mercoledì',
    value: 2
  },
  {
    title: 'Giovedì',
    value: 3
  },
  {
    title: 'Venerdì',
    value: 4
  },
  {
    title: 'Sabato',
    value: 5
  },
  {
    title: 'Domenica',
    value: 6
  }
];

const getDayByValue = (value) => {
  return weekDays.find(day => day.value === value).title;
};

export default {
  weekDays,
  getDayByValue
};
