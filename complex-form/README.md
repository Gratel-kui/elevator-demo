# Complex Form Demo

This is a Next.js application that demonstrates a complex form implementation with validation rules and dynamic fields.

## Features

- Company information form with validation
- Dynamic fields based on product type selection
- Conditional validation rules
- Modern UI using shadcn/ui components

## Requirements

- Node.js 18.x or higher
- npm or yarn

## Getting Started

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3001](http://localhost:3001) in your browser to see the application.

## Form Requirements

The form collects the following information:

- Company Name (required)
- Phone Country Code (required, must be a valid international code)
- Phone Number (required, must contain only digits)
- Company Address (required)
- Billing Address (optional, can be same as company address)
- Product Type (required, select from: Passenger, Hydraulic, Humanoid)

For Passenger product type, additional fields are shown:
- Weight (kg): Either predefined (630, 1000, 1250) or custom (200-10000)
- Speed (mm/s): Options depend on selected weight
- Width (mm): Options depend on selected weight and speed

## Technologies Used

- Next.js
- TypeScript
- React Hook Form
- Zod for validation
- shadcn/ui components
- Tailwind CSS
