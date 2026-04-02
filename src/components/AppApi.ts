import { Api } from './base/Api';
import { IOrder, IOrderResult, IProductsResponse } from '../types';

export class AppApi {
    private api: Api;

    // Принимаем готовый экземпляр Api, а не создаём внутри
    constructor(api: Api) {
        this.api = api;
    }

    getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product');
    }

    postOrder(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order', order);
    }
}