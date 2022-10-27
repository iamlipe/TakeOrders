import RNLocalize from 'react-native-localize';

const formatedCurrency = (value: number) => {
  return value.toLocaleString(RNLocalize.getLocales()[0].languageTag, {
    style: 'currency',
    currency: RNLocalize.getCurrencies()[0],
  });
};

export default formatedCurrency;
