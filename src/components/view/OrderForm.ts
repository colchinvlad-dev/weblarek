import { Form } from './Form';
import { IBuyer } from '../../types';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class OrderForm extends Form<IBuyer> {
    protected paymentButtons: NodeListOf<HTMLButtonElement>;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.paymentButtons = container.querySelectorAll('.order__buttons .button_alt');

        this.paymentButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const payment = btn.name as 'card' | 'cash';
                this.paymentButtons.forEach(b => b.classList.remove('button_alt-active'));
                btn.classList.add('button_alt-active');
                this.onInputChange('payment', payment);
            });
        });
    }

    set payment(value: string) {
        this.paymentButtons.forEach(btn => {
            btn.classList.toggle('button_alt-active', btn.name === value);
        });
    }

    set address(value: string) {
        const input = ensureElement<HTMLInputElement>('input[name=address]', this.container);
        input.value = value;
    }

    render(data: Partial<IBuyer> & { valid: boolean; errors: string }): HTMLElement {
        super.render(data);
        this.payment = data.payment || '';
        this.address = data.address || '';
        return this.container;
    }
}