import {observable, action, computed} from 'mobx';
import {apiGet, apiPost} from '../api';
import {ViewStatus} from '../components/PublicView';
import {cookies} from '../utils';
import moment from 'moment';
import {ItemT} from '../typings/stores';

class Stores {
  @observable loading: ViewStatus = 'Hide';
  @observable list: Array<ItemT> = [];
  private timer: number | null = null;
  @observable socket: WebSocket | null = null;
  @observable account_event: {[key: string]: string} = {};
  @observable email = '';
  @observable token = '';
  @observable nickname = '';

  @action fetchNotesList() {
    return apiGet<Array<ItemT>>('/notes/find').then((res) => {
      if (res && res.success) {
        res.data.forEach((e) => {
          e.created_at = moment(e.created_at).format('YYYY-MM-DD HH:mm:ss');
          e.updated_at = moment(e.updated_at).format('YYYY-MM-DD HH:mm:ss');
          e.loading = 'Hide';
          e.current_edit_name = '';
        });
        this.list = res.data;
        if (!this.socket) {
          this.initWebSocket();
        }
      }
      return res;
    });
  }

  @action changeEmail(email: string, nickname: string) {
    this.email = email;
    this.nickname = nickname;
    cookies.load('token').then((res) => {
      this.token = res;
    });
  }

  @computed get webSocketStatus() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return true;
    }
    return false;
  }

  @action initWebSocket() {
    if (this.socket) {
      return;
    }
    const url = 'http://localhost:3000/websocket';
    this.socket = new WebSocket(url);
    this.socket.onopen = async () => {
      const token = await cookies.load('token');
      const params = {event: 'account', data: {type: 'sub', token}};
      this.send(JSON.stringify(params));
      console.log(' >> WebSocket open...');
    };
    this.socket.onmessage = (evt) => {
      console.log('--onmessage--', evt.data);
      try {
        const data = JSON.parse(evt.data);
        if (data && data.event === 'account') {
          this.account_event = data.data;
        }
        if (data && this.account_event[data.event]) {
          this.fetchNotesList();
        }
        if (data && data.event === 'edit') {
          const _data = data.data;
          const i = this.list.findIndex((e) => e._id === _data.id);
          if (_data.type === 'sub' && i !== -1) {
            const item = this.list[i];
            const members = JSON.parse(item.members);
            this.list[i].loading = 'Show';
            this.list[i].current_edit_name = members[_data.member];
          } else if (_data.type === 'unsub' && i !== -1) {
            this.list[i].loading = 'Hide';
            this.list[i].current_edit_name = '';
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    this.socket.onclose = () => {
      this.socket = null;
      if (!this.timer) {
        this.reconnection();
      }
      console.log(' >> Websocket Close...');
    };
    console.log(' >> WebSocket init :', url);
  }

  @action send(params: string) {
    if (this.socket) {
      console.log(' >> ws send:', params);
      this.socket.send(params);
    }
  }

  /**
   * 断线重连
   */
  private reconnection() {
    this.initWebSocket();
    this.timer = setInterval(() => {
      this.initWebSocket();
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      console.log(` >> [${now}] WebSocket Reconnect....`);
    }, 3000);
  }
}

export const stores = new Stores();
