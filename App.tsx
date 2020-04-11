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
import {stores} from './src/stores';
import {StatusBar} from 'react-native';
import {AppNavigator} from './src/routes';
import {ModalLayers} from 'react-native-byron-modal';
import FlashMessage from 'react-native-flash-message';
import Orientation from 'react-native-orientation-locker';
import {Provider} from 'mobx-react';

class App extends React.Component {
  public componentDidMount() {
    Orientation.lockToPortrait();
  }
  
  public render() {
    return (
      <Provider stores={stores}>
        <StatusBar barStyle="light-content" />
        <ModalLayers>
          <AppNavigator ref={(ref) => ($route = ref)} />
        </ModalLayers>
        <FlashMessage position="top" />
      </Provider>
    );
  }
}

export default App;
