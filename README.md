# Интернет-магазин «Web-Larёk» 🛒

«Web-Larёk» — учебный интернет-магазин с товарами для веб‑разработчиков. Пользователь может просматривать каталог, открывать карточки товаров в модальных окнах, добавлять позиции в корзину и оформлять заказ с выбором способа оплаты. Весь цикл покупки завершает отправка заказа на сервер.

## Содержание

- [Стек технологий](#стек-технологий)
- [Быстрый старт](#быстрый-старт)
- [Скрипты](#скрипты)
- [Конфигурация окружения](#конфигурация-окружения)
- [Структура проекта](#структура-проекта)
- [Архитектура (MVP)](#архитектура-mvp)
- [Базовые классы](#базовые-классы)
- [Типы данных](#типы-данных)
- [Классы слоя «Модели» и коммуникаций](#классы-слоя-модели-и-коммуникаций)
- [Коммуникации с сервером](#коммуникации-с-сервером)
- [Проверка работоспособности](#проверка-работоспособности)
- [Полезное](#полезное)

---

## Стек технологий

- **HTML**, **SCSS**
- **TypeScript**
- **Vite** (сборка и dev‑сервер)

---

## Быстрый старт

Установите зависимости и запустите проект:

```bash
# запуск dev-режима
npm run dev

# сборка production-версии
npm run build

# предпросмотр собранной версии
npm run preview
```

> После сборки статические файлы появятся в папке `dist/`.

---

## Скрипты

| Команда    | Назначение                                   |
|------------|-----------------------------------------------|
| `dev`      | Запуск проекта в режиме разработки            |
| `build`    | Production‑сборка проекта в `dist/`           |
| `preview`  | Локальный предпросмотр сборки из `dist/`      |

---

## Конфигурация окружения

Проект использует переменную окружения для формирования URL‑ов API и CDN.

Создайте файл `.env` (или `.env.local`) в корне проекта и укажите:

```env
VITE_API_ORIGIN=https://larek-api.nomoreparties.co
```

- `API_URL` = `${VITE_API_ORIGIN}/api/weblarek`
- `CDN_URL` = `${VITE_API_ORIGIN}/content/weblarek`

Настройки и соответствия категорий находятся в `src/utils/constants.ts`.

---

## Структура проекта

```
├─ index.html                 # Главная HTML-страница
├─ src/
│  ├─ main.ts                 # Точка входа приложения
│  ├─ scss/
│  │  └─ styles.scss          # Корневой файл стилей
│  ├─ components/
│  │  ├─ base/                # Базовые классы (Api, EventEmitter, Component)
│  │  ├─ Models/              # Модели (Products, Basket, Order)
│  │  └─ Services/            # Сервисы (ShopApi)
│  ├─ types/
│  │  └─ index.ts             # Типы и интерфейсы
│  └─ utils/
│     ├─ constants.ts         # Константы и маршруты API
│     ├─ utils.ts             # Утилиты
│     └─ data.ts              # Мок-данные для локальной проверки
└─ ...
```

**Важные файлы:**

- `index.html` — HTML‑файл главной страницы  
- `src/main.ts` — точка входа приложения  
- `src/scss/styles.scss` — корневой файл стилей  
- `src/types/index.ts` — типы проекта  
- `src/utils/constants.ts` — константы, эндпоинты и карты категорий  
- `src/utils/utils.ts` — служебные функции

---

## Архитектура (MVP)

Проект реализован в парадигме **MVP (Model‑View‑Presenter)** с событийной связью слоёв.

- **Model** — хранит и изменяет данные (не зависит от DOM/сетевых запросов).
- **View** — отвечает за отображение данных и реакции UI.
- **Presenter** — координирует бизнес‑логику, связывает Model и View.

Событийная схема (упрощённо):

```
[View] --(emit: пользовательское действие)--> [Presenter]
[Presenter] --(изменяет)--> [Model]
[Model] --(emit: обновление данных)--> [Presenter] --(обновляет)--> [View]
```

---

## Базовые классы

### `Component<T>`
Базовый класс для всех UI‑компонентов.

- **Конструктор**: `constructor(container: HTMLElement)`
- **Поля**:  
  `container: HTMLElement` — корневой DOM‑элемент компонента.
- **Методы**:
  - `render(data?: Partial<T>): HTMLElement` — записывает данные и возвращает DOM‑элемент компонента.
  - `setImage(element: HTMLImageElement, src: string, alt?: string): void` — безопасно обновляет `<img>`.

### `Api`
Инкапсулирует работу с HTTP‑запросами.

- **Конструктор**: `constructor(baseUrl: string, options: RequestInit = {})`
- **Поля**:  
  `baseUrl: string`, `options: RequestInit`
- **Методы**:
  - `get(uri: string): Promise<object>`
  - `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>`
  - `protected handleResponse(response: Response): Promise<object>`

### `EventEmitter` (файл `src/components/base/Events.ts`)
Брокер событий по паттерну «Наблюдатель».

- **Поля**:  
  `_events: Map<string | RegExp, Set<Function>>`
- **Методы**:
  - `on<T>(event: EventName, callback: (data: T) => void): void`
  - `emit<T>(event: string, data?: T): void`
  - `trigger<T>(event: string, context?: Partial<T>): (data: T) => void`

> Обратите внимание: класс `EventEmitter` экспортируется из файла **`Events.ts`**.

---

## Типы данных

**Файл:** `src/types/index.ts`

### Служебные
- `ApiPostMethods` — `'POST' | 'PUT' | 'DELETE'`
- `IApi` — контракт транспорта: `get(uri): Promise<T>`, `post(uri, data, method?): Promise<T>`

### Бизнес‑сущности
- `ProductId` — `string`
- `Price` — `number | null` (для «Бесценно»)
- `PaymentMethod` — `'card' | 'cash'`
- `IListResponse<T>` — обёртка списков: `{ total, items }`
- `IProduct` — `{ id, title, description, image, category, price }`
- `IBasketItem` — `{ id, title, price }`
- `IBasketState` — `{ items: IBasketItem[], total: number }` (сумма по числовым ценам)
- `IOrderDraft` — `{ payment?, address?, email?, phone? }`
- `IOrderPayload` — `{ items[], total, payment, address, email, phone }`
- `IOrderResponse` — `{ id, total }`
- `IProductsResponse` — `IListResponse<IProduct>`

---

# Классы слоя «Модели» и коммуникаций

## `Products` — каталог товаров  
`src/components/Models/Products.ts`

**Назначение:** типобезопасное хранилище массива товаров `IProduct[]` без привязки к DOM/HTTP.

**Поля:**
- `private items: IProduct[] = []` — текущий каталог. Доступ только через методы, чтобы исключить наружные мутации.

**Методы:**
- `setItems(items: IProduct[]): void` — принимает массив и сохраняет **копию** (`[...items]`) во внутреннее состояние. Некорректный ввод приводит к пустому каталогу.
- `getItems(): IProduct[]` — возвращает **новый массив-копию** каталога (иммутабельность внешнего доступа).
- `getById(id: string): IProduct | undefined` — находит товар по `id`; если не найден, возвращает `undefined`.
- `clear(): void` — очищает каталог (`[]`).
- `get length(): number` — геттер, количество товаров в каталоге.

**Зависимости:** отсутствуют.

---

## `Basket` — корзина  
`src/components/Models/Basket.ts`

**Назначение:** хранит текущие позиции и суммарную стоимость заказа.

**Поля:**
- `private state: IBasketState = { items: [], total: 0 }`, где  
  - `items: IBasketItem[]` — массив позиций (минимум `id` и `price`, где `price: number | null`),  
  - `total: number` — суммарная стоимость.

**Методы:**
- `setItems(items: IBasketItem[]): void` — полностью заменяет список позиций **копией** входных данных и **пересчитывает** `total`.
- `add(item: IBasketItem): void` — добавляет **копию** позиции в конец списка и **пересчитывает** `total`. Дедупликация/количество одинаковых позиций не навязываются моделью.
- `remove(id: string): void` — удаляет позицию(и) с указанным `id` и **пересчитывает** `total`.
- `clear(): void` — сбрасывает состояние до `{ items: [], total: 0 }`.
- `getState(): IBasketState` — возвращает **глубокую копию** плоского состояния (массив позиций копируется поэлементно).

**Алгоритм пересчёта (`private recalc()`):**  
`total = items.reduce((s, i) => s + (i.price ?? 0), 0)` — в сумму входят **только числовые цены**; `null` трактуется как `0`.

**Зависимости:** отсутствуют.

---

## `Order` — данные покупателя  
`src/components/Models/Order.ts`

**Назначение:** хранит и изменяет **черновик** данных заказа.

**Поля:**
- `private draft: IOrderDraft = {}` — частично заполненная структура, включающая `payment`, `address`, `email`, `phone` и т. п. (см. типы проекта).

**Методы:**
- `setDraft(draft: IOrderDraft): void` — полностью заменяет черновик **копией** переданного объекта.
- `patchDraft(patch: Partial<IOrderDraft>): void` — поверхностно дополняет/обновляет поля черновика (`{ ...draft, ...patch }`).
- `getDraft(): IOrderDraft` — возвращает **копию** черновика для безопасного чтения.
- `reset(): void` — очищает черновик до пустого объекта.

**Зависимости:** отсутствуют.

---

## `ShopApi` — коммуникации с сервером  
`src/components/Services/ShopApi.ts`

**Назначение:** изолированный слой HTTP-коммуникаций с API магазина. Не зависит от DOM и конкретных моделей — опирается на **контракты типов** и таблицу маршрутов.

**Поля и зависимости:**
- `constructor(private readonly api: IApi) {}` — принимает абстрактный HTTP-клиент `IApi` (композиция), что упрощает тестирование и подмену транспорта (fetch/axios/моки).

**Маршруты:** берутся из `ENDPOINTS` (`src/utils/constants.ts`), например:
- `ENDPOINTS.products` — список товаров,
- `ENDPOINTS.order` — создание заказа,
- опционально `ENDPOINTS.product(id)` — получение одного товара.

**Методы:**
- `async getProducts(): Promise<IProduct[]>` — `GET` на `ENDPOINTS.products`. Ожидает `IProductsResponse` с полем `items: IProduct[]`, возвращает `items`.  
  *Операция:* загрузка каталога с сервера.
- `async createOrder(payload: IOrderPayload): Promise<IOrderResponse>` — `POST` на `ENDPOINTS.order` с телом `payload`. Возвращает ответ оформления заказа `IOrderResponse` (например, `id` и финальный `total`).  
  *Операция:* создание заказа на бэкенде.

**Ключевые контракты:**
- `IApi` — транспорт:  
  `get<T>(uri: string): Promise<T>` и `post<T>(uri: string, data: object, method?: 'POST'|'PUT'|'DELETE'): Promise<T>`
- `IProduct` — товар (идентификатор, название, `price: number | null`, описание, изображение, категория и т. д.).
- `IProductsResponse = IListResponse<IProduct>` — список (`{ total, items }`).
- `IOrderPayload` — полезная нагрузка заказа: `items: { id; price }[]`, `total`, а также `payment`, `address`, `email`, `phone`.
- `IOrderResponse` — результат создания заказа (например, `{ id, total }`).

---

## Коммуникации с сервером

Маршруты собираются из `src/utils/constants.ts`:

- `API_URL` — `${VITE_API_ORIGIN}/api/weblarek`
- `CDN_URL` — `${VITE_API_ORIGIN}/content/weblarek`
- `settings.endpoints` — относительные пути (`products`, `product(id)`, `order`)
- `ENDPOINTS` — абсолютные маршруты (`API_URL + settings.endpoints`)

> Если эндпоинты заданы **абсолютными URL**, создавайте `Api` с **пустым** `baseUrl`, чтобы избежать «origin + origin».

---

## Проверка работоспособности

Локальная проверка логики реализована в `src/main.ts` на мок‑данных `src/utils/data.ts`:

- **Products**: `setItems`, `getItems`, `getById`, `clear`, геттер `length`
- **Basket**: `setItems`, `add`, `remove`, `clear`, `getState` (счёт только по числовым ценам)
- **Order**: `setDraft → patchDraft → reset`

Результаты выводятся в консоль. Затем выполняется запрос каталога через `ShopApi`, полученные товары сохраняются в `Products` и логируются.

---

## Полезное

- Категории и их соответствие модификаторам — `categoryMap` в `constants.ts`.
- Если в коллекции Postman список товаров — `/catalog`, достаточно заменить только это значение в `settings.endpoints`.
- Компоненты интерфейса наследуются от `Component<T>` и обновляют DOM через `render()` — это упрощает переиспользование и тестирование.

## События, генерируемые слоями View

- `product/open` — пользователь открыл карточку товара (клик по карточке каталога, не по кнопке).
  - **Параметры:** `{ id: string }` — идентификатор товара.

- `product/add` — пользователь нажал «Купить».
  - **Параметры:** `{ id: string }`.

- `product/remove` — пользователь нажал «Удалить из корзины».
  - **Параметры:** `{ id: string }`.

- `basket/open` — пользователь открыл корзину (иконка в хедере).

- `basket/remove` — пользователь удалил строку товара из корзины.
  - **Параметры:** `{ id: string }`.

- `basket/checkout` — пользователь нажал «Оформить покупку» в корзине.

- `order/step1/next` — пользователь перешёл к шагу 2 оформления.
  - **Параметры:** `{ data: { payment: 'card' | 'cash'; address: string } }`.
  - Генерируется **только** если форма валидна (выбрана оплата и введён адрес).

- `order/step2/pay` — пользователь нажал «Оплатить».
  - **Параметры:** `{ data: { email: string; phone: string } }`.
  - Генерируется **только** если форма валидна (оба поля непустые и с базовой валидацией).

- `modal/close` — запрос закрыть модальное окно (по Esc/overlay/крестику или явным действием компонента).

## Презентер

В проекте один презентер, код расположен в `src/main.ts`. Он **не генерирует события**, а только **подписывается** на события от слоёв Model и View и координирует логику:

- Подписки на **модели**:
  - `products:changed` → пересобрать массив карточек для каталога и перерисовать `CatalogView`;
  - `basket:changed` → обновить счётчик в шапке, обновить `BasketView`, а если корзина открыта в модальном окне — заменить содержимое модалки свежим рендером корзины;
  - `order:changed` / `order:reset` → обновления черновика (UI-подсветку делаем на стороне форм).

- Подписки на **представления**:
  - `product/open` → открыть модальное превью товара;
  - `product/add` / `product/remove` → добавить/удалить товар в/из корзины;
  - `basket/open` → открыть корзину в модальном окне;
  - `basket/remove` → удалить позицию из корзины (крестик в списке);
  - `basket/checkout` → открыть шаг 1 оформления;
  - `order/step1/next` → сохранить выбор оплаты/адрес и открыть шаг 2;
  - `order/step2/pay` → отправить заказ на сервер, показать окно успеха, очистить корзину и черновик.

**Важно:** презентер не хранит данные и не общается с DOM напрямую, кроме вызовов методов View. Взаимодействие с сервером инкапсулировано в `ShopApi`.

## Классы слоя View

Каждый класс отвечает за свой участок разметки, ищет дочерние элементы в конструкторе и хранит ссылки на них в полях. Слушатели событий навешиваются один раз в конструкторе. Классы не содержат бизнес-логики и **не хранят данные** — только отображение и генерация событий.

### `CatalogView` (`src/components/base/View/CatalogView.ts`)
- **Назначение:** контейнер каталога; размещает карточки товаров.
- **Конструктор:** без параметров.
- **Поля (DOM):** корневой элемент каталога (где выводятся карточки).
- **Методы:**
  - `setState({ items })` — принимает массив «плоских» данных для карточек (id, title, image, price, inBasket, category).
  - `render()` — создаёт дочерние `ProductCardView` и возвращает DOM-узел каталога.
- **События:** не генерирует (их генерируют карточки).

### `ProductCardView` (`.../ProductCardView.ts`)
- **Назначение:** карточка в каталоге (без кнопки «Купить»).
- **Конструктор:** `(events, props)` — события и данные карточки.
- **Поля (DOM):** заголовок, изображение, категория, цена.
- **Методы:** `render()` — возвращает корневой элемент карточки.
- **События (emit):** `product/open { id }` по клику на карточку.

### `ProductPreviewView` (`.../ProductPreviewView.ts`)
- **Назначение:** карточка в модальном окне — полное описание и кнопка покупки.
- **Конструктор:** `(events, props)`.
- **Поля (DOM):** заголовок, описание, изображение, категория, цена, кнопка.
- **Методы:** `render()`.
- **Логика отображения:** если `price === null` → кнопка заблокирована и текст «Недоступно».
- **События (emit):**
  - `product/add { id }` / `product/remove { id }` по клику на кнопку (в зависимости от состояния);
  - (опционально, по ТЗ) `modal/close {}` — закрыть модалку после клика.
- **Синхронизация:** подписан на `basket:changed` и сам обновляет надпись кнопки («Купить» ↔ «Удалить из корзины»).

### `BasketView` (`.../BasketView.ts`)
- **Назначение:** корзина в модальном окне.
- **Конструктор:** `(events)`.
- **Поля (DOM):** список позиций, сумма, кнопка «Оформить».
- **Методы:** `setState({ items, total })`, `render()`.
- **Особенности:** делегирование клика по `.basket__item-delete` (крестик) на корневом элементе.
- **События (emit):** 
  - `basket/remove { id }` — удалить позицию;
  - `basket/checkout {}` — перейти к оформлению.

### `HeaderCartButtonView` (`.../HeaderCartButtonView.ts`)
- **Назначение:** иконка корзины в шапке + счётчик.
- **Конструктор:** `(events)` — ищет `.header__basket` в DOM.
- **Поля (DOM):** кнопка в шапке, счётчик.
- **Методы:** `setState({ count })`, `render()`.
- **События (emit):** `basket/open {}` по клику.

### `ModalView` (`.../ModalView.ts`)
- **Назначение:** универсальная обёртка модального окна.
- **Конструктор:** `(events)` — ищет `#modal-container`.
- **Поля (DOM):** оверлей, контейнер, контент, кнопка закрытия.
- **Методы:** 
  - `open(content?: HTMLElement)` — открыть с контентом;
  - `close()` — закрыть;
  - `setContent(node: HTMLElement)` — заменить содержимое;
  - `getElement()` — вернуть корневой элемент модалки.
- **События (emit):** `modal/close {}` при закрытии по крестику, клику вне окна, Esc.

### Формы оформления заказа

#### `OrderStep1View` (`.../OrderStep1View.ts`)
- **Назначение:** выбор оплаты и адреса.
- **Поля (DOM):** кнопки оплаты (card/cash), input адреса, кнопка «Далее», блок ошибок.
- **Правила:** 
  - выделение выбранной оплаты модификатором `button_alt-active`;
  - валидация: оба поля обязательны.
- **События (emit):** `order/step1/next { data: { payment, address } }` — только при валидности.

#### `OrderStep2View` (`.../OrderStep2View.ts`)
- **Назначение:** ввод email и телефона.
- **Поля (DOM):** inputs email/phone, кнопка «Оплатить», блок ошибок.
- **Правила:** поля обязательны, базовая валидация email/phone.
- **События (emit):** `order/step2/pay { data: { email, phone } }` — только при валидности.


## События, генерируемые моделями (Model layer)

- `products:changed`
  - **Кем:** `Products.setItems`, `Products.clear`
  - **Payload:** `{ items: IProduct[] }`

- `basket:changed`
  - **Кем:** `Basket.setItems`, `Basket.add`, `Basket.remove`, `Basket.clear`
  - **Payload:** `{ items: IBasketItem[]; total: number }`

- `order:changed`
  - **Кем:** `Order.setDraft`, `Order.patchDraft`
  - **Payload:** `{ draft: IOrderDraft }`

- `order:reset`
  - **Кем:** `Order.reset`
  - **Payload:** `{}` (без данных)

### Как формируется URL изображения

API возвращает поле `image`, которое может содержать путь вида `/images/NAME.svg` или `/NAME.svg`.  
Для корректного показа компонент собирает полный URL:

