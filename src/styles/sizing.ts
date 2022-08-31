import { RFValue } from 'react-native-responsive-fontsize';

const SIZING = {
  MINOR: `${RFValue(10)}`,
  SMALLEST: `${RFValue(12)}px`,
  SMALLER: `${RFValue(14)}px`,
  SMALL: `${RFValue(16)}px`,
  MEDIUM: `${RFValue(18)}px`,
  LARGE: `${RFValue(24)}px`,
  LARGER: `${RFValue(32)}px`,
};

export type SIZING_TYPE = typeof SIZING;

export default SIZING;
