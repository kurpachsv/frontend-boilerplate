FROM node:8-alpine

RUN apk update && apk add --no-cache git openssh python build-base

ENV NODE_PATH /usr/local/lib/node_modules

RUN npm install -g -s pm2

RUN chown -R node.node /usr/local/lib/node_modules

RUN npm install -g -s node-gyp node-pre-gyp bindings gulp \
    && chown -R node.node /usr/local/lib/node_modules

#  Add bitbucket.org to the list of known hosts
RUN echo -e "\nHost bitbucket.org\n \
   StrictHostKeyChecking no " >> /etc/ssh/ssh_config

VOLUME ["/app", "/ssh-agent"]

WORKDIR /app

CMD ["/bin/sh","/app/pipeline.build.sh"]
