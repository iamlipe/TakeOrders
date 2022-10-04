export const formatedValue = ({ value }: { value: string }) => {
  if (value === '0') return 'R$ 0,00';

  if (value.length === 2) return `R$ 0,${value}`;

  if (value.length === 3)
    return `R$ ${value.substring(0, 1)},${value.substring(1, value.length)}`;

  if (value.length === 4)
    return `R$ ${value.substring(1, 2)},${value.substring(2, value.length)}`;

  if (value.length > 4)
    return `R$ ${value.substring(1, value.length - 2)},${value.substring(
      value.length - 2,
    )}`;
};
