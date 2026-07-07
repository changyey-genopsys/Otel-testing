#!/bin/bash

source /opt/init/common.sh

put_component_template \
    ${TEST_COMPONENT_TEMPLATE} \
    /opt/init/resources/component-template-app.json

put_component_template \
    ${SYSTEM_COMPONENT_TEMPLATE} \
    /opt/init/resources/component-template-system.json

# put_component_template \
#     logs-component-audit \
#     /opt/init/resources/component-template-audit.json