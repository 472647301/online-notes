import {stores} from '../stores';
import {ViewStatus} from '../components/PublicView';

export type IStore = typeof stores;

export type ItemT = {
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
