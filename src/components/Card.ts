import { Component } from './base/Component';
import { ILotItem } from '../types';
import { bem, createElement, ensureElement } from '../utils/utils';
import { categoryColor } from '../utils/constants';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
	title: string;
	description: string | string[];
	image: string;
	category: string;
	price: number | null;
	index: number;
}

export class Card<T> extends Component<ICard<T>> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__text`);
		this._category = container.querySelector('.card__category');
		this._price = ensureElement<HTMLElement>('.card__price', container);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.add(categoryColor[value]);
	}

	set price(value: number | null) {
		if (value !== null) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
			if (this._button) {
				this._button.setAttribute('disabled', '^.^');
			}
		}
	}
}

export type IBasketItem = {
	index?: number;
	id?: string;
	title: string;
	price: number | null;
};

export class BasketItem extends Component<IBasketItem> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _id: string;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._button = ensureElement<HTMLButtonElement>(
			`.${blockName}__button`,
			container
		);
		this._button.addEventListener('click', actions.onClick);
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	set index(value: number) {
		this.setText(this._index, value + 1);
	}

	set price(value: number) {
		this._price.textContent = value + ' синапсов';
	}
}
