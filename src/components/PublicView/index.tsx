import React from 'react';
import {View, Text, ViewStyle, Dimensions} from 'react-native';
import {LayoutChangeEvent, StyleSheet} from 'react-native';
import {ActivityIndicator} from 'react-native';

type IPublicView = React.SFC & {
  style?: ViewStyle;
  status: ViewStatus;
  message?: string;
};
export type ViewStatus = 'Hide' | 'Show';
export class PublicView extends React.PureComponent<IPublicView> {
  public state = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };

  private rootLayoutChange(e: LayoutChangeEvent) {
    const {layout} = e.nativeEvent;
    const {width, height} = this.state;
    if (width !== layout.width || height !== layout.height) {
      this.setState({width: layout.width, height: layout.height});
    }
  }

  public render() {
    const {width, height} = this.state;
    const {status, style, message} = this.props;
    return (
      <View
        style={[styles.root, style]}
        onLayout={this.rootLayoutChange.bind(this)}>
        {this.props.children}
        {status === 'Hide' ? null : (
          <View
            style={[
              styles.loading,
              {width, height},
              {backgroundColor: message ? 'rgba(0,0,0,0.8)' : 'transparent'},
            ]}>
            <View style={styles.loading_view}>
              <ActivityIndicator size={'large'} color={'#fff'} />
            </View>
            {message ? (
              <Text style={styles.loading_text}>{message}</Text>
            ) : null}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  loading: {
    position: 'absolute',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  loading_view: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  loading_text: {
    color: '#fff',
    fontSize: 12,
    marginTop: 10,
  },
});
