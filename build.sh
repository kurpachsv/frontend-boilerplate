#!/usr/bin/env bash
# PRODUCTION BUILD


npm install -s
NODE_ENV=production gulp vendor
NODE_ENV=production gulp theme
NODE_ENV=production gulp client


