import { Model } from './base/Model';
import { FormErrors, IAppState, ILotItem, IOrder, IOrderForm } from '../types';

export type CatalogChangeEvent = {
	catalog: LotItem[];
};

export class LotItem extends Model<ILotItem> {
	description: string;
	id: string;
	image: string;
	title: string;
	price: number | null;
	category: string;
}

export class AppState extends Model<IAppState> {
	basket: LotItem[] = [];
	catalog: LotItem[];
	order: IOrder = {
		email: '',
		phone: '',
		items: [],
		address: '',
		payment: '',
		total: 0,
	};
	preview: string | null;

	formErrorsOrder: FormErrors = {};
	formErrorsContacts: FormErrors = {};

	clearBasket() {
		this.basket = [];
		this.order.items = [];
		this.order.email = '';
		this.order.phone = '';
		this.order.address = '';
	}

	getTotal() {
		return this.basket.reduce((a, b) => a + b.price, 0);
	}

	getBasketItems(): LotItem[] {
		return this.basket;
	}

	setCatalog(items: ILotItem[]) {
		this.catalog = items.map((item) => new LotItem(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: LotItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	addLot(lot: LotItem): void {
		const basketHasIt = this.basket.find((item) => item.id === lot.id);

		if (!basketHasIt) {
			this.basket.push(lot);
			this.emitChanges('basketContent:changed');
			this.order.items.push(lot.id);
		} else {
			console.log('Товар уже есть в корзине');
		}
	}

	removeLot(id: string): void {
		this.basket = this.basket.filter((lot) => lot.id !== id);
		this.emitChanges('basketContent:changed');

		if (this.order.items.indexOf(id) >= 0) {
			this.order.items.splice(this.order.items.indexOf(id), 1);
		}
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setContactsField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	validateContacts() {
		const errors: typeof this.formErrorsContacts = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrorsContacts = errors;
		this.events.emit('formErrors:change', this.formErrorsContacts);
		return Object.keys(errors).length === 0;
	}

	validateOrder() {
		const errors: typeof this.formErrorsOrder = {};

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrorsOrder = errors;
		this.events.emit('formErrors:change', this.formErrorsOrder);

		return Object.keys(errors).length === 0;
	}
}
