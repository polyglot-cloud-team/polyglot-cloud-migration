pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'rao578612'
        VM_IP = '20.219.151.31'
        VM_USER = 'azureuser'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('SSH Environment Sync') {
            steps {
                echo "Syncing Docker Compose configuration to Azure Host: ${VM_IP}..."
                sshagent(['azureuser']) {
                    sh "scp -o StrictHostKeyChecking=no docker-compose.prod.yml ${VM_USER}@${VM_IP}:~/docker-compose.prod.yml"
                }
            }
        }

        stage('Execute Cloud Deployment') {
            steps {
                echo "Orchestrating container layers on live Azure instance..."
                sshagent(['azureuser']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_IP} "
                            sudo apt-get update && sudo apt-get install -y docker-compose-v2 &&
                            sudo docker compose -f ~/docker-compose.prod.yml pull &&
                            sudo docker compose -f ~/docker-compose.prod.yml up -d &&
                            sudo docker ps
                        "
                    """
                }
            }
        }

        stage('Automated Health Check') {
            steps {
                echo 'Validating public application routing endpoint...'
                sh "curl -f http://${VM_IP}:80 || exit 1"
            }
        }
    }
}