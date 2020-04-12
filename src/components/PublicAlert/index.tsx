import React from 'react';
import {View, Text} from 'react-native';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {ModalLayerFactory} from 'react-native-byron-modal';
import {ModalLayerController} from 'react-native-byron-modal';

export class PublicAlert {
  private alert?: ModalLayerController;
  private options?: IAlertText;

  public show(options: IAlertText) {
    this.options = options;
    this.alert = ModalLayerFactory.create({
      component: (
        <AlertText
          {...options}
          onClose={this.onClose.bind(this)}
          onConfirm={this.onConfirm.bind(this)}
          delete={this.onDelete.bind(this)}
        />
      ),
    });
    this.alert.show();
  }

  public hide() {
    this.alert?.hide();
  }

  private onDelete() {
    if (this.alert) {
      ModalLayerFactory.delete(this.alert);
    }
  }

  private onClose() {
    this.hide();
    if (this.options && this.options.onClose) {
      this.options.onClose();
    }
  }

  private onConfirm() {
    this.hide();
    if (this.options && this.options.onConfirm) {
      this.options.onConfirm();
    }
  }
}

type IAlertText = {
  title?: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  delete?: () => void;
};

export class AlertText extends React.PureComponent<IAlertText> {
  public componentWillUnmount() {
    if (this.props.delete) {
      this.props.delete();
    }
  }

  public render() {
    const {title, message} = this.props;
    const {cancelText, confirmText} = this.props;
    return (
      <View style={styles.pop_up}>
        <Text style={styles.title}>{title || '温馨提示'}</Text>
        <View style={styles.content}>
          <Text style={styles.message}>{message}</Text>
        </View>
        <View style={styles.btn_wrap}>
          <TouchableOpacity style={styles.btn} onPress={this.props.onClose}>
            <Text style={styles.cancel}>{cancelText || '取消'}</Text>
          </TouchableOpacity>
          <View style={styles.cut_line}></View>
          <TouchableOpacity style={styles.btn} onPress={this.props.onConfirm}>
            <Text style={styles.confirm}>{confirmText || '确认'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pop_up: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  title: {
    marginTop: 14,
    marginBottom: 14,
    fontSize: 16,
    textAlign: 'center',
    color: '#252529',
  },
  message: {
    color: '#6D778B',
    fontSize: 14,
    textAlign: 'center',
  },
  content: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  btn_wrap: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  btn: {
    flex: 1,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cut_line: {
    width: 1,
    backgroundColor: '#EEEEEE',
  },
  cancel: {
    fontSize: 16,
    color: '#979797',
  },
  confirm: {
    fontSize: 16,
    color: '#0384FD',
  },
});
