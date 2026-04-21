import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

export class BasketView extends Component<{ items: IProduct[]; total: number }> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected events: IEvents,
        private cardFactory: (item: IProduct, index: number) => HTMLElement
    ) {
        super(container);
        this.listElement = ensureElement<HTMLElement>('.basket__list', container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('order:start');
        });
    }

    set items(items: IProduct[]) {
        this.listElement.innerHTML = '';
        if (items.length) {
            items.forEach((item, index) => {
                this.listElement.append(this.cardFactory(item, index + 1));
            });
        } else {
            this.listElement.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
        }
        this.buttonElement.disabled = items.length === 0;
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }
}