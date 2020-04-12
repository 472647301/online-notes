/**
 * @format
 */
import App from './App';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

if (!__DEV__) {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.debug = () => {};
  console.error = () => {};
}

AppRegistry.registerComponent(appName, () => App);
