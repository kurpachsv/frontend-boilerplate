/***
 * Пайплайн для поставки готовых образов на прод стенды
 * Предусмотрен откат к прежней версии контейнеров.
 */

@Library('common-libraries')_

node(targetStand) {

    stage("Prepare") {
        checkout scm

        sh "rm -f .env"
        sh "echo \"BRANCH_NAME=$tag\nTARGET_STAND=$targetStand\" >> .env"

        docker.withRegistry("https://${REGISTRY_IP_PORT}", 'docker_registry_all_perm') {
            sh "BRANCH_NAME=${tag} docker-compose -f frontend_dev_pm.yml pull mtd-frontend-landing"
        }

        echo "Получаем имя образа текущего контейнера"

        CONTAINER_ID = sh(
            script: "docker-compose -f frontend_dev_pm.yml ps -q mtd-frontend-landing",
            returnStdout: true
        ).trim()

        if (CONTAINER_ID?.trim()) {
            CONTAINER_IMAGE_NAME = sh(
                script: "docker inspect --format=\"{{ index  .Config.Image }}\" ${CONTAINER_ID}",
                returnStdout: true
            ).trim()
            String str = CONTAINER_IMAGE_NAME
            OLD_TAG = str.split(":")[1]
            echo "Тэг образа заменяемого контейнера ${OLD_TAG}"
        } else {
            echo "Не найдено контейнера для сервиса Frontend"
        }

    }

    stage("Deploy") {

        sh "docker-compose -f frontend_dev_pm.yml up -d --force-recreate --remove-orphans --no-build "

        deployNginxStaticContent(tag)

        sh "echo Restart NGINX"
        def upstreamBuild = build(
            job: 'gracefull-restart-nginx',
            wait: true,
            propagate: false,
            parameters: [string(name: 'targetStand', value: targetStand)]
        )
    }

    stage("Rollback") {

        if (CONTAINER_ID?.trim()) {
            slackJobInputNotification("server_update_log")
            def inputResult = input message: 'Выберите дальнейшее действие:', parameters: [choice(choices: ['Продолжить', 'Откатить'], description: '', name: '')]

            if (inputResult == 'Откатить') {
                sh "rm -f .env"
                sh "echo \"BRANCH_NAME=$OLD_TAG\nTARGET_STAND=$targetStand\" >> .env"

                sh "docker-compose -f frontend_dev_pm.yml up -d --force-recreate --remove-orphans --no-build "

                deployNginxStaticContent(OLD_TAG)

                sh "echo Restart NGINX"
                def upstreamBuild = build(
                    job: 'gracefull-restart-nginx',
                    wait: true,
                    propagate: false,
                    parameters: [string(name: 'targetStand', value: targetStand)]
                )

                currentBuild.result = "UNSTABLE"
                slackCustomJobMessage("", "Выполнен откат изменений по требованию пользователя!\n" +
                    "Текущая версия сервиса: ${OLD_TAG}", "server_update_log")

            }
        } else {
            currentBuild.result = "UNSTABLE"
            slackCustomJobMessage("", "Не найдено контейнера для сервиса. Откат сервиса невозможен!", "server_update_log")
            echo "Не найдено контейнера для сервиса. Откат сервиса невозможен!"
        }

    }

}

def deployNginxStaticContent(tag) {
    docker.image("docker.maground.com/mtd-frontend:$tag").inside('-u root -v nginx-static-content:/data') { c ->
        sh 'cp -Rv /app/build /data/'
    }
}
