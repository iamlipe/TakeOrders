import 'styled-components/native';

import COLORS from '@styles/colors';
import FONTS from '@styles/fonts';
import SIZING from '@styles/sizing';

declare module 'styled-components' {
  type COLOR_TYPE = typeof COLORS;
  type FONTS_TYPE = typeof FONTS;
  type SIZING_TYPE = typeof SIZING;
  export interface DefaultTheme {
    colors: COLOR_TYPE;
    fonts: FONTS_TYPE;
    sizing: SIZING_TYPE;
  }
}
