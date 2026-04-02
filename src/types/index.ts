export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Тип для способа оплаты – добавлена пустая строка как начальное значение
export type TPayment = 'card' | 'cash' | '';

// Интерфейс товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// Интерфейс данных покупателя (поля могут быть пустыми до заполнения)
export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

// Заказ расширяет данные покупателя и добавляет специфичные поля
export interface IOrder extends IBuyer {
    total: number;
    items: string[];
}

// Ответ сервера на успешный заказ
export interface IOrderResult {
    id: string;
    total: number;
}

// Структура ответа сервера при получении списка товаров
export interface IProductsResponse {
    total: number;
    items: IProduct[];
}