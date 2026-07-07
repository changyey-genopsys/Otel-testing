#!/bin/bash

source /opt/init/common.sh

put_component_template \
    logs-component-app \
    /opt/init/resources/component-template-app.json

put_component_template \
    logs-component-system \
    /opt/init/resources/component-template-system.json

# put_component_template \
#     logs-component-audit \
#     /opt/init/resources/component-template-audit.json