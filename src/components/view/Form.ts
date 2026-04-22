import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorElement: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
        this.errorElement = ensureElement<HTMLElement>('.form__errors', container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            this.events.emit('form:change', {
                field: target.name,
                value: target.value,
                formId: this.container.id
            });
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.id}:submit`);
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorElement.textContent = value;
    }

    render(data?: Partial<T>): HTMLElement {
        if (data) {
            super.render(data);
        }
        return this.container;
    }
}