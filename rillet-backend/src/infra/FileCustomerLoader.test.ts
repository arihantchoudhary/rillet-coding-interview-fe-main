import { it, expect } from 'vitest';
import { FileCustomerLoader } from './FileCustomerLoader.js';

it('should return customers matching the query', async () => {
	const loader = new FileCustomerLoader();

	const result = await loader.search('amazon', 20);

	expect(result.length).toBeGreaterThan(0);
	expect(result.every((customer) => customer.name.toLowerCase().includes('amazon'))).toBe(true);
});

it('should return customers sorted alphabetically by name', async () => {
	const loader = new FileCustomerLoader();

	const result = await loader.search('inc', 20);

	for (let i = 0; i < result.length - 1; i++) {
		expect(result[i].name.localeCompare(result[i + 1].name)).toBeLessThanOrEqual(0);
	}
});

it('should perform case-insensitive search', async () => {
	const loader = new FileCustomerLoader();

	const lowerCaseResult = await loader.search('google', 20);
	const upperCaseResult = await loader.search('GOOGLE', 20);
	const mixedCaseResult = await loader.search('GoOgLe', 20);

	expect(lowerCaseResult).toEqual(upperCaseResult);
	expect(lowerCaseResult).toEqual(mixedCaseResult);
});

it('should respect the limit parameter', async () => {
	const loader = new FileCustomerLoader();

	const result = await loader.search('inc', 5);

	expect(result.length).toBeLessThanOrEqual(5);
});

it('should return empty array when no customers match', async () => {
	const loader = new FileCustomerLoader();

	const result = await loader.search('nonexistentcompany12345', 20);

	expect(result).toEqual([]);
});

it('should return all matching customers when limit is greater than matches', async () => {
	const loader = new FileCustomerLoader();

	const result = await loader.search('amazon', 100);

	expect(result.length).toBeGreaterThan(0);
	expect(result.every((customer) => customer.name.toLowerCase().includes('amazon'))).toBe(true);
});

it('should match partial strings anywhere in the name', async () => {
	const loader = new FileCustomerLoader();

	const result = await loader.search('tech', 20);

	expect(result.length).toBeGreaterThan(0);
	expect(result.every((customer) => customer.name.toLowerCase().includes('tech'))).toBe(true);
});

it('should return customers with valid id and name properties', async () => {
	const loader = new FileCustomerLoader();

	const result = await loader.search('google', 1);

	expect(result.length).toBeGreaterThan(0);
	expect(result[0]).toHaveProperty('id');
	expect(result[0]).toHaveProperty('name');
	expect(typeof result[0].id).toBe('string');
	expect(typeof result[0].name).toBe('string');
	expect(result[0].id.length).toBeGreaterThan(0);
	expect(result[0].name.length).toBeGreaterThan(0);
});
