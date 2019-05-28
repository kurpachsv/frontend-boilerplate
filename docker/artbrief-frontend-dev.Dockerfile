# DEVELOPMENT
# docker 17.06.0+ compatible
FROM node:8-alpine

# s6-overlay
ADD https://github.com/just-containers/s6-overlay/releases/download/v1.11.0.1/s6-overlay-amd64.tar.gz /tmp/
RUN tar xzf /tmp/s6-overlay-amd64.tar.gz -C /
ENTRYPOINT ["/init"]

# initialization script to access Chrome Debugging Protocol
RUN echo -e "#!/bin/sh \
    \nsysctl -w net.ipv4.conf.eth0.route_localnet=1; \
    \niptables -t nat -I PREROUTING -p tcp --dport 9230 -j DNAT --to-destination 127.0.0.1:9230; \
    \niptables -t nat -I PREROUTING -p tcp --dport 9250 -j DNAT --to-destination 127.0.0.1:9250; \
    \niptables -t nat -I PREROUTING -p tcp --dport 9270 -j DNAT --to-destination 127.0.0.1:9270; \
    \niptables -t nat -I PREROUTING -p tcp --dport 9290 -j DNAT --to-destination 127.0.0.1:9290; \
    \niptables -t nat -I PREROUTING -p tcp --dport 9330 -j DNAT --to-destination 127.0.0.1:9330; \
    " >> /etc/cont-init.d/node-nat \
    && chmod +x /etc/cont-init.d/node-nat

RUN apk update && apk add --no-cache iptables

ENV NODE_PATH /usr/local/lib/node_modules

RUN npm install -g -s pm2 mocha gulp \
    && chown -R node.node /usr/local/lib/node_modules

RUN mkdir /app

WORKDIR /app

CMD ["pm2-docker", "start", "config/pm2/dev.yml"]
