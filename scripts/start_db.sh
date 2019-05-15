#!/bin/bash -e
PID=$(pgrep mongod || echo "0")
if (("${#PID}" > "1")); then
    echo "✅  Mongo process already running: ${PID}";
    exit 0;
else
    echo "Setting up db...";
    mongod --config mongod.conf;
fi