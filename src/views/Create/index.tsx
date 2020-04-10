import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView, View, Text} from 'react-native';
import {RouteProps} from '../../typings/routes';
import {inject, observer} from 'mobx-react';
import {PublicHeader} from '../../components/PublicHeader';

/**
 * Template
 */
@inject('stores')
@observer
export class CreateScreen extends React.Component<RouteProps> {
  public render() {
    const {navigation} = this.props;
    return (
      <SafeAreaView style={styles.wrapp}>
        <PublicHeader
          title={'新建笔记'}
          onClickLeft={() => navigation.goBack()}
        />
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
});
