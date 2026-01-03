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


const getDateRangeArray = () => {
  const result = [];
  const today = new Date();
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + 2);

  for (let date = new Date(today); date <= endDate; date.setDate(date.getDate() + 1)) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    result.push(`${year}-${month}-${day}`);
  }

  return result;
};


export default {
  weekDays,
  getDayByValue,
  getDateRangeArray
};
