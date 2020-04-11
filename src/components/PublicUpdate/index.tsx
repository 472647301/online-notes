import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import {StyleSheet, TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {EmitterSubscription, KeyboardEvent} from 'react-native';
import {Keyboard, Platform, TextInput} from 'react-native';
import {ActivityIndicator, Easing} from 'react-native';
import {ModalLayerFactory} from 'react-native-byron-modal';
import {ModalLayerController} from 'react-native-byron-modal';
import {ModalLayerAnimated} from 'react-native-byron-modal';

export class PublicUpdate {
  private alert?: ModalLayerController;
  private options?: IUpdateModal;

  public show(options: IUpdateModal) {
    this.options = options;
    this.alert = ModalLayerFactory.create({
      component: (
        <UpdateModal
          {...options}
          onConfirm={this.onConfirm.bind(this)}
          delete={this.onDelete.bind(this)}
        />
      ),
      act: ModalLayerAnimated.TRANSLATE_Y,
      boxStyle: {position: 'absolute', bottom: 0},
      hideEasing: Easing.bezier(0.215, 0.61, 0.355, 1),
      showEasing: Easing.bezier(0.215, 0.61, 0.355, 1),
    });
    this.alert.show();
  }

  public hide() {
    Keyboard.dismiss();
    this.alert?.hide();
  }

  private onDelete() {
    if (this.alert) {
      ModalLayerFactory.delete(this.alert);
    }
  }

  private async onConfirm(val: string) {
    if (this.options && this.options.onConfirm) {
      const bool = await this.options.onConfirm(val);
      if (bool) {
        this.hide();
      }
      return bool;
    }
    return true;
  }
}

type IUpdateModal = {
  title: string;
  placeholder: string;
  onConfirm: (val: string) => Promise<boolean>;
  delete?: () => void;
};

export class UpdateModal extends React.PureComponent<IUpdateModal> {
  public state = {
    height: 200,
    loading: false,
    value: '',
  };

  private keyboardShow: EmitterSubscription | null = null;
  private keyboardHide: EmitterSubscription | null = null;

  /**
   * 监听键盘打开
   */
  private keyboardDidShow = (e: KeyboardEvent) => {
    if (Platform.OS === 'ios') {
      if (e.endCoordinates.height !== this.state.height) {
        this.setState({height: e.endCoordinates.height + 200});
      }
    }
  };

  /**
   * 监听键盘关闭
   */
  private keyboardDidHide = (e: KeyboardEvent) => {
    this.setState({height: 200});
  };

  /**
   * 确认按钮
   */
  private onConfirm = async () => {
    const {value} = this.state;
    const {onConfirm} = this.props;
    this.setState({loading: true});
    const bool = await onConfirm(value);
    if (!bool) {
      this.setState({loading: false});
    }
  };

  public componentDidMount() {
    this.keyboardShow = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
    this.keyboardHide = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
  }

  public componentWillUnmount() {
    if (this.props.delete) {
      this.props.delete();
    }
    if (this.keyboardShow) {
      this.keyboardShow.remove();
    }
    if (this.keyboardHide) {
      this.keyboardHide.remove();
    }
  }

  public render() {
    const {title, placeholder} = this.props;
    const {height, loading} = this.state;
    return (
      <Animatable.View
        transition={'height'}
        style={[styles.view, {height: height}]}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.row}>
          <TextInput
            autoFocus={true}
            style={styles.row_input}
            placeholder={placeholder}
            placeholderTextColor={'rgba(255, 255, 255, .5)'}
            onChangeText={(text) => this.setState({value: text})}
          />
        </View>
        <TouchableOpacity
          disabled={loading}
          style={styles.button}
          onPress={this.onConfirm}>
          {loading ? (
            <ActivityIndicator size={'small'} />
          ) : (
            <Text style={styles.button_text}>{'确认'}</Text>
          )}
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#1E1E20',
    width: Dimensions.get('window').width,
    height: 200,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 50,
    marginLeft: 30,
  },
  row: {
    height: 50,
    flexDirection: 'row',
    marginLeft: 30,
    marginRight: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: 'rgba(255, 255, 255, .5)',
    borderBottomWidth: 1,
    marginBottom: 30,
  },
  row_input: {
    flex: 1,
    alignItems: 'center',
    color: '#fff',
    fontSize: 16,
    padding: 0,
  },
  button: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: '#C7A976',
  },
  button_text: {
    color: '#fff',
    fontSize: 16,
  },
});
