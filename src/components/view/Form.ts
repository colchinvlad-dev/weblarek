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
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.id}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit('form:change', { field, value, formId: this.container.id });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this.errorElement, value);
    }

    protected setText(el: HTMLElement | null, text: string) {
        if (el) el.textContent = text;
    }
}