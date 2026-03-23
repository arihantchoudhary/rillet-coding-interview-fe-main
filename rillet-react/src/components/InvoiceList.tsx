import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Search, Receipt } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { InvoiceResponse } from '@/lib/invoice';

const API_BASE = 'http://localhost:3000';

interface InvoiceListProps {
	refreshKey: number;
}

export function InvoiceList({ refreshKey }: InvoiceListProps) {
	const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
	const [search, setSearch] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const fetchInvoices = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await fetch(`${API_BASE}/invoices`);
			if (res.ok) {
				const data = await res.json();
				setInvoices(data);
			}
		} catch (err) {
			console.error('Failed to fetch invoices:', err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchInvoices();
	}, [fetchInvoices, refreshKey]);

	const filtered = invoices.filter((inv) => {
		if (!search) return true;
		const q = search.toLowerCase();
		return (
			inv.invoiceCode.toLowerCase().includes(q) ||
			inv.productName.toLowerCase().includes(q) ||
			inv.customerId.toLowerCase().includes(q)
		);
	});

	return (
		<Card className="w-full max-w-lg">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Receipt className="h-6 w-6 text-purple-700" />
						Invoices
					</CardTitle>
					<Button variant="ghost" size="sm" onClick={fetchInvoices} disabled={isLoading}>
						<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<Input
						type="text"
						placeholder="Search invoices..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9"
						data-testid="invoice-search"
					/>
				</div>

				{invoices.length === 0 && !isLoading && (
					<p className="py-8 text-center text-sm text-gray-400">
						No invoices yet. Create one above!
					</p>
				)}

				{filtered.length === 0 && invoices.length > 0 && (
					<p className="py-4 text-center text-sm text-gray-400">No invoices match "{search}"</p>
				)}

				<div className="space-y-2">
					{filtered.map((inv) => (
						<div
							key={inv.id}
							className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 transition-colors hover:border-purple-200 hover:bg-purple-50/30"
						>
							<div className="flex items-center justify-between">
								<span className="font-medium text-gray-900">{inv.invoiceCode}</span>
								<span className="text-lg font-bold text-gray-900">${inv.total.toFixed(2)}</span>
							</div>
							<div className="mt-1 flex items-center justify-between text-sm text-gray-500">
								<span>{inv.productName}</span>
								<span>
									{inv.quantity} x ${inv.price.toFixed(2)}
									{inv.discount > 0 && (
										<span className="ml-1 text-purple-600">
											(-{(inv.discount * 100).toFixed(0)}%)
										</span>
									)}
								</span>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
