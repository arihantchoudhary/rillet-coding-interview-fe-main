import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NumberFieldProps {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
	error?: string;
	required?: boolean;
	placeholder?: string;
	min?: number;
	max?: number;
	step?: string;
}

export function NumberField({
	id,
	label,
	value,
	onChange,
	onBlur,
	error,
	required,
	placeholder,
	min,
	max,
	step,
}: NumberFieldProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor={id}>
				{label}
				{required && <span className="text-red-500" aria-hidden="true"> *</span>}
			</Label>
			<Input
				type="number"
				id={id}
				name={id}
				data-testid={id}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onBlur={onBlur}
				placeholder={placeholder}
				required={required}
				aria-required={required}
				aria-invalid={!!error}
				aria-describedby={error ? `${id}-error` : undefined}
				min={min}
				max={max}
				step={step}
				className={error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
			/>
			{error && (
				<p id={`${id}-error`} role="alert" className="text-sm text-red-600">
					{error}
				</p>
			)}
		</div>
	);
}
