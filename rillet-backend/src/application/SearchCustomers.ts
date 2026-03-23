import { Customer } from '../domain/Customer.js';
import { CustomerLoader } from '../domain/CustomerLoader.js';

export class SearchCustomers {
	constructor(private customerLoader: CustomerLoader) {}

	async execute(query: string, limit: number = 20): Promise<Customer[]> {
		if (!query || query.trim().length === 0) {
			return [];
		}

		return this.customerLoader.search(query, limit);
	}
}
