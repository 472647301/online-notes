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
import {
  EmitterSubscription,
  Platform,
  KeyboardEvent,
  Keyboard,
} from 'react-native';

/**
 * Template
 */
@inject('stores')
@observer
export class PasswordScreen extends React.Component<RouteProps, IState> {
  constructor(props: RouteProps) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      status: 'Hide',
      height: 0,
    };
  }

  private keyboardShow: EmitterSubscription | null = null;

  public keyboardDidShow = (e: KeyboardEvent) => {
    if (Platform.OS === 'ios') {
      this.setState({height: e.endCoordinates.height});
    } else {
      this.setState({height: e.endCoordinates.screenY});
    }
  };

  public submit = async () => {
    const {oldPassword, newPassword} = this.state;
    if (!oldPassword) {
      return showMessage({type: 'danger', message: '请输入旧密码'});
    }
    if (!newPassword) {
      return showMessage({type: 'danger', message: '请输入新密码'});
    }
    if (newPassword.length < 6) {
      return showMessage({type: 'danger', message: '密码为6～12位字母和数字'});
    }
    this.setState({status: 'Show'});
    const res = await apiPost('/user/passeord', {
      old_password: oldPassword,
      new_password: newPassword,
    });
    this.setState({status: 'Hide'});
    if (res && !res.success) {
      return showMessage({type: 'danger', message: res.error});
    }
    if (res && res.success) {
      cookies.save('token', '');
      this.props.navigation.navigate('Login');
    }
  };

  public componentDidMount() {
    this.keyboardShow = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
  }

  public componentWillUnmount() {
    if (this.keyboardShow) {
      this.keyboardShow.remove();
    }
  }

  public render() {
    const {navigation} = this.props;
    const {status, height} = this.state;
    return (
      <SafeAreaView style={styles.wrapp}>
        <PublicHeader
          title={'修改密码'}
          onClickLeft={() => navigation.goBack()}
        />
        <PublicView status={status} style={styles.main}>
          <View style={{backgroundColor: '#2B2B2D'}}>
            <View style={styles.item}>
              <Image style={styles.item_icon} source={icons.email} />
              <TextInput
                autoFocus={true}
                style={styles.item_input}
                placeholder={'请输入旧密码'}
                placeholderTextColor={'rgba(255, 255, 255, .5)'}
                onChangeText={(text) => this.setState({oldPassword: text})}
              />
            </View>
            <View style={styles.item_line} />
            <View style={styles.item}>
              <Image style={styles.password} source={icons.password} />
              <TextInput
                style={styles.item_input}
                placeholder={'请输入新密码'}
                placeholderTextColor={'rgba(255, 255, 255, .5)'}
                onChangeText={(text) => this.setState({newPassword: text})}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.footer_button} onPress={this.submit}>
            <Text style={styles.footer_button_text}>{'提交'}</Text>
          </TouchableOpacity>
        </PublicView>
        {Platform.OS === 'ios' ? (
          <View style={{height: height, backgroundColor: 'rgba(0,0,0,0.18)'}} />
        ) : null}
      </SafeAreaView>
    );
  }
}

type IState = {
  oldPassword: string;
  newPassword: string;
  status: ViewStatus;
  height: number;
};

const styles = StyleSheet.create({
  wrapp: {
    flex: 1,
    backgroundColor: '#28282A',
  },
  main: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 30,
    backgroundColor: 'rgba(0,0,0,0.18)',
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
    marginTop: 10,
  },
  footer_button_text: {
    color: '#fff',
    fontSize: 16,
  },
});
