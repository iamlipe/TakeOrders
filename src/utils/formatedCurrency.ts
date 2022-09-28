const formatedCurrency = (value: number) => {
  return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
};

export default formatedCurrency;
