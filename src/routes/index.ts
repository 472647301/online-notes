import {LoginScreen} from '../views/Login';
import {UsersScreen} from '../views/Users';
import {NotesScreen} from '../views/Notes';
import {CreateScreen} from '../views/Create';
import {WelcomeScreen} from '../views/Welcome';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

const ButtomNavigator = createBottomTabNavigator(
  {
    Notes: NotesScreen,
    Users: UsersScreen,
  },
  /**
   * 配置文档
   * https://reactnavigation.org/docs/zh-Hans/bottom-tab-navigator.html
   */
  {
    tabBarOptions: {
      showIcon: true,
      activeTintColor: '#C7A976',
      inactiveTintColor: '#979797',
      labelStyle: {fontSize: 10, marginBottom: 4},
      style: {
        height: 56,
        backgroundColor: '#000',
        borderTopColor: '#C7A976',
      },
    },
  },
);

const MainNavigator = createStackNavigator(
  {
    Main: ButtomNavigator,
    Login: LoginScreen,
    Create: CreateScreen,
    Welcome: WelcomeScreen,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Welcome',
  },
);

export const AppNavigator = createAppContainer(MainNavigator);
