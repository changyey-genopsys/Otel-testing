#!/bin/bash

set -e

source /opt/init/common.sh

wait_for_elasticsearch

echo "========== Migration Start =========="

for migration in /opt/init/migrations/*.sh
do
    echo
    echo "Running $(basename "$migration")"

    bash "$migration"
done

echo
echo "========== Migration Finished =========="