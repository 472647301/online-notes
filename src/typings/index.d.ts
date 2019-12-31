import {IAppStore} from '../stores';
import {NavigationScreenProp, NavigationParams} from 'react-navigation';

export interface IProps<S = NavigationParams, P = NavigationParams> {
  store: IAppStore;
  navigation: NavigationScreenProp<S, P>;
}
