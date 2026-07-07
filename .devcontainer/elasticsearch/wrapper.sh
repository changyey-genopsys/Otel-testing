#!/bin/bash

set -e

#
# Background Initialization
#
/opt/init/migrate.sh &

#
# Start Elasticsearch
#
exec /usr/local/bin/docker-entrypoint.sh "$@"