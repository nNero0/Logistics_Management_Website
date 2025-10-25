# Logistics Management Website

A comprehensive logistics management system with vehicle tracking, shipment management, and user authentication.

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **ORM**: Sequelize
- **Database**: MySQL
- **Map API**: Leaflet

## Setup Instructions

### 1. Environment Variables

#### Backend (.env in server/ directory):

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=logistics
DB_USER=root
DB_PASSWORD=1234

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env in client/LogisticsManagementWebsite/ directory):

```env
# API Configuration
VITE_APP_API=http://localhost:3001/api
```

### 2. Database Setup

1. Create MySQL database named 'logistics'
2. Run the SQL scripts in `rawSQL/FINALCREATE.sql` to create tables
3. Optionally run test data scripts

### 3. Installation & Running

```bash
# Backend
cd server
npm install
npm start

# Frontend
cd client/LogisticsManagementWebsite
npm install
npm run dev
```

## Features

- Vehicle Management (PhuongTien)
- User Authentication
- Shipment Tracking
- Container Management
- Route Planning
