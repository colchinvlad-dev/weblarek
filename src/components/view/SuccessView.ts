// src/components/view/SuccessView.ts
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class SuccessView extends Component<{ total: number }> {
    protected descriptionElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(value: number) {
        this.setText(this.descriptionElement, `Списано ${value} синапсов`);
    }

    protected setText(el: HTMLElement | null, text: string) {
        if (el) el.textContent = text;
    }
}