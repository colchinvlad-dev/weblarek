import './scss/styles.scss';
import { ProductsModel } from './components/models/ProductsModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { AppApi } from './components/AppApi';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';

// 1. Создаём экземпляры моделей
const productsModel = new ProductsModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

// 2. Тестирование моделей с тестовыми данными (apiProducts)
console.log('=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ (локальные данные) ===');

// Сохраняем тестовый каталог
productsModel.setItems(apiProducts.items);
console.log('Каталог товаров (getItems):', productsModel.getItems());

// Получение товара по id
const testId = apiProducts.items[0].id;
const productById = productsModel.getItemById(testId);
console.log(`Товар с id=${testId}:`, productById);

// Сохранение выбранного товара
if (productById) productsModel.setSelectedItem(productById);
console.log('Выбранный товар (getSelectedItem):', productsModel.getSelectedItem());

// Тестирование корзины
console.log('Корзина пуста? Кол-во:', basketModel.getCount());
basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);
console.log('После добавления двух товаров:', basketModel.getItems());
console.log('Кол-во товаров:', basketModel.getCount());
console.log('Общая стоимость:', basketModel.getTotalPrice());
console.log('Содержит товар с id=' + testId + '?', basketModel.contains(testId));
basketModel.removeItem(testId);
console.log('После удаления первого товара:', basketModel.getItems());
basketModel.clear();
console.log('После очистки корзины:', basketModel.getItems());

// Тестирование покупателя
buyerModel.setField('payment', 'cash');
buyerModel.setField('address', 'ул. Пушкина, 1');
buyerModel.setField('email', 'test@example.com');
buyerModel.setField('phone', '+7 123 456 78 90');
console.log('Данные покупателя:', buyerModel.getData());
console.log('Валидация (ошибки):', buyerModel.validate());
console.log('Данные валидны?', buyerModel.isValid());

// Очистка и проверка ошибок
buyerModel.clear();
console.log('После очистки, ошибки:', buyerModel.validate());
console.log('=== КОНЕЦ ТЕСТИРОВАНИЯ ===\n');

// 3. Запрос к реальному серверу
console.log('=== ЗАПРОС К СЕРВЕРУ ===');
const api = new AppApi(API_URL);

api.getProducts()
    .then(response => {
        console.log('Ответ от сервера:', response);
        // Сохраняем массив товаров в модель каталога
        productsModel.setItems(response.items);
        console.log('Каталог из модели после сохранения с сервера:', productsModel.getItems());
    })
    .catch(err => {
        console.error('Ошибка при получении товаров:', err);
    });