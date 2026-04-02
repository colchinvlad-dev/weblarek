import { Api } from './base/Api';
import { IOrder, IOrderResult, IProductsResponse } from '../types';

export class AppApi {
    private api: Api;

    constructor(baseUrl: string, options?: RequestInit) {
        this.api = new Api(baseUrl, options);
    }

    // Получить список товаров с сервера
    getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product');
    }

    // Отправить заказ
    postOrder(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order', order);
    }
}
