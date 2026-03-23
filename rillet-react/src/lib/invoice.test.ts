import { describe, it, expect } from 'vitest';
import {
	calculateTotal,
	validateForm,
	toInvoiceRequest,
	type InvoiceFormData,
} from './invoice';

describe('calculateTotal', () => {
	it('calculates price * quantity with no discount', () => {
		expect(calculateTotal(100, 5, 0)).toBe(500);
	});

	it('applies discount correctly', () => {
		// (100 * 5) - (100 * 5 * 0.1) = 500 - 50 = 450
		expect(calculateTotal(100, 5, 10)).toBe(450);
	});

	it('handles 100% discount', () => {
		expect(calculateTotal(100, 5, 100)).toBe(0);
	});

	it('handles 50% discount', () => {
		expect(calculateTotal(200, 3, 50)).toBe(300);
	});

	it('returns 0 for zero price', () => {
		expect(calculateTotal(0, 5, 0)).toBe(0);
	});

	it('returns 0 for zero quantity', () => {
		expect(calculateTotal(100, 0, 0)).toBe(0);
	});

	it('returns 0 for negative price', () => {
		expect(calculateTotal(-10, 5, 0)).toBe(0);
	});

	it('handles decimal prices', () => {
		expect(calculateTotal(19.99, 3, 0)).toBe(59.97);
	});

	it('rounds to 2 decimal places', () => {
		// 10.33 * 3 = 30.99
		expect(calculateTotal(10.33, 3, 0)).toBe(30.99);
	});

	it('clamps discount above 100 to 100', () => {
		expect(calculateTotal(100, 1, 150)).toBe(0);
	});

	it('clamps negative discount to 0', () => {
		expect(calculateTotal(100, 1, -10)).toBe(100);
	});
});

describe('validateForm', () => {
	const validForm: InvoiceFormData = {
		invoiceCode: 'INV-001',
		customerId: '550e8400-e29b-41d4-a716-446655440001',
		customerName: 'Amazon',
		productName: 'Web Hosting',
		price: '100',
		quantity: '5',
		discount: '10',
	};

	it('returns no errors for valid data', () => {
		expect(validateForm(validForm)).toEqual({});
	});

	it('requires invoice code', () => {
		const errors = validateForm({ ...validForm, invoiceCode: '' });
		expect(errors.invoiceCode).toBe('Invoice code is required');
	});

	it('requires invoice code to not be just whitespace', () => {
		const errors = validateForm({ ...validForm, invoiceCode: '   ' });
		expect(errors.invoiceCode).toBe('Invoice code is required');
	});

	it('requires customer selection', () => {
		const errors = validateForm({ ...validForm, customerId: '' });
		expect(errors.customer).toBe('Please select a customer');
	});

	it('requires product name', () => {
		const errors = validateForm({ ...validForm, productName: '' });
		expect(errors.productName).toBe('Product name is required');
	});

	it('requires price', () => {
		const errors = validateForm({ ...validForm, price: '' });
		expect(errors.price).toBe('Price is required');
	});

	it('requires price greater than 0', () => {
		const errors = validateForm({ ...validForm, price: '0' });
		expect(errors.price).toBe('Price must be greater than 0');
	});

	it('rejects negative price', () => {
		const errors = validateForm({ ...validForm, price: '-5' });
		expect(errors.price).toBe('Price must be greater than 0');
	});

	it('rejects price with more than 2 decimal places', () => {
		const errors = validateForm({ ...validForm, price: '10.123' });
		expect(errors.price).toBe('Price can have at most 2 decimal places');
	});

	it('allows price with 2 decimal places', () => {
		const errors = validateForm({ ...validForm, price: '10.99' });
		expect(errors.price).toBeUndefined();
	});

	it('requires quantity', () => {
		const errors = validateForm({ ...validForm, quantity: '' });
		expect(errors.quantity).toBe('Quantity is required');
	});

	it('requires quantity greater than 0', () => {
		const errors = validateForm({ ...validForm, quantity: '0' });
		expect(errors.quantity).toBe('Quantity must be greater than 0');
	});

	it('rejects non-integer quantity', () => {
		const errors = validateForm({ ...validForm, quantity: '2.5' });
		expect(errors.quantity).toBe('Quantity must be a whole number');
	});

	it('allows empty discount', () => {
		const errors = validateForm({ ...validForm, discount: '' });
		expect(errors.discount).toBeUndefined();
	});

	it('rejects discount above 100', () => {
		const errors = validateForm({ ...validForm, discount: '101' });
		expect(errors.discount).toBe('Discount must be between 0 and 100');
	});

	it('rejects negative discount', () => {
		const errors = validateForm({ ...validForm, discount: '-5' });
		expect(errors.discount).toBe('Discount must be between 0 and 100');
	});

	it('rejects non-integer discount', () => {
		const errors = validateForm({ ...validForm, discount: '10.5' });
		expect(errors.discount).toBe('Discount must be a whole number');
	});

	it('returns multiple errors at once', () => {
		const errors = validateForm({
			invoiceCode: '',
			customerId: '',
			customerName: '',
			productName: '',
			price: '',
			quantity: '',
			discount: '',
		});
		expect(errors.invoiceCode).toBeDefined();
		expect(errors.customer).toBeDefined();
		expect(errors.productName).toBeDefined();
		expect(errors.price).toBeDefined();
		expect(errors.quantity).toBeDefined();
	});
});

describe('toInvoiceRequest', () => {
	it('converts form data to API request format', () => {
		const request = toInvoiceRequest({
			invoiceCode: 'INV-001',
			customerId: 'abc-123',
			customerName: 'Test Co',
			productName: 'Widget',
			price: '100',
			quantity: '5',
			discount: '10',
		});

		expect(request).toEqual({
			invoiceCode: 'INV-001',
			customerId: 'abc-123',
			productName: 'Widget',
			price: 100,
			quantity: 5,
			discount: 0.1,
		});
	});

	it('converts empty discount to 0', () => {
		const request = toInvoiceRequest({
			invoiceCode: 'INV-001',
			customerId: 'abc-123',
			customerName: 'Test Co',
			productName: 'Widget',
			price: '50',
			quantity: '2',
			discount: '',
		});

		expect(request.discount).toBe(0);
	});

	it('trims whitespace from string fields', () => {
		const request = toInvoiceRequest({
			invoiceCode: '  INV-001  ',
			customerId: 'abc-123',
			customerName: 'Test Co',
			productName: '  Widget  ',
			price: '50',
			quantity: '2',
			discount: '',
		});

		expect(request.invoiceCode).toBe('INV-001');
		expect(request.productName).toBe('Widget');
	});
});
