import React from 'react';
import {StyleSheet, Dimensions, Platform} from 'react-native';
import {ImageBackground, TouchableOpacity, SafeAreaView} from 'react-native';
import {ActivityIndicator, View, Text} from 'react-native';
import {RouteProps} from '../../typings/routes';
import {inject, observer} from 'mobx-react';
import {apiGet} from '../../api';
import {icons} from '../../icons';

/**
 * Template
 */
@inject('stores')
@observer
export class WelcomeScreen extends React.Component<RouteProps> {
  public state = {
    loading: true,
    duration: 5,
  };

  public isUnmount = false;
  public timer: number | null = null;

  // 进入首页
  public enterMain = () => {
    this.props.navigation.navigate('Main');
  };

  public runTimer = () => {
    if (this.isUnmount) {
      return;
    }
    if (!this.state.duration) {
      this.clearTimer();
      this.enterMain();
      return;
    }
    const duration = this.state.duration;
    this.setState({duration: duration - 1});
  };

  public clearTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  };

  public fetchLoginStatus = async () => {
    const res = await apiGet<{email: string; nickname: string}>('/user/info');
    if (res && res.success) {
      this.props.stores.changeEmail(res.data.email, res.data.nickname);
      this.timer = setInterval(this.runTimer, 1000);
    }
  };

  public componentDidMount() {
    this.fetchLoginStatus();
  }

  public componentWillUnmount() {
    this.isUnmount = true;
  }

  public render() {
    const {duration} = this.state;
    const {width, height} = Dimensions.get('window');
    const source =
      Platform.OS === 'ios'
        ? {
            uri: `https://bing.ioliu.cn/v1/rand?w=${width}&h=${height}`,
          }
        : icons.rand;
    return (
      <ImageBackground style={[styles.wrapp, {width, height}]} source={source}>
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.wrapp_head}>
            <View style={{flex: 1}} />
            {this.timer ? (
              <TouchableOpacity
                style={styles.wrapp_head_item}
                onPress={this.enterMain}>
                <Text style={styles.wrapp_head_text}>跳过 {duration}s</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={{flex: 1}} />
          <View style={styles.wrapp_footer}>
            <ActivityIndicator size={'large'} color={'#C7A976'} />
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  wrapp: {
    flex: 1,
    backgroundColor: '#28282A',
  },
  wrapp_head: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
  },
  wrapp_head_item: {
    width: 88,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  wrapp_head_text: {
    color: '#fff',
    fontSize: 14,
  },
  wrapp_footer: {
    height: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
