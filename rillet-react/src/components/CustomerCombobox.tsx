import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Customer } from '@/lib/invoice';
import { API_BASE } from '@/lib/config';

interface CustomerComboboxProps {
	value: string;
	customerName: string;
	onSelect: (customer: Customer) => void;
	onClear: () => void;
	onBlur?: () => void;
	error?: string;
}

export function CustomerCombobox({
	value,
	customerName,
	onSelect,
	onClear,
	onBlur,
	error
}: CustomerComboboxProps) {
	const [query, setQuery] = useState(customerName);
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [isLoading, setIsLoading] = useState(false);
	const listRef = useRef<HTMLUListElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setQuery(customerName);
	}, [customerName]);

	useEffect(() => {
		if (!query || (query === customerName && value)) {
			setCustomers([]);
			return;
		}

		const controller = new AbortController();
		const timeoutId = setTimeout(async () => {
			setIsLoading(true);
			try {
				const res = await fetch(`${API_BASE}/customers?q=${encodeURIComponent(query)}`, {
					signal: controller.signal
				});
				if (res.ok) {
					const data: Customer[] = await res.json();
					setCustomers(data);
					setIsOpen(data.length > 0);
					setActiveIndex(-1);
				}
			} catch (err) {
				if (!(err instanceof DOMException && err.name === 'AbortError')) {
					console.error('Failed to fetch customers:', err);
				}
			} finally {
				setIsLoading(false);
			}
		}, 300);

		return () => {
			clearTimeout(timeoutId);
			controller.abort();
		};
	}, [query, customerName, value]);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	function selectCustomer(customer: Customer) {
		onSelect(customer);
		setQuery(customer.name);
		setIsOpen(false);
		setActiveIndex(-1);
	}

	function handleInputChange(newQuery: string) {
		setQuery(newQuery);
		if (value) {
			onClear();
		}
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (!isOpen) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setActiveIndex((prev) => Math.min(prev + 1, customers.length - 1));
				break;
			case 'ArrowUp':
				e.preventDefault();
				setActiveIndex((prev) => Math.max(prev - 1, 0));
				break;
			case 'Enter':
				e.preventDefault();
				if (activeIndex >= 0 && customers[activeIndex]) {
					selectCustomer(customers[activeIndex]);
				}
				break;
			case 'Escape':
				setIsOpen(false);
				setActiveIndex(-1);
				break;
		}
	}

	const activeDescendant = activeIndex >= 0 ? `customer-option-${activeIndex}` : undefined;

	return (
		<div ref={containerRef} className="space-y-2">
			<Label htmlFor="customer">
				Customer{' '}
				<span className="text-red-500" aria-hidden="true">
					*
				</span>
			</Label>
			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
				<Input
					ref={inputRef}
					type="text"
					id="customer"
					data-testid="customer"
					role="combobox"
					aria-expanded={isOpen}
					aria-haspopup="listbox"
					aria-controls="customer-listbox"
					aria-activedescendant={activeDescendant}
					aria-autocomplete="list"
					aria-required
					aria-invalid={!!error}
					aria-describedby={error ? 'customer-error' : undefined}
					value={query}
					onChange={(e) => handleInputChange(e.target.value)}
					onFocus={() => {
						if (customers.length > 0 && !value) setIsOpen(true);
					}}
					onBlur={onBlur}
					onKeyDown={handleKeyDown}
					placeholder="Search customers..."
					className={`pl-9 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
				/>
				{isLoading && (
					<div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
						Loading...
					</div>
				)}
				{isOpen && customers.length > 0 && (
					<ul
						ref={listRef}
						id="customer-listbox"
						role="listbox"
						aria-label="Customer suggestions"
						className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
					>
						{customers.map((customer, index) => (
							<li
								key={customer.id}
								id={`customer-option-${index}`}
								role="option"
								aria-selected={index === activeIndex}
								onClick={() => selectCustomer(customer)}
								onMouseEnter={() => setActiveIndex(index)}
								className={`cursor-pointer px-3 py-2 text-sm transition-colors ${
									index === activeIndex
										? 'bg-purple-600 text-white'
										: 'text-gray-900 hover:bg-purple-50'
								}`}
							>
								{customer.name}
							</li>
						))}
					</ul>
				)}
			</div>
			{error && (
				<p id="customer-error" role="alert" className="text-sm text-red-600">
					{error}
				</p>
			)}
		</div>
	);
}
