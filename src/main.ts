// src/main.ts
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
import { CatalogView } from './components/base/View/CatalogView';
import { HeaderCartButtonView } from './components/base/View/HeaderCartButtonView';
import { ModalView } from './components/base/View/ModalView';
import { ProductPreviewView } from './components/base/View/ProductPreviewView';
import { BasketView } from './components/base/View/BasketView';
import { OrderStep1View } from './components/base/View/OrderStep1View';
import { OrderStep2View } from './components/base/View/OrderStep2View';

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
const catalog = new CatalogView(events);
const basketView = new BasketView(events);
headerCart.setState({ count: 0 });
const makeImageUrl = (s?: string) => {
  if (!s) return undefined;
  const file = s.replace(/^\/?images\//i, '').replace(/^\//, '');
  return `${CDN_URL}/${file}`;
};

// -------------------- ПРЕЗЕНТЕР: события МОДЕЛЕЙ --------------------

// 1) каталог обновился -> перерисовать список карточек
events.on<{ items: IProduct[] }>('products:changed', ({ items }) => {
  const viewItems = items.map((p) => ({
    id: p.id,
    title: p.title,
    image: makeImageUrl(p.image),
    price: p.price,
    inBasket: basketModel.has(p.id),
    category: p.category,
  }));
  catalog.setState({ items: viewItems });
  catalog.render();
});

// 2) корзина изменилась -> обновить счётчик; если открыта корзина — перерисовать её в модалке
events.on<{ items: { id: ProductId; title: string; price: number | null }[]; total: number }>(
  'basket:changed',
  ({ items, total }) => {
    // счётчик в шапке
    headerCart.setState({ count: items.length });
    // обновляем состояние вью корзины
    basketView.setState({
      items: items.map((i, idx) => ({ ...i, index: idx + 1 } as any)),
      total,
    });

    // если модалка открыта и внутри сейчас корзина — подменяем контент
    const modalRoot = modal.getElement();
    const isOpen = modalRoot.classList.contains('modal_active');
    const isBasketShown = Boolean(modalRoot.querySelector('.modal__content .basket'));
    if (isOpen && isBasketShown) {
      modal.setContent(basketView.render());
    }
  }
);

// 3) изменения заказа 
events.on('order:changed', () => {
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

// удалить товар по нажатию
events.on<{ id: string }>('basket/remove', ({ id }) => {
  basketModel.remove(id);
});

// открыть корзину
events.on('basket/open', () => {
  const state = basketModel.getState();
  basketView.setState({
    items: state.items.map((i, idx) => ({ ...i, index: idx + 1 } as any)),
    total: state.total,
  });
  modal.open(basketView.render());
});

// оформить заказ (из корзины)
events.on('basket/checkout', () => {
  modal.open(new OrderStep1View(events).render());
});

// шаг 1 формы — «Далее»
events.on<{ data: { payment: 'card' | 'cash'; address: string } }>('order/step1/next', ({ data }) => {
  orderModel.patchDraft({ payment: data.payment, address: data.address });
  modal.open(new OrderStep2View(events).render());
});

// шаг 2 формы — «Оплатить»
events.on<{ data: { email: string; phone: string } }>('order/step2/pay', async ({ data }) => {
  orderModel.patchDraft({ email: data.email, phone: data.phone });

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

    // попап успеха
    const tpl = document.getElementById('success') as HTMLTemplateElement;
    const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    node.querySelector('.order-success__description')!.textContent = `Списано ${basket.total} синапсов`;
    node
      .querySelector<HTMLButtonElement>('.order-success__close')!
      .addEventListener('click', () => modal.close());
    modal.open(node);
    basketModel.clear();
    orderModel.reset();
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
