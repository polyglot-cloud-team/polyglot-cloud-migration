pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'rao578612'
        VM_IP = 'YOUR_AZURE_VM_PUBLIC_IP' // <- Replace this with your actual Azure VM IP later!
        VM_USER = 'azureuser'
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
                // Copies production files over to your Azure instance safely
                sshagent(['cloud-vm-ssh']) {
                    sh "scp -o StrictHostKeyChecking=no docker-compose.prod.yml ${VM_USER}@${VM_IP}:~/docker-compose.prod.yml"
                }
            }
        }

        stage('Execute Cloud Deployment') {
            steps {
                echo 'Connecting to Azure VM and orchestrating rolling deployment...'
                // Securely logs into your Azure VM using your credentials and pulls fresh images
                sshagent(['cloud-vm-ssh']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_IP} "
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
                echo 'Verifying that public cloud routing endpoints are healthy...'
                // Pings your frontend container to ensure a clean HTTP 200/302 response code
                sh "curl -f http://${VM_IP}:80 || exit 1"
            }
        }
    }
}