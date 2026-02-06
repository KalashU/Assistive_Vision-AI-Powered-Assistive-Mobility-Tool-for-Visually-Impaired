# Vision Assist - AI-Powered Mobility Tool

An AI-powered assistant mobility tool for visually impaired users, featuring object detection and navigation assistance.

## Features

- **Secure Authentication**: Email/password login and registration powered by Supabase
- **User Dashboard**: Personalized home page with easy navigation
- **Object Detection**: Camera-based AI detection system with audio feedback
- **Accessibility First**: Designed with ARIA labels and screen reader support

## Prerequisites

Before running this project locally, make sure you have:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## Local Setup Instructions

### 1. Download/Clone the Project

Download this project to your local machine or clone it if using git.

### 2. Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

This will install all required packages (React, Supabase, React Router, Tailwind CSS, etc.)

### 3. Environment Variables

The `.env` file is already configured with Supabase credentials:

```
VITE_SUPABASE_URL=https://arcbfjckwzesoreftkpy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyY2JmamNrd3plc29yZWZ0a3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyOTM3ODIsImV4cCI6MjA3Njg2OTc4Mn0.ZTvvOEQTlw6U2Amsgg-HeUXvGo6_P3VafO8w3ZvQ8jI
```

**Note**: These credentials are already set up and ready to use. The database is configured with user authentication.

### 4. Run the Development Server

Start the local development server:

```bash
npm run dev
```

The application will be available at: **http://localhost:5173**

### 5. Build for Production (Optional)

To create a production build:

```bash
npm run build
```

The build files will be in the `dist` folder.

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
project/
├── src/
│   ├── components/         # Reusable components
│   │   └── ProtectedRoute.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── lib/               # Utilities and configs
│   │   └── supabase.ts
│   ├── pages/             # Page components
│   │   ├── LoginPage.tsx
│   │   ├── HomePage.tsx
│   │   └── DetectionPage.tsx
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── .env                   # Environment variables
├── package.json           # Dependencies
└── vite.config.ts         # Vite configuration
```

## Using the Application

### First Time User

1. Open the application in your browser
2. Click "Don't have an account? Sign Up"
3. Enter your full name, email, and password (minimum 6 characters)
4. Click "Sign Up"
5. You'll be automatically logged in and redirected to the home page

### Existing User

1. Enter your email and password
2. Click "Sign In"
3. Access the home page and detection features

### Object Detection

1. From the home page, click "Object Detection"
2. Click "Start Detection" to activate the camera
3. Allow camera permissions when prompted
4. The AI will detect objects in your environment
5. Toggle audio feedback on/off using the speaker icon
6. Click "Stop Detection" or "Camera Off" when done

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Supabase** - Backend and authentication
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Troubleshooting

### Camera Not Working

- Make sure you allow camera permissions when prompted
- Check if another application is using the camera
- Try refreshing the page

### Can't Sign In

- Verify your email and password are correct
- Make sure you've signed up first
- Check your internet connection

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port (5174, 5175, etc.)

## Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run typecheck  # Check TypeScript types
```

## Notes

- The object detection currently uses simulated data for demonstration
- In production, this would connect to a real AI model API
- The camera feature requires HTTPS in production environments
- All user data is securely stored in Supabase with Row Level Security

## Support

For issues or questions, refer to the documentation of the respective technologies:
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/)
