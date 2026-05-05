pipeline {
    agent any

    environment {
        FE_IMAGE = "pannatronkanla/frontend"
        BE_IMAGE = "pannatronkanla/backend"
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
                sh "docker build -t $FE_IMAGE:$TAG -t $FE_IMAGE:latest ./frontend"
                sh "docker build -t $BE_IMAGE:$TAG -t $BE_IMAGE:latest ./backend"
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
                    docker push $FE_IMAGE:$TAG
                    docker push $FE_IMAGE:latest
                    docker push $BE_IMAGE:$TAG
                    docker push $BE_IMAGE:latest
                    '''
                }
            }
        }

        stage('Connect AKS') {
            steps {
                sh '''
                az aks get-credentials \
                  --resource-group aks-rg \
                  --name my-aks-cluster \
                  --overwrite-existing
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                cd ansible
                ansible-playbook -i inventory deploy.yml
                '''
            }
        }
    }
}
