pipeline {
    agent any

    environment {
        BACKEND_IMAGE  = 'rohitxten/expense-backend:latest'
        FRONTEND_IMAGE = 'rohitxten/expense-frontend:latest'
        SONAR_SCANNER_HOME = tool 'Sonar'
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/Rohit03022006/expense-tracker.git'
            }
        }

        stage('SonarQube Code Analysis') {
            steps {
                withSonarQubeEnv('Sonar') {
                    sh """
                    ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                      -Dsonar.projectName=ExpenseTracker \
                      -Dsonar.projectKey=expense_tracker \
                      -Dsonar.sources=.
                    """
                }
            }
        }

        stage('Sonar Quality Gate') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --format HTML --format XML',
                                odcInstallation: 'Dependency check'
                dependencyCheckPublisher pattern: '**/dependency-check-report.*'
            }
        }

        stage('Trivy File System Scan') {
            steps {
                sh '''
                trivy fs \
                  --security-checks vuln,config \
                  --severity HIGH,CRITICAL \
                  --format table \
                  -o trivy-fs-report.html .
                '''
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'DockerHubCredential',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                    docker build -t rohitxten/expense-backend:latest ./backend
                    docker push rohitxten/expense-backend:latest

                    docker build \
                      --build-arg VITE_API_URL=/api \
                      -t rohitxten/expense-frontend:latest ./frontend
                    docker push rohitxten/expense-frontend:latest
                    '''
                }
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh '''
                trivy image --severity HIGH,CRITICAL \
                  --format table \
                  -o trivy-backend-report.html rohitxten/expense-backend:latest

                trivy image --severity HIGH,CRITICAL \
                  --format table \
                  -o trivy-frontend-report.html rohitxten/expense-frontend:latest
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                withCredentials([
                    string(credentialsId: 'MONGODB_URI', variable: 'MONGODB_URI')
                ]) {
                    sh '''
                    docker stop expense-frontend expense-backend || true
                    docker rm expense-frontend expense-backend || true
                    docker network create expense-network || true
                    '''

                    sh '''
                    docker run -d \
                      --name expense-backend \
                      --network expense-network \
                      -e MONGODB_URI="$MONGODB_URI" \
                      -p 5000:5000 \
                      rohitxten/expense-backend:latest
                    '''

                    sh 'sleep 10'

                    sh '''
                    docker run -d \
                      --name expense-frontend \
                      --network expense-network \
                      -p 5173:80 \
                      rohitxten/expense-frontend:latest
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded! Expense Tracker deployed.'
            sh 'docker ps --filter name=expense-'
        }

        failure {
            echo 'Pipeline failed! Check logs.'
            sh 'docker logs expense-backend || true'
            sh 'docker logs expense-frontend || true'
        }

        always {
            sh 'docker logout || true'
            archiveArtifacts artifacts: '**/*report.html', allowEmptyArchive: true
            archiveArtifacts artifacts: '**/dependency-check-report.*', allowEmptyArchive: true
        }
    }
}
