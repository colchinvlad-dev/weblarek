import { Card } from './Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class CardBasket extends Card<IProduct> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;
    protected data?: IProduct;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this.deleteButton.addEventListener('click', () => {
            if (this.data) {
                this.events.emit('product:remove', this.data);
            }
        });
    }

    set index(value: number) {
        this.setText(this.indexElement, String(value));
    }

    render(data: IProduct & { index: number }): HTMLElement {
        this.data = data;
        super.render(data);
        this.index = data.index;
        return this.container;
    }
}