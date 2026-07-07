#!/bin/bash

source /opt/init/common.sh

create_data_stream ${TEST_INDEX}

create_data_stream ${SYSTEM_INDEX}

# create_data_stream logs-audit-default