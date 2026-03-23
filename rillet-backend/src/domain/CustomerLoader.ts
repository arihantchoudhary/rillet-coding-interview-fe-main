import { Customer } from './Customer.js';

export interface CustomerLoader {
	search(query: string, limit: number): Promise<Customer[]>;
}
