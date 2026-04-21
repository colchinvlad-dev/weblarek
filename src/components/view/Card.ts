import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export abstract class Card<T = IProduct> extends Component<T> {
    protected categoryElement?: HTMLElement;
    protected titleElement: HTMLElement;
    protected imageElement?: HTMLImageElement;
    protected priceElement: HTMLElement;
    protected buttonElement?: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        const cat = container.querySelector('.card__category');
        this.categoryElement = cat instanceof HTMLElement ? cat : undefined;
        this.titleElement = ensureElement<HTMLElement>('.card__title', container);
        const img = container.querySelector('.card__image');
        this.imageElement = img instanceof HTMLImageElement ? img : undefined;
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
        const btn = container.querySelector('.card__button');
        this.buttonElement = btn instanceof HTMLButtonElement ? btn : undefined;
    }

    set category(value: string) {
        if (this.categoryElement) {
            this.categoryElement.textContent = value;
            const modifier = categoryMap[value as keyof typeof categoryMap] ?? 'card__category_other';
            this.categoryElement.className = `card__category ${modifier}`;
        }
    }

    set title(value: string) {
        this.setText(this.titleElement, value);
    }

    set image(value: string) {
        if (this.imageElement) {
            const url = value.startsWith('http') || value.startsWith('/') ? value : CDN_URL + value;
            this.setImage(this.imageElement, url, value);
        }
    }

    set price(value: number | null) {
        this.setText(this.priceElement, value === null ? 'Бесценно' : `${value} синапсов`);
        if (this.buttonElement) this.setDisabled(this.buttonElement, value === null);
    }

    protected setText(el: HTMLElement | null, text: string) {
        if (el) el.textContent = text;
    }

    protected setDisabled(el: HTMLElement, disabled: boolean) {
        if (el instanceof HTMLButtonElement) el.disabled = disabled;
        else el.setAttribute('aria-disabled', String(disabled));
    }
}