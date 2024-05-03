# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build

```

# Описание базового кода: интерфейсы и классы

### Интерфейс IAppState - описывает данные компонентов приложения: каталога товаров, корзины, превью карточки и заказа

```
interface IAppState {
    catalog: ILotItem[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
}
```

### Интерфейс ILotItem - описывает данные данные товара

```
interface ILotItem {
    id?: string;
    title: string;
    description?: string;
    image?: string;
    price: number;
    category?: string;
}
```

### Интерфейс IOrderForm - описывает информацию от пользователя, требуемую при оформлении заказа

```
interface IOrderForm {
    email: string;
    phone: string;
    address: string;
    payment: string;
}
```

### Интерфейс IOrder - описывает информацию о заказе: список товаров и общую сумму, и также включает в себя интерфейс IOrderForm

```
interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}
```

### Интерфейс IOrderResult - содержит id оформленного заказа

```
interface IOrderResult {
    id: string;
}
```

## 1. Абстрактный класс Component<T> 
##### Представляет собой базовый компонент для работы с DOM элементами. Он предоставляет инструменты для управления отображением и поведением элементов на веб-странице.

#### Конструктор
- **protected constructor(container: HTMLElement)**:
  - Создает экземпляр класса Component с указанным контейнером (DOM элемент), к которому будет привязан компонент.

#### Методы
1. **toggleClass(element: HTMLElement, className: string, force?: boolean)**:
   - Переключает класс у указанного DOM элемента.
   
2. **setText(element: HTMLElement, value: unknown)**:
   - Устанавливает текстовое содержимое для указанного DOM элемента.
   
3. **setDisabled(element: HTMLElement, state: boolean)**:
   - Устанавливает состояние блокировки для указанного DOM элемента.
   
4. **setHidden(element: HTMLElement)**:
   - Скрывает указанный DOM элемент.
   
5. **setVisible(element: HTMLElement)**:
   - Показывает указанный DOM элемент.
   
6. **setImage(element: HTMLImageElement, src: string, alt?: string)**:
   - Устанавливает изображение с альтернативным текстом для указанного элемента <img>.
   
7. **render(data?: Partial<T>): HTMLElement**:
   - Отображает компонент с возможностью передачи данных для отрисовки.
  
2. ## Класс EventEmitter

##### Представляет собой инструмент для управления событиями и обработчиками событий в приложении. Он позволяет устанавливать обработчики на определенные события, инициировать события с передачей данных, а также удалять обработчики и сбрасывать все обработчики.

#### Свойства
- **_events**: Map<EventName, Set<Subscriber>> - Хранит сопоставление событий и их подписчиков.

#### Конструктор
- **constructor()**:
  - Создает экземпляр класса EventEmitter.

#### Методы
1. **on<T extends object>(eventName: EventName, callback: (event: T) => void)**:
   - Устанавливает обработчик для указанного события.
   
2. **off(eventName: EventName, callback: Subscriber)**:
   - Удаляет обработчик для указанного события.
   
3. **emit<T extends object>(eventName: string, data?: T)**:
   - Инициирует событие с передачей данных подписчикам.
   
4. **onAll(callback: (event: EmitterEvent) => void)**:
   - Устанавливает обработчик для всех событий.
   
5. **offAll()**:
   - Удаляет все обработчики событий.
   
6. **trigger<T extends object>(eventName: string, context?: Partial<T>)**:
   - Возвращает функцию-триггер, которая генерирует событие при вызове.

