/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {store} from './src/stores';
import {Provider} from 'mobx-react';
import {AppNavigator} from './src/routes';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {mapping, light, dark} from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {ThemeContext} from './src/theme';
import {observer} from 'mobx-react';

// declare var global: {HermesInternal: null | {}};

@observer
class App extends React.Component {
  public render() {
    const theme = store.theme === 'light' ? light : dark;
    return (
      <React.Fragment>
        <Provider store={store}>
          <IconRegistry icons={EvaIconsPack} />
          <ThemeContext.Provider
            value={{theme: store.theme, toggleTheme: store.toggleTheme}}>
            <ApplicationProvider mapping={mapping} theme={theme}>
              <AppNavigator />
            </ApplicationProvider>
          </ThemeContext.Provider>
        </Provider>
      </React.Fragment>
    );
  }
}

export default App;
