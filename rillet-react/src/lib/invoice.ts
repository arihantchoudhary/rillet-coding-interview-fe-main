export interface Customer {
	id: string;
	name: string;
}

export interface InvoiceFormData {
	invoiceCode: string;
	customerId: string;
	customerName: string;
	productName: string;
	price: string;
	quantity: string;
	discount: string;
}

export interface InvoiceRequest {
	invoiceCode: string;
	customerId: string;
	productName: string;
	price: number;
	quantity: number;
	discount: number;
}

export interface InvoiceResponse extends InvoiceRequest {
	id: string;
	total: number;
	createdAt: string;
}

export interface FormErrors {
	invoiceCode?: string;
	customer?: string;
	productName?: string;
	price?: string;
	quantity?: string;
	discount?: string;
}

export function calculateTotal(
	price: number,
	quantity: number,
	discountPercent: number,
): number {
	if (price <= 0 || quantity <= 0) return 0;
	const subtotal = price * quantity;
	const discount = Math.min(Math.max(discountPercent, 0), 100) / 100;
	return Math.round((subtotal - subtotal * discount) * 100) / 100;
}

export function validateForm(data: InvoiceFormData): FormErrors {
	const errors: FormErrors = {};

	if (!data.invoiceCode.trim()) {
		errors.invoiceCode = 'Invoice code is required';
	}

	if (!data.customerId) {
		errors.customer = 'Please select a customer';
	}

	if (!data.productName.trim()) {
		errors.productName = 'Product name is required';
	}

	const price = Number(data.price);
	if (!data.price) {
		errors.price = 'Price is required';
	} else if (isNaN(price) || price <= 0) {
		errors.price = 'Price must be greater than 0';
	} else if (data.price.includes('.') && data.price.split('.')[1].length > 2) {
		errors.price = 'Price can have at most 2 decimal places';
	}

	const quantity = Number(data.quantity);
	if (!data.quantity) {
		errors.quantity = 'Quantity is required';
	} else if (isNaN(quantity) || quantity <= 0) {
		errors.quantity = 'Quantity must be greater than 0';
	} else if (!Number.isInteger(quantity)) {
		errors.quantity = 'Quantity must be a whole number';
	}

	const discount = Number(data.discount);
	if (data.discount !== '' && data.discount !== undefined) {
		if (isNaN(discount)) {
			errors.discount = 'Discount must be a number';
		} else if (discount < 0 || discount > 100) {
			errors.discount = 'Discount must be between 0 and 100';
		} else if (!Number.isInteger(discount)) {
			errors.discount = 'Discount must be a whole number';
		}
	}

	return errors;
}

export function toInvoiceRequest(data: InvoiceFormData): InvoiceRequest {
	return {
		invoiceCode: data.invoiceCode.trim(),
		customerId: data.customerId,
		productName: data.productName.trim(),
		price: Number(data.price),
		quantity: Number(data.quantity),
		discount: Number(data.discount || 0) / 100,
	};
}
