pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "pannatronkanla/frontend"
        TAG = "${BUILD_NUMBER}"
    }

    stages {

          stage('Checkout') {
              steps {
                git branch: 'main', url: 'https://github.com/D1n0cute/project-server-less.git'
              }

          }        

        stage('Docker Build') {
            steps {
                sh '''
                docker build -t $DOCKER_IMAGE:$TAG -t $DOCKER_IMAGE:latest ./frontend
                '''
            }
        }

        stage('Push Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh '''
                    echo $PASS | docker login -u $USER --password-stdin
                    docker push $DOCKER_IMAGE:$TAG
                    docker push $DOCKER_IMAGE:latest
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy step here'
            }
        }
    }
}
