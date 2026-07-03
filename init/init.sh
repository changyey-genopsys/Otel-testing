#!/bin/bash

set -e

ES=http://localhost:9200

echo "Create ILM Policy..."

curl -s \
-X PUT \
"$ES/_ilm/policy/logs-ilm" \
-H "Content-Type: application/json" \
-d @/init/ilm-policy.json

echo

echo "Create Component Template..."

curl -s \
-X PUT \
"$ES/_component_template/logs-component" \
-H "Content-Type: application/json" \
-d @/init/component-template.json

echo

echo "Create Index Template..."

curl -s \
-X PUT \
"$ES/_index_template/logs-template" \
-H "Content-Type: application/json" \
-d @/init/index-template.json

echo

echo "Create Data Stream..."

curl -s \
-X PUT \
"$ES/_data_stream/logs-ts-app-default"

echo
echo "Initialization Finished."