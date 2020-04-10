import {IStore} from './stores';
import {NavigationScreenProp, NavigationParams} from 'react-navigation';

export interface RouteProps<P = NavigationParams> {
  stores: IStore;
  navigation: NavigationScreenProp<
    {
      key?: string;
      routeName: string;
    },
    P
  >;
}
