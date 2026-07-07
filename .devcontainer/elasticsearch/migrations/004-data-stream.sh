#!/bin/bash

source /opt/init/common.sh

create_data_stream logs-app-default

create_data_stream logs-system-default

# create_data_stream logs-audit-default