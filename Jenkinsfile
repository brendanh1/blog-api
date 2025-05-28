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
        sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ." 
      }
    }

    stage('Test') {
  steps {
    echo 'Running tests...'
    sh 'npm install'
    sh 'npm test'
  }

}

 stage('Code Quality') {
  steps {
    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
      sh '''
        npx sonar-scanner \
          -Dsonar.organization=your-org-name \
          -Dsonar.projectKey=your-org-name_blog-api \
          -Dsonar.sources=src \
          -Dsonar.tests=tests \
          -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
          -Dsonar.login=$SONAR_TOKEN
      '''
    }
  }
}

stage('Security') {
  steps {
    echo 'Running Snyk vulnerability scan...'

    withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
      sh '''
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
      echo "Build completed: _NAME:$IMAGE_TAG"
    }
    failure {
      echo 'Build failed.'
    }
  }
}
