# Changes Log

## Pre-Interview Setup — 2026-03-23

### 1. Fix React `handleChange` to update state
- **File:** `rillet-react/src/App.tsx` (line 9)
- **What:** `handleChange` was only calling `console.log(e.target.value)` — never updating `formData` state. Changed to `setFormData({ ...formData, [e.target.name]: e.target.value })`.
- **Why:** The existing test `updates form fields on input` was failing because typing into the invoice code input had no effect.

## Invoice Form Implementation — 2026-03-23

### 2. Business logic module (`src/lib/invoice.ts`)
- **New file:** `rillet-react/src/lib/invoice.ts`
- **What:** Extracted all business logic into a standalone module:
  - `calculateTotal(price, quantity, discountPercent)` — computes invoice total with discount (accepts 0–100%), clamps invalid discount values, rounds to 2 decimal places
  - `validateForm(data)` — validates all form fields: required checks, numeric ranges, integer enforcement for quantity/discount, max 2 decimal places for price
  - `toInvoiceRequest(data)` — converts form state to API request format (trims strings, converts discount from percentage to 0–1 decimal)
  - TypeScript interfaces: `Customer`, `InvoiceFormData`, `InvoiceRequest`, `InvoiceResponse`, `FormErrors`

### 3. Unit tests for business logic (`src/lib/invoice.test.ts`)
- **New file:** `rillet-react/src/lib/invoice.test.ts`
- **What:** 32 unit tests covering:
  - `calculateTotal` — basic multiplication, discount application, 100% discount, zero/negative inputs, decimal prices, rounding, clamping
  - `validateForm` — all required field checks, price > 0, max 2 decimals, integer-only quantity, discount range 0–100, multiple simultaneous errors
  - `toInvoiceRequest` — discount conversion (percentage → decimal), empty discount default, whitespace trimming

### 4. Reusable `TextField` component (`src/components/TextField.tsx`)
- **New file:** `rillet-react/src/components/TextField.tsx`
- **What:** Reusable text input component with:
  - `<label>` + `<input>` with proper `htmlFor`/`id` linking
  - Required field indicator (`*`)
  - Error display with `role="alert"` and `aria-describedby`
  - `aria-invalid` and `aria-required` attributes
  - Red border styling on error state, purple focus ring

### 5. Reusable `NumberField` component (`src/components/NumberField.tsx`)
- **New file:** `rillet-react/src/components/NumberField.tsx`
- **What:** Same accessibility and styling as TextField but with `type="number"` and support for `min`, `max`, `step` attributes.

### 6. `CustomerCombobox` component (`src/components/CustomerCombobox.tsx`)
- **New file:** `rillet-react/src/components/CustomerCombobox.tsx`
- **What:** Searchable customer dropdown with:
  - Debounced API search (300ms) against `GET /customers?q=...`
  - `AbortController` to cancel stale requests
  - Full keyboard navigation: Arrow Up/Down, Enter to select, Escape to close
  - ARIA combobox pattern: `role="combobox"`, `aria-expanded`, `aria-activedescendant`, `aria-haspopup="listbox"`, `role="listbox"`, `role="option"`, `aria-selected`
  - Click-outside-to-close behavior
  - Loading indicator
  - Purple highlight on active option

### 7. Main `App` component rewrite (`src/App.tsx`)
- **File:** `rillet-react/src/App.tsx`
- **What:** Complete rewrite from skeleton to full invoice form:
  - Composes `CustomerCombobox`, `TextField`, `NumberField` components
  - Live total calculation that updates as user types (price × quantity − discount)
  - On-blur validation for individual fields + full validation on submit
  - `touched` state tracking so errors only show after user interacts
  - Form submission via `POST /invoices` with success/error feedback
  - Form resets after successful submission
  - Disabled submit button during submission
  - `noValidate` on `<form>` to use custom validation instead of browser defaults
  - `aria-live="polite"` on total display for screen reader updates
  - 3-column grid layout for price/quantity/discount

### 8. Updated interaction tests (`src/App.test.tsx`)
- **File:** `rillet-react/src/App.test.tsx`
- **What:** Rewrote browser tests to cover the full form:
  - Renders all fields (labels, combobox, submit button, total display)
  - Invoice code input updates correctly
  - Total calculates dynamically from price × quantity
  - Total applies discount correctly
  - All 5 validation errors appear on empty submit
  - Validation error shows for specific empty field
  - Error clears when field is corrected after submit

## shadcn/ui Component Library — 2026-03-23

### 9. shadcn/ui setup and dependencies
- **Files:** `package.json`, `tsconfig.app.json`, `vite.config.ts`, `src/lib/utils.ts`
- **What:** Added `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`. Configured `@/` path alias for clean imports. Added `cn()` utility for merging Tailwind classes.

### 10. UI primitives (`src/components/ui/`)
- **New files:** `button.tsx`, `input.tsx`, `label.tsx`, `card.tsx`
- **What:** shadcn-style base components with consistent styling:
  - `Button` — variant support (default purple, destructive, outline, ghost) and size variants
  - `Input` — styled text input with focus ring, ref forwarding
  - `Label` — styled form label
  - `Card` / `CardHeader` / `CardTitle` / `CardContent` / `CardFooter` — card layout with rounded borders and shadow

### 11. Refactored all form components to use shadcn primitives
- **Files:** `TextField.tsx`, `NumberField.tsx`, `CustomerCombobox.tsx`, `App.tsx`
- **What:** Replaced raw HTML inputs/buttons with shadcn `Input`, `Label`, `Button`, `Card`. Added `FileText` icon in header, `Search` icon in customer combobox. Improved visual hierarchy with card layout, consistent spacing, and polished borders/shadows.
