SET standard_conforming_strings = ON;

CREATE SCHEMA IF NOT EXISTS spatial_data;
CREATE EXTENSION IF NOT EXISTS postgis;

DROP TABLE IF EXISTS spatial_data.buildings CASCADE;
DROP TABLE IF EXISTS spatial_data.businesses CASCADE;
DROP TABLE IF EXISTS spatial_data.mmda_data CASCADE;

BEGIN;

CREATE TABLE spatial_data.buildings (
    ogc_fid SERIAL PRIMARY KEY,
    geom GEOMETRY(MULTIPOLYGON, 4326),
    name VARCHAR(80),
    id NUMERIC(10, 0)
);
CREATE INDEX ON spatial_data.buildings USING GIST (geom);

CREATE TABLE spatial_data.businesses (
    ogc_fid SERIAL PRIMARY KEY,
    geom GEOMETRY(POINT, 4326),
    id NUMERIC(10,0),
    name VARCHAR(80)
);
CREATE INDEX ON spatial_data.businesses USING GIST (geom);

CREATE TABLE spatial_data.mmda_data (
    ogc_fid SERIAL PRIMARY KEY,
    geom GEOMETRY(MULTIPOLYGON, 4326),
    code VARCHAR(10),
    mmda VARCHAR(100),
    region VARCHAR(50),
    area DOUBLE PRECISION
);
CREATE INDEX ON spatial_data.mmda_data USING GIST (geom);

COMMIT;