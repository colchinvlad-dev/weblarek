import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { ProductsModel } from './components/models/ProductsModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { AppApi } from './components/AppApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IOrder, IBuyer } from './types';

// Views
import { GalleryView } from './components/view/GalleryView';
import { HeaderBasketView } from './components/view/HeaderBasketView';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { Modal } from './components/view/Modal';
import { BasketView } from './components/view/BasketView';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { SuccessView } from './components/view/SuccessView';

const events = new EventEmitter();
const api = new AppApi(new Api(API_URL));

const productsModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// Глобальные контейнеры
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalContainer, events);

// Шаблоны
const catalogCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewCardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Представления (создаются один раз)
const gallery = new GalleryView(ensureElement<HTMLElement>('.gallery'), events, catalogCardTemplate);
const headerBasket = new HeaderBasketView(ensureElement<HTMLElement>('.header__basket'), events);
const preview = new CardPreview(cloneTemplate(previewCardTemplate), events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate) as HTMLFormElement, events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate) as HTMLFormElement, events);
const successView = new SuccessView(cloneTemplate(successTemplate), events);

// Данные для превью (хранятся в замыкании)
let currentPreviewData: (IProduct & { inBasket: boolean }) | null = null;

// Обработчики событий
events.on('catalog:changed', (data: { items: IProduct[] }) => {
    gallery.items = data.items;
});

events.on('product:select', (item: IProduct) => {
    productsModel.setSelectedItem(item);
});

events.on('product:selected', (item: IProduct) => {
    const inBasket = basketModel.contains(item.id);
    currentPreviewData = { ...item, inBasket };
    modal.render({ content: preview.render(currentPreviewData) });
});

events.on('preview:action', () => {
    const item = productsModel.getSelectedItem();
    if (!item) return;
    if (basketModel.contains(item.id)) {
        basketModel.removeItem(item.id);
    } else {
        basketModel.addItem(item);
    }
    modal.close();
});

events.on('basket:changed', () => {
    const items = basketModel.getItems();
    const cards = items.map((item, index) => {
        const cardEl = cloneTemplate(basketCardTemplate);
        const card = new CardBasket(cardEl, () => basketModel.removeItem(item.id));
        return card.render({ ...item, index: index + 1 });
    });
    basketView.items = cards;
    basketView.total = basketModel.getTotalPrice();
    headerBasket.count = basketModel.getCount();
    
    // Обновляем превью, если открыто
    if (currentPreviewData) {
        const selected = productsModel.getSelectedItem();
        if (selected) {
            const inBasket = basketModel.contains(selected.id);
            currentPreviewData = { ...selected, inBasket };
            preview.render(currentPreviewData);
        }
    }
    
    // Обновляем галерею, чтобы сбросить состояние кнопок
    gallery.items = productsModel.getItems();
});

events.on('basket:open', () => {
    modal.render({ content: basketView.render() });
});

events.on('order:start', () => {
    const data = buyerModel.getData();
    orderForm.render({ ...data, valid: false, errors: '' });
    modal.render({ content: orderForm.render() });
});

events.on('form:change', (data: { field: keyof IBuyer; value: string; formId: string }) => {
    buyerModel.setField(data.field, data.value);
});

events.on('buyer:changed', (data: IBuyer) => {
    const errors = buyerModel.validate();
    const orderValid = !errors.payment && !errors.address;
    const contactsValid = !errors.email && !errors.phone;
    orderForm.render({ ...data, valid: orderValid, errors: [errors.payment, errors.address].filter(Boolean).join(', ') });
    contactsForm.render({ ...data, valid: contactsValid, errors: [errors.email, errors.phone].filter(Boolean).join(', ') });
});

events.on('order:submit', () => {
    modal.render({ content: contactsForm.render() });
});

events.on('contacts:submit', () => {
    const order: IOrder = {
        ...buyerModel.getData(),
        total: basketModel.getTotalPrice(),
        items: basketModel.getItems().map(item => item.id)
    };
    api.postOrder(order)
        .then(result => {
            successView.total = result.total;
            modal.render({ content: successView.render() });
            basketModel.clear();
            buyerModel.clear();
            currentPreviewData = null;
        })
        .catch(err => {
            console.error('Ошибка оформления заказа:', err);
            successView.total = order.total;
            modal.render({ content: successView.render() });
            basketModel.clear();
            buyerModel.clear();
            currentPreviewData = null;
        });
});

events.on('success:close', () => {
    modal.close();
});

// Загрузка товаров
api.getProducts()
    .then(response => productsModel.setItems(response.items))
    .catch(() => import('./utils/data').then(({ apiProducts }) => productsModel.setItems(apiProducts.items)));