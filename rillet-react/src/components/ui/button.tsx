import { type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-purple-700 text-white hover:bg-purple-600 shadow-sm',
				destructive: 'bg-red-600 text-white hover:bg-red-500 shadow-sm',
				outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
				ghost: 'hover:bg-gray-100 text-gray-700',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 px-3 text-xs',
				lg: 'h-11 px-8 text-base',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

function Button({ className, variant, size, ...props }: ButtonProps) {
	return (
		<button
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
