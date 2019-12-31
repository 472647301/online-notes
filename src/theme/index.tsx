import React from 'react';

type ITheme = 'light' | 'dark';

export const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: (theme: ITheme) => {},
});
