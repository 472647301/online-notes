import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView, View, Text, Image} from 'react-native';
import {RouteProps} from '../../typings/routes';
import {inject, observer} from 'mobx-react';
import {PublicHeader} from '../../components/PublicHeader';
import {NavigationCommonTabOptions} from 'react-navigation-tabs/src/types';
import {icons} from '../../icons';

/**
 * Template
 */
@inject('stores')
@observer
export class UsersScreen extends React.Component<RouteProps> {
  static navigationOptions(): NavigationCommonTabOptions {
    return {
      tabBarLabel: '用户中心',
      tabBarIcon: ({tintColor}) => {
        if (tintColor === '#C7A976') {
          return <Image style={styles.tab_icon} source={icons.tab_user_on} />;
        }
        return <Image source={icons.tab_user_off} style={styles.tab_icon} />;
      },
    };
  }

  public render() {
    return (
      <SafeAreaView style={styles.wrapp}>
        <PublicHeader title={'用户'} />
        <View style={styles.main}></View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  wrapp: {
    flex: 1,
    backgroundColor: '#28282A',
  },
  main: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  tab_icon: {
    width: 26,
    height: 26,
  },
});
