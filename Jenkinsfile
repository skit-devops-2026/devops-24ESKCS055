pipeline {
    agent any

    // If you configure a NodeJS tool named 'Node20' in Jenkins (Manage Jenkins -> Tools),
    // you can uncomment the block below. Otherwise Jenkins uses the system Node/npm from PATH:
    // tools {
    //     nodejs 'Node20'
    // }

    stages {
        stage('Checkout') {
            steps {
                // Pulls the code from your repository
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'make install'
                    } else {
                        bat 'npm --prefix backend install && npm --prefix frontend install'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'make test'
                    } else {
                        bat 'npm --prefix backend test'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'make build'
                    } else {
                        bat 'npm --prefix frontend run build'
                    }
                }
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
