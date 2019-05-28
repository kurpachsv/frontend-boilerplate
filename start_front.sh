#!/bin/bash

sudo nginx

pm2 start config/pipeline.pm2/local.dev.yml
pm2 logs
