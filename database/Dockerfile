FROM postgres:15-alpine

RUN apk add --no-cache \
    curl \
    bash

RUN mkdir -p /backup
RUN mkdir -p /scripts

COPY postgresql.conf /etc/postgresql/postgresql.conf

EXPOSE 5432

CMD ["postgres"]