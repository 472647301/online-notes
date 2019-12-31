import React from 'react';
import {StyleSheet} from 'react-native';
import {Layout, Spinner} from '@ui-kitten/components';
import {inject, observer} from 'mobx-react';
import {IProps} from '../../typings/index';

@inject('store')
@observer
export class LaunchScreen extends React.Component<IProps> {
  public componentDidMount() {
    const { navigation, store } = this.props
    setTimeout(() => {
      navigation.navigate('Home')
    }, 3000)
  }

  public render() {
    return (
      <Layout style={styles.main}>
        <Spinner size="medium" />
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
