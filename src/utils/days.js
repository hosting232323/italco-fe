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
  const today = new Date();
  const startUTC = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );

  const result = [];
  const endDate = new Date(startUTC);
  endDate.setUTCMonth(endDate.getUTCMonth() + 2);
  const endUTC = endDate.getTime();
  for (let ts = startUTC; ts <= endUTC; ts += 86400000) {
    const d = new Date(ts);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    result.push(`${year}-${month}-${day}`);
  }
  return result;
};


export default {
  weekDays,
  getDayByValue,
  getDateRangeArray
};
