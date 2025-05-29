pipeline {
  agent any

  environment {
    IMAGE_NAME = "blog-api"
    IMAGE_TAG = "${BUILD_NUMBER}"
  }

  stages {
    stage('Build') {
      steps {
        echo 'Logging in to Docker Hub...'
        withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          bat """
            docker login -u %DOCKER_USER% -p %DOCKER_PASS%
            docker build -t %IMAGE_NAME%:%IMAGE_TAG% .
          """
        }
      }
    }

    stage('Test') {
  steps {
    echo 'Running unit tests...'
    bat 'npm run test:unit'

    echo 'Running integration tests...'
    bat 'npm run test:integration'
  }
}

    stage('Code Quality') {
      steps {
        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
          bat """
            npm install
            npx sonar-scanner ^
              -Dsonar.organization=brendanh1 ^
              -Dsonar.projectKey=brendanh1_blog-api ^
              -Dsonar.sources=src ^
              -Dsonar.tests=tests ^
              -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info ^
              -Dsonar.login=%SONAR_TOKEN%
          """
        }
      }
    }

    stage('Security') {
      steps {
        echo 'Running Snyk vulnerability scan...'
        withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
          bat """
            npm install -g snyk
            snyk auth %SNYK_TOKEN%
            snyk test || true
          """
        }
      }
    }

    stage('Deploy') {
      steps {
        echo 'Deploying Docker container...'
        bat """
          docker stop blog-api || true
          docker rm blog-api || true
          docker run -d -p 3000:3000 --name blog-api %IMAGE_NAME%:%IMAGE_TAG%
        """
      }
    }

    stage('Release') {
      steps {
        echo 'Releasing Docker image to Docker Hub...'
        withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          bat """
            docker login -u %DOCKER_USER% -p %DOCKER_PASS%
            docker tag blog-api:%IMAGE_TAG% %DOCKER_USER%/blog-api:%IMAGE_TAG%
            docker push %DOCKER_USER%/blog-api:%IMAGE_TAG%
          """
        }
      }
    }

    stage('Monitoring') {
      steps {
        echo 'Sending deployment event to Datadog...'
        withCredentials([string(credentialsId: 'datadog-api-key', variable: 'DD_API_KEY')]) {
          bat '''
            curl -X POST "https://api.datadoghq.com/api/v1/events" ^
            -H "Content-Type: application/json" ^
            -H "DD-API-KEY: %DD_API_KEY%" ^
            -d "{\\"title\\": \\"Deployment\\", \\"text\\": \\"New release of %IMAGE_NAME%:%IMAGE_TAG% deployed\\", \\"alert_type\\": \\"info\\"}"
          '''
        }
      }
    }
  }

  post {
    success {
      echo "Build completed: ${IMAGE_NAME}:${IMAGE_TAG}"
    }
    failure {
      echo "Build failed: ${IMAGE_NAME}:${IMAGE_TAG} ."
    }
  }
}
