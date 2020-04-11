import axios from 'axios';
import {NavigationActions} from 'react-navigation';
import {cookies} from '../utils';
import {showMessage} from 'react-native-flash-message';

const api = axios.create({
  timeout: 30000,
  baseURL: 'http://localhost:3000',
});

// 添加自定义实例请求拦截器
api.interceptors.request.use(
  async (config) => {
    config.headers['authorization'] = await cookies.load('token');
    const url = `${config.baseURL}${config.url}`;
    console.log(` >> ${url}: ${JSON.stringify(config.data)}`);
    return config;
  },
  (error) => {
    return error;
  },
);

// 添加自定义实例响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.message && error.message.indexOf('401') && $route) {
      cookies.save('token', '');
      $route.dispatch(
        NavigationActions.navigate({
          routeName: 'Login',
        }),
      );
    } else {
      if (error.message) {
        showMessage({type: 'danger', message: error.message});
      }
    }
    return error;
  },
);

export async function apiGet<T, P = {}>(path: string, params?: P) {
  const data = await api
    .get<IData<T>>(path, {
      params: params,
    })
    .catch((err) => {
      return undefined;
    });
  return data?.data;
}

export async function apiPost<T, P = {}>(path: string, params: P) {
  const data = await api.post<IData<T>>(path, params).catch((err) => {
    return undefined;
  });
  return data?.data;
}

export type IData<T> = {
  code: number;
  success: boolean;
  timestamp: string;
  error: string;
  data: T;
};
