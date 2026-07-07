#!/bin/bash

ES=http://localhost:9200

wait_for_elasticsearch() {

    echo "Waiting Elasticsearch..."

    until curl -fs "$ES" >/dev/null
    do
        sleep 2
    done

    echo "Elasticsearch Ready"
}

put_ilm() {

    local name=$1
    local file=$2

    echo "Create ILM : $name"

    curl -fs \
        -X PUT \
        "$ES/_ilm/policy/$name" \
        -H "Content-Type: application/json" \
        -d @"$file"
}

put_component_template() {

    local name=$1
    local file=$2

    echo "Create Component Template : $name"

    curl -fs \
        -X PUT \
        "$ES/_component_template/$name" \
        -H "Content-Type: application/json" \
        -d @"$file"
}

put_index_template() {

    local name=$1
    local file=$2

    echo "Create Index Template : $name"

    curl -fs \
        -X PUT \
        "$ES/_index_template/$name" \
        -H "Content-Type: application/json" \
        -d @"$file"
}

create_data_stream() {

    local name=$1

    if curl -fs "$ES/_data_stream/$name" >/dev/null
    then
        echo "$name already exists"
        return
    fi

    echo "Create Data Stream : $name"

    curl -fs \
        -X PUT \
        "$ES/_data_stream/$name"
}