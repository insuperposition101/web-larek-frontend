export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export interface ILotItem {
	id?: string;
	title: string;
	description?: string;
	image?: string;
	price: number | null;
	category?: string;
}

export interface IAppState {
	catalog: ILotItem[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
}

export interface IOrderForm {
	email: string;
	phone: string;
	address: string;
	payment: string;
}

export interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
	id: string;
	total: number;
}
