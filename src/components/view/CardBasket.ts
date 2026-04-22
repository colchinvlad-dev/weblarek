import { Card } from './Card';
import { IProduct } from '../../types';

export class CardBasket extends Card<IProduct> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, onDelete: () => void) {
        super(container);
        this.indexElement = container.querySelector<HTMLElement>('.basket__item-index')!;
        this.deleteButton = container.querySelector<HTMLButtonElement>('.basket__item-delete')!;

        this.deleteButton.addEventListener('click', onDelete);
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }

    render(data?: IProduct & { index: number }): HTMLElement {
        if (data) {
            super.render(data);
            this.index = data.index;
        }
        return this.container;
    }
}