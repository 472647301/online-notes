import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView, View, Text, ScrollView} from 'react-native';
import {RouteProps} from '../../typings/routes';
import {inject, observer} from 'mobx-react';
import {PublicHeader} from '../../components/PublicHeader';
import {ItemT} from '../../typings/stores';

/**
 * Template
 */
@inject('stores')
@observer
export class DetailsScreen extends React.Component<RouteProps<{item: ItemT}>> {
  public render() {
    const {navigation} = this.props;
    const item = navigation.getParam('item');
    const members = JSON.parse(item.members);
    return (
      <SafeAreaView style={styles.wrapp}>
        <PublicHeader
          title={item.title}
          onClickLeft={() => navigation.goBack()}
        />
        <View style={styles.main}>
          <Text style={[styles.author, {color: '#FF5959'}]}>
            {members[item.author]}
            {`<${item.author}>`}
          </Text>
          <Text style={styles.author}>创建于 {item.created_at}</Text>
          <ScrollView style={styles.scroll}>
            <Text style={styles.scroll_text}>
              {'  '}
              {item.content}
            </Text>
          </ScrollView>
          {item.update_name ? (
            <React.Fragment>
              <Text style={[styles.update_name, {color: '#4392F1'}]}>
                {item.update_name}
              </Text>
              <Text style={styles.update_name}>
                最后编辑于 {item.updated_at}
              </Text>
            </React.Fragment>
          ) : null}
        </View>
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
    paddingTop: 20,
    paddingBottom: 20,
  },
  scroll: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 20,
  },
  scroll_text: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 28,
  },
  author: {
    paddingLeft: 15,
    // lineHeight: 28,
    fontSize: 14,
    color: '#9B9B9B',
  },
  update_name: {
    paddingRight: 15,
    // lineHeight: 28,
    fontSize: 14,
    color: '#9B9B9B',
    textAlign: 'right',
  },
});
