import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import App from './App.tsx';

test('renders form with invoice code', async () => {
	const { getByLabelText, getByRole } = await render(<App />);

	await expect.element(getByLabelText('Invoice Code')).toBeInTheDocument();
	await expect.element(getByRole('button', { name: 'Submit' })).toBeInTheDocument();
});

test('updates form fields on input', async () => {
	const { getByTestId } = await render(<App />);
	const invoiceCodeInput = getByTestId('invoiceCode');

	await invoiceCodeInput.fill('#INV-12300');

	await expect(invoiceCodeInput).toHaveValue('#INV-12300');
});
