import { SearchCustomers } from '../application/SearchCustomers.js';
import { CreateInvoice } from '../application/CreateInvoice.js';
import { FileCustomerLoader } from './FileCustomerLoader.js';
import { InMemoryInvoiceRepository } from './InMemoryInvoiceRepository.js';

export interface Container {
	searchCustomers: SearchCustomers;
	createInvoice: CreateInvoice;
	invoiceRepository: InMemoryInvoiceRepository;
}

export function createContainer(): Container {
	const customerLoader = new FileCustomerLoader();
	const invoiceRepository = new InMemoryInvoiceRepository();

	const searchCustomers = new SearchCustomers(customerLoader);
	const createInvoice = new CreateInvoice(invoiceRepository);

	return {
		searchCustomers,
		createInvoice,
		invoiceRepository
	};
}
