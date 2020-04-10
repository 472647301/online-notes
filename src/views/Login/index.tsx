import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView, View, Text} from 'react-native';
import {Image, TextInput, TouchableOpacity} from 'react-native';
import {RouteProps} from '../../typings/routes';
import {inject, observer} from 'mobx-react';
import {PublicHeader} from '../../components/PublicHeader';
import {icons} from '../../icons';
import {apiPost} from '../../api';
import {showMessage} from 'react-native-flash-message';
import {PublicView, ViewStatus} from '../../components/PublicView';
import {cookies} from '../../utils';

/**
 * Template
 */
@inject('stores')
@observer
export class LoginScreen extends React.Component<RouteProps, IState> {
  constructor(props: RouteProps) {
    super(props);
    this.state = {
      type: 'LOGIN',
      timer: 0,
      email: '',
      code: '',
      password: '',
      status: 'Hide',
    };
  }

  public changeType = () => {
    const {type} = this.state;
    const _type = type === 'LOGIN' ? 'REGISTER' : 'LOGIN';
    this.setState({type: _type});
  };

  public sendCode = async () => {
    const {email} = this.state;
    if (!email) {
      return showMessage({type: 'danger', message: '请输入邮箱地址'});
    }
    const reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!reg.test(email)) {
      return showMessage({type: 'danger', message: '请输入正确的邮箱'});
    }
    this.setState({status: 'Show'});
    const res = await apiPost('/send/code', {email});
    this.setState({status: 'Hide'});
    if (res && res.success) {
      this.setState({timer: 1});
    }
  };

  public submit = async () => {
    const {type, email, code, password} = this.state;
    const isLogin = type === 'LOGIN';
    if (!email) {
      return showMessage({type: 'danger', message: '请输入邮箱地址'});
    }
    const reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!reg.test(email)) {
      return showMessage({type: 'danger', message: '请输入正确的邮箱'});
    }
    if (!password) {
      return showMessage({type: 'danger', message: '请输入密码'});
    }
    if (password.length < 6) {
      return showMessage({type: 'danger', message: '密码为6～12位字母和数字'});
    }
    if (!isLogin && !code) {
      return showMessage({type: 'danger', message: '请输入邮箱验证码'});
    }
    const url = !isLogin ? '/user/register' : '/user/login';
    const params = !isLogin
      ? {email, password, nackname: email, active_code: code}
      : {email, password};
    this.setState({status: 'Show'});
    const res = await apiPost<{token: string}>(url, params);
    this.setState({status: 'Hide'});
    console.log(res);
    if (res && res.success) {
      cookies.save('token', res.data.token);
      this.props.navigation.navigate('Main');
    }
  };

  public render() {
    const {type, status} = this.state;
    const isLogin = type === 'LOGIN';
    return (
      <SafeAreaView style={styles.wrapp}>
        <PublicHeader title={type === 'LOGIN' ? '登录' : '注册'} />
        <View style={styles.main}>
          <PublicView status={status}>
            <View style={styles.list}>
              <View style={styles.item}>
                <Image style={styles.item_icon} source={icons.email} />
                <TextInput
                  style={styles.item_input}
                  placeholder={'邮箱帐号'}
                  placeholderTextColor={'#fff'}
                  onChangeText={(text) => this.setState({email: text})}
                />
              </View>
              <View style={styles.item_line} />
              {isLogin ? null : (
                <View style={styles.item}>
                  <Image style={styles.item_icon} source={icons.code} />
                  <TextInput
                    style={styles.item_input}
                    placeholder={'邮箱验证码'}
                    placeholderTextColor={'#fff'}
                    keyboardType={'numeric'}
                    onChangeText={(text) => this.setState({code: text})}
                  />
                  <TouchableOpacity
                    disabled={!!this.state.timer}
                    style={styles.item_button}
                    onPress={() => {}}>
                    <Text style={styles.item_button_text}>
                      {this.state.timer ? `已发送` : '发送'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {isLogin ? null : <View style={styles.item_line} />}
              <View style={styles.item}>
                <Image style={styles.password} source={icons.password} />
                <TextInput
                  style={styles.item_input}
                  placeholder={'密码'}
                  placeholderTextColor={'#fff'}
                  onChangeText={(text) => this.setState({password: text})}
                />
              </View>
            </View>
            <View style={styles.register}>
              <View style={{flex: 1}} />
              <Text style={styles.register_right} onPress={this.changeType}>
                {isLogin ? '没有账号？立即注册' : '已经账号？去登录'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.footer_button}
              onPress={this.submit}>
              <Text style={styles.footer_button_text}>
                {isLogin ? '登录' : '注册'}
              </Text>
            </TouchableOpacity>
          </PublicView>
        </View>
      </SafeAreaView>
    );
  }
}

type IState = {
  type: 'LOGIN' | 'REGISTER';
  timer: number;
  email: string;
  code: string;
  password: string;
  status: ViewStatus;
};

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
    marginLeft: 30,
    marginRight: 30,
    marginTop: 30,
    backgroundColor: '#2B2B2D',
  },
  item: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  item_line: {
    height: 1,
    backgroundColor: '#18181A',
  },
  item_icon: {
    width: 20,
    height: 20,
  },
  item_input: {
    flex: 1,
    paddingLeft: 20,
    justifyContent: 'center',
    color: '#fff',
    fontSize: 16,
    paddingRight: 10,
    paddingTop: 0,
    paddingBottom: 0,
  },
  item_button: {
    width: 50,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#1E1E20',
    flexDirection: 'row',
  },
  item_button_text: {
    color: '#fff',
    fontSize: 10,
  },
  password: {
    width: 14,
    height: 20,
    marginLeft: 3,
  },
  footer_button: {
    height: 48,
    backgroundColor: '#C7A976',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    marginLeft: 30,
    marginRight: 30,
  },
  footer_button_text: {
    color: '#fff',
    fontSize: 16,
  },
  register: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
  },
  register_right: {
    color: '#fff',
    fontSize: 14,
  },
});