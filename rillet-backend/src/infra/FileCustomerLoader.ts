import { Customer } from '../domain/Customer.js';
import { CustomerLoader } from '../domain/CustomerLoader.js';
import customersData from './customers.json' with { type: 'json' };

export class FileCustomerLoader implements CustomerLoader {
	private customers: Customer[];

	constructor() {
		this.customers = customersData;
	}

	async search(query: string, limit: number): Promise<Customer[]> {
		const normalizedQuery = query.toLowerCase();

		const matches = this.customers
			.filter((customer) => customer.name.toLowerCase().includes(normalizedQuery))
			.sort((a, b) => a.name.localeCompare(b.name));

		return matches.slice(0, limit);
	}
}
