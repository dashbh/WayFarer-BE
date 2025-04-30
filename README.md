# WayFarer Backend (BE) ![CI](https://github.com/dashbh/WayFarer-BE/actions/workflows/ci.yml/badge.svg)


## Overview
WayFarer Backend is a **NestJS-driven microservices architecture** built using a **monorepo** structure. It provides an **API Gateway, authentication service, and catalog service**, communicating via **TCP**. The authentication service secures the catalog service using **JWT authentication**.

## Architecture
The backend follows a **microservices architecture** with the following components:

### **1. API Gateway**
- Acts as the single entry point for all client requests.
- Routes requests to the appropriate microservices.
- Handles authentication and authorization.

### **2. Auth Service**
- Manages user authentication and authorization.
- Implements **JWT authentication** using **Passport.js**.
- Provides login, registration, and user validation functionalities.

### **3. Catalog Service**
- Manages travel-related data, including destinations and packages.
- Protected by **AuthGuard**, requiring a valid JWT token for access.

## Communication Pattern
- **gRPC communication** between **API Gateway** and **Catalog/Auth Services**.
- Ensures efficient inter-service messaging and decoupling.

## Authentication
- Uses **JWT (JSON Web Token)** for secure authentication.
- **Passport.js** integrated for authentication handling.
- **AuthGuard** enforces restricted access to the catalog service.

## Deployment
- **Docker-based deployment** with a minimal **Node.js Alpine** image.
- Services are containerized for scalability and portability.

## Setup & Installation
### Prerequisites
- Node.js & npm
- Docker (for containerized deployment)

### Installation Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/wayfarer-be.git
   cd wayfarer-be
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the development server:
   ```sh
   npm run start:all
   ```

### Running with Docker
1. Build and run the Docker containers:
   ```sh
   docker-compose up --build
   ```

## Future Enhancements
- Integration with more microservices (e.g., booking, payments).
- Enhanced security measures (OAuth, multi-factor authentication).
- Kubernetes deployment for scalability.

---
This repository serves as the backend for the **WayFarer Travel Booking Platform**. Contributions and improvements are welcome!

