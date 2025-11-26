const formatFilters = (filters) => {
  if (filters['Schedule.date_0'] && filters['Schedule.date_1']) {
    filters['Schedule.date'] = [filters['Schedule.date_0'], filters['Schedule.date_1']];
    delete filters['Schedule.date_0'];
    delete filters['Schedule.date_1'];
  }

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
  formatFilters
};
