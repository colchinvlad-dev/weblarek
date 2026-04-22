import { CardWithImage } from './CardWithImage';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CardPreview extends CardWithImage<IProduct> {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.descriptionElement = container.querySelector<HTMLElement>('.card__text')!;
        this.buttonElement = container.querySelector<HTMLButtonElement>('.card__button')!;

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('preview:action');
        });
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set inBasket(value: boolean) {
        this.buttonElement.textContent = value ? 'Удалить из корзины' : 'В корзину';
    }

    set price(value: number | null) {
        super.price = value;
        if (value === null) {
            this.buttonElement.textContent = 'Недоступно';
            this.buttonElement.disabled = true;
        } else {
            // Сбрасываем disabled, если цена есть
            this.buttonElement.disabled = false;
        }
    }

    render(data?: IProduct & { inBasket: boolean }): HTMLElement {
        if (data) {
            super.render(data);
            this.description = data.description;
            this.inBasket = data.inBasket;
            // Цена устанавливается через super.render, но переопределённый сеттер уже сработал
        }
        return this.container;
    }
}