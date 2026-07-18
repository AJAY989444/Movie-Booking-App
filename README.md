# CinePass 🎬 – Premium Online Movie Ticket Booking Platform

CinePass is a full-stack, enterprise-grade movie booking application built with a modern architecture: a high-performance **React (Vite)** frontend styling a glassmorphic dashboard, powered by a secure **Spring Boot** backend, and integrated with a cloud-native serverless **TiDB (MySQL-compatible)** database.

---

## 🚀 Live Production Links

* **Frontend App**: [https://cinepass-frontend-vkjq.onrender.com](https://cinepass-frontend-vkjq.onrender.com)
* **Backend API**: [https://cinepass-backend-6ykh.onrender.com](https://cinepass-backend-6ykh.onrender.com)
* **Database (Cloud)**: TiDB Serverless (AWS Southeast Asia)

---

## 🔑 Default Login Credentials

The system automatically initializes and seeds all necessary roles, cinema halls, seats, movies, and showtimes on its first launch. You can log in immediately using the following accounts:

| Role | Email | Password | Allowed Operations |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@cinepass.com` | `admin123` | Full access, manage halls, movies, seat structures, showtimes, and user accounts. |
| **Staff Member** | `staff@cinepass.com` | `staff123` | Ticket booking workflow, view seat layouts, scan/validate bookings, and manage customer tickets. |
| **Standard Customer** | `user@cinepass.com` | `user123` | Browse active movies, search showtimes, book interactive seats in real-time, and view transaction history. |

---

## 🌟 Key Features

* **Glassmorphic UI & Dark Mode**: Modern design built using React, Nginx, and responsive custom Vanilla CSS styles.
* **Interactive Real-Time Seating**: A live layout picker showing seats as `Available`, `Booked`, or `Selected`.
* **Role-Based Access Control (RBAC)**: Secure endpoints and route guards using JWT tokens for Admins, Staff, and Customers.
* **Spring Boot Security**: Stored passwords are cryptographically hashed using BCrypt.
* **Cloud-Native Database**: Connects securely to TiDB Serverless using SSL certificates and connection pooling with HikariCP.
* **Docker Containerized Builds**: Multistage Docker builds optimize image sizes for both the Spring Boot JAR and the React/Nginx SPA.

---

## 🛠️ How to Operate Locally

### 1. Prerequisites
* **Java**: JDK 17 or higher (JDK 21+ recommended)
* **Node.js**: Version 18.x or higher
* **MySQL / TiDB**: A running instance with a database named `moviebooking`

### 2. Run the Spring Boot Backend
1. Clone the repository and navigate to the root directory.
2. Configure database credentials in `src/main/resources/application.properties` (or set the environment variables `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`).
3. Build and launch the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend will boot on port `8080`. It will automatically run the schema migrations and seed default data.*

### 3. Run the React Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Set your local environment API variable:
   Create a `.env` file inside the `frontend` folder with:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will boot on `http://localhost:5173`.*

---

## 🚢 Render Cloud Deployment Reference

Here is a summary of the configuration settings used for our Render Blueprint:

### Backend Configuration
* **Runtime**: `Docker`
* **Dockerfile Path**: `./Dockerfile`
* **Docker Context**: `.`
* **Environment Variables**:
  * `SPRING_DATASOURCE_URL`: `jdbc:mysql://<tidb-host>:4000/moviebooking?useSSL=true&requireSSL=true&verifyServerCertificate=false&serverTimezone=UTC`
  * `SPRING_DATASOURCE_USERNAME`: `2TQq4YUqLqGM8SJ.root`
  * `SPRING_DATASOURCE_PASSWORD`: `APsODRgzjp4yGkoE`
  * `CORS_ALLOWED_ORIGINS`: `https://cinepass-frontend-vkjq.onrender.com`

### Frontend Configuration
* **Runtime**: `Docker`
* **Dockerfile Path**: `./frontend/Dockerfile`
* **Docker Context**: `./frontend`
* **Environment Variables**:
  * `VITE_API_URL`: `https://cinepass-backend-6ykh.onrender.com/api`
