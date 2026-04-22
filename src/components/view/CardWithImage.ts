import { Card } from './Card';
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';

export abstract class CardWithImage<T = IProduct> extends Card<T> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement) {
        super(container);
        this.categoryElement = container.querySelector<HTMLElement>('.card__category')!;
        this.imageElement = container.querySelector<HTMLImageElement>('.card__image')!;
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        const modifier = categoryMap[value as keyof typeof categoryMap] ?? 'card__category_other';
        this.categoryElement.className = `card__category ${modifier}`;
    }

    set image(value: string) {
        this.imageElement.src = CDN_URL + value;
        this.imageElement.alt = value;
    }
}