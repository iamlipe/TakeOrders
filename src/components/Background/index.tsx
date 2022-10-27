import React, { memo } from 'react';

import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from 'styled-components';

interface BackgroundProps {
  children: React.ReactNode;
}

const Background = ({ children }: BackgroundProps) => {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[
        theme.colors.BACKGROUND_WEAKYELLOW,
        theme.colors.BACKGROUND_OFFWHITE,
      ]}
      style={{ minHeight: '100%' }}
    >
      {children}
    </LinearGradient>
  );
};

export default memo(Background);
