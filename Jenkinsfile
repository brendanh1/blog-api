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
        echo 'Running SonarCloud analysis...'

        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
          sh '''
            npm install
            npx sonar-scanner \
              -Dsonar.organization=brendanh1 \
              -Dsonar.projectKey=brendanh1_blog-api \
              -Dsonar.sources=src \
              -Dsonar.tests=tests \
              -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
              -Dsonar.login=$SONAR_TOKEN
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
