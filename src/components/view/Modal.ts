import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<{ content: HTMLElement }> {
    protected closeButton: HTMLButtonElement;
    protected contentContainer: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.contentContainer = ensureElement<HTMLElement>('.modal__content', container);
        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) this.close();
        });
    }

    set content(value: HTMLElement) {
        this.contentContainer.replaceChildren(value);
    }

    get activeContent(): HTMLElement | null {
        return this.contentContainer.firstElementChild as HTMLElement | null;
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.contentContainer.innerHTML = '';
        this.events.emit('modal:close');
    }

    render(data: { content: HTMLElement }): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}