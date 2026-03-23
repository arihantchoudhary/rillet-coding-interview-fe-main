import { useState } from 'react';

function App() {
	const [formData, setFormData] = useState({
		invoiceCode: ''
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<div className="flex min-h-screen items-center justify-center">
			<form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 p-6">
				<h1 className="text-4xl font-bold">Welcome to Rillet!</h1>

				<div>
					<label htmlFor="invoiceCode" className="block text-sm font-medium">
						Invoice Code
					</label>
					<input
						type="text"
						id="invoiceCode"
						name="invoiceCode"
						data-testid="invoiceCode"
						value={formData.invoiceCode}
						onChange={handleChange}
						className="mt-1 w-full rounded border p-2"
					/>
				</div>

				<button
					type="submit"
					className="w-full rounded bg-purple-700 p-2 text-white hover:bg-purple-600"
				>
					Submit
				</button>
			</form>
		</div>
	);
}

export default App;
