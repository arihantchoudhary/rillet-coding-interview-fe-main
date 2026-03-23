import { z } from 'zod';

export const InvoiceRequestSchema = z.object({
	invoiceCode: z.string().min(1, 'Invoice code is required'),
	customerId: z.uuid('Customer ID must be a valid UUID'),
	productName: z.string().min(1, 'Product name is required'),
	price: z.number().positive('Price must be greater than 0'),
	quantity: z.number().int().positive('Quantity must be a positive integer'),
	discount: z.number().min(0, 'Discount must be at least 0').max(1, 'Discount must be at most 1')
});

export type InvoiceRequest = z.infer<typeof InvoiceRequestSchema>;
