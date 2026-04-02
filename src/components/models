import { IProduct } from '../../types';

export class ProductsModel {
    private items: IProduct[] = [];
    private selectedItem: IProduct | null = null;

    // Сохранить массив товаров
    setItems(items: IProduct[]): void {
        this.items = items;
    }

    // Получить все товары
    getItems(): IProduct[] {
        return this.items;
    }

    // Получить товар по id
    getItemById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    // Сохранить выбранный товар для детального просмотра
    setSelectedItem(item: IProduct): void {
        this.selectedItem = item;
    }

    // Получить выбранный товар
    getSelectedItem(): IProduct | null {
        return this.selectedItem;
    }
}
