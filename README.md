# ZODIACO E-commerce Store

A modern, fully functional e-commerce application built with React (Next.js) and Python (Flask).

## Features

- 🛍️ **Product Catalog**: Browse products with filtering and search
- 🛒 **Shopping Cart**: Add, remove, and manage cart items
- 👤 **User Authentication**: Register, login, and user management
- 💳 **Checkout Process**: Complete order flow with payment integration
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🔐 **JWT Authentication**: Secure API communication
- 🎨 **Modern UI**: Beautiful design with Radix UI components

## Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL/SQLite** - Database
- **Redis** - Caching and sessions
- **JWT** - Authentication
- **Flask-RESTX** - API documentation

## Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- npm or pnpm

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd Front_EcommerceStore-main
   npm install --force
   ```

2. **Create environment file**:
   Create `.env.local` in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   NODE_ENV=development
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000`

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd Back_EcommerceStore-main/Back_EcommerceStore-main
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables** (optional):
   ```bash
   export FLASK_ENV=development
   export SECRET_KEY=your-secret-key
   ```

5. **Initialize database**:
   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```

6. **Start backend server**:
   ```bash
   python app.py
   ```

7. **Access API documentation**:
   Navigate to `http://localhost:5000/api/v1/docs/`

## Project Structure

```
Front_EcommerceStore-main/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── carrito/           # Cart pages
│   ├── categoria/         # Category pages
│   ├── checkout/          # Checkout pages
│   ├── cuenta/            # Account pages
│   └── producto/          # Product pages
├── components/            # Reusable components
│   ├── ui/               # UI components (Radix UI)
│   └── ...               # Custom components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and API client
└── types/                # TypeScript type definitions

Back_EcommerceStore-main/
├── app/
│   ├── api/              # API endpoints
│   ├── models/           # Database models
│   ├── services/         # Business logic
│   └── repositories/     # Data access layer
├── config.py             # Configuration
└── app.py               # Application entry point
```

## API Integration

The frontend is fully connected to the backend through a comprehensive API service layer:

### Key Features
- **Authentication**: JWT-based login/register
- **Products**: Fetch, filter, and search products
- **Cart**: Add, remove, and sync cart items
- **Orders**: Create and manage orders
- **User Management**: Profile updates and address management

### API Endpoints
- `GET /api/v1/products` - List products with filtering
- `GET /api/v1/products/{id}` - Get product details
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart/items` - Add item to cart
- `POST /api/v1/orders` - Create order

## Development

### Frontend Development
- **Hot reload**: Changes reflect immediately
- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Tailwind**: Utility-first CSS

### Backend Development
- **Flask debug mode**: Automatic reloading
- **SQLAlchemy**: Database migrations
- **Swagger docs**: API documentation at `/docs`
- **CORS**: Configured for frontend communication

## Deployment

### Frontend (Vercel/Netlify)
1. Connect repository to Vercel/Netlify
2. Set environment variables
3. Deploy automatically on push

### Backend (Heroku/Railway)
1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy using Git integration

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NODE_ENV=development
```

### Backend
```env
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@localhost/db
REDIS_URL=redis://localhost:6379/0
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team. 