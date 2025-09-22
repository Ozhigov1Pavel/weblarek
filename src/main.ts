import './scss/styles.scss';

// MODELS
import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Order } from './components/Models/Order';

// API
import { Api } from './components/base/Api';
import { ShopApi } from './components/Services/ShopApi';
import { API_URL, CDN_URL } from './utils/constants';

// EVENTS & VIEWS
import { events } from './components/base/eventsBus';
import { CatalogView } from './components/View/CatalogView';
import { HeaderCartButtonView } from './components/View/HeaderCartButtonView';
import { ModalView } from './components/View/ModalView';
import { ProductCardView } from './components/View/ProductCardView';
import { ProductPreviewView } from './components/View/ProductPreviewView';
import { BasketView } from './components/View/BasketView';
import { BasketItemView } from './components/View/BasketItemView';
import { OrderStep1View } from './components/View/OrderStep1View';
import { OrderStep2View } from './components/View/OrderStep2View';
import { SuccessView } from './components/View/SuccessView';

// TYPES
import type { IProduct, IOrderPayload, ProductId } from './types';

// -------------------- ИНИЦИАЛИЗАЦИЯ --------------------
const productsModel = new Products(events);
const basketModel = new Basket(events);
const orderModel = new Order(events);

const apiClient = new Api(API_URL);
const shopApi = new ShopApi(apiClient);

// VIEW-инстансы
const modal = new ModalView(events);
const headerCart = new HeaderCartButtonView(events);
const catalog = new CatalogView();
const basketView = new BasketView(events);

let isBasketOpen = false;
let step1View: OrderStep1View | null = null;
let step2View: OrderStep2View | null = null;

headerCart.render({ count: 0 });


