import { useState } from 'react';
import { FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/TextField';
import { NumberField } from '@/components/NumberField';
import { CustomerCombobox } from '@/components/CustomerCombobox';
import { InvoiceList } from '@/components/InvoiceList';
import {
	calculateTotal,
	validateForm,
	toInvoiceRequest,
	type InvoiceFormData,
	type FormErrors,
	type Customer
} from '@/lib/invoice';

const API_BASE = 'http://localhost:3000';

const initialFormData: InvoiceFormData = {
	invoiceCode: '',
	customerId: '',
	customerName: '',
	productName: '',
	price: '',
	quantity: '',
	discount: ''
};

function App() {
	const [formData, setFormData] = useState<InvoiceFormData>(initialFormData);
	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});
	const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
		'idle'
	);
	const [submitMessage, setSubmitMessage] = useState('');
	const [refreshKey, setRefreshKey] = useState(0);

	const total = calculateTotal(
		Number(formData.price) || 0,
		Number(formData.quantity) || 0,
		Number(formData.discount) || 0
	);

	function updateField(field: keyof InvoiceFormData, value: string) {
		const updated = { ...formData, [field]: value };
		setFormData(updated);

		if (touched[field]) {
			const fieldErrors = validateForm(updated);
			setErrors((prev) => ({
				...prev,
				[field === 'customerId' ? 'customer' : field]:
					fieldErrors[field === 'customerId' ? 'customer' : (field as keyof FormErrors)]
			}));
		}
	}

	function handleBlur(field: string) {
		setTouched((prev) => ({ ...prev, [field]: true }));
		const fieldErrors = validateForm(formData);
		const errorKey = field === 'customerId' ? 'customer' : field;
		setErrors((prev) => ({
			...prev,
			[errorKey]: fieldErrors[errorKey as keyof FormErrors]
		}));
	}

	function handleCustomerSelect(customer: Customer) {
		setFormData((prev) => ({
			...prev,
			customerId: customer.id,
			customerName: customer.name
		}));
		setErrors((prev) => ({ ...prev, customer: undefined }));
	}

	function handleCustomerClear() {
		setFormData((prev) => ({
			...prev,
			customerId: '',
			customerName: ''
		}));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const formErrors = validateForm(formData);
		setErrors(formErrors);
		setTouched({
			invoiceCode: true,
			customerId: true,
			productName: true,
			price: true,
			quantity: true,
			discount: true
		});

		if (Object.keys(formErrors).length > 0) {
			return;
		}

		setSubmitStatus('submitting');
		setSubmitMessage('');

		try {
			const body = toInvoiceRequest(formData);
			const res = await fetch(`${API_BASE}/invoices`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Failed to create invoice');
			}

			const invoice = await res.json();
			setSubmitStatus('success');
			setSubmitMessage(
				`Invoice ${invoice.invoiceCode} created! Total: $${invoice.total.toFixed(2)}`
			);
			setFormData(initialFormData);
			setTouched({});
			setErrors({});
			setRefreshKey((k) => k + 1);
		} catch (err) {
			setSubmitStatus('error');
			setSubmitMessage(err instanceof Error ? err.message : 'An error occurred');
		}
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-start gap-6 bg-gray-50 p-4 py-12">
			<Card className="w-full max-w-lg">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="h-6 w-6 text-purple-700" />
						Create Invoice
					</CardTitle>
				</CardHeader>

				<form onSubmit={handleSubmit} noValidate>
					<CardContent className="space-y-5">
						<CustomerCombobox
							value={formData.customerId}
							customerName={formData.customerName}
							onSelect={handleCustomerSelect}
							onClear={handleCustomerClear}
							onBlur={() => handleBlur('customerId')}
							error={errors.customer}
						/>

						<TextField
							id="invoiceCode"
							label="Invoice Code"
							value={formData.invoiceCode}
							onChange={(v) => updateField('invoiceCode', v)}
							onBlur={() => handleBlur('invoiceCode')}
							error={errors.invoiceCode}
							required
							placeholder="e.g. INV-001"
						/>

						<TextField
							id="productName"
							label="Product Name"
							value={formData.productName}
							onChange={(v) => updateField('productName', v)}
							onBlur={() => handleBlur('productName')}
							error={errors.productName}
							required
							placeholder="e.g. Web Hosting"
						/>

						<div className="grid grid-cols-3 gap-3">
							<NumberField
								id="price"
								label="Price"
								value={formData.price}
								onChange={(v) => updateField('price', v)}
								onBlur={() => handleBlur('price')}
								error={errors.price}
								required
								min={0.01}
								step="0.01"
								placeholder="0.00"
							/>

							<NumberField
								id="quantity"
								label="Quantity"
								value={formData.quantity}
								onChange={(v) => updateField('quantity', v)}
								onBlur={() => handleBlur('quantity')}
								error={errors.quantity}
								required
								min={1}
								step="1"
								placeholder="0"
							/>

							<NumberField
								id="discount"
								label="Discount %"
								value={formData.discount}
								onChange={(v) => updateField('discount', v)}
								onBlur={() => handleBlur('discount')}
								error={errors.discount}
								min={0}
								max={100}
								step="1"
								placeholder="0"
							/>
						</div>

						<div
							className="rounded-lg bg-gray-50 px-4 py-3 text-right"
							aria-live="polite"
							aria-atomic="true"
						>
							<span className="text-sm text-gray-500">Total</span>
							<p className="text-2xl font-bold text-gray-900" data-testid="total">
								${total.toFixed(2)}
							</p>
						</div>

						{submitStatus === 'success' && (
							<div
								role="alert"
								className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
							>
								{submitMessage}
							</div>
						)}

						{submitStatus === 'error' && (
							<div
								role="alert"
								className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
							>
								{submitMessage}
							</div>
						)}
					</CardContent>

					<CardFooter>
						<Button type="submit" disabled={submitStatus === 'submitting'} className="w-full">
							{submitStatus === 'submitting' ? 'Submitting...' : 'Submit'}
						</Button>
					</CardFooter>
				</form>
			</Card>

			<InvoiceList refreshKey={refreshKey} />
		</div>
	);
}

export default App;
