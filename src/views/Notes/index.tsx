import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {inject, observer} from 'mobx-react';
import {SafeAreaView} from 'react-navigation';
import {Layout, Menu, Icon, Button} from '@ui-kitten/components';
import {TopNavigation, TopNavigationAction} from '@ui-kitten/components';
import {IProps} from '../../typings/index';

@inject('store')
@observer
export class NotesScreen extends React.Component<IProps> {
  /**
   * 添加笔记
   */
  public createNotes() {
    const {navigation} = this.props;
    navigation.navigate('Create');
  }

  /**
   * 应用设置
   */
  public applicationSetting() {
    const {navigation} = this.props;
    navigation.navigate('Setting');
  }

  public render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <TopNavigation
          title="笔记"
          alignment="center"
          rightControls={[
            <TopNavigationAction
              icon={() => <Icon name="plus-outline" />}
              onPress={() => this.createNotes()}
            />,
            <TopNavigationAction
              icon={() => <Icon name="settings-outline" />}
              onPress={() => this.applicationSetting()}
            />,
          ]}
        />
        <Layout style={{flex: 1}}></Layout>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});
