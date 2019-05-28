@Library('common-libraries')_

node('cd') {

    stage("Prepare") {

        if (params.clearWS) {
            sh "echo Clear work space"
            sh 'sudo rm -rf ./node_modules'
            sh 'sudo rm -rf ./build'
            sh 'sudo rm -rf ./package-lock.json'
        }

        checkout scm

        branch_name = branch.replaceAll("origin/", "").replaceAll("/", "_")
        sh "rm -f .env"
        sh "echo \"BRANCH_NAME=$branch_name\nTARGET_STAND=$targetStand\" >> .env"

    }

    stage("Build") {

        sh "echo Build project artifacts"
        docker.build("nodejs_tools", '-f docker/nodejs-tools.Dockerfile .').inside(){
            sh '/bin/sh ./pipeline.build.sh'
        }

        sh "echo Build service container"
        sh 'docker-compose -f frontend_dev_dm.yml build mtd-frontend-dev'
    }


    stage ("Publish") {
        docker.withRegistry("https://${REGISTRY_IP_PORT}", 'docker_registry_all_perm') {
            sh "docker-compose -f frontend_dev_dm.yml push mtd-frontend-dev"
        }
    }

    stage('Deploy') {

        stash 'sources'

        node (targetStand){
            dir('dev_src') {
                docker.image("bash").inside("-u root -v ab_src_front:/ab_src_front") {
                    unstash 'sources'
                    sh 'rm -rf /ab_src_front/*'
                    sh 'cp -Rv ./* /ab_src_front/'
                }
            }
            sh 'rm -rf dev_src'
        }


        stash includes: 'frontend_dev_dm.yml', name: 'docker-compose'
        stash includes: '.env', name: 'env'

        node (targetStand){
            unstash 'docker-compose'
            unstash 'env'

            stage ("Pull image of service container") {
                docker.withRegistry("https://${REGISTRY_IP_PORT}", 'docker_registry_all_perm') {
                    sh "docker-compose -f frontend_dev_dm.yml pull mtd-frontend-dev"
                }
            }

            try {
                sh 'docker rm -f $(docker ps -aq --filter name=mtd-frontend)'
            } catch (e) {}

            sh "docker-compose -f frontend_dev_dm.yml up -d --force-recreate --remove-orphans mtd-frontend-dev"

            deleteDir()
        }

        build job: 'mtd-nginx-debug', parameters: [string(name: 'targetStand', value: targetStand)]

    }

}
