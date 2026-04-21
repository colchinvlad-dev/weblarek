import { Card } from './Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class CardPreview extends Card<IProduct> {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected data?: IProduct;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        this.buttonElement.addEventListener('click', () => {
            if (this.data) {
                const isInBasket = this.buttonElement.textContent === 'Удалить из корзины';
                this.events.emit(isInBasket ? 'product:remove' : 'product:add', this.data);
            }
        });
    }

    set description(value: string) {
        this.setText(this.descriptionElement, value);
    }

    set inBasket(value: boolean) {
        this.buttonElement.textContent = value ? 'Удалить из корзины' : 'В корзину';
    }

    set price(value: number | null) {
        super.price = value;
        if (value === null) {
            this.buttonElement.textContent = 'Недоступно';
            this.buttonElement.disabled = true;
        }
    }

    render(data: IProduct & { inBasket: boolean }): HTMLElement {
        this.data = data;
        super.render(data);
        this.inBasket = data.inBasket;
        return this.container;
    }
}