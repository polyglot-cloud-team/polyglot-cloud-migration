pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'rao578612'
        VM_IP = '192.168.10.18'
        VM_USER = 'X1 Carbon'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Pulls deployment scripts and compose files from your main branch
                checkout scm
            }
        }

        stage('SSH Environment Sync') {
            steps {
                echo 'Preparing deployment configuration files...'
                // Copies production files over to your laptop adapter network safely
                sshagent(['cloud-vm-ssh']) {
                    sh "scp -o StrictHostKeyChecking=no docker-compose.prod.yml \"${VM_USER}@${VM_IP}:/C:/Users/X1 Carbon/\""
                }
            }
        }

        stage('Execute Cloud Deployment') {
            steps {
                echo 'Connecting to target machine and orchestrating rolling deployment...'
                // Logs into the host environment using your credentials and boots the stack
                sshagent(['cloud-vm-ssh']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no \"${VM_USER}@${VM_IP}\" "
                            docker compose -f docker-compose.prod.yml pull &&
                            docker compose -f docker-compose.prod.yml up -d &&
                            docker ps
                        "
                    """
                }
            }
        }

        stage('Automated Health Check') {
            steps {
                echo 'Verifying that routing endpoints are healthy...'
                // Pings your frontend container to ensure a clean HTTP response code
                sh "curl -f http://${VM_IP}:80 || exit 1"
            }
        }
    }
}