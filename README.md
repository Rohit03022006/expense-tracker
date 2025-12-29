# ExpenseTracker – Personal Finance Management Application  
**(CI/CD Enabled | Secure | Containerized | Production-Ready)**

ExpenseTracker is a full-stack personal finance management application designed to help users track income, expenses, budgets, and generate detailed financial reports. The project follows modern DevOps practices with integrated CI/CD automation, code quality analysis, and security scanning.

---

## Key Highlights

* Automated CI/CD pipeline using Jenkins
* SonarQube integration for static code analysis and Quality Gates
* Trivy for vulnerability scanning of file systems and Docker images
* Fully Dockerized frontend and backend
* Secure integration with MongoDB Atlas
* Docker images published to Docker Hub
* Security-first DevOps workflow

---

## Features

* **User Authentication** – Secure login and registration using JSON Web Tokens (JWT)
* **Dashboard** – Overview of income, expenses, and savings
* **Transaction Management** – Full CRUD operations for transactions
* **Categories** – Customizable expense and income categories
* **Budgets** – Monthly budget tracking with alerts
* **Reports** – Charts and financial analytics
* **Data Export** – Export data in CSV, JSON, and PDF formats
* **Multi-Currency Support**
* **Responsive User Interface**

---

## Technology Stack

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
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs
* PDFKit

### DevOps and CI/CD

* **Jenkins** – CI/CD automation
* **Docker & Docker Compose** – Containerization
* **SonarQube** – Code quality analysis and Quality Gates
* **Trivy** – Vulnerability scanning
* **OWASP Dependency-Check** – Dependency vulnerability detection
* **Docker Hub** – Image registry

---

## CI/CD Pipeline Overview

The Jenkins pipeline automates the complete application lifecycle through the following stages:

### Pipeline Stages

1. **Clone Repository** – Retrieve source code from version control
2. **SonarQube Code Analysis** – Static code quality scanning
3. **Sonar Quality Gate Enforcement** – Enforce quality standards
4. **OWASP Dependency Check** – Scan for vulnerable dependencies
5. **Trivy File System Scan** – Vulnerability scanning of source files
6. **Build Docker Images** – Create frontend and backend Docker images
7. **Push Images to Docker Hub** – Publish images to registry
8. **Trivy Docker Image Scan** – Vulnerability scanning of built images
9. **Deploy Application using Docker** – Automated deployment

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
   ├── Docker Deployment
   └── Nginx
