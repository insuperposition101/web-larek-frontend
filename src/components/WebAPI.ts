import { Api } from './base/Api';
import { IOrder, IOrderResult, ILotItem, ApiListResponse } from '../types';

export class WebAPI extends Api {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getLotItem(id: string): Promise<ILotItem> {
		return this.get(`/product/${id}`).then((item: ILotItem) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	getLotList(): Promise<ILotItem[]> {
		return this.get('/product').then((data: ApiListResponse<ILotItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderLots(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
