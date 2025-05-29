

# Blog API
A lightweight RESTful API built with Node.js and Express, designed to support basic blog operations. This project is integrated with a full CI/CD pipeline using Jenkins and Docker, and includes quality assurance through automated testing, static code analysis, and security scanning.

## Features:
- Node.js Express server for REST API
- Health check endpoint (/health)
- Docker containerization
- Jenkins pipeline for CI/CD
- SonarCloud integration for code quality
- Snyk integration for security analysis
- Unit and integration tests using Jest and Supertest

## Pipeline Overview

1. **Build** – Docker image is built and tagged
2. **Test** – Unit and integration tests are executed
3. **Code Quality** – Static code analysis performed via SonarCloud
4. **Security** – Snyk CLI used to scan for vulnerabilities
5. **Deploy** – Docker container deployed locally
6. **Release** – Docker image pushed to Docker Hub
7. **Monitoring** – Deployment event logged via Datadog
