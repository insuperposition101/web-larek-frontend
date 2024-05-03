import './scss/styles.scss';

import { WebAPI } from './components/WebAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState, CatalogChangeEvent, LotItem } from './components/AppData';
import { Page } from './components/Page';
import { Card, BasketItem } from './components/Card';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { IOrderForm } from './types';
import { Order } from './components/Order';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new WebAPI(CDN_URL, API_URL);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Order(cloneTemplate(contactsTemplate), events);

// Переиспользуемый код обновления корзины
function updateBasket() {
	basket.items = appData.getBasketItems().map((item, index) => {
		const basketCard = new BasketItem(
			'card',
			cloneTemplate(cardBasketTemplate),
			{
				onClick: () => {
					events.emit('lot:deleted', item);
				},
			}
		);
		return basketCard.render({
			title: item.title,
			price: item.price,
			index: index,
		});
	});
	basket.total = appData.getTotal();
}

// Получаем лоты с сервера
api
	.getLotList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

// Открыть лот
events.on('card:select', (item: LotItem) => {
	appData.setPreview(item);
});

// Изменен открытый выбранный лот
events.on('preview:changed', (item: LotItem) => {
	const showItem = (item: LotItem) => {
		const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
			onClick: () => events.emit('auction:changed', item),
		});
		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				description: item.description,
				category: item.category,
				price: item.price,
			}),
		});
	};

	if (item) {
		api
			.getLotItem(item.id)
			.then((result) => {
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

//Добавить лот в корзину
events.on('auction:changed', (item: LotItem) => {
	appData.addLot(item);
	page.counter = appData.getBasketItems().length;
	modal.close();
});

// Открыть корзину и обновить информацию в корзине
events.on('bids:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
	updateBasket();
});

// //Удалить лот из корзины и обновить информацию в корзине
events.on('lot:deleted', (item: LotItem) => {
	appData.removeLot(item.id);
	page.counter = appData.getBasketItems().length;
	updateBasket();
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone, address, payment } = errors;
	order.valid = !address && !payment;
	contacts.valid = !email && !phone;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Установить способ оплаты
events.on('payment:set', (item: HTMLButtonElement) => {
	appData.order.payment = item.name;
});

// Изменилось одно из полей
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

// Открыть форму заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: 'card',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открыть форму c контактами
events.on('order:submit', () => {
	appData.order.total = appData.getTotal();
	if (appData.order.payment === '') {
		appData.order.payment = 'card';
	}
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Оформить заказ
events.on('contacts:submit', () => {
	api
		.orderLots(appData.order)
		.then((result) => {
			console.log(appData.order);
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({
					total: appData.getTotal(),
				}),
			});

			appData.clearBasket();
			page.counter = appData.basket.length;
		})

		.catch((err) => {
			console.error(err);
		});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});
