import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView, View, Text, Image, TouchableOpacity} from 'react-native';
import {RouteProps} from '../../typings/routes';
import {inject, observer} from 'mobx-react';
import {PublicHeader} from '../../components/PublicHeader';
import {NavigationCommonTabOptions} from 'react-navigation-tabs/src/types';
import {icons} from '../../icons';
import {PublicView} from '../../components/PublicView';
import {apiGet, apiPost} from '../../api';
import {cookies} from '../../utils';
import {showMessage} from 'react-native-flash-message';
import {PublicAlert} from '../../components/PublicAlert';
import {PublicUpdate} from '../../components/PublicUpdate';

/**
 * Template
 */
@inject('stores')
@observer
export class UsersScreen extends React.Component<RouteProps> {
  public state = {
    loading: false,
  };

  public alert = new PublicAlert();
  public update = new PublicUpdate();

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

  public onClickRight = () => {
    this.alert.show({message: '确认退出登录？', onConfirm: this.onExit});
  };

  public onExit = async () => {
    this.setState({loading: true});
    const res = await apiGet('/user/logout');
    this.setState({loading: false});
    if (res && !res.success) {
      return showMessage({type: 'danger', message: res.error});
    }
    if (res && res.success) {
      cookies.save('token', '');
      this.props.navigation.navigate('Login');
    }
  };

  public changeNickname = () => {
    this.update.show({
      title: '修改昵称',
      placeholder: '请输入新昵称',
      onConfirm: (val) => this.onConfirmNickname(val),
    });
  };

  public onConfirmNickname = async (val: string) => {
    if (!val) {
      showMessage({type: 'danger', message: '请输入新昵称'});
      return false;
    }
    const res = await apiPost<{nickname: string; email: string}>(
      '/user/nickname',
      {nickname: val},
    );
    if (res && res.success) {
      this.props.stores.changeEmail(res.data.email, res.data.nickname);
    }
    return Boolean(res && res.success);
  };

  public render() {
    const {loading} = this.state;
    const {stores} = this.props;
    return (
      <SafeAreaView style={styles.wrapp}>
        <PublicHeader
          title={'用户'}
          onClickRight={this.onClickRight}
          rightIcon={icons.icon_x}
          rightIconStyle={{width: 15, height: 15}}
        />
        <PublicView status={loading ? 'Show' : 'Hide'} style={styles.main}>
          <View style={styles.list}>
            <View style={styles.item}>
              <View style={styles.item_left}>
                <Text style={styles.item_left_text}>账号</Text>
              </View>
              <View style={styles.item_right}>
                <Text style={styles.item_right_text}>{stores.email}</Text>
              </View>
            </View>
            <View style={styles.item_line} />
            <TouchableOpacity style={styles.item} onPress={this.changeNickname}>
              <View style={styles.item_left}>
                <Text style={styles.item_left_text}>昵称</Text>
              </View>
              <View style={styles.item_right}>
                <Text style={styles.item_right_text}>{stores.nickname}</Text>
                <Image style={styles.nickname} source={icons.edit} />
              </View>
            </TouchableOpacity>
            <View style={styles.item_line} />
            <View style={styles.item}>
              <View style={styles.item_left}>
                <Text style={styles.item_left_text}>连接状态</Text>
              </View>
              <View style={styles.item_right}>
                <Text
                  style={[
                    styles.item_right_text,
                    {color: stores.webSocketStatus ? '#4ECD73' : '#FF2D55'},
                  ]}>
                  {stores.webSocketStatus ? '已连接' : '未连接'}
                </Text>
              </View>
            </View>
            <View style={styles.item_line} />
            <View style={styles.item}>
              <View style={styles.item_left}>
                <Text style={styles.item_left_text}>事件通知</Text>
              </View>
              <View style={styles.item_right}>
                <Text
                  style={[
                    styles.item_right_text,
                    {
                      color: Object.keys(stores.account_event).length
                        ? '#4ECD73'
                        : '#FF2D55',
                    },
                  ]}>
                  {Object.keys(stores.account_event).length
                    ? '已订阅'
                    : '未订阅'}
                </Text>
              </View>
            </View>
          </View>
          {/* <TouchableOpacity style={styles.footer_button}>
            <Text style={styles.footer_button_text}>{'退出'}</Text>
          </TouchableOpacity> */}
        </PublicView>
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
  list: {
    // flex: 1,
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 30,
    backgroundColor: '#18181A',
  },
  item: {
    height: 60,
    backgroundColor: '#18181A',
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: 'row',
  },
  item_line: {
    marginLeft: 30,
    marginRight: 30,
    height: 1,
    backgroundColor: '#2F2F31',
  },
  item_left: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  item_left_text: {
    color: '#fff',
    fontSize: 14,
  },
  item_right: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  item_right_text: {
    color: '#fff',
    fontSize: 12,
  },
  tab_icon: {
    width: 26,
    height: 26,
  },
  footer_button: {
    height: 48,
    backgroundColor: '#C7A976',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 30,
    marginBottom: 30,
  },
  footer_button_text: {
    color: '#fff',
    fontSize: 16,
  },
  nickname: {
    width: 12,
    height: 12,
    marginLeft: 5,
    marginTop: -2,
  },
});
