# AI Personality Coach

A Next.js application for discovering your MBTI personality type, journaling, and personal growth tracking with Auth0 authentication and MongoDB database.
Demo Link: https://youtu.be/46ZT3023p9E?si=Y96xMkRTS3z0PLIB

## Features

- **Landing Page**: Welcome page with navigation to all features
- **MBTI Quiz**: Personality type assessment
- **Dashboard**: User dashboard with profile information
- **Daily Journal**: Personal reflection and growth tracking
- **Authentication**: Secure login/logout with Auth0
- **Database**: MongoDB Atlas with Mongoose ODM
- **Habit Tracking**: Personal development habit management

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Auth0
- **Database**: MongoDB Atlas
- **ODM**: Mongoose

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Auth0 account
- MongoDB Atlas account

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd ai-personality-coach
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Auth0**:
   - Create an Auth0 account at [auth0.com](https://auth0.com)
   - Create a new application (Regular Web Application)
   - Configure the following settings:
     - Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
     - Allowed Logout URLs: `http://localhost:3000`
     - Allowed Web Origins: `http://localhost:3000`

4. **Set up MongoDB Atlas**:
   - Create a MongoDB Atlas account at [mongodb.com](https://mongodb.com)
   - Create a new cluster (free tier available)
   - Create a database user with read/write permissions
   - Get your connection string from the cluster
     
5. **Set Up Gemini API (Google AI Studio)**:
   - Go to https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Generate an API key for Gemini 
   - Copy the key — you’ll add it to your .env.local file

6. **Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # Auth0 Configuration
   AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
   AUTH0_BASE_URL='http://localhost:3000'
   AUTH0_ISSUER_BASE_URL='https://YOUR_DOMAIN'
   AUTH0_CLIENT_ID='your_client_id'
   AUTH0_CLIENT_SECRET='your_client_secret'

   # MongoDB Configuration
   MONGODB_URI='mongodb+srv://username:password@cluster.mongodb.net/ai-personality-coach?retryWrites=true&w=majority'

   # Gemini AP Configuration
   GEMINI_API_KEY='your_google_gemini_api_key'
   ```

   Replace the values with your Auth0, MongoDB, and Gemini credentials.

7. **Generate AUTH0_SECRET**:
   ```bash
   openssl rand -hex 32
   ```

8. **Run the development server**:
   ```bash
   npm run dev
   ```

9. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Database Models

### User
- Auth0 integration with `auth0Id`
- Personal information (name, email, picture)
- MBTI type and preferences
- Theme and notification settings

### JournalEntry
- Daily journal entries with mood tracking
- Tags and privacy settings
- Rich content with 10,000 character limit
- Mood rating on 1-10 scale

### MBTIProfile
- Complete MBTI assessment results
- Individual dimension scores (E/I, S/N, T/F, J/P)
- Confidence level and insights
- Career and relationship advice

### Habit
- Personal development habit tracking
- Categories: health, productivity, learning, social, mindfulness
- Streak tracking and goal setting
- Reminder system with customizable schedules

## Authentication Flow

1. **Login**: Users click "Login" to authenticate with Auth0
2. **Callback**: Auth0 redirects back to your app with an authorization code
3. **User Creation**: New users are automatically created in MongoDB
4. **Dashboard**: Users can access the dashboard after authentication
5. **Logout**: Users can logout and return to the landing page

## Development

- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first styling with custom gradients and components
- **Server Components**: Leveraging Next.js 14 App Router for optimal performance
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Database**: MongoDB with Mongoose for data modeling and validation


## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is for educational and personal use.
