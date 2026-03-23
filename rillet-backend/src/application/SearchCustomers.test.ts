import { it, expect, vi } from 'vitest';
import { SearchCustomers } from './SearchCustomers.js';
import { CustomerLoader } from '../domain/CustomerLoader.js';
import { Customer } from '../domain/Customer.js';

it('should return customers matching the query', async () => {
	const mockCustomerLoader: CustomerLoader = {
		search: vi.fn()
	};
	const searchCustomers = new SearchCustomers(mockCustomerLoader);

	const mockCustomers: Customer[] = [
		{ id: '1', name: 'Amazon Web Services' },
		{ id: '2', name: 'Amazon Prime' }
	];

	vi.mocked(mockCustomerLoader.search).mockResolvedValue(mockCustomers);

	const result = await searchCustomers.execute('amazon', 20);

	expect(mockCustomerLoader.search).toHaveBeenCalledWith('amazon', 20);
	expect(result).toEqual(mockCustomers);
});

it('should return empty array when query is empty string', async () => {
	const mockCustomerLoader: CustomerLoader = {
		search: vi.fn()
	};
	const searchCustomers = new SearchCustomers(mockCustomerLoader);

	const result = await searchCustomers.execute('', 20);

	expect(mockCustomerLoader.search).not.toHaveBeenCalled();
	expect(result).toEqual([]);
});

it('should return empty array when query is only whitespace', async () => {
	const mockCustomerLoader: CustomerLoader = {
		search: vi.fn()
	};
	const searchCustomers = new SearchCustomers(mockCustomerLoader);

	const result = await searchCustomers.execute('   ', 20);

	expect(mockCustomerLoader.search).not.toHaveBeenCalled();
	expect(result).toEqual([]);
});

it('should use default limit of 20 when not specified', async () => {
	const mockCustomerLoader: CustomerLoader = {
		search: vi.fn()
	};
	const searchCustomers = new SearchCustomers(mockCustomerLoader);

	const mockCustomers: Customer[] = [{ id: '1', name: 'Test Company' }];

	vi.mocked(mockCustomerLoader.search).mockResolvedValue(mockCustomers);

	await searchCustomers.execute('test');

	expect(mockCustomerLoader.search).toHaveBeenCalledWith('test', 20);
});

it('should respect custom limit parameter', async () => {
	const mockCustomerLoader: CustomerLoader = {
		search: vi.fn()
	};
	const searchCustomers = new SearchCustomers(mockCustomerLoader);

	const mockCustomers: Customer[] = [{ id: '1', name: 'Test Company' }];

	vi.mocked(mockCustomerLoader.search).mockResolvedValue(mockCustomers);

	await searchCustomers.execute('test', 5);

	expect(mockCustomerLoader.search).toHaveBeenCalledWith('test', 5);
});
