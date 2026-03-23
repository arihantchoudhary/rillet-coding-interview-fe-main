export interface InvoiceCreateRequest {
	invoiceCode: string;
	customerId: string;
	productName: string;
	price: number;
	quantity: number;
	discount: number;
}

export interface Invoice extends InvoiceCreateRequest {
	id: string;
	createdAt: Date;
	total: number;
}
