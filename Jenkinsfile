pipeline {
  agent any

  environment {
    IMAGE_NAME = "blog-api"
    IMAGE_TAG = "${env.BUILD_NUMBER}"
  }

  stages {
    stage('Build') {
      steps {
        echo 'Building Docker image...'
        bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .' 
      }
    }

    stage('Test') {
  steps {
    echo 'Running tests...'
    bat 'npm install'
    bat 'npm test'
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
          -Dsonar.login= %SONAR_TOKEN%
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
    echo 'Promoting Docker image to production...'

    // Tag the image as 'latest'
    bat 'docker tag %IMAGE_NAME%:%IMAGE_TAG% brendan170/%IMAGE_NAME%:%IMAGE_TAG%'
    bat 'docker tag %IMAGE_NAME%:%IMAGE_TAG% brendan170/%IMAGE_NAME%:latest'

  withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
    bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'
    bat 'docker push brendan170/%IMAGE_NAME%:%IMAGE_TAG%'
    bat 'docker push brendan170/%IMAGE_NAME%:latest'
    }

    echo 'Release complete and pushed to Docker Hub.'
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
      echo "Build completed: %IMAGE_NAME%:%IMAGE_TAG%"
    }
    failure {
      echo 'Build failed.'
    }
  }
}
