import { expect, test, describe } from 'vitest';
import { render } from 'vitest-browser-react';
import App from './App.tsx';

describe('Invoice Form', () => {
	test('renders form with all fields', async () => {
		const { getByLabelText, getByRole, getByTestId } = await render(<App />);

		await expect.element(getByLabelText('Invoice Code *')).toBeInTheDocument();
		await expect.element(getByLabelText('Product Name *')).toBeInTheDocument();
		await expect.element(getByLabelText('Price *')).toBeInTheDocument();
		await expect.element(getByLabelText('Quantity *')).toBeInTheDocument();
		await expect.element(getByLabelText('Discount %')).toBeInTheDocument();
		await expect.element(getByRole('combobox')).toBeInTheDocument();
		await expect.element(getByRole('button', { name: 'Submit' })).toBeInTheDocument();
		await expect.element(getByTestId('total')).toHaveTextContent('$0.00');
	});

	test('updates invoice code field on input', async () => {
		const { getByTestId } = await render(<App />);
		const invoiceCodeInput = getByTestId('invoiceCode');

		await invoiceCodeInput.fill('#INV-12300');

		await expect(invoiceCodeInput).toHaveValue('#INV-12300');
	});

	test('calculates total dynamically', async () => {
		const { getByTestId } = await render(<App />);

		await getByTestId('price').fill('100');
		await getByTestId('quantity').fill('5');

		await expect.element(getByTestId('total')).toHaveTextContent('$500.00');
	});

	test('calculates total with discount', async () => {
		const { getByTestId } = await render(<App />);

		await getByTestId('price').fill('100');
		await getByTestId('quantity').fill('5');
		await getByTestId('discount').fill('10');

		await expect.element(getByTestId('total')).toHaveTextContent('$450.00');
	});

	test('shows validation errors on submit with empty form', async () => {
		const { getByRole, getByText } = await render(<App />);

		await getByRole('button', { name: 'Submit' }).click();

		await expect.element(getByText('Invoice code is required')).toBeInTheDocument();
		await expect.element(getByText('Please select a customer')).toBeInTheDocument();
		await expect.element(getByText('Product name is required')).toBeInTheDocument();
		await expect.element(getByText('Price is required')).toBeInTheDocument();
		await expect.element(getByText('Quantity is required')).toBeInTheDocument();
	});

	test('shows validation error after submitting empty field', async () => {
		const { getByRole, getByText, getByTestId } = await render(<App />);

		await getByTestId('invoiceCode').fill('');
		await getByRole('button', { name: 'Submit' }).click();

		await expect
			.element(getByText('Invoice code is required'))
			.toBeInTheDocument();
	});

	test('clears error when field is corrected after submit', async () => {
		const { getByRole, getByTestId } = await render(<App />);

		// Submit to trigger errors
		await getByRole('button', { name: 'Submit' }).click();

		// Fix error
		await getByTestId('invoiceCode').fill('INV-001');

		await expect(getByTestId('invoiceCode')).toHaveAttribute('aria-invalid', 'false');
	});
});
