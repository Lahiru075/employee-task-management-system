
# ⚡ TaskFlow – Enterprise Employee Task Management System

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JUnit 5](https://img.shields.io/badge/JUnit_5-Testing-25A162?style=for-the-badge&logo=junit5&logoColor=white)](https://junit.org/junit5/)

A robust, enterprise-ready Full-Stack Employee Task Management System architected with **Spring Boot** and **React (TypeScript + Tailwind CSS)**. Designed and implemented for the Software Engineering Intern Practical Assessment at **NextGen CodeX (Pvt) Ltd**.

---

## 📑 Table of Contents
- [Project Overview](#-project-overview)
- [System Architecture & Database Design](#-system-architecture--database-design)
- [Application Screenshots](#-application-screenshots)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Repository Structure](#-repository-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Getting Started](#-installation--getting-started)
- [Automated Unit Testing](#-automated-unit-testing)
- [REST API Documentation](#-rest-api-documentation)
- [AI Assistance Disclosure](#-ai-assistance-disclosure)
- [Author & Submission Info](#-author--submission-info)

---

## 📌 Project Overview

**TaskFlow** provides an end-to-end task tracking and collaboration workspace designed to streamline workflow transparency between management and team members. Built around a role-based access control (RBAC) model, the system enables managers to delegate tasks, track sprints, and monitor workload distribution while empowering employees to independently manage and progress their assigned tasks through distinct lifecycle stages.

---

## 🏛️ System Architecture & Database Design

The application follows a decoupled client-server architecture communicating via stateless RESTful JSON APIs.

### Entity Relationship Model (ERD)
The persistence layer utilizes a relational database structure designed with Referential Integrity constraints:

```
+-----------------------------------+             +------------------------------------+
|               USERS               |             |               TASKS                |
+-----------------------------------+             +------------------------------------+
| PK  id                  BIGINT    | 1         * | PK  id                   BIGINT    |
|     name                VARCHAR   |<----------->| FK  assigned_user_id     BIGINT    |
|     email (UNIQUE)      VARCHAR   |             |     title                VARCHAR   |
|     password            VARCHAR   |             |     description          TEXT      |
|     role (ADMIN/EMPLOYEE) ENUM    |             |     status (TO_DO/..)    ENUM      |
|     created_at          DATETIME  |             |     priority (LOW/..)    ENUM      |
|     updated_at          DATETIME  |             |     due_date             DATE      |
+-----------------------------------+             |     created_at           DATETIME  |
                                                  |     updated_at           DATETIME  |
                                                  +------------------------------------+
                   Relationship: One-to-Many (One User -> Many Tasks)
```

---

## 📸 Application Screenshots

Place your screenshots inside a root `./screenshots/` directory:

| 1. Authentication (Sign In) | 2. Admin Workspace Dashboard |
| :---: | :---: |
| ![Sign In](./screenshots/login.png) | ![Admin Dashboard](./screenshots/dashboard.png) |

| 3. Task Creation & Assignment Modal | 4. Employee Directory & Directory View |
| :---: | :---: |
| ![Create Task Modal](./screenshots/create-task.png) | ![Employee Directory](./screenshots/employees.png) |

---

## ✨ Key Features

### 1. Core Task Lifecycle (CRUD)
- **Create:** Task creation with title, description, priority, lifecycle status, due date, and assigned employee.
- **Read:** Responsive grid views with real-time KPI metrics (Total, To Do, In Progress, Completed).
- **Update:** Full task editing and rapid status transitions via intuitive card controls.
- **Delete:** Protected task removal integrated with SweetAlert2 confirmation dialogs.

### 2. Role-Based Access Control (RBAC)
- **Admin / Manager:**
  - Full CRUD authority over all organizational tasks.
  - Ability to assign work directly to employees.
  - Access to the Employee Directory and workload metrics.
- **Employee:**
  - View only tasks directly assigned to their authenticated account.
  - Direct authority to transition their own task statuses (`To Do` ➔ `In Progress` ➔ `Completed`).

### 3. Dynamic Assignment & Employee Dropdown
- Management modals dynamically fetch and populate active employee emails directly from the backend, eliminating typing errors and ensuring referential validity.

### 4. Search, Filter & Multi-Criteria Sorting
- **Real-Time Search:** Instant client-side text evaluation across task titles, descriptions, and assignee emails.
- **Status Filter Pills:** Quick filters for `ALL`, `TO_DO`, `IN_PROGRESS`, and `COMPLETED`.
- **Sorting Engine:** Dynamic multi-option sort supporting:
  - **Due Date (Earliest First)**
  - **Priority (High to Low)**

### 5. Enterprise UX & Responsive Shell
- Fully responsive sidebar with mobile drawer navigation.
- Glassmorphism header with active session indicator and live date tracking.
- Non-blocking dark-glass floating toast notifications for user feedback.

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Utility-first responsive design)
- **Tooling & Bundler:** Vite
- **Icons:** Lucide React
- **HTTP Client:** Axios (Custom interceptor instances)
- **Alerts & Modals:** SweetAlert2 & Custom Tailwind Modals

### Backend Architecture
- **Language & Platform:** Java (JDK 17 / 21)
- **Framework:** Spring Boot 4.x
  - Spring Web (REST APIs)
  - Spring Data JPA (Object-Relational Mapping)
  - Spring Validation (`jakarta.validation` annotations)
- **ORM & Database:** Hibernate & MySQL 8.x
- **Boilerplate Reduction:** Project Lombok
- **Testing Suite:** JUnit 5, Mockito

---

## 📂 Repository Structure

```text
employee-task-management-system/
│
├── task-management-backend/          # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/taskmanagementbackend/
│   │   │   │   ├── controller/      # REST API Controllers (Auth, Task)
│   │   │   │   ├── dto/             # Data Transfer Objects (Requests & Responses)
│   │   │   │   ├── entity/          # JPA Database Entities (Task, User)
│   │   │   │   ├── enums/           # Role, TaskStatus, TaskPriority
│   │   │   │   ├── exception/       # Global & Custom Exception Handlers
│   │   │   │   ├── repository/      # Spring Data JPA Repositories
│   │   │   │   └── service/         # Business Logic & Service Implementations
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── application.properties.example
│   │   └── test/                    # JUnit 5 & Mockito Unit Tests
│   ├── pom.xml
│   └── mvnw
│
├── task-management-frontend/         # React + TypeScript (Vite)
│   ├── src/
│   │   ├── components/              # Shared Components (Sidebar, Modals)
│   │   ├── layouts/                 # DashboardLayout & Navigation Shell
│   │   ├── pages/                   # Views (Dashboard, Login, Register, Employees)
│   │   ├── service/                 # Axios API Service Modules
│   │   ├── types/                   # TypeScript Type & Interface Definitions
│   │   ├── routes/                  # Routing Configuration
│   │   └── main.tsx                 # Entry Point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── screenshots/                     # Application Screen Captures
└── README.md
```

---

## ⚙️ Prerequisites

Before setting up the project locally, verify that you have:
- **Java Development Kit (JDK 17 or 21)** installed
- **Node.js (v18.x or later)** and **npm**
- **MySQL Server (v8.0+)** running locally
- **Git**

---

## 🚀 Installation & Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Lahiru075/employee-task-management-system.git
cd employee-task-management-system
```

---

### 2. Database Configuration

1. Launch your MySQL client and create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS task_management_db;
   ```

2. Inside `task-management-backend/src/main/resources/`, inspect `application.properties`:
   ```properties
   spring.application.name=task-management-backend

   # Server Port
   server.port=8080

   # Database Configuration
   spring.datasource.url=jdbc:mysql://localhost:3306/task_management_db?createDatabaseIfNotExist=true
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

   # JPA / Hibernate Settings
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.format_sql=true
   ```
   *(Update username and password to match your local MySQL configuration if different).*

---

### 3. Backend Setup & Run

```bash
cd task-management-backend

# Build and run the Spring Boot application
./mvnw clean install
./mvnw spring-boot:run
```
*The Spring Boot backend will initialize and listen on `http://localhost:8080`.*

---

### 4. Frontend Setup & Run

Open a new terminal window:

```bash
cd task-management-frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
*The frontend client will launch at `http://localhost:5173`.*

---

## 🧪 Automated Unit Testing

The backend includes automated service layer testing using **JUnit 5** and **Mockito**. The test suite validates task instantiation, mock database persistence, field mapping, and exception boundary handling.

Run tests using the Maven wrapper:
```bash
cd task-management-backend
./mvnw test
```

### Test Suite Execution Output
```text
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.example.taskmanagementbackend.service.TaskServiceTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.472 s -- in TaskServiceTest
[INFO]
[INFO] Results:
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] -------------------------------------------------------
[INFO] BUILD SUCCESS
```

---

## 📡 REST API Documentation

### Authentication & User Endpoints (`/api/v1/auth`)

| HTTP Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new user account (Admin / Employee) | Public |
| `POST` | `/api/v1/auth/login` | Authenticate credentials and return session user | Public |
| `GET` | `/api/v1/auth/users` | Retrieve all registered users | Authenticated |
| `GET` | `/api/v1/auth/employees/emails` | Retrieve array of all active employee emails | Admin |

### Task Management Endpoints (`/api/v1/tasks`)

| HTTP Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/tasks` | Create and assign a new task | Admin |
| `GET` | `/api/v1/tasks` | Fetch all tasks across workspace | Admin |
| `GET` | `/api/v1/tasks/my-tasks` | Fetch tasks assigned to the current employee | Employee |
| `GET` | `/api/v1/tasks/{id}` | Retrieve specific task details by ID | Authenticated |
| `PUT` | `/api/v1/tasks/{id}` | Update task details (Title, Priority, Date, etc.) | Admin |
| `PATCH` | `/api/v1/tasks/{id}/status` | Update task lifecycle progress status | Authenticated |
| `DELETE` | `/api/v1/tasks/{id}` | Delete a task from the system | Admin |

---

## 🤖 AI Assistance Disclosure

In compliance with **Section 10 (Candidate Guidelines and Conditions)** of the assessment:
- **AI Tool Utilized:** Google AI Studio
- **Scope of Assistance:**
  - Brainstorming responsive layout utilities and CSS color harmonies using Tailwind CSS.
  - Reviewing TypeScript interfaces, regex patterns for validation, and structuring Markdown documentation.
  - Assisting with standard syntax boilerplates for JUnit 5 / Mockito unit test structures.
- **Candidate Statement:** All application logic, database schema design, Spring Boot architecture, API integrations, and frontend components were independently reviewed, executed, customized, and understood by the candidate.

---

## 👤 Author & Submission Information

- **Candidate Name:** Lahiru Lakshan
- **GitHub Username:** [@Lahiru075](https://github.com/Lahiru075)
- **Repository URL:** [employee-task-management-system](https://github.com/Lahiru075/employee-task-management-system)
- **Position Applied:** Software Engineering Intern
- **Evaluation Company:** NextGen CodeX (Pvt) Ltd
- **Submission Date:** November 2026
```

---
   git commit -m "docs: add comprehensive production-ready README documentation"
   git push origin main
   ```