```
![WorkFlow](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/WorkFlow.png)

---

## Code Quality – SonarQube

SonarQube provides static code analysis to ensure code quality and security:

* Static analysis for:
  * Bugs
  * Vulnerabilities
  * Code smells
* **Quality Gate** – Blocks pipeline progression on quality failures
* Enforces clean, maintainable, and secure code standards

---

## Security Scanning – Trivy

### Trivy File System Scan

* Scans source code and configuration files
* Detects:
  * Vulnerable dependencies
  * Security misconfigurations

### Trivy Image Scan

* Scans Docker images before deployment
* Detects:
  * OS-level vulnerabilities
  * Critical and High severity CVEs

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

Images are automatically built and pushed via Jenkins during the CI/CD process.

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

## Deployment with Docker (Recommended)

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

---

## Jenkins Credentials Used

| Credential ID         | Type               |
| --------------------- | ------------------ |
| `DockerHubCredential` | Username + Token   |
| `MONGODB_URI`         | Secret Text        |
| `Sonar`               | SonarQube Server   |

---

## Access Points

* Frontend: http://localhost:5173
* Backend API: http://localhost:5000

---

## API Endpoints

### Authentication
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login user
- `GET /api/auth/me` – Get current user details
- `PUT /api/auth/profile` – Update user profile

### Expenses/Transactions
- `GET /api/expenses` – Get all transactions
- `POST /api/expenses` – Create transaction
- `GET /api/expenses/:id` – Get single transaction
- `PUT /api/expenses/:id` – Update transaction
- `DELETE /api/expenses/:id` – Delete transaction
- `GET /api/expenses/stats` – Get transaction statistics

### Categories
- `GET /api/categories` – Get all categories
- `POST /api/categories` – Create category
- `PUT /api/categories/:id` – Update category
- `DELETE /api/categories/:id` – Delete category

### Budgets
- `GET /api/budgets` – Get all budgets
- `POST /api/budgets` – Create budget
- `GET /api/budgets/current` – Get current month budgets
- `PUT /api/budgets/:id` – Update budget
- `DELETE /api/budgets/:id` – Delete budget

### Export
- `GET /api/export/expenses/csv` – Export to CSV format
- `GET /api/export/expenses/json` – Export to JSON format
- `GET /api/export/expenses/pdf` – Export to PDF format
- `GET /api/export/backup` – Full data backup

## Usage Guide

### 1. Initial Setup

1. **Start the application** by running both backend and frontend services
2. **Open your browser** and navigate to http://localhost:5173
3. **Click "Register"** to create a new account
4. **Provide your details**:
   - Full Name
   - Email Address
   - Password
   - Preferred Currency

### 2. Adding Your First Transaction

1. **Navigate to the "Transactions" page**
2. **Click the "Add Transaction" button**
3. **Complete the form**:
   - Description (e.g., "Grocery Shopping")
   - Amount (e.g., 5000)
   - Type (Income or Expense)
   - Category (select from dropdown)
   - Transaction Date
   - Tags (optional)
4. **Click "Save"** to record the transaction

### 3. Creating Categories

1. **Navigate to the "Categories" page**
2. **Click "Create Category"**
3. **Enter category details**:
   - Name (e.g., "Food & Dining")
   - Type (Income or Expense)
   - Color (select for visual identification)
4. **Click "Save"** to create the category

### 4. Setting Up Budgets

1. **Navigate to the "Budgets" page**
2. **Click "Create Budget"**
3. **Configure budget parameters**:
   - Category selection
   - Monthly amount
   - Month and Year
4. **Click "Save"** to create the budget
5. **Monitor spending** against the set budget limits

### 5. Viewing Financial Reports

1. **Navigate to the "Reports" page**
2. **Review comprehensive statistics**:
   - Total Income
   - Total Expenses
   - Net Savings
   - Category Breakdown
   - Monthly Trends
3. **Export financial data** using CSV, JSON, or PDF export options

### 6. Updating User Profile

1. **Navigate to the "Profile" page**
2. **Update personal information**:
   - Name
   - Email Address
   - Currency preference
3. **Click "Save Changes"** to update profile

---

## Application Screenshots

| Feature | Screenshot |
|---------|-----------|
| **Landing Page** | ![Landing Page](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/base.png) |
| **Register Page** | ![Register](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/register.png) |
| **Login Page** | ![Login](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/login.png) |
| **Dashboard** | ![Dashboard](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/dashboard.png) |
| **Expenses/Transactions** | ![Expenses](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/expenses.png) |
| **Categories Management** | ![Categories](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/categories.png) |
| **Budgets Management** | ![Budgets](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/budgets.png) |
| **Reports and Analytics** | ![Reports](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/reports.png) |
| **DevSecOps Pipeline** | ![WorkFlow](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/WorkFlow.png) |
| **User Profile** | ![Profile](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/profile.png) |
| **PDF Export** | ![Data](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/expenses.pdf) |
| **CSV Export** | ![Data](https://github.com/Rohit03022006/expense-tracker/blob/master/Screenshots/expenses.csv) |

---

## Learning Resources

* React – [React Documentation](https://react.dev)
* Node.js – [Node.js Official Site](https://nodejs.org)
* Docker – [Docker Documentation](https://docs.docker.com)
* Jenkins – [Jenkins Documentation](https://www.jenkins.io/doc)
* SonarQube – [SonarQube Documentation](https://docs.sonarsource.com)
* Trivy – [Trivy Documentation](https://aquasecurity.github.io/trivy)

---

## Author

**Rohit**  
DevOps Engineer | Full Stack Developer | Cloud Enthusiast

---

## Final Note

This project demonstrates real-world DevOps and Full-Stack engineering practices, incorporating security, automation, and scalability considerations suitable for production deployment.
