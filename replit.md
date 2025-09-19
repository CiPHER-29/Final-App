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
- **Main Application**: Single-page application (`complete_study_tracker.html`) containing the full Study GPS functionality
- **Landing Page**: Marketing/welcome page (`landing.html`) with hero section and call-to-action
- **Modular Components**: Icon components separated into reusable modules
- **Timer System**: Real-time study session tracking with pause/resume functionality

### Backend Architecture
- **Server**: Express.js server providing static file serving and API endpoints
- **Configuration Management**: Environment variable-based configuration
- **API Endpoints**: RESTful endpoints for user authentication and study data management
- **Static File Serving**: Public directory structure for organized asset delivery

### Data Storage Strategy
- **Local State**: React state for real-time application data (subjects, sessions, timers)
- **File-based Storage**: JSON files for persistent data storage (users.json, study_data.json)
- **Session Management**: In-memory tracking of active study sessions and timers

### Authentication & Authorization
- **Custom Authentication**: Built-in user authentication system with password hashing
- **Session Management**: Token-based user sessions stored locally
- **Password Security**: BCrypt password hashing for secure user authentication

## External Dependencies

### Core Libraries
- **React 18**: Frontend framework via CDN
- **React DOM 18**: DOM rendering library
- **Babel Standalone**: JavaScript transpilation for JSX support
- **Tailwind CSS**: Utility-first CSS framework via CDN

### Backend Services
- **Express.js**: Web server framework for handling HTTP requests and API endpoints
- **BCrypt**: Password hashing library for secure user authentication
- **UUID**: Unique identifier generation for users and data records
- **File System**: JSON-based data storage for user accounts and study data

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
- **Port Configuration**: Server runs on port 5000 (0.0.0.0:5000) for development and production
- **Cross-Origin Support**: Configured for development and production environments
- **Replit Deployment**: Configured for autoscale deployment using npm start

## Recent Changes
- **September 19, 2025**: Successfully imported from GitHub and configured for Replit environment
  - Installed all Node.js dependencies (express, bcryptjs, dotenv, uuid, @supabase/supabase-js)  
  - Fixed environment variable configuration to support both SUPABASE_ and VITE_SUPABASE_ prefixes
  - Verified server startup and both landing page and main app functionality working correctly
  - Configured deployment settings for autoscale production deployment using npm start
  - Server running successfully on http://0.0.0.0:5000 with existing user data intact
  - Hybrid data storage system operational (Supabase + file-based fallback)