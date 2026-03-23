import express, { Request, Response } from 'express';
import cors from 'cors';
import { createContainer } from '../src/infra/container.js';
import { InvoiceRequestSchema } from '../src/infra/schemas/InvoiceRequestSchema.js';

const app = express();

app.use(cors());
app.use(express.json());

const container = createContainer();

app.get('/api/customers', async (req: Request, res: Response) => {
	try {
		const query = req.query.q as string;

		if (!query) {
			return res.status(400).json({ error: 'Query parameter "q" is required' });
		}

		const customers = await container.searchCustomers.execute(query, 20);
		res.json(customers);
	} catch (error) {
		console.error('Error searching customers:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

app.get('/api/invoices', (_req: Request, res: Response) => {
	try {
		const invoices = container.invoiceRepository.getAll();
		res.json(invoices);
	} catch (error) {
		console.error('Error fetching invoices:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

app.post('/api/invoices', async (req: Request, res: Response) => {
	const result = InvoiceRequestSchema.safeParse(req.body);

	if (!result.success) {
		return res.status(400).json({
			validationErrors: result.error.issues.map((issue) => ({
				field: issue.path.join('.'),
				message: issue.message
			}))
		});
	}

	try {
		const invoice = await container.createInvoice.execute(result.data);
		res.status(200).json(invoice);
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error creating invoice:', error.message);
			res.status(400).json({ error: error.message });
		} else {
			console.error('Unknown error creating invoice:', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	}
});

app.get('/api/health', (_req: Request, res: Response) => {
	res.json({ status: 'ok' });
});

export default app;
