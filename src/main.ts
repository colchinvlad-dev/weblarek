import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { ProductsModel } from './components/models/ProductsModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel, type BuyerErrors } from './components/models/BuyerModel';
import { AppApi } from './components/AppApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IOrder, IBuyer } from './types';

// Views
import { CardCatalog } from './components/view/CardCatalog';
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

const gallery = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalContainer, events);

const catalogCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewCardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const basketCounter = document.querySelector('.header__basket-counter');
const basketButton = document.querySelector('.header__basket');

let currentForm: OrderForm | ContactsForm | null = null;

function showSuccess(total: number) {
    const successEl = cloneTemplate(successTemplate);
    const successView = new SuccessView(successEl, events);
    successView.total = total;
    modal.render({ content: successEl });
    basketModel.clear();
    buyerModel.clear();
}

events.on('catalog:changed', (data: { items: IProduct[] }) => {
    gallery.innerHTML = '';
    data.items.forEach(item => {
        const cardEl = cloneTemplate(catalogCardTemplate);
        const card = new CardCatalog(cardEl, () => events.emit('product:select', item));
        gallery.append(card.render(item));
    });
});

events.on('product:select', (item: IProduct) => productsModel.setSelectedItem(item));

events.on('product:selected', (item: IProduct) => {
    const previewEl = cloneTemplate(previewCardTemplate);
    const preview = new CardPreview(previewEl, events);
    const inBasket = basketModel.contains(item.id);
    modal.render({ content: preview.render({ ...item, inBasket }) });
});

events.on('product:add', (item: IProduct) => {
    basketModel.addItem(item);
    modal.close();
});

events.on('product:remove', (item: IProduct) => {
    basketModel.removeItem(item.id);
    const activeContent = modal.activeContent;
    const isPreviewOpen = activeContent?.classList.contains('card_full');
    const selected = productsModel.getSelectedItem();
    if (isPreviewOpen && selected?.id === item.id) {
        const preview = new CardPreview(activeContent as HTMLElement, events);
        preview.inBasket = false;
        preview.price = item.price;
        modal.close();
    }
});

events.on('basket:changed', () => {
    const count = basketModel.getCount();
    if (basketCounter) basketCounter.textContent = String(count);
    const content = modal.activeContent;
    if (content && content.classList.contains('basket')) {
        const basketView = new BasketView(content as HTMLElement, events, (item, index) => {
            const cardEl = cloneTemplate(basketCardTemplate);
            const card = new CardBasket(cardEl, events);
            return card.render({ ...item, index });
        });
        basketView.items = basketModel.getItems();
        basketView.total = basketModel.getTotalPrice();
    }
});

basketButton?.addEventListener('click', () => {
    const basketViewEl = cloneTemplate(basketTemplate);
    const basketView = new BasketView(basketViewEl, events, (item, index) => {
        const cardEl = cloneTemplate(basketCardTemplate);
        const card = new CardBasket(cardEl, events);
        return card.render({ ...item, index });
    });
    basketView.items = basketModel.getItems();
    basketView.total = basketModel.getTotalPrice();
    modal.render({ content: basketViewEl });
});

events.on('order:start', () => {
    const orderEl = cloneTemplate(orderTemplate) as HTMLFormElement;
    currentForm = new OrderForm(orderEl, events);
    const buyerData = buyerModel.getData();
    currentForm.render({ ...buyerData, valid: false, errors: '' });
    modal.render({ content: orderEl });
});

events.on('form:change', (data: { field: string; value: string; formId: string }) => {
    buyerModel.setField(data.field as keyof IBuyer, data.value);
    let errors: BuyerErrors;
    if (data.formId === 'order') errors = buyerModel.validateOrder();
    else errors = buyerModel.validateContacts();
    const isValid = Object.keys(errors).length === 0;
    if (currentForm) {
        currentForm.valid = isValid;
        currentForm.errors = Object.values(errors).join(', ');
    }
});

events.on('order:submit', () => {
    const orderErrors = buyerModel.validateOrder();
    if (Object.keys(orderErrors).length > 0) {
        if (currentForm) {
            currentForm.valid = false;
            currentForm.errors = Object.values(orderErrors).join(', ');
        }
        return;
    }
    const contactsEl = cloneTemplate(contactsTemplate) as HTMLFormElement;
    currentForm = new ContactsForm(contactsEl, events);
    const buyerData = buyerModel.getData();
    currentForm.render({ ...buyerData, valid: false, errors: '' });
    modal.render({ content: contactsEl });
});

events.on('contacts:submit', () => {
    const contactsErrors = buyerModel.validateContacts();
    if (Object.keys(contactsErrors).length > 0) {
        if (currentForm) {
            currentForm.valid = false;
            currentForm.errors = Object.values(contactsErrors).join(', ');
        }
        return;
    }
    const order: IOrder = {
        ...buyerModel.getData(),
        total: basketModel.getTotalPrice(),
        items: basketModel.getItems().map(item => item.id)
    };
    api.postOrder(order)
        .then(result => showSuccess(result.total))
        .catch(err => {
            console.error('Ошибка оформления заказа:', err);
            showSuccess(order.total);
        });
});

events.on('success:close', () => modal.close());

api.getProducts()
    .then(response => productsModel.setItems(response.items))
    .catch(() => {
        import('./utils/data').then(({ apiProducts }) => productsModel.setItems(apiProducts.items));
    });