FROM docker.elastic.co/elasticsearch/elasticsearch:9.4.2

USER root

RUN mkdir -p /opt/init
# RUN apt-get update && apt-get install -y curl

COPY wrapper.sh /opt/init/
COPY migrate.sh /opt/init/
COPY common.sh /opt/init/

COPY migrations /opt/init/migrations
COPY resources /opt/init/resources

RUN chmod +x /opt/init/*.sh
RUN chmod +x /opt/init/migrations/*.sh

USER elasticsearch

ENTRYPOINT ["/opt/init/wrapper.sh"]