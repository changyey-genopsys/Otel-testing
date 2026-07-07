#!/bin/bash

source /opt/init/common.sh

put_index_template \
    logs-app-template \
    /opt/init/resources/index-template-app.json

put_index_template \
    logs-system-template \
    /opt/init/resources/index-template-system.json

# put_index_template \
#     logs-audit-template \
#     /opt/init/resources/index-template-audit.json