pipeline {
    agent any

    // This sets up Node.js. 
    // You will need to configure a NodeJS installation in Jenkins (Manage Jenkins -> Tools)
    // and name it 'Node20'. If you name it something else, update the string below.
    tools {
        nodejs 'Node20'
    }

    stages {
        stage('Checkout') {
            steps {
                // Pulls the code from your repository
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Note for Windows users: If your Jenkins runs natively on Windows CMD, 
                // you may need to change 'sh' to 'bat' (e.g., bat 'make install').
                // However, since 'make' requires a unix-like environment, 'sh' works best 
                // if you're using Git Bash, WSL, or Docker.
                sh 'make install'
            }
        }

        stage('Test') {
            steps {
                sh 'make test'
            }
        }

        stage('Build') {
            steps {
                sh 'make build'
            }
        }
    }
    
    post {
        always {
            echo "Pipeline finished with status: ${currentBuild.currentResult}"
        }
        success {
            echo "Build succeeded! Ready for deployment."
        }
        failure {
            echo "Build failed. Check the logs above."
        }
    }
}
