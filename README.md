# ExpenseTracker - Personal Finance Management App

A full-stack web application to track your income, expenses, budgets, and generate financial reports.


## Features

- **User Authentication** - Secure login and registration
- **Dashboard** - Overview of income, expenses, and savings
- **Transaction Management** - Add, edit, delete income/expense transactions
- **Categories** - Organize transactions by custom categories
- **Budgets** - Set monthly budgets and track spending
- **Reports** - Generate financial reports with charts
- **Export Data** - Export transactions to CSV, JSON, or PDF
- **Multi-Currency Support** - Support for USD, EUR, GBP, INR, CAD, and more
- **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling
- **React Icons** - Icons
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **PDFKit** - PDF generation

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Check version: `node --version`

2. **MongoDB** (v4.4 or higher)
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
   - Check if running: `mongod --version`

3. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/

## Installation

### Step 1: Clone or Download the Project

```bash
# If using Git
git clone <repository-url>
cd expense-tracker

# Or download and extract the ZIP file
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 4: Configure Environment Variables

#### Backend Configuration

Create a `.env` file in the `backend` folder:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/expense-tracker

# JWT Secret (change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# JWT Expiration
JWT_EXPIRE=30d
```

#### Frontend Configuration

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Option 1: Run Backend and Frontend Separately

#### Terminal 1 - Start MongoDB (if using local MongoDB)
```bash
mongod
```

#### Terminal 2 - Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

#### Terminal 3 - Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:5173

### Option 2: Run Both Concurrently (from root folder)

```bash
# Install concurrently globally (one time only)
npm install -g concurrently

# Run both servers
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Expenses/Transactions
- `GET /api/expenses` - Get all transactions
- `POST /api/expenses` - Create transaction
- `GET /api/expenses/:id` - Get single transaction
- `PUT /api/expenses/:id` - Update transaction
- `DELETE /api/expenses/:id` - Delete transaction
- `GET /api/expenses/stats` - Get statistics

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `GET /api/budgets/current` - Get current month budgets
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Export
- `GET /api/export/expenses/csv` - Export to CSV
- `GET /api/export/expenses/json` - Export to JSON
- `GET /api/export/expenses/pdf` - Export to PDF
- `GET /api/export/backup` - Full backup

## Usage Guide

### 1. First Time Setup

1. **Start the application** (both backend and frontend)
2. **Open your browser** and go to http://localhost:5173
3. **Click "Register"** to create a new account
4. **Fill in your details**:
   - Name
   - Email
   - Password
   - Preferred Currency

### 2. Adding Your First Transaction

1. **Go to "Transactions"** page
2. **Click "Add Transaction"** button
3. **Fill in the form**:
   - Description (e.g., "Grocery Shopping")
   - Amount (e.g., 5000)
   - Type (Income or Expense)
   - Category (select from dropdown)
   - Date
   - Tags (optional)
4. **Click "Save"**

### 3. Creating Categories

1. **Go to "Categories"** page
2. **Click "Create Category"**
3. **Enter details**:
   - Name (e.g., "Food & Dining")
   - Type (Income or Expense)
   - Color (pick a color)
4. **Click "Save"**

### 4. Setting Up Budgets

1. **Go to "Budgets"** page
2. **Click "Create Budget"**
3. **Set budget details**:
   - Category
   - Amount
   - Month & Year
4. **Click "Save"**
5. **Track your spending** against the budget

### 5. Viewing Reports

1. **Go to "Reports"** page
2. **View statistics**:
   - Total Income
   - Total Expenses
   - Net Savings
   - Category Breakdown
   - Monthly Trends
3. **Export data** using CSV, JSON, or PDF buttons

### 6. Updating Your Profile

1. **Go to "Profile"** page
2. **Update your information**:
   - Name
   - Email
   - Currency preference
3. **Click "Save Changes"**

## Screenshots

| Feature | Screenshot |
|---------|-----------|
| **Landing Page** | ![Landing Page](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/base.png) |
| **Register** | ![Register](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/register.png) |
| **Login** | ![Login](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/login.png) |
| **Dashboard** | ![Dashboard](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/dashboard.png) |
| **Expenses/Transactions** | ![Expenses](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/expenses.png) |
| **Categories** | ![Categories](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/categories.png) |
| **Budgets** | ![Budgets](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/budgets.png) |
| **Reports** | ![Reports](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/reports.png) |
| **Profile** | ![Profile](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/profile.png) |
| **Data(PDF)** | ![Data](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/expenses.pdf) |
| **Data(CSV)** | ![Data](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/expenses.csv) |

## Troubleshooting

### Backend Issues

**Problem: "Cannot connect to MongoDB"**
```bash
# Solution 1: Check if MongoDB is running
mongod --version

# Solution 2: Start MongoDB service
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Solution 3: Check MONGO_URI in .env file
```

**Problem: "Port 5000 already in use"**
```bash
# Solution: Change PORT in backend/.env file
PORT=5001
```

**Problem: "JWT Secret not defined"**
```bash
# Solution: Add JWT_SECRET to backend/.env file
JWT_SECRET=your_secret_key_here
```

### Frontend Issues

**Problem: "Cannot connect to backend"**
```bash
# Solution 1: Check if backend is running on port 5000
# Solution 2: Verify VITE_API_URL in frontend/.env
VITE_API_URL=http://localhost:5000/api

# Solution 3: Clear browser cache and reload
```

**Problem: "Module not found"**
```bash
# Solution: Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Problem: "Port 5173 already in use"**
```bash
# Solution: Kill the process or use different port
# Windows: netstat -ano | findstr :5173
# Mac/Linux: lsof -ti:5173 | xargs kill
```

### Common Issues

**Problem: "CORS Error"**
```bash
# Solution: Ensure backend CORS is configured correctly
# Check backend/server.js has proper CORS settings
```

**Problem: "Authentication failed"**
```bash
# Solution 1: Clear localStorage in browser
# Solution 2: Re-register or login again
# Solution 3: Check JWT_SECRET matches in backend
```

## Default Test Account

For testing purposes, you can create an account with:
- Email: test@example.com
- Password: Test123!


## Learning Resources

- **React**: https://react.dev/
- **Node.js**: https://nodejs.org/docs/
- **Express**: https://expressjs.com/
- **MongoDB**: https://docs.mongodb.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
