# Zeepay Transaction Tracking Dashboard

A comprehensive web-based transaction tracking dashboard for Zeepay Ghana Ltd. Built with React, TypeScript, Vite, and Supabase.

## Features

- **Professional Homepage**: Modern design mimicking the real Zeepay website
- **Authentication**: Secure login, signup, and password reset via Supabase Auth
- **Dashboard**: Transaction summaries, filtering, and real-time updates
- **Transaction Details**: Detailed view with logs and admin notes
- **User Management**: Admin panel for managing users and roles
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-friendly interface
- **Settings**: Profile management and preferences

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database, Authentication, API)
- **Routing**: React Router DOM
- **Charts**: Recharts (for future enhancements)
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm
- Supabase account with project setup

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Zeepay
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   - **Important**: Never commit the `.env` file to version control. It's already in `.gitignore`.

## Database Schema

## Running the Project

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.tsx      # Main layout with sidebar
│   └── ProtectedRoute.tsx  # Route protection
├── contexts/           # React contexts
│   ├── AuthContext.tsx    # Authentication state
│   └── ThemeContext.tsx   # Dark mode state
├── lib/               # Utilities
│   └── supabase.ts    # Supabase client configuration
├── pages/             # Page components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── DashboardPage.tsx
│   ├── TransactionDetailsPage.tsx
│   ├── UsersPage.tsx
│   └── SettingsPage.tsx
├── App.tsx            # Main app component with routing
└── main.tsx          # Entry point
```

## Features in Detail

### Authentication
- Email/password login
- User registration
- Password reset via email
- Session management
- Role-based access (admin/user)

### Dashboard
- Summary cards showing total transactions, completed, pending, and failed
- Transaction table with filtering by:
  - Search (reference ID, sender, receiver)
  - Status (completed, pending, failed)
  - Date
- Real-time updates (uses mock data if Supabase is unavailable)

### Transaction Details
- Complete transaction information
- Sender and receiver details
- Transaction logs
- Admin-only internal notes section

### User Management (Admin Only)
- View all users
- Edit user roles (admin/user)
- Activate/deactivate users

### Settings
- Update profile information
- Toggle dark mode
- View account information

## Mock Data

The application includes mock data that will be used if:
- Supabase tables don't exist yet
- There's an error connecting to Supabase
- Tables are empty

This allows the application to work immediately while you set up the database.

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will automatically detect Vite and configure the build
4. Add environment variables if needed (Supabase keys are already in code)

### Netlify

1. Push your code to GitHub
2. Import the project in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

## Environment Variables

Supabase credentials are now stored in environment variables for security. The application reads from `.env` file:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key

**Security Note**: 
- The `.env` file is automatically ignored by git (see `.gitignore`)
- Never commit your `.env` file to version control
- Use `.env.example` as a template for other developers
- For production deployments, set these as environment variables in your hosting platform (Vercel, Netlify, etc.)

## Future Enhancements

- Export transactions to CSV
- Advanced search by reference ID
- Transaction trend charts
- Alerts for failed/pending transactions
- Real-time notifications
- Transaction analytics

## License

Copyright © 2025 Zeepay Ghana Ltd. All rights reserved.
