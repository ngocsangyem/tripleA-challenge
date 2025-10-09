# TripleA challenge

> Live demo: https://triple-a-challenge.vercel.app/

## Features

- **Account Management**: Create accounts with initial balances
- **Fund Transfers**: Transfer money between accounts with validation
- **Form Validation**: Comprehensive input validation with vee-validate
- **Modern UI**: Beautiful interface with shadcn-vue components

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20.19.0 or >=22.12.0
- **pnpm**: v10.12.1 or higher
- **Docker**: For running the API server

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/tripleA-challenge.git
cd tripleA-challenge
```

### 2. Install Dependencies

```bash
pnpm install
```

> If you do not have pnpm cli. Please install it by following the command

```bash
npm install -g pnpm

# Macos
sudo npm install -g pnpm
```

### 3. Start Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```bash
tripleA-challenge/
│
├── src/                          # Source code
│   ├── __tests__/               # Unit tests
│   │   └── App.spec.ts             # App component tests
│   │
│   ├── components/              # UI components
│   │   └── ui/                  # shadcn-vue components
│   │       ├── alert/              # Alert components
│   │       ├── button/             # Button component
│   │       ├── card/               # Card components
│   │       ├── dialog/             # Dialog components
│   │       ├── form/               # Form components
│   │       ├── input/              # Input component
│   │       ├── label/              # Label component
│   │       └── sonner/             # Toast notifications
│   │
│   ├── features/                # Feature modules
│   │   ├──accounts/           # Account management
│   │   │   └──components/
│   │   │       ├── CreateAccountForm.vue
│   │   │       ├── AccountBalanceViewer.vue
│   │   │       └── index.ts
│   │   │
│   │   └──transactions/       # Transaction management
│   │       └── components/
│   │           ├── TransferForm.vue
│   │           └── index.ts
│   │
│   ├──shared/                  # Shared resources
│   │   ├── api/                # API layer
│   │   │   ├── client.ts          # Axios client
│   │   │   ├── accounts.api.ts    # Account endpoints
│   │   │   ├── transactions.api.ts # Transfer endpoints
│   │   │   └── index.ts
│   │   │
│   │   ├── types/              # TypeScript types
│   │   │   ├── account.ts         # Account types
│   │   │   ├── transaction.ts     # Transaction types
│   │   │   ├── api.ts             # API types
│   │   │   └── index.ts
│   │   │
│   │   ├── ui/                 # Shared UI components
│   │   │   ├── ErrorAlert.vue
│   │   │   ├── LoadingSpinner.vue
│   │   │   ├── SuccessToast.vue
│   │   │   └── index.ts
│   │   │
│   │   └── utils/              # Utility functions
│   │       ├── __tests__/
│   │       │   ├── money.spec.ts
│   │       │   └── validation.spec.ts
│   │       ├── money.ts           # Money formatting/validation
│   │       ├── validation.ts      # Form validation rules
│   │       └── index.ts
│   │
│   ├── stores/                  # Pinia stores
│   │   ├── accounts.ts            # Account state management
│   │   ├── transactions.ts        # Transaction state management
│   │   ├── ui.ts                  # UI state management
│   │   └── index.ts
│   │
│   ├── router/                  # Vue Router
│   │   └── index.ts
│   │
│   ├── lib/                     # Library utilities
│   │   └── utils.ts               # Tailwind utilities
│   │
│   ├── App.vue                     # Root component
│   ├── main.ts                     # Application entry point
│   └── index.css                   # Global styles
│
├── cypress/                     # E2E tests
│   ├── e2e/
│   │   └── app-workflows.cy.ts    # E2E test scenarios
│   ├── support/
│   │   ├── commands.ts            # Custom Cypress commands
│   │   └── e2e.ts
│   └── fixtures/               # Test fixtures

---

## 🛠️ Available Scripts

### Development

```bash
# Start development server with hot reload
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Testing

```bash
# Run unit tests
pnpm test:unit

# Run E2E tests (headless)
pnpm test:e2e

# Open Cypress E2E UI
pnpm test:e2e:dev
```

### Code Quality

```bash
# Run linter (auto-fix enabled)
pnpm lint

# Run linter separately
pnpm lint:eslint
pnpm lint:oxlint

# Format code with Prettier
pnpm format

# Type check
pnpm type-check
```

---

## Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
# API Base URL (default: /api)
VITE_API_BASE_URL=http://localhost:8860/api
```

### Vite Proxy (Development)

The application uses Vite proxy to avoid CORS issues during development:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8860',
      changeOrigin: true,
    },
  },
}
```

---

## Testing

### Unit Tests (Vitest)

```bash
pnpm test:unit
```

### E2E Tests (Cypress)

```bash
# Headless mode
pnpm test:e2e

# Interactive mode
pnpm test:e2e:dev
```

---

## Tech Stack

### Core
- **Vue 3.5**: Progressive JavaScript framework
- **TypeScript 5.9**: Type-safe JavaScript
- **Vite 7**: Next-generation frontend tooling
- **Pinia 3**: State management library

### UI & Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn-vue**: High-quality UI components
- **Reka UI**: Headless UI components
- **Lucide Vue**: Icon library
- **vue-sonner**: Toast notifications

### Forms & Validation
- **vee-validate**: Form validation
- **@vee-validate/rules**: Validation rules

### Utilities
- **VueUse**: Collection of Vue composition utilities
- **Axios**: HTTP client
