import {observable, action, computed} from 'mobx';
import {apiGet, apiPost} from '../api';
import {ViewStatus} from '../components/PublicView';
import {cookies} from '../utils';
import moment from 'moment';

class Stores {
  @observable loading: ViewStatus = 'Hide';
  @observable list: Array<ItemT> = [];
  private timer: number | null = null;
  public socket: WebSocket | null = null;
  public account_event: {[key: string]: string} = {};
  @observable email = '';

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

  @action changeEmail(email: string) {
    this.email = email;
  }

  @computed get webSocketStatus() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return true;
    }
    return false;
  }

  public initWebSocket() {
    if (this.socket) {
      return;
    }
    const url = 'http://localhost:3000/websocket';
    this.socket = new WebSocket(url);
    this.socket.onopen = async () => {
      const token = await cookies.load('token');
      const params = {event: 'account', data: {type: 'sub', token}};
      this.socket?.send(JSON.stringify(params));
      console.log(' >> WebSocket open...');
    };
    this.socket.onmessage = (evt) => {
      console.log('--onmessage--', evt.data);
      if (evt.data && evt.data.event === 'account') {
        this.account_event = evt.data.data;
      }
      if (evt.data && this.account_event[evt.data.event]) {
        this.fetchNotesList();
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

type ItemT = {
  _id: string;
  title: string;
  content: string;
  author: string;
  update_name: string;
  /**
   * 协作者 JSON {'email':'name'}
   */
  members: string;
  created_at: string;
  updated_at: string;
  loading: ViewStatus;
  current_edit_name: string;
};
