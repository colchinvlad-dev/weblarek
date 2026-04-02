import { IProduct } from '../../types';

export class BasketModel {
    private items: IProduct[] = [];

    // Получить все товары в корзине
    getItems(): IProduct[] {
        return this.items;
    }

    // Добавить товар (если ещё не добавлен)
    addItem(item: IProduct): void {
        if (!this.contains(item.id)) {
            this.items.push(item);
        }
    }

    // Удалить товар по id
    removeItem(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
    }

    // Очистить корзину
    clear(): void {
        this.items = [];
    }

    // Общая стоимость товаров в корзине
    getTotalPrice(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    // Количество товаров в корзине
    getCount(): number {
        return this.items.length;
    }

    // Проверить, есть ли товар с указанным id в корзине
    contains(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}
