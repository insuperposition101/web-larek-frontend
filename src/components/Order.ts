import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { EventEmitter, IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export class Order extends Form<IOrderForm> {
	protected _buttons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._buttons = Array.from(container.querySelectorAll('.button_alt'));
		this._buttons.forEach((button) => {
			button.addEventListener('click', () => {
				events.emit('payment:set', { name: button.name });
				this.payment = button.name;
			});
		});
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set payment(name: string) {
		this._buttons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
