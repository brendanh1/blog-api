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
        sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
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
