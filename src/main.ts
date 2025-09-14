import './scss/styles.scss';


import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Order } from './components/Models/Order';
import type { IBasketItem } from './types';
import { Api } from './components/base/Api';            
import { ShopApi } from './components/Services/ShopApi';
   
import { apiProducts } from './utils/data';

console.log('=== ПРоверка моделей данных ===');

// ——— Products
const productsModel = new Products();
productsModel.setItems(apiProducts.items);
console.log('Каталог: всего', productsModel.length, 'товаров');
console.log('Каталог (все):', productsModel.getItems());
const firstId = productsModel.getItems()[0]?.id;
console.log('Товар по id:', firstId, productsModel.getById(firstId));

// ——— Basket
const basket = new Basket();
const first = productsModel.getItems()[0];
const second = productsModel.getItems()[1];

if (first) basket.add({ id: first.id, title: first.title, price: first.price } as IBasketItem);
if (second) basket.add({ id: second.id, title: second.title, price: second.price } as IBasketItem);

console.log('Корзина после добавления двух позиций:', basket.getState());

if (first) basket.remove(first.id);
console.log('Корзина после удаления первой позиции:', basket.getState());

basket.clear();
console.log('Корзина после очистки:', basket.getState());

// ——— Order
const order = new Order();
order.setDraft({ payment: 'card', address: 'Тестовый адрес', email: 'test@example.com', phone: '+7 (999) 000-00-00' });
console.log('Черновик заказа (после set):', order.getDraft());

order.patchDraft({ address: 'Новый адрес' });
console.log('Черновик заказа (после patch):', order.getDraft());

order.reset();
console.log('Черновик заказа (после reset):', order.getDraft());

console.log('=== Конец проверки моделей ===');

const apiClient = new Api('');
const shopApi = new ShopApi(apiClient);

shopApi
  .getProducts()
  .then((items) => {
    productsModel.setItems(items);
    console.log('Каталог с сервера (сохранён в Products):', productsModel.getItems());
  })
  .catch((e) => console.error('Ошибка загрузки каталога:', e));