# Rillet Frontend Coding Interview

Welcome to the Rillet frontend coding interview!

This interview will be conducted as a **pair programming session** with a Rillet engineer, either virtually (on-site via video call) or in person at our office. You'll work together to implement the solution, discussing your approach and decisions along the way.

## Challenge Overview

Your task is to build an **invoice creation form** that allows users to create invoices with customer information, product details, and automatic total calculation.

**Choose ONE framework** to complete this challenge:

- rillet-svelte
- rillet-react

### Design

Follow the design specifications in this Figma file:
**[Invoice Form Design](https://www.figma.com/design/yMcqRtSTk8jlB6prlX6KGW/Front-end-exercise?node-id=3-6549&t=RjJdr79VRPsDiXAA-0)**

### Requirements

Build a form with the following fields:

1. **Customer Search** (Combobox with search)
   - Implement a searchable combobox/autocomplete component
   - Fetch customers from the backend API: `GET /customers?q=<search-query>`
   - Display customer names in the dropdown
   - Allow user to select a customer

2. **Invoice Code** (Text input)
   - Required field

3. **Product Name** (Text input)
   - Required field

4. **Price** (Number input)
   - Required field
   - Must be greater than 0
   - At most two decimal places

5. **Quantity** (Number input)
   - Required field
   - Must be greater than 0
   - No decimals

6. **Discount** (Number input)
   - Optional field
   - Must be between 0 and 100 (representing 0% to 100%)
   - No decimals

7. **Total Display**
   - Display the invoice total using price, quantity and discount
   - Should update automatically as user changes price, quantity, or discount

8. **Submit**
   - Send POST request to `/invoices` with all form data
   - Handle success/error states appropriately

## What We're Assessing

Your solution will be evaluated on:

### 1. Component Architecture

- How you break down the form into smaller, reusable components
- Separation of concerns
- Component composition and props design

### 2. Validation

- Form field validation (required fields, value ranges)
- User-friendly error messages
- Validation timing (on blur, on submit, etc.)

### 3. Testing

- **Unit tests** for business logic (especially calculation functions)
- **Interaction tests** using Testing Library and/or Playwright
- Test user workflows (typing, selecting, submitting)
- Extract computation logic from components and unit test it
- You can use Testing Library for component tests, Playwright for E2E, or both!

### 4. Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Form error announcements

### 5. Semantic HTML

- Use appropriate HTML elements (`<form>`, `<label>`, `<input>`, etc.)
- Proper form structure
- Meaningful element choices

### 6. Styling

- Match the Figma design (it's OK not to use exact colours and font)
- Clean and polished UI
- Use Tailwind CSS utilities effectively or plain CSS

### 7. Problem-Solving Approach

- How you break down the problem into smaller chunks
- Implementation order and priorities
- Code organization and file structure

## Incremental steps

For this challenge, we expect you to implement the form incrementally, testing each step as you go. Choose where you want to start.
There is already a base form and some initial tests, feel free change that in any way you like.

- Implement the customer search combobox
- Implement the invoice total calculation
- Implement the invoice submission

## Structure

- **rillet-svelte**: SvelteKit frontend application (choose this OR rillet-react)
- **rillet-react**: React frontend application (choose this OR rillet-svelte)
- **rillet-backend**: Node.js/Express backend (already implemented)

## Getting Started

### 1. Install Dependencies

```bash
# Install all dependencies for all workspaces
npm install
```

### 2. Start the Backend

The backend is already fully implemented. Start it with:

```bash
npm run dev:backend
```

The backend will run on `http://localhost:3000`

### 3. Start Your Chosen Frontend

**If using SvelteKit:**

```bash
npm run dev:svelte
```

**If using React:**

```bash
npm run dev:react
```

### 4. Start Building!

Implement the invoice form in your chosen frontend framework.

## Available Commands

### Root Commands

Run these from the project root:

```bash
# Development
npm run dev:backend    # Start backend dev server (port 3000)
npm run dev:svelte     # Start SvelteKit dev server (port 5173)
npm run dev:react      # Start React dev server (port 5173)

# Linting & Formatting
npm run lint           # Lint all apps
npm run format         # Format all files with Prettier
```

### Testing

```bash
# Svelte app
npm run test:svelte        # Run Svelte tests (Vitest)

# React app
npm run test:react         # Run React tests (Vitest)

# Backend
npm run test:backend       # Run backend tests

# All tests
npm run test:all
```

## Backend API Reference

The backend is already fully implemented at `http://localhost:3000`

### Endpoints

#### 1. Search Customers

```
GET /customers?q=<search-query>
```

**Example Request:**

```bash
curl "http://localhost:3000/customers?q=amazon"
```

**Example Response:**

```json
[
	{
		"id": "550e8400-e29b-41d4-a716-446655440001",
		"name": "Amazon Web Services"
	}
]
```

#### 2. Create Invoice

```
POST /invoices
Content-Type: application/json
```

**Request Body:**

```json
{
	"invoiceCode": "INV-001",
	"customerId": "550e8400-e29b-41d4-a716-446655440001",
	"productName": "Web Hosting",
	"price": 100,
	"quantity": 5,
	"discount": 0.1
}
```

**Response:**

```json
{
	"id": "generated-uuid",
	"invoiceCode": "INV-001",
	"customerId": "550e8400-e29b-41d4-a716-446655440001",
	"productName": "Web Hosting",
	"price": 100,
	"quantity": 5,
	"discount": 0.1,
	"total": 450,
	"createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Calculation:** `total = (price × quantity) - (price × quantity × discount)`

- Example: `(100 × 5) - (100 × 5 × 0.1) = 500 - 50 = 450`

## Tips for Success

1. **Use TDD**: Write tests first! Start with a failing test, make it pass, then refactor
2. **Extract Logic**: Keep business logic (calculations, validation) separate from components
3. **Test Strategy**:
   - Unit tests for pure functions and business logic
   - Component tests for user interactions
4. **Accessibility**: Consider keyboard navigation and screen readers from the start
5. **Component Breakdown**: Think about reusable components (TextField, NumberField, Combobox, etc.)

Good luck!
