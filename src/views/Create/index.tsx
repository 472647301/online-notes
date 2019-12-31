import React from 'react';
import {StyleSheet, View} from 'react-native';
import {inject, observer} from 'mobx-react';
import {SafeAreaView} from 'react-navigation';
import {Layout, Input, Icon, Text} from '@ui-kitten/components';
import {Button, TopNavigationAction} from '@ui-kitten/components';
import {TopNavigation, Toggle} from '@ui-kitten/components';
import {Keyboard, KeyboardEvent} from 'react-native';
import {Dimensions, EmitterSubscription} from 'react-native';
import {IProps} from '../../typings/index';
import Modal from 'react-native-modal';

@inject('store')
@observer
export class CreateScreen extends React.Component<IProps<{}, {id?: number}>> {
  public state: IState = {
    isNew: !this.props.navigation.getParam('id'),
    title: '',
    content: '',
    height: 0,
  };

  public onChangeTitle(text: string) {
    this.setState({title: text});
  }

  public onChangeContent(text: string) {
    this.setState({content: text});
  }

  public keyboardShow?: EmitterSubscription;
  public keyboardHide?: EmitterSubscription;

  public componentDidMount() {
    this.keyboardShow = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow.bind(this),
    );
    this.keyboardHide = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide.bind(this),
    );
  }

  public componentWillUnmount() {
    if (this.keyboardShow) {
      this.keyboardShow.remove();
    }
    if (this.keyboardHide) {
      this.keyboardHide.remove();
    }
  }

  public _keyboardDidShow(e: KeyboardEvent) {
    if (!this.state.height) {
      const kH = e.endCoordinates.height;
      const wH = Dimensions.get('window').height;
      const height = wH - Math.ceil(kH) - 220;
      this.setState({height: height});
    }
  }

  public _keyboardDidHide(e: KeyboardEvent) {}

  /**
   * 添加团队协作
   */
  public addTeamPerson() {}

  public releaseNotes() {}

  public render() {
    const {navigation} = this.props;
    const {isNew, title, content, height} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <TopNavigation
          title={isNew ? '新建' : '编辑'}
          leftControl={
            <TopNavigationAction
              icon={() => <Icon name="arrow-back" />}
              onPress={() => navigation.goBack()}
            />
          }
          rightControls={[
            <TopNavigationAction
              icon={() => <Icon name="person-add-outline" />}
              onPress={() => this.addTeamPerson()}
            />,
            <TopNavigationAction
              icon={() => <Icon name="checkmark-square-2-outline" />}
              onPress={() => this.releaseNotes()}
            />,
          ]}
        />
        <Layout style={styles.main}>
          <Text style={styles.title}>标题</Text>
          <Input
            // status={title ? 'success' : 'danger'}
            // caption={title ? '' : '请输入标题'}
            value={title}
            autoFocus={true}
            blurOnSubmit={false}
            placeholder="请输入标题"
            onChangeText={t => this.onChangeTitle(t)}
          />
          <Text style={styles.title}>内容</Text>
          <View style={{height: height}}>
            <Input
              value={content}
              multiline={true}
              numberOfLines={7}
              blurOnSubmit={false}
              placeholder="请输入内容"
              onChangeText={t => this.onChangeContent(t)}
            />
          </View>
        </Layout>
      </SafeAreaView>
    );
  }
}

type IState = {
  isNew: boolean;
  title: string;
  content: string;
  height: number;
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
  },
  title: {
    color: '#6D778B',
    fontSize: 12,
    lineHeight: 30,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal_view: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 256,
    padding: 16,
  },
  modal_text: {
    lineHeight: 48,
    marginBottom: 20,
  },
});
