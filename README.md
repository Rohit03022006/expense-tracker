# ExpenseTracker – Personal Finance Management App

**(CI/CD Enabled • Secure • Containerized • Production-Ready)**

ExpenseTracker is a **full-stack personal finance management application** that helps users track income, expenses, budgets, and generate detailed financial reports.
The project follows **modern DevOps practices** with **CI/CD automation, code quality analysis, and security scanning**.

---

## Key Highlights

* Automated **CI/CD pipeline using Jenkins**
* **SonarQube** for static code analysis & Quality Gates
* **Trivy** for file system & Docker image vulnerability scanning
* Fully **Dockerized frontend & backend**
* Secure **MongoDB Atlas** integration
* Docker images published to **Docker Hub**
* Security-first DevOps workflow

---

## Features

* **User Authentication** – Secure login & registration (JWT)
* **Dashboard** – Income, expenses & savings overview
* **Transaction Management** – CRUD operations
* **Categories** – Custom expense/income categories
* **Budgets** – Monthly budget tracking
* **Reports** – Charts & analytics
* **Export Data** – CSV, JSON, PDF
* **Multi-Currency Support**
* **Responsive UI**

---

## Tech Stack

### Frontend

* React (Vite)
* React Router
* Axios
* Tailwind CSS
* Recharts
* React Toastify

### Backend

* Node.js
* Express.js
* MongoDB (Atlas)
* Mongoose
* JWT Authentication
* bcryptjs
* PDFKit

### DevOps & CI/CD

* **Jenkins** – CI/CD automation
* **Docker & Docker Compose**
* **SonarQube** – Code Quality & Quality Gate
* **Trivy** – Vulnerability Scanning
* **OWASP Dependency-Check**
* **Docker Hub** – Image Registry

---

## CI/CD Pipeline Overview

The Jenkins pipeline automates the **complete application lifecycle**:

### Pipeline Stages

1. **Clone Repository**
2. **SonarQube Code Analysis**
3. **Sonar Quality Gate Enforcement**
4. **OWASP Dependency Check**
5. **Trivy File System Scan**
6. **Build Docker Images**
7. **Push Images to Docker Hub**
8. **Trivy Docker Image Scan**
9. **Deploy Application using Docker**

---

## CI/CD Architecture

```
GitHub
   ↓
Jenkins Pipeline
   ├── SonarQube (Code Quality)
   ├── OWASP Dependency Check
   ├── Trivy FS Scan
   ├── Docker Build
   ├── Trivy Image Scan
   └── Docker Deployment
```
![WorkFlow](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/WorkFlow.png) |

---

## Code Quality – SonarQube

* Static analysis for:

  * Bugs
  * Vulnerabilities
  * Code smells
* **Quality Gate** blocks pipeline on failure
* Enforces clean & maintainable code

---

## Security Scanning – Trivy

### Trivy File System Scan

* Scans source code & config files
* Detects:

  * Vulnerable dependencies
  * Misconfigurations

### Trivy Image Scan

* Scans Docker images before deployment
* Detects:

  * OS-level vulnerabilities
  * Critical & High CVEs

---

## Dockerization

### Backend Image

```bash
rohitxten/expense-backend:latest
```

### Frontend Image

```bash
rohitxten/expense-frontend:latest
```

Images are built and pushed automatically via Jenkins.

---

## Environment Configuration

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=<MongoDB Atlas URI>
JWT_SECRET=<secure-secret>
JWT_EXPIRE=30d
```

### Frontend (Build-time)

```env
VITE_API_URL=http://localhost:5000
```

---

## Run with Docker (Recommended)

```bash
docker network create expense-network

docker run -d \
  --name expense-backend \
  --network expense-network \
  -e MONGODB_URI=<MongoDB_URI> \
  -p 5000:5000 \
  rohitxten/expense-backend:latest

docker run -d \
  --name expense-frontend \
  --network expense-network \
  -p 5173:80 \
  rohitxten/expense-frontend:latest
```

Access:

* Frontend → [http://localhost:5173](http://localhost:5173)
* Backend → [http://localhost:5000](http://localhost:5000)

---

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

---

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
| **DevSecOps** | ![WorkFlow](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/WorkFlow.png) |
| **Profile** | ![Profile](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/profile.png) |
| **Data(PDF)** | ![Data](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/expenses.pdf) |
| **Data(CSV)** | ![Data](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/expenses.csv) |


---

## Jenkins Credentials Used

| Credential ID         | Type             |
| --------------------- | ---------------- |
| `DockerHubCredential` | Username + Token |
| `MONGODB_URI`         | Secret Text      |
| `Sonar`               | SonarQube Server |

---


## Troubleshooting

### Frontend not connecting to backend?

* Ensure frontend is built with:

```env
VITE_API_URL=http://localhost:5000
```

### Jenkins Docker permission issue?

```bash
sudo usermod -aG docker jenkins
sudo systemctl restart docker jenkins
```

### SonarQube not starting?

```bash
sudo sysctl -w vm.max_map_count=262144
```

---

## Learning Resources

* React – [https://react.dev](https://react.dev)
* Node.js – [https://nodejs.org](https://nodejs.org)
* Docker – [https://docs.docker.com](https://docs.docker.com)
* Jenkins – [https://www.jenkins.io/doc](https://www.jenkins.io/doc)
* SonarQube – [https://docs.sonarsource.com](https://docs.sonarsource.com)
* Trivy – [https://aquasecurity.github.io/trivy](https://aquasecurity.github.io/trivy)

---

## Author

**Rohit**
DevOps • Full Stack • Cloud Enthusiast

---

## Final Note

This project demonstrates **real-world DevOps & Full-Stack engineering practices** and is **production-ready**, secure, and scalable.
