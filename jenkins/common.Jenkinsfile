/***
 * Пайплайн выкатывает приложение на тестовые стенды.
 * Если выбраны параметры
 * targetStand: uat
 * branch_name: master
 * то появится возможность отправить сборку в продакшен.
 * За поставку на прод отвечает пайплайн deploy-to-prod
 */
@Library('common-libraries')_

node("cd") {

    def branch_name

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
        sh 'docker-compose -f frontend_dev_pm.yml build mtd-frontend-landing'

    }

    stage("Publish") {
        docker.withRegistry("https://${REGISTRY_IP_PORT}", 'docker_registry_all_perm') {
            sh 'docker-compose -f frontend_dev_pm.yml push mtd-frontend-landing'
        }
    }

    stage("Deploy") {

        stash includes: 'frontend_dev_pm*.yml', name: 'docker-compose'
        stash includes: '.env', name: 'env'

        node(targetStand) {

            unstash 'docker-compose'
            unstash 'env'


            sh "echo Pull image of service container"
            docker.withRegistry("https://${REGISTRY_IP_PORT}", 'docker_registry_all_perm') {
                sh 'docker-compose -f frontend_dev_pm.yml pull mtd-frontend-landing'
            }


            try {
                sh 'echo Remove debug Frontend container if exists'
                sh 'docker rm -f $(docker ps -aq --filter name=mtd-frontend-dev)'
            } catch (e) {}

            sh "echo Start new containers"
            sh 'docker-compose -f frontend_dev_pm.yml up -d --force-recreate --remove-orphans --no-build '

            sh "echo Update Nginx static content"
            deployNginxStaticContent(branch_name)


            try {
                sh 'echo Remove debug Nginx container if exists'
                sh 'docker rm -f $(docker ps -aq --filter name=mtd-nginx-debug)'
            } catch (e) {}

            build job: 'mtd-nginx', parameters: [string(name: 'targetStand', value: targetStand)]

            deleteDir()
        }
    }


    stage("Promote to prod") {
        if (promoteToProd == "promote") {

            slackJobInputNotification("server_update_log")
            def testPassParamInput = input message: 'Деплоим на прод?'

            def docker_registry_tag
            echo "Тегаем image номером сборки"
            docker.withRegistry("https://${REGISTRY_IP_PORT}", 'docker_registry_all_perm') {
                docker_registry_tag = "build_${BUILD_NUMBER}"
                sh "BRANCH_NAME=${docker_registry_tag} docker-compose -f frontend_dev_pm.yml build mtd-frontend-landing"
                sh "BRANCH_NAME=${docker_registry_tag} docker-compose -f frontend_dev_pm.yml push mtd-frontend-landing"
            }


            echo 'тегаем релиз в bitbacket'
            withCredentials([usernamePassword(credentialsId: 'bitbucket', usernameVariable: 'username', passwordVariable: 'password')])
                {
                    sh "git tag -d ${docker_registry_tag} || true"
                    try {
                        sh "git push --delete https://$username:$password@bitbucket.org/maground/maground-frontend.git ${docker_registry_tag}"
                    } catch (e) {
                        echo "Произошла ошибка при удалении тега в origin: " + e
                    }
                    GIT_COMMIT_HASH = sh(script: "git log -n 1 --pretty=format:'%H'", returnStdout: true)

                    sh "git tag ${docker_registry_tag} ${GIT_COMMIT_HASH}"
                    sh "git push https://$username:$password@bitbucket.org/maground/maground-frontend.git --tags"
                }


            build job: 'prod_frontend-deployment', parameters: [
                string(name: 'targetStand', value: 'prod'),
                string(name: 'tag', value: docker_registry_tag)
            ]
        }
    }
}

def deployNginxStaticContent(tag) {
    docker.image("docker.maground.com/mtd-frontend:$tag").inside('-u root -v nginx-static-content:/data') { c ->
        sh 'cp -Rv /app/build /data/'
    }
}
