import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView, View, Text, Image} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native';
import {RouteProps} from '../../typings/routes';
import {inject, observer} from 'mobx-react';
import {PublicHeader} from '../../components/PublicHeader';
import {NavigationCommonTabOptions} from 'react-navigation-tabs/src/types';
import {icons} from '../../icons';
import {PublicView, ViewStatus} from '../../components/PublicView';

/**
 * Template
 */
@inject('stores')
@observer
export class NotesScreen extends React.Component<RouteProps> {
  public state: IState = {
    loading: 'Show',
  };

  static navigationOptions(): NavigationCommonTabOptions {
    return {
      tabBarLabel: '我的笔记',
      tabBarIcon: ({tintColor}) => {
        if (tintColor === '#C7A976') {
          return <Image style={styles.tab_icon} source={icons.tab_home_on} />;
        }
        return <Image source={icons.tab_home_off} style={styles.tab_icon} />;
      },
    };
  }

  public onDelete = (id: string) => {};

  public addMember = (id: string) => {};

  public componentDidMount() {
    this.props.stores.fetchNotesList().then(() => {
      this.setState({loading: 'Hide'});
    });
  }

  public render() {
    const {loading} = this.state;
    const {navigation, stores} = this.props;
    return (
      <SafeAreaView style={styles.wrapp}>
        <PublicHeader
          title={'首页'}
          onClickRight={() => navigation.navigate('Create')}
        />
        <PublicView status={loading} style={styles.main}>
          {loading === 'Hide' && !stores.list.length ? (
            <View style={styles.no_data}>
              <Image style={styles.no_data_icon} source={icons.error_icon} />
            </View>
          ) : (
            <ScrollView style={{flex: 1}}>
              {stores.list.map((e) => {
                return (
                  <PublicView
                    key={e._id}
                    style={styles.item}
                    status={e.loading}
                    message={
                      e.current_edit_name
                        ? `${e.current_edit_name}正在编辑...`
                        : ''
                    }>
                    <View style={styles.item_wrap}>
                      <Text style={styles.item_title} numberOfLines={1}>
                        {e.title}
                      </Text>
                      <Text style={styles.item_content} numberOfLines={3}>
                        {'  '}
                        {e.content}
                      </Text>
                    </View>
                    {e.author === stores.email ? (
                      <View style={styles.item_footer}>
                        <TouchableOpacity
                          style={styles.item_footer_left}
                          onPress={() => this.onDelete(e._id)}>
                          <Text style={styles.item_footer_text}>删除</Text>
                        </TouchableOpacity>
                        <View style={styles.item_footer_line} />
                        <TouchableOpacity
                          style={styles.item_footer_center}
                          onPress={() =>
                            navigation.navigate('Create', {item: e})
                          }>
                          <Text style={styles.item_footer_text}>编辑</Text>
                        </TouchableOpacity>
                        <View style={styles.item_footer_line} />
                        <TouchableOpacity
                          style={styles.item_footer_right}
                          onPress={() => this.addMember(e._id)}>
                          <Text style={styles.item_footer_text}>添加成员</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.item_footer}>
                        <TouchableOpacity
                          style={styles.item_footer_center}
                          onPress={() =>
                            navigation.navigate('Create', {item: e})
                          }>
                          <Text style={styles.item_footer_text}>编辑</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </PublicView>
                );
              })}
            </ScrollView>
          )}
        </PublicView>
      </SafeAreaView>
    );
  }
}

type IState = {
  loading: ViewStatus;
};

const styles = StyleSheet.create({
  wrapp: {
    flex: 1,
    backgroundColor: '#28282A',
  },
  main: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    paddingTop: 15,
  },
  tab_icon: {
    width: 26,
    height: 26,
  },
  no_data: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  no_data_icon: {
    width: 70,
    height: 77,
  },
  item: {
    height: 125,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    // borderWidth: 1,
    // borderColor: '#2F2F31',
    backgroundColor: '#18181A',
  },
  item_wrap: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  item_title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  item_content: {
    color: '#9B9B9B',
    fontSize: 14,
  },
  item_footer: {
    height: 34,
    flexDirection: 'row',
  },
  item_footer_line: {
    width: 3,
  },
  item_footer_text: {
    color: '#fff',
    fontSize: 12,
  },
  item_footer_left: {
    flex: 1,
    height: 34,
    backgroundColor: '#FF5959',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item_footer_center: {
    flex: 1,
    height: 34,
    backgroundColor: '#4ECD73',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item_footer_right: {
    flex: 1,
    height: 34,
    backgroundColor: '#4392F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
