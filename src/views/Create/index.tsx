import React from 'react';
import {StyleSheet, BackHandler, Dimensions} from 'react-native';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {RouteProps} from '../../typings/routes';
import {inject, observer} from 'mobx-react';
import {PublicHeader} from '../../components/PublicHeader';
import {ItemT} from '../../typings/stores';
import {PublicView, ViewStatus} from '../../components/PublicView';
import {NavigationEventSubscription} from 'react-navigation';
import {NativeSyntheticEvent, EmitterSubscription} from 'react-native';
import {TextInputContentSizeChangeEventData} from 'react-native';
import {Keyboard, KeyboardEvent, Platform} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {apiPost} from '../../api';

/**
 * Template
 */
@inject('stores')
@observer
export class CreateScreen extends React.Component<
  RouteProps<{item: ItemT}>,
  IState
> {
  constructor(props: RouteProps<{item: ItemT}>) {
    super(props);
    const item = props.navigation.getParam('item');
    this.state = {
      loading: 'Hide',
      title: item ? item.title : '',
      content: item ? item.content : '',
      height: 36,
    };
  }

  public didFocusSubscription = this.props.navigation.addListener(
    'didFocus',
    (payload) => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      );
    },
  );

  public willBlurSubscription?: NavigationEventSubscription;
  private keyboardShow: EmitterSubscription | null = null;

  public onBackButtonPressAndroid = () => {
    const {navigation, stores} = this.props;
    const item = navigation.getParam('item');
    if (item && item._id) {
      const params = {
        event: 'edit',
        data: {
          type: 'unsub',
          id: item._id,
          members: item.members,
          token: stores.token,
        },
      };
      stores.send(JSON.stringify(params));
    }
    navigation.goBack();
    return true;
  };

  public onContentSizeChange = (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => {
    this.setState({height: e.nativeEvent.contentSize.height});
  };

  public keyboardDidShow = (e: KeyboardEvent) => {
    if (Platform.OS === 'ios') {
      this.setState({height: e.endCoordinates.height});
    } else {
      this.setState({height: e.endCoordinates.screenY - 100});
    }
  };

  public submit = async () => {
    const {navigation} = this.props;
    const {title, content} = this.state;
    if (!title) {
      return showMessage({type: 'danger', message: '请输入标题'});
    }
    if (!content) {
      return showMessage({type: 'danger', message: '请输入内容'});
    }
    const item = navigation.getParam('item');
    const url = item ? '/notes/update' : '/notes/create';
    const params = item ? {title, content, id: item._id} : {title, content};
    this.setState({loading: 'Show'});
    const res = await apiPost(url, params);
    this.setState({loading: 'Hide'});
    if (res && !res.success) {
      return showMessage({type: 'danger', message: res.error});
    }
    if (res && res.success) {
      showMessage({type: 'success', message: '提交成功'});
      this.setState({title: '', content: ''});
    }
  };

  public componentDidMount() {
    const {navigation, stores} = this.props;
    const item = navigation.getParam('item');
    if (item && item._id) {
      const params = {
        event: 'edit',
        data: {
          type: 'sub',
          id: item._id,
          members: item.members,
          token: stores.token,
        },
      };
      stores.send(JSON.stringify(params));
    }
    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      (payload) =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
    this.keyboardShow = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
  }

  public componentWillUnmount() {
    if (this.keyboardShow) {
      this.keyboardShow.remove();
    }
    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove();
    }
    if (this.willBlurSubscription) {
      this.willBlurSubscription.remove();
    }
  }

  public render() {
    const {navigation} = this.props;
    const item = navigation.getParam('item');
    const {loading, title, content, height} = this.state;
    const h = Dimensions.get('window').height;
    return (
      <SafeAreaView style={styles.wrapp}>
        <PublicHeader
          title={item ? '编辑' : '新建'}
          onClickLeft={this.onBackButtonPressAndroid}
        />
        <PublicView status={loading} style={styles.main}>
          <View style={styles.item}>
            <Text style={styles.item_title}>{'标题'}</Text>
            <TextInput
              value={title}
              autoFocus={true}
              style={styles.item_input}
              placeholder={'请输入标题'}
              placeholderTextColor={'#9B9B9B'}
              onChangeText={(text) => this.setState({title: text})}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.item_title}>{'内容'}</Text>
            <TextInput
              value={content}
              multiline={true}
              style={[
                styles.item_input,
                {height: h - height - 280},
                /*{height: Math.max(35, this.state.height)}*/
              ]}
              placeholder={'请输入内容'}
              // onContentSizeChange={this.onContentSizeChange}
              placeholderTextColor={'#9B9B9B'}
              onChangeText={(text) => this.setState({content: text})}
            />
          </View>
          <TouchableOpacity style={styles.footer_button} onPress={this.submit}>
            <Text style={styles.footer_button_text}>提交</Text>
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
  loading: ViewStatus;
  title: string;
  content: string;
  height: number;
};

const styles = StyleSheet.create({
  wrapp: {
    flex: 1,
    backgroundColor: '#28282A',
  },
  main: {
    flex: 1,
    paddingTop: 30,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  item: {
    backgroundColor: '#18181A',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    marginBottom: 10,
  },
  item_title: {
    color: '#C7A976',
    fontSize: 14,
    lineHeight: 32,
  },
  item_input: {
    height: 30,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlignVertical: 'top',
    paddingTop: 0,
    paddingBottom: 0,
  },
  footer_button: {
    height: 48,
    backgroundColor: '#C7A976',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    flexDirection: 'row',
  },
  footer_button_text: {
    color: '#fff',
    fontSize: 16,
  },
});
