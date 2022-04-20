import axios, { AxiosInstance } from 'axios';
import { DataInterface } from './DataInterface';

class DataLoader {
  private readonly items: Record<string, DataInterface>;
  private baseRequest: AxiosInstance;
  private loadingItems: Array<string> = [];

  constructor(baseUrl: string, dataItems: Array<DataInterface>) {
    this.items = {};

    this.baseRequest = axios.create({baseURL: baseUrl});
    dataItems.forEach(item => this.items[item.name] = item);
  }

  getData(name: string): unknown {
    return this.items[name].data;
  }

  async load(name: string, params?: Record<string, string>) {
    if (!this.items.hasOwnProperty(name)) {
      throw new Error('Data item is not found');
    }

    this.loadingItems.push(name);

    const item = this.items[name];

    const resp = await this.baseRequest
      .request({
        url: item.address,
        params: params || {},
        responseType: 'json'
      });

    if (resp.status === 200) {
      item.data = resp.data;

      const loadingItemIndex = this.loadingItems.indexOf(name);

      if (loadingItemIndex !== -1) {
        this.loadingItems.splice(loadingItemIndex, 1);
      }
    }
  }

  get isLoading(): boolean {
    return this.loadingItems.length > 0;
  }
}

export { DataLoader };
