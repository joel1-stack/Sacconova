# SaccoNova Frontend

A modern SACCO (Savings and Credit Cooperative Organization) management system built with Angular 20.

## Features

- **Dashboard**: Overview of member accounts, loans, and transactions
- **Account Management**: Savings and shares account tracking
- **Loan Management**: Loan applications, approvals, and repayments
- **Transaction History**: Complete transaction tracking and reporting
- **User Authentication**: Secure login and session management
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- Angular 20 with standalone components
- TypeScript
- SCSS for styling
- RxJS for reactive programming
- Docker for containerization

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Angular CLI 20.3.3

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sacco-nova-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200/`

### Default Login Credentials

For development/testing purposes:
- Email: admin@sacconova.com
- Password: admin123

## Project Structure

```
src/
├── app/
│   ├── core/                 # Core services, models, guards
│   ├── shared/               # Shared components, pipes, directives
│   ├── modules/              # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── dashboard/       # Dashboard
│   │   ├── accounts/        # Account management
│   │   ├── loans/           # Loan management
│   │   └── transactions/    # Transaction management
│   └── styles/              # Global styles
├── assets/                  # Static assets
└── environments/            # Environment configurations
```

## Building for Production

```bash
ng build --configuration production
```

## Docker Deployment

1. Build the Docker image:
```bash
docker build -t sacco-nova-frontend .
```

2. Run with Docker Compose:
```bash
docker-compose up -d
```

## Development Guidelines

- Use standalone components for new features
- Follow Angular style guide
- Write unit tests for components and services
- Use TypeScript strict mode
- Follow semantic versioning

## API Integration

The frontend expects a REST API backend with the following endpoints:
- `/api/auth/*` - Authentication
- `/api/accounts/*` - Account management
- `/api/loans/*` - Loan management
- `/api/transactions/*` - Transaction management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
