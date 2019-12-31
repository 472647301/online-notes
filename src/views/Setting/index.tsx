import React from 'react';
import {StyleSheet} from 'react-native';
import {inject, observer} from 'mobx-react';
import {SafeAreaView} from 'react-navigation';
import {Layout, Drawer, Icon, Text} from '@ui-kitten/components';
import {Button, TopNavigationAction} from '@ui-kitten/components';
import {TopNavigation, Toggle} from '@ui-kitten/components';
import {IProps} from '../../typings/index';
import Modal from 'react-native-modal';

@inject('store')
@observer
export class SettingScreen extends React.Component<IProps> {
  public state = {
    visible: false,
  };

  public renderToggle() {
    const {store} = this.props;
    return (
      <Toggle
        checked={store.theme === 'dark'}
        onChange={b => this.onCheckedChange(b)}
        style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
      />
    );
  }

  public onCheckedChange(bool: boolean) {
    const {store} = this.props;
    if (bool) {
      store.toggleTheme('dark');
    } else {
      store.toggleTheme('light');
    }
  }

  public renderModalElement() {
    return (
      <Layout level="3" style={styles.modal_view}>
        <Text style={styles.modal_text}>功能维护中...</Text>
        <Button onPress={() => this.setState({visible: false})}>确定</Button>
      </Layout>
    );
  }

  public drawerData = [
    {
      title: '暗黑主题',
      icon: () => <Icon name="color-palette-outline" />,
      accessory: () => this.renderToggle(),
    },
    {title: '备份到本地', icon: () => <Icon name="cloud-download-outline" />},
    {title: '清理本地缓存', icon: () => <Icon name="save-outline" />},
    {title: '给应用点赞', icon: () => <Icon name="star-outline" />},
    {title: '分享给朋友', icon: () => <Icon name="people-outline" />},
    {title: '意见反馈', icon: () => <Icon name="email-outline" />},
  ];

  public onRouteSelect(index: number) {
    const {visible} = this.state;
    if (!visible) {
      this.setState({visible: true});
    }
  }

  public render() {
    const {visible} = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <TopNavigation
          title="设置"
          leftControl={
            <TopNavigationAction
              icon={() => <Icon name="arrow-back" />}
              onPress={() => navigation.goBack()}
            />
          }
        />
        <Layout style={styles.main}>
          <Drawer
            data={this.drawerData}
            onSelect={i => this.onRouteSelect(i)}
          />
        </Layout>
        <Modal
          style={styles.modal}
          isVisible={visible}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          onBackdropPress={() => this.setState({visible: false})}
          onBackButtonPress={() => this.setState({visible: false})}>
          {this.renderModalElement()}
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
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
