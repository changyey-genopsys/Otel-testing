#!/bin/bash

source /opt/init/common.sh

put_ilm \
    logs-app-ilm \
    /opt/init/resources/ilm-policy-app.json

put_ilm \
    logs-system-ilm \
    /opt/init/resources/ilm-policy-system.json

# put_ilm \
#     logs-audit-ilm \
#     /opt/init/resources/ilm-audit.json