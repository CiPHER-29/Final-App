# Study GPS

## Overview

Study GPS is a React-based web application designed to help students monitor and optimize their learning progress. The application enables users to track study sessions, manage subjects, and maintain a timer-based approach to learning with the goal of continuous improvement ("1% better than yesterday"). Built as a science project, it features a modern dark theme interface with comprehensive session tracking and analytics capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Pure React 18 with Babel transpilation
- **UI Library**: Tailwind CSS for styling with custom CSS variables for theming
- **State Management**: React hooks (useState, useEffect) for local component state
- **Routing**: Simple HTML-based navigation between landing and main application pages
- **Icons**: Custom SVG icon components for consistent visual design

### Component Structure
- **Main Application**: Single-page application (`complete_study_tracker.html`) containing the full study tracker functionality
- **Landing Page**: Marketing/welcome page (`landing.html`) with hero section and call-to-action
- **Modular Components**: Icon components separated into reusable modules
- **Timer System**: Real-time study session tracking with pause/resume functionality

### Backend Architecture
- **Server**: Express.js server providing static file serving and API endpoints
- **Configuration Management**: Environment variable-based configuration for external services
- **API Endpoints**: RESTful endpoints for Supabase configuration delivery
- **Static File Serving**: Public directory structure for organized asset delivery

### Data Storage Strategy
- **Local State**: React state for real-time application data (subjects, sessions, timers)
- **External Database**: Supabase integration prepared for persistent data storage
- **Session Management**: In-memory tracking of active study sessions and timers

### Authentication & Authorization
- **Supabase Auth**: Integration prepared for user authentication and session management
- **Environment Security**: API keys and sensitive configuration stored in environment variables
- **Public Access**: Current implementation allows public access to core functionality

## External Dependencies

### Core Libraries
- **React 18**: Frontend framework via CDN
- **React DOM 18**: DOM rendering library
- **Babel Standalone**: JavaScript transpilation for JSX support
- **Tailwind CSS**: Utility-first CSS framework via CDN

### Backend Services
- **Supabase**: Backend-as-a-Service for database, authentication, and real-time features
  - Database URL: Configurable via environment variables
  - Anonymous key authentication for public access
  - Real-time subscriptions capability

### Development Dependencies
- **Express.js**: Web server framework
- **dotenv**: Environment variable management
- **Node.js**: Runtime environment for server execution

### CDN Resources
- **Google Fonts**: Space Mono font family for consistent typography
- **React/ReactDOM**: Frontend libraries served via cdnjs
- **Babel**: JavaScript compiler served via cdnjs
- **Tailwind CSS**: Styling framework served via CDN

### Hosting & Deployment
- **Static File Serving**: Express.js serves public directory contents
- **Port Configuration**: Flexible port assignment via environment variables
- **Cross-Origin Support**: Configured for development and production environments