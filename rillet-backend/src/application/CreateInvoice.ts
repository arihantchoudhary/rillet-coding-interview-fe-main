import { Invoice, InvoiceCreateRequest } from '../domain/Invoice.js';
import { InvoiceCreator } from '../domain/InvoiceCreator.js';

export class CreateInvoice {
	constructor(private invoiceCreator: InvoiceCreator) {}

	async execute(request: InvoiceCreateRequest): Promise<Invoice> {
		if (!request.invoiceCode || request.invoiceCode.trim().length === 0) {
			throw new Error('Invoice code is required');
		}

		if (!request.customerId || request.customerId.trim().length === 0) {
			throw new Error('Customer ID is required');
		}

		if (!request.productName || request.productName.trim().length === 0) {
			throw new Error('Product name is required');
		}

		if (request.price <= 0) {
			throw new Error('Price must be greater than 0');
		}

		if (request.quantity <= 0) {
			throw new Error('Quantity must be greater than 0');
		}

		if (request.discount < 0 || request.discount > 1) {
			throw new Error('Discount must be between 0 and 1');
		}

		return this.invoiceCreator.create(request);
	}
}
