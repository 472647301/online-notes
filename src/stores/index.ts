import {observable, action} from 'mobx';

export class AppStore {
  @observable token = '';
  @observable theme: ITheme = 'light'; // 主题

  @action changeToken(token: string) {
    this.token = token;
  }

  // 切换主题
  @action toggleTheme(theme: ITheme) {
    if (this.theme !== theme) {
      this.theme = theme;
    }
  }
}

export const store = new AppStore();

export interface IAppStore extends AppStore {}

type ITheme = 'light' | 'dark';
