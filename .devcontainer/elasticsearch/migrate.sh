#!/bin/bash

set -e

source /opt/init/common.sh

wait_for_elasticsearch

# echo "TEST_ILM : $TEST_ILM"
# echo "SYSTEM_ILM : $SYSTEM_ILM"

# echo "TEST_COMPONENT_TEMPLATE : $TEST_COMPONENT_TEMPLATE"
# echo "SYSTEM_COMPONENT_TEMPLATE : $SYSTEM_COMPONENT_TEMPLATE"

# echo "TEST_INDEX_TEMPLATE : $TEST_INDEX_TEMPLATE"
# echo "SYSTEM_INDEX_TEMPLATE : $SYSTEM_INDEX_TEMPLATE"

# echo "TEST_INDEX : $TEST_INDEX"
# echo "SYSTEM_INDEX : $SYSTEM_INDEX"

echo "========== Migration Start =========="

for migration in /opt/init/migrations/*.sh
do
    echo
    echo "Running $(basename "$migration")"

    bash "$migration"
done

echo
echo "========== Migration Finished =========="