const makeImageUrl = (s?: string) => {
  if (!s) return undefined;
  const file = s.replace(/^\/?images\//i, '').replace(/^\//, '');
  return `${CDN_URL}/${file}`;
};

// -------------------- ПРЕЗЕНТЕР: события МОДЕЛЕЙ --------------------



events.on<{ items: IProduct[] }>('products:changed', ({ items }) => {
  const nodes: HTMLElement[] = items.map((p) => {
    const card = new ProductCardView(events, {
      id: p.id,
      title: p.title,
      image: makeImageUrl(p.image),
      price: p.price,
      inBasket: basketModel.has(p.id),
      category: p.category,
    });
    return card.render();
  });


  catalog.items = nodes;
  catalog.render();
});



events.on<{ items: { id: ProductId; title: string; price: number | null }[]; total: number }>(
  'basket:changed',
  ({ items, total }) => {
    headerCart.render({ count: items.length });
    if (isBasketOpen) {
      const nodes = items.map((i, idx) => {
        const item = new BasketItemView(events);
        item.render({
          id: i.id,
          index: idx + 1,
          title: i.title,
          priceText: i.price === null ? 'Бесценно' : `${i.price} синапсов`,
        });
        return item.render();
      });
      basketView.render({ items: nodes, total });
      modal.setContent(basketView.render()); 
    }
  }
);


events.on('order:changed', () => {
});

events.on('modal/close', () => {
  isBasketOpen = false;
  step1View = null;
  step2View = null;
});

// -------------------- ПРЕЗЕНТЕР: события VIEW --------------------

// открыть карточку в модалке
events.on<{ id: string }>('product/open', ({ id }) => {
  const p = productsModel.getById(id);
  if (!p) return;

  const preview = new ProductPreviewView(events, {
    id: p.id,
    title: p.title,
    description: p.description,
    image: makeImageUrl(p.image),
    price: p.price,
    inBasket: basketModel.has(p.id),
    category: p.category,
  });
  modal.open(preview.render());
});

// кнопка «Купить» в превью
events.on<{ id: ProductId }>('product/add', ({ id }) => {
  const p = productsModel.getById(id);
  if (!p || p.price === null) return;
  basketModel.add({ id: p.id, title: p.title, price: p.price });
});

// кнопка «Удалить из корзины» в превью
events.on<{ id: ProductId }>('product/remove', ({ id }) => {
  basketModel.remove(id);
});

// удалить товар по нажатию (из BasketItemView)
events.on<{ id: string }>('basket/remove', ({ id }) => {
  basketModel.remove(id);
});

// открыть корзину
events.on('basket/open', () => {
  const state = basketModel.getState();
  const nodes = state.items.map((i, idx) => {
    const item = new BasketItemView(events);
    item.render({
      id: i.id,
      index: idx + 1,
      title: i.title,
      priceText: i.price === null ? 'Бесценно' : `${i.price} синапсов`,
    });
    return item.render();
  });
  basketView.render({ items: nodes, total: state.total });
  modal.open(basketView.render());
  isBasketOpen = true;
});

// оформить заказ (из корзины)
events.on('basket/checkout', () => {
  step1View = new OrderStep1View(events);
  step1View.render({ payment: orderModel.getDraft().payment, address: orderModel.getDraft().address, canNext: false, errors: [] });
  modal.open(step1View.render());
  isBasketOpen = false;
});

events.on<{ data: { payment?: 'card' | 'cash' | null; address?: string } }>('order/step1/change', ({ data }) => {
  orderModel.patchDraft({ payment: data.payment ?? undefined, address: data.address ?? undefined });
  const draft = orderModel.getDraft();
  const errors = orderModel.validateStep1();
  const canNext = errors.length === 0;

  if (step1View) {
    step1View.render({
      payment: draft.payment ?? null,
      address: draft.address ?? '',
      errors,
      canNext,
    });
  }
});

// «Далее» на шаге 1
events.on<{ data: { payment?: 'card' | 'cash' | null; address?: string } }>('order/step1/next', () => {
  const errors = orderModel.validateStep1();
  if (errors.length > 0) {
    step1View?.render({ errors, canNext: false });
    return;
  }

  // Открываем шаг 2
  step2View = new OrderStep2View(events);
  const d = orderModel.getDraft();
  step2View.render({ email: d.email ?? '', phone: d.phone ?? '', canPay: false, errors: [] });
  modal.open(step2View.render());
  step1View = null;
});

// Изменения на шаге 2
events.on<{ data: { email?: string; phone?: string } }>('order/step2/change', ({ data }) => {
  orderModel.patchDraft({ email: data.email ?? undefined, phone: data.phone ?? undefined });
  const errors = orderModel.validateStep2();
  const canPay = errors.length === 0;
  if (step2View) {
    step2View.render({ errors, canPay });
  }
});

// «Оплатить»
events.on<{ data: { email?: string; phone?: string } }>('order/step2/pay', async () => {
  const errors = orderModel.validateStep2();
  if (errors.length > 0) {
    step2View?.render({ errors, canPay: false });
    return;
  }

  const draft = orderModel.getDraft();
  const basket = basketModel.getState();

  const payload: IOrderPayload = {
    payment: draft.payment!,
    address: draft.address!,
    email: draft.email!,
    phone: draft.phone!,
    items: basket.items.map((i) => ({ id: i.id, price: i.price })),
    total: basket.total,
  };

  try {
    await shopApi.createOrder(payload);

    const success = new SuccessView();
    success.setText(`Списано ${basket.total} синапсов`);
    success.onClose(() => modal.close());
    modal.open(success.render());
    basketModel.clear();
    orderModel.reset();
    step2View = null;
  } catch (e) {
    console.error('Не удалось оформить заказ:', e);
  }
});

// -------------------- ЗАГРУЗКА КАТАЛОГА --------------------
(async () => {
  try {
    const items = await shopApi.getProducts();
    productsModel.setItems(items);
  } catch (e) {
    console.error('Ошибка загрузки каталога:', e);
  }
})();
