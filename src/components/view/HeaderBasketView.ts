import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class HeaderBasketView extends Component<{ count: number }> {
    protected counterElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.counterElement = container.querySelector<HTMLElement>('.header__basket-counter')!;
        this.container.addEventListener('click', () => this.events.emit('basket:open'));
    }

    set count(value: number) {
        this.counterElement.textContent = String(value);
    }
}