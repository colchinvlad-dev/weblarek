import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class BasketView extends Component<{ items: HTMLElement[]; total: number }> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.listElement = ensureElement<HTMLElement>('.basket__list', container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('order:start');
        });
    }

    set items(items: HTMLElement[]) {
        this.listElement.replaceChildren(...items);
        this.buttonElement.disabled = items.length === 0;
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    render(data?: { items: HTMLElement[]; total: number }): HTMLElement {
        if (data) {
            this.items = data.items;
            this.total = data.total;
        }
        return this.container;
    }
}