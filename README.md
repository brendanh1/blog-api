# blog-api

Blog API
A lightweight RESTful API built with Node.js and Express, designed to support basic blog operations. This project is integrated with a full CI/CD pipeline using Jenkins and Docker, and includes quality assurance through automated testing, static code analysis, and security scanning.



Features:
Node.js Express server for REST API

Health check endpoint (/health)

Docker containerization

Jenkins pipeline for CI/CD

SonarCloud integration for code quality

Snyk integration for security analysis

Unit and integration tests using Jest and Supertest



Pipeline
This project is deployed through a multi-stage Jenkins pipeline with the following stages:

Build – Docker image is built and tagged

Test – Unit and integration tests executed

Code Quality – SonarCloud analysis performed

Security – Snyk CLI performs vulnerability scanning

Deploy – Docker container is deployed locally

Release – Image pushed to Docker Hub

Monitoring – Deployment event sent to Datadog

