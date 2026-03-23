import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

test('renders form with invoice code', async () => {
	const screen = render(Page);

	await expect.element(screen.getByLabelText('Invoice Code')).toBeInTheDocument();
	await expect.element(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
});

test('updates form fields on input', async () => {
	const screen = render(Page);
	const invoiceCodeInput = screen.getByTestId('invoiceCode');

	await invoiceCodeInput.fill('#INV-12300');

	await expect.element(invoiceCodeInput).toHaveValue('#INV-12300');
});
