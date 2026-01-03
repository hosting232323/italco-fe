import caps from '@/assets/caps';


const getCapItems = () => {
  const seenTitles = new Set();
  return Object.entries(caps).flatMap(([provincia, comuni]) =>
    Object.entries(comuni).flatMap(([cap, info]) => {
      const title = `${info.name} (${provincia})`;
      if (seenTitles.has(title)) return [];

      seenTitles.add(title);
      return [{value: cap, title}];
    })
  );
};


const getProvinces = () => {
  return Object.keys(caps);
};


const getCityByCap = (cap) => {
  for (const [provincia, comuni] of Object.entries(caps)) {
    if (comuni[cap])
      return `${comuni[cap].name} (${provincia})`;
  }
};


export default {
  getCapItems,
  getProvinces,
  getCityByCap
};
