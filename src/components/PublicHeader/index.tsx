import React from 'react';
import {View, Text, Image, ImageSourcePropType} from 'react-native';
import {StyleSheet, TouchableOpacity, ImageStyle} from 'react-native';
import {icons} from '../../icons';

export class PublicHeader extends React.PureComponent<{
  title?: string;
  onClickLeft?: () => void;
  onClickRight?: () => void;
  rightIcon?: ImageSourcePropType;
  rightIconStyle?: ImageStyle;
}> {
  public render() {
    const {
      title,
      onClickLeft,
      onClickRight,
      rightIcon,
      rightIconStyle,
    } = this.props;
    return (
      <View style={styles.head}>
        <TouchableOpacity
          style={styles.head_left}
          disabled={!Boolean(onClickLeft)}
          onPress={onClickLeft}>
          {onClickLeft ? (
            <Image source={icons.head_back} style={styles.head_left_icon} />
          ) : null}
        </TouchableOpacity>
        <View style={styles.head_center}>
          <Text numberOfLines={1} style={styles.head_center_text}>
            {title}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.head_right}
          disabled={!Boolean(onClickRight)}
          onPress={onClickRight}>
          {onClickRight ? (
            <Image
              source={rightIcon ? rightIcon : icons.head_add}
              style={rightIconStyle ? rightIconStyle : styles.head_right_icon}
            />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  head: {
    height: 44,
    backgroundColor: '#28282A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  head_left: {
    width: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  head_left_icon: {
    width: 9,
    height: 16,
  },
  head_center: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  head_center_text: {
    fontSize: 18,
    color: '#fff',
  },
  head_right: {
    width: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  head_right_icon: {
    width: 20,
    height: 20,
  },
});
