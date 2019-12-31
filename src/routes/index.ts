import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {LaunchScreen} from '../views/Launch';
import {LoginScreen} from '../views/Login';
import {NotesScreen} from '../views/Notes';
import {CreateScreen} from '../views/Create';
import {SettingScreen} from '../views/Setting';

const MainNavigator = createStackNavigator(
  {
    Launch: LaunchScreen,
    Login: LoginScreen,
    Create: CreateScreen,
    Home: NotesScreen,
    Setting: SettingScreen,
  },
  {
    headerMode: 'none',
  },
);

export const AppNavigator = createAppContainer(MainNavigator);
