import { CardWithImage } from './CardWithImage';
import { IProduct } from '../../types';

export class CardCatalog extends CardWithImage<IProduct> {
    constructor(container: HTMLElement, onClick: (event: MouseEvent) => void) {
        super(container);
        this.container.addEventListener('click', onClick);
    }
}