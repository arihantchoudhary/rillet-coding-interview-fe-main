import { Invoice, InvoiceCreateRequest } from './Invoice.js';

export interface InvoiceCreator {
	create(request: InvoiceCreateRequest): Promise<Invoice>;
}
