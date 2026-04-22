import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { CardCatalog } from './CardCatalog';
import { IEvents } from '../base/Events';
import { cloneTemplate } from '../../utils/utils';

export class GalleryView extends Component<{ items: IProduct[] }> {
    constructor(
        container: HTMLElement,
        protected events: IEvents,
        private template: HTMLTemplateElement
    ) {
        super(container);
    }

    set items(items: IProduct[]) {
        this.container.innerHTML = '';
        items.forEach(item => {
            const cardEl = cloneTemplate(this.template);
            const card = new CardCatalog(cardEl, () => this.events.emit('product:select', item));
            this.container.append(card.render(item));
        });
    }
}