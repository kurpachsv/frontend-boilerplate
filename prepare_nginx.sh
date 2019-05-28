#!/bin/bash

cd /usr/local/etc/nginx/
rm -rf nginx.conf
cp mtd.nginx.conf nginx.conf
