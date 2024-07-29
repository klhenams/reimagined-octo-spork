FROM postgis/postgis:latest

COPY ./setup/*.sql /docker-entrypoint-initdb.d/

# ADD ./setup/pg_hba.conf /var/lib/postgresql/data
# ADD ./setup/postgresql.conf /var/lib/postgresql/data
