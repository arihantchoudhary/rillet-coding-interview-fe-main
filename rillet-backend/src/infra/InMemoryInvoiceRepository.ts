import { randomUUID } from 'crypto';
import { Invoice, InvoiceCreateRequest } from '../domain/Invoice.js';
import { InvoiceCreator } from '../domain/InvoiceCreator.js';

export class InMemoryInvoiceRepository implements InvoiceCreator {
	private invoices: Invoice[] = [];

	async create(request: InvoiceCreateRequest): Promise<Invoice> {
		const subtotal = request.price * request.quantity;
		const discountAmount = subtotal * request.discount;
		const total = subtotal - discountAmount;

		const invoice: Invoice = {
			id: randomUUID(),
			...request,
			createdAt: new Date(),
			total
		};

		this.invoices.push(invoice);

		return invoice;
	}

	getAll(): Invoice[] {
		return [...this.invoices];
	}
}
