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

## Классы слоя «Модели» и коммуникаций

### `Products` — каталог товаров (`src/components/Models/Products.ts`)
- **Назначение:** хранение массива `IProduct[]`.  
- **Методы:** `setItems(items)`, `getItems()`, `getById(id)`, `clear()`; геттер `length`.  
- **Зависимости:** нет (не знает про DOM/HTTP).

### `Basket` — корзина (`src/components/Models/Basket.ts`)
- **Назначение:** хранение `items` и `total`.  
- **Методы:** `setItems(items)`, `add(item)`, `remove(id)`, `clear()`, `getState()` (возвращает копию состояния).  
- **Особенности:** `total` считается автоматически **только по числовым ценам** (`null` не суммируется).  
- **Зависимости:** нет.

### `Order` — данные покупателя (`src/components/Models/Order.ts`)
- **Назначение:** хранение черновика `IOrderDraft`.  
- **Методы:** `setDraft(draft)`, `patchDraft(patch)`, `getDraft()`, `reset()`.  
- **Зависимости:** нет.

### `ShopApi` — связь с сервером (`src/components/Services/ShopApi.ts`)
- **Назначение:** изолированный коммуникационный слой.  
- **Зависимость:** принимает `api: IApi` (композиция), использует `get/post`.  
- **Маршруты:** берёт из `ENDPOINTS` (см. `src/utils/constants.ts`).  
- **Методы:**
  - `getProducts()` — `GET /product/` (или `/catalog`), возвращает `IProduct[]`.
  - `createOrder(payload)` — `POST /order/`, принимает `IOrderPayload`, возвращает `IOrderResponse`.

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
