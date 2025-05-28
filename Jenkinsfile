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
        bat "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ." 
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
          -Dsonar.login= %sonar_token%
      """
    }
  }
}

stage('Security') {
  steps {
    echo 'Running Snyk vulnerability scan...'

    withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
      bat '''
        npm install -g snyk
        snyk auth $SNYK_TOKEN
        snyk test || true
      '''
    }
  }
}
  }

  post {
    success {
      echo "Build completed: $IMAGE_NAME:$IMAGE_TAG"
    }
    failure {
      echo 'Build failed.'
    }
  }
}
