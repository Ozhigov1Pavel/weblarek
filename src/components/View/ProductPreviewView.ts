import type { IEvents } from '../base/Events';
import type { ProductId, Price } from '../../types';
import { cloneTemplate } from './utils';
import { BaseCardView } from './BaseCardView';

export interface ProductPreviewProps {
  id: ProductId;
  title: string;
  description?: string;
  image?: string;
  price: Price;
  inBasket: boolean;
  category?: string;
}

export class ProductPreviewView extends BaseCardView<ProductPreviewProps> {
  private root: HTMLElement;
  private btn: HTMLButtonElement;
  private descEl: HTMLElement;
  private id: ProductId;
  private price: Price;
  private inBasket: boolean;

  constructor(private readonly events: IEvents, props: ProductPreviewProps) {
    const root = cloneTemplate<HTMLElement>('card-preview');
    super(root);
    this.root = root;
    this.titleEl    = (root.querySelector('.card__title') as HTMLElement) || undefined;
    this.descEl     = (root.querySelector('.card__text') as HTMLElement) || document.createElement('div');
    this.priceEl    = (root.querySelector('.card__price') as HTMLElement) || undefined;
    this.categoryEl = (root.querySelector('.card__category') as HTMLElement) || undefined;

    const imgNode = root.querySelector('.card__image') as HTMLElement | null;
    if (imgNode instanceof HTMLImageElement) this.imgEl = imgNode;
    else this.imgBoxEl = imgNode || undefined;

    this.btn = (root.querySelector('.card__button') as HTMLButtonElement) || document.createElement('button');

    this.id = props.id;
    this.price = props.price;
    this.inBasket = props.inBasket;
    this.setTitle(props.title);
    this.descEl.textContent = props.description ?? '';
    this.applyImage(props.image, props.title);
    this.setPrice(props.price);
    this.setCategory(props.category);
    this.updateButton();

    // клик «Купить» / «Удалить из корзины»
    this.btn.addEventListener('click', () => {
      if (this.price === null) return;
      this.inBasket = !this.inBasket;
      this.updateButton();
      this.events.emit(this.inBasket ? 'product/add' : 'product/remove', { id: this.id });
      
    });


    this.events.on<{ items: { id: string }[]; total: number }>('basket:changed', ({ items }) => {
      const nowInBasket = items.some((i) => i.id === this.id);
      if (nowInBasket !== this.inBasket) {
        this.inBasket = nowInBasket;
        this.updateButton();
        
      }
    });
  }

  private updateButton() {
    if (this.price === null) {
      this.btn.textContent = 'Недоступно';
      this.btn.disabled = true;
    } else {
      this.btn.textContent = this.inBasket ? 'Удалить из корзины' : 'Купить';
      this.btn.disabled = false;
    }
  }

  getElement() {
    return this.root;
  }
}
