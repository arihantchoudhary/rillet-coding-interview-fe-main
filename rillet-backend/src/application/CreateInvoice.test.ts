import { it, expect, vi } from 'vitest';
import { CreateInvoice } from './CreateInvoice.js';
import { InvoiceCreator } from '../domain/InvoiceCreator.js';
import { Invoice, InvoiceCreateRequest } from '../domain/Invoice.js';

const validRequest: InvoiceCreateRequest = {
	invoiceCode: 'INV-001',
	customerId: '550e8400-e29b-41d4-a716-446655440001',
	productName: 'Web Hosting',
	price: 100,
	quantity: 5,
	discount: 0.1
};

it('should create an invoice with valid data', async () => {
	const mockInvoiceCreator: InvoiceCreator = {
		create: vi.fn()
	};
	const createInvoice = new CreateInvoice(mockInvoiceCreator);

	const mockInvoice: Invoice = {
		...validRequest,
		id: 'invoice-123',
		createdAt: new Date(),
		total: 450
	};

	vi.mocked(mockInvoiceCreator.create).mockResolvedValue(mockInvoice);

	const result = await createInvoice.execute(validRequest);

	expect(mockInvoiceCreator.create).toHaveBeenCalledWith(validRequest);
	expect(result).toEqual(mockInvoice);
});

it('should throw error when invoiceCode is empty', async () => {
	const mockInvoiceCreator: InvoiceCreator = {
		create: vi.fn()
	};
	const createInvoice = new CreateInvoice(mockInvoiceCreator);

	const request = { ...validRequest, invoiceCode: '' };

	await expect(createInvoice.execute(request)).rejects.toThrow('Invoice code is required');
	expect(mockInvoiceCreator.create).not.toHaveBeenCalled();
});

it('should throw error when invoiceCode is only whitespace', async () => {
	const mockInvoiceCreator: InvoiceCreator = {
		create: vi.fn()
	};
	const createInvoice = new CreateInvoice(mockInvoiceCreator);

	const request = { ...validRequest, invoiceCode: '   ' };

	await expect(createInvoice.execute(request)).rejects.toThrow('Invoice code is required');
	expect(mockInvoiceCreator.create).not.toHaveBeenCalled();
});

it('should throw error when customerId is empty', async () => {
	const mockInvoiceCreator: InvoiceCreator = {
		create: vi.fn()
	};
	const createInvoice = new CreateInvoice(mockInvoiceCreator);

	const request = { ...validRequest, customerId: '' };

	await expect(createInvoice.execute(request)).rejects.toThrow('Customer ID is required');
	expect(mockInvoiceCreator.create).not.toHaveBeenCalled();
});

it('should throw error when productName is empty', async () => {
	const mockInvoiceCreator: InvoiceCreator = {
		create: vi.fn()
	};
	const createInvoice = new CreateInvoice(mockInvoiceCreator);

	const request = { ...validRequest, productName: '' };

	await expect(createInvoice.execute(request)).rejects.toThrow('Product name is required');
	expect(mockInvoiceCreator.create).not.toHaveBeenCalled();
});

it('should throw error when price is zero', async () => {
	const mockInvoiceCreator: InvoiceCreator = {
		create: vi.fn()
	};
	const createInvoice = new CreateInvoice(mockInvoiceCreator);

	const request = { ...validRequest, price: 0 };

	await expect(createInvoice.execute(request)).rejects.toThrow('Price must be greater than 0');
	expect(mockInvoiceCreator.create).not.toHaveBeenCalled();
});

it('should throw error when price is negative', async () => {
	const mockInvoiceCreator: InvoiceCreator = {
		create: vi.fn()
	};
	const createInvoice = new CreateInvoice(mockInvoiceCreator);

	const request = { ...validRequest, price: -10 };

	await expect(createInvoice.execute(request)).rejects.toThrow('Price must be greater than 0');
	expect(mockInvoiceCreator.create).not.toHaveBeenCalled();
});

it('should throw error when quantity is zero', async () => {
	const mockInvoiceCreator: InvoiceCreator = {
		create: vi.fn()
	};
	const createInvoice = new CreateInvoice(mockInvoiceCreator);

	const request = { ...validRequest, quantity: 0 };

	await expect(createInvoice.execute(request)).rejects.toThrow('Quantity must be greater than 0');
	expect(mockInvoiceCreator.create).not.toHaveBeenCalled();
});

it('should throw error when quantity is negative', async () => {
	const mockInvoiceCreator: InvoiceCreator = {
		create: vi.fn()
	};
	const createInvoice = new CreateInvoice(mockInvoiceCreator);

	const request = { ...validRequest, quantity: -5 };

	await expect(createInvoice.execute(request)).rejects.toThrow('Quantity must be greater than 0');
	expect(mockInvoiceCreator.create).not.toHaveBeenCalled();
});

it('should throw error when discount is negative', async () => {
	const mockInvoiceCreator: InvoiceCreator = {
		create: vi.fn()
	};
	const createInvoice = new CreateInvoice(mockInvoiceCreator);

	const request = { ...validRequest, discount: -0.1 };

	await expect(createInvoice.execute(request)).rejects.toThrow('Discount must be between 0 and 1');
	expect(mockInvoiceCreator.create).not.toHaveBeenCalled();
});

it('should throw error when discount is greater than 1', async () => {
	const mockInvoiceCreator: InvoiceCreator = {
		create: vi.fn()
	};
	const createInvoice = new CreateInvoice(mockInvoiceCreator);

	const request = { ...validRequest, discount: 1.5 };

	await expect(createInvoice.execute(request)).rejects.toThrow('Discount must be between 0 and 1');
	expect(mockInvoiceCreator.create).not.toHaveBeenCalled();
});

it('should accept discount of 0', async () => {
	const mockInvoiceCreator: InvoiceCreator = {
		create: vi.fn()
	};
	const createInvoice = new CreateInvoice(mockInvoiceCreator);

	const request = { ...validRequest, discount: 0 };
	const mockInvoice: Invoice = {
		...request,
		id: 'invoice-123',
		createdAt: new Date(),
		total: 500
	};

	vi.mocked(mockInvoiceCreator.create).mockResolvedValue(mockInvoice);

	await expect(createInvoice.execute(request)).resolves.toBeDefined();
	expect(mockInvoiceCreator.create).toHaveBeenCalledWith(request);
});

it('should accept discount of 1 (100%)', async () => {
	const mockInvoiceCreator: InvoiceCreator = {
		create: vi.fn()
	};
	const createInvoice = new CreateInvoice(mockInvoiceCreator);

	const request = { ...validRequest, discount: 1 };
	const mockInvoice: Invoice = {
		...request,
		id: 'invoice-123',
		createdAt: new Date(),
		total: 0
	};

	vi.mocked(mockInvoiceCreator.create).mockResolvedValue(mockInvoice);

	await expect(createInvoice.execute(request)).resolves.toBeDefined();
	expect(mockInvoiceCreator.create).toHaveBeenCalledWith(request);
});
