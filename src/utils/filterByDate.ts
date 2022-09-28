export interface FilterByDateProps {
  date: Date;
  period: 'lastMonth' | 'last7Days' | 'last30Days';
}

const filterLastMonth = (dateToFilter: Date) => {
  const currDate = new Date();

  const itsTheSameYear = currDate.getFullYear() === dateToFilter.getFullYear();
  const itsTheSameMonth = currDate.getMonth() === dateToFilter.getMonth();

  if (itsTheSameYear && itsTheSameMonth) return true;

  return false;
};

const filterLast7Days = (dateToFilter: Date) => {
  const last7Days = dateToFilter.getTime() > Date.now() - 7 * 24 * 3600 * 1000;

  if (last7Days) return true;

  return false;
};

const filterLast30Days = (dateToFilter: Date) => {
  const last30Days =
    dateToFilter.getTime() > Date.now() - 30 * 24 * 3600 * 1000;

  if (last30Days) return true;

  return false;
};

export const filterByDate = ({ date, period }: FilterByDateProps) => {
  switch (period) {
    case 'lastMonth':
      return filterLastMonth(date);
      break;
    case 'last7Days':
      return filterLast7Days(date);
      break;
    case 'last30Days':
      return filterLast30Days(date);
      break;
  }
};